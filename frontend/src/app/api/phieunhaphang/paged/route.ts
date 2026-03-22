import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

// Types (avoid `any`)
type PhieuNhapRaw = {
  MaPNH?: string;
  maPNH?: string;
  MaPNNH?: string;
  created_at?: string | number | null;
  createdAt?: string | number | null;
  TrangThai?: string;
  trangThai?: string;
  MaNCC?: string;
  [key: string]: unknown;
};

type ChiTietItem = {
  SoLuong?: number | string | null;
  DonGia?: number | string | null;
  [key: string]: unknown;
};

type PagedResponse = {
  data: PhieuNhapRaw[];
  totalCount: number;
};

// Simple runtime guards
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const toNumber = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

// In-memory cache with typed entries
let _cachedList: PhieuNhapRaw[] | null = null;
let _cachedAt = 0;
const CACHE_TTL_MS = 5 * 1000; // 5 seconds
// small cache for per-receipt details to reduce repeat detail requests
const _detailCache = new Map<string, { ts: number; data: unknown }>();
const DETAIL_CACHE_TTL_MS = 30 * 1000; // cache details for 30s

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const cursorParam = url.searchParams.get("cursor") ?? null;
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  const status = url.searchParams.get("status") ?? "ALL";
  const date = url.searchParams.get("date") ?? null;
  const bustCacheParam = url.searchParams.get("bustCache") ?? null;

  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Prefer Authorization forwarded from the incoming request (client),
  // fallback to server-side supabase session access token if available.
  const incomingAuth = request.headers.get("authorization");
  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (
    session &&
    (session as unknown as Record<string, unknown>)["access_token"]
  ) {
    headers["Authorization"] = `Bearer ${String(
      (session as unknown as Record<string, unknown>)["access_token"]
    )}`;
  }

  try {
    let list: PhieuNhapRaw[];

    const now = Date.now();
    const bypassHeader = request.headers.get("x-bypass-cache") || null;
    const bypass = Boolean(bustCacheParam === "1" || bustCacheParam === "true" || bypassHeader === "1" || bypassHeader === "true");

    console.log("[paged] cursorParam=", cursorParam, "pageSize=", pageSize, "status=", status, "date=", date, "bypass=", bypass);
    if (!bypass && _cachedList && now - _cachedAt < CACHE_TTL_MS) {
      // use cached list
      list = _cachedList;
    } else {
      // fetch full list from backend and update cache
      const res = await fetch(`${BACKEND}/api/phieunhaphang`, { headers });
      const json = (await res.json()) as unknown;

      if (Array.isArray(json)) {
        list = json as PhieuNhapRaw[];
      } else if (isRecord(json) && Array.isArray(json.data)) {
        list = json.data as PhieuNhapRaw[];
      } else {
        list = [];
      }

      _cachedList = list;
      _cachedAt = now;
    }

    // Apply status filter
    if (status && status !== "ALL") {
      list = list.filter((r) => {
        const st = String(r.TrangThai ?? r.trangThai ?? "DANG_CHO");
        return st === status;
      });
    }

    // Apply date filter (YYYY-MM-DD)
    if (date) {
      try {
        const zone = "Asia/Ho_Chi_Minh";
        const start = DateTime.fromISO(date, { zone })
          .startOf("day")
          .toMillis();
        const end = DateTime.fromISO(date, { zone }).endOf("day").toMillis();

        list = list.filter((r) => {
          try {
            const createdRaw = r.created_at ?? r.createdAt ?? null;
            if (createdRaw === null || createdRaw === undefined) return false;

            let dtMillis: number;
            if (typeof createdRaw === "number") {
              const asNum = Number(createdRaw);
              dtMillis = asNum < 1e12 ? asNum * 1000 : asNum;
              dtMillis = DateTime.fromMillis(dtMillis).setZone(zone).toMillis();
            } else {
              const asStr = String(createdRaw);
              let dt = DateTime.fromISO(asStr);
              if (!dt.isValid) {
                const jd = new Date(asStr);
                if (isNaN(jd.getTime())) return false;
                dt = DateTime.fromJSDate(jd);
              }
              dtMillis = dt.setZone(zone).toMillis();
            }
            return dtMillis >= start && dtMillis <= end;
          } catch {
            return false;
          }
        });
      } catch (err) {
        console.error("date filter error", String(err));
      }
    }

    // sort by created_at desc
    list.sort((a, b) => {
      const da = new Date(String(a.created_at ?? a.createdAt ?? 0)).getTime();
      const db = new Date(String(b.created_at ?? b.createdAt ?? 0)).getTime();
      return db - da;
    });
    // debug: log total and a few created_at samples to inspect formats
    try {
      const sample = list.slice(0, 5).map((r) => ({ id: r.MaPNH ?? r.maPNH ?? r.MaPNNH, created_at: r.created_at ?? r.createdAt }));
      console.log("[paged] totalList=", list.length, "sampleCreatedAt=", sample);
    } catch (e) {
      console.log("[paged] sample log failed", String(e));
    }

    const totalCount = list.length;

    const parseToMillis = (v: unknown) => {
      if (v === null || v === undefined) return 0;
      if (typeof v === "number") {
        const n = Number(v);
        return n < 1e12 ? n * 1000 : n;
      }
      const s = String(v);
      const asNum = Number(s);
      if (!Number.isNaN(asNum) && asNum > 0) {
        return asNum < 1e12 ? asNum * 1000 : asNum;
      }
      const dt = new Date(s);
      return isNaN(dt.getTime()) ? 0 : dt.getTime();
    };

    let slice: PhieuNhapRaw[] = [];
    let nextCursor: string | null = null;
    if (!cursorParam) {
      const pageNum = Math.max(1, page);
      const offset = (pageNum - 1) * pageSize;
      slice = list.slice(offset, offset + pageSize);
      const last = slice[slice.length - 1];
      nextCursor = last ? String(parseToMillis(last.created_at ?? last.createdAt ?? 0)) : null;
    } else {
      const cursorMillis = parseToMillis(cursorParam);
      console.log("[paged] cursorMillis=", cursorMillis, "totalList=", list.length);
      const filtered = list.filter((r) => {
        const createdMillis = parseToMillis(r.created_at ?? r.createdAt ?? 0);
        return createdMillis < cursorMillis;
      });
      slice = filtered.slice(0, pageSize);
      const last = slice[slice.length - 1];
      nextCursor = last ? String(parseToMillis(last.created_at ?? last.createdAt ?? 0)) : null;
    }

    const concurrency = 4;
    const detailed: (PhieuNhapRaw & { items: ChiTietItem[]; __computedTotal: number })[] = [];

    const fetchDetailFor = async (r: PhieuNhapRaw): Promise<PhieuNhapRaw & { items: ChiTietItem[]; __computedTotal: number }> => {
      const MaPNH = (r.MaPNH ?? r.maPNH ?? r.MaPNNH) as string | undefined;
      if (!MaPNH) return { ...r, items: [], __computedTotal: 0 } as PhieuNhapRaw & { items: ChiTietItem[]; __computedTotal: number };

      const cached = _detailCache.get(MaPNH);
      if (cached && Date.now() - cached.ts < DETAIL_CACHE_TTL_MS) {
        try {
          const itemsRaw = cached.data as unknown[];
          const items = itemsRaw as ChiTietItem[];
          const total = items.reduce((s: number, it) => s + toNumber(it.SoLuong) * toNumber(it.DonGia), 0);
          return { ...r, items, __computedTotal: total };
        } catch {
          // fall through to refetch
        }
      }

      try {
        const dres = await fetch(`${BACKEND}/api/chitietnhaphang/phieu/${encodeURIComponent(MaPNH)}`, { headers });
        const djson = (await dres.json()) as unknown;

        let itemsRaw: unknown[] = [];
        if (Array.isArray(djson)) itemsRaw = djson;
        else if (isRecord(djson) && Array.isArray(djson.data)) itemsRaw = djson.data;
        else itemsRaw = [];

        try {
          _detailCache.set(MaPNH, { ts: Date.now(), data: itemsRaw });
        } catch {}

        const items = itemsRaw as ChiTietItem[];
        const total = items.reduce((s: number, it) => {
          const qty = toNumber(it.SoLuong);
          const price = toNumber(it.DonGia);
          return s + qty * price;
        }, 0);

        return { ...r, items, __computedTotal: total };
      } catch (e) {
        console.error("detail fetch error", MaPNH, String(e));
        return { ...r, items: [], __computedTotal: 0 };
      }
    };

    for (let i = 0; i < slice.length; i += concurrency) {
      const batch = slice.slice(i, i + concurrency);
      const results = await Promise.all(batch.map((r) => fetchDetailFor(r)));
      detailed.push(...results);
    }
    
    try {
      const nowTs = Date.now();
      for (const [k, v] of _detailCache) {
        if (nowTs - v.ts > DETAIL_CACHE_TTL_MS * 4) _detailCache.delete(k);
      }
    } catch {}

    const response: PagedResponse & { nextCursor?: string | null } = {
      data: detailed as PhieuNhapRaw[],
      totalCount,
      nextCursor,
    };
    return NextResponse.json(response);
  } catch (e) {
    console.error("paged api error", String(e));
    return NextResponse.json(
      { data: [], totalCount: 0, error: String(e) },
      { status: 500 }
    );
  }
}

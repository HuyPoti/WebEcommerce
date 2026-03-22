"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter as FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/business/ProductTable";
import ProductPopup from "@/components/business/ProductPopup";
import ProductViewPopup from "@/components/business/ProductViewPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Product from "@/interfaces/product";
import axios from "axios";

const sizes = ["S", "M", "L", "XL", "XXL"];

// Debounce hook
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Helper: sort product sizes
const sortProductSizes = (data: Product[]): Product[] =>
  data.map((product) => {
    if (product.CHITIETSANPHAM && Array.isArray(product.CHITIETSANPHAM)) {
      product.CHITIETSANPHAM = [...product.CHITIETSANPHAM].sort((a, b) => {
        const ia = sizes.indexOf(a.KichCo);
        const ib = sizes.indexOf(b.KichCo);
        if (ia === -1 && ib === -1) return a.KichCo.localeCompare(b.KichCo);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
    }
    return product;
  });

export default function ProductsPageClient({
  access_token,
}: {
  access_token: string;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [noMoreProducts, setNoMoreProducts] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  enum Filter {
    All = "all",
    Active = "active",
    Inactive = "inactive",
  }
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const fetchProducts = useCallback(
    async (pageNum: number) => {
      if (loading || (noMoreProducts && pageNum > 1)) return;

      setLoading(true);
      setError(null);

      try {
        const skip = (pageNum - 1) * pageSize;

        const params = {
          skip: skip,
          take: pageSize,
          includeSizes: true,
          orderByField: "created_at",
          orderByDirection: "desc",
          search: "",
          status: "",
        };

        if (debouncedSearch && debouncedSearch.trim() !== "") {
          params.search = debouncedSearch.trim();
        }

        if (filter !== Filter.All) {
          params.status = filter;
        }

        const res = await axios.get<{ data: Product[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham`,
          {
            params,
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const fetchedData: Product[] = sortProductSizes(res.data.data ?? []);

        if (fetchedData.length < pageSize) setNoMoreProducts(true);
        else setNoMoreProducts(false);

        setProducts((prev) =>
          pageNum === 1 ? fetchedData : [...prev, ...fetchedData]
        );

        console.log("Fetched products:", fetchedData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải sản phẩm");
      } finally {
        console.log("Fetching products done");
        setLoading(false);
      }
    },
    [access_token, debouncedSearch, filter, Filter]
  );

  // Fetch first page or whenever search/filter changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [debouncedSearch, filter]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !noMoreProducts) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, noMoreProducts]
  );

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const obs = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [handleObserver]);

  // Load more whenever page increases
  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page);
  }, [page]);

  // Save product
  const handleSave = async (data: Product) => {
    if (!data) return;
    setLoading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of data.HinhAnh || []) {
        if (typeof file === "string") {
          uploadedUrls.push(file);
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "products");
          const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          const json = await res.json();
          uploadedUrls.push(json.secure_url);
        }
      }

      data.HinhAnh = uploadedUrls;

      const requestProduct = {
        TenSP: data.TenSP,
        GiaBan: data.GiaBan,
        MauSac: data.MauSac,
        TrangThai: data.TrangThai,
        MoTa: data.MoTa,
        HinhAnh: data.HinhAnh,
        MaDM: data.DANHMUC.MaDM,
        GiaMua: 0,
        slug:
          data.slug?.trim() ||
          data.TenSP.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/^-+|-+$/g, ""),
      };

      const requestProductDetail = data.CHITIETSANPHAM.map((detail, i) => ({
        ...detail,
        KichCo: sizes[i],
      }));

      if (editing) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${data.MaSP}`,
          requestProduct,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        for (const detail of requestProductDetail) {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietsanpham/${detail.MaCTSP}`,
            detail,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham`,
          requestProduct,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const newProductId = res.data.data.MaSP;
        for (const detail of requestProductDetail) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietsanpham`,
            { ...detail, MaSP: newProductId },
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        }
      }

      // Refresh to first page
      setProducts([]);
      setPage(1);
      fetchProducts(1);
      setNoMoreProducts(false);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Lưu sản phẩm thất bại");
    } finally {
      setLoading(false);
      setOpen(false);
      setEditing(null);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-2xl mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 bg-muted border-0 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={loading}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Select
          onValueChange={(v) => setFilter(v as Filter)}
          defaultValue={Filter.All}
          disabled={loading}
        >
          <SelectTrigger className="w-48 relative pl-9 border-gray-200">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Filter.All}>Tất cả</SelectItem>
            <SelectItem value={Filter.Active}>Đang hoạt động</SelectItem>
            <SelectItem value={Filter.Inactive}>Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <ProductTable
        products={products}
        onEdit={(id) => {
          setOpen(true);
          setEditing(products.find((p) => p.MaSP === id) ?? null);
        }}
        onView={(id) =>
          setViewProduct(products.find((p) => p.MaSP === id) ?? null)
        }
      />

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {loading && <p>Đang tải...</p>}
        {noMoreProducts && !loading && (
          <p className="text-muted-foreground text-sm">
            Không còn sản phẩm nào nữa
          </p>
        )}
      </div>

      <ProductPopup
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        selectedSizeIndex={selectedSizeIndex}
        setSelectedSizeIndex={setSelectedSizeIndex}
        initialData={editing ?? undefined}
        error={error}
        setError={setError}
      />

      <ProductViewPopup
        open={Boolean(viewProduct)}
        productDetail={viewProduct?.CHITIETSANPHAM}
        onClose={() => setViewProduct(null)}
      />
    </main>
  );
}

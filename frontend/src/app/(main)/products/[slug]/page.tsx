import React, { lazy, Suspense } from "react";
import Head from "next/head";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const SlugPage = lazy(() => import("./SlugPage"));

// Optimize API response time by adding caching headers
async function getRelatedProducts(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/related/${slug}`,
    {
      cache: "force-cache", // Use cache to reduce API response time
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch related products");
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid related products data");
  }
  return data;
}

async function getReply(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phanhoi?slug=${slug}`,
    {
      cache: "force-cache", // Use cache to reduce API response time
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch related reply");
  }
  const data = await res.json();
  return data;
}

// Dynamic Open Graph / Twitter metadata per product
// Optimize Open Graph metadata for Facebook Bot
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug?.trim();
  if (!slug) return {};
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${encodeURIComponent(
        slug
      )}`,
      {
        cache: "force-cache",
      }
    );
    if (!res.ok) return {};
    const json = await res.json();
    const product = json?.data;
    if (!product) return {};

    const title = product.TenSP || "Sản phẩm FlexStyle";
    const description =
      (product.MoTa && String(product.MoTa).slice(0, 160)) ||
      `Xem chi tiết ${title} trên FlexStyle`;
    const images = product.HinhAnh[0];

    return {
      metadataBase: new URL("https://flex-style.vercel.app"),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: "FlexStyle",
        type: "website", // Changed type back to "website" for compatibility
        url: `https://flex-style.vercel.app/products/${encodeURIComponent(
          slug
        )}`,
        images: {
          url: images,
          width: 1200,
          height: 630,
          alt: title,
        },
        locale: "vi_VN",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images,
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trimmedSlug = slug.trim();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${trimmedSlug}`,
      {
        cache: "force-cache",
      }
    );
    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const productData = await res.json();
    if (!productData || !productData.data) {
      throw new Error("Invalid product data");
    }

    const relatedProducts = await getRelatedProducts(trimmedSlug);
    const feedbacks = await getReply(trimmedSlug);
    const canonicalUrl = `https://flex-style.vercel.app/products/${trimmedSlug}`;

    return (
      <>
        <Head>
          <link rel="canonical" href={canonicalUrl} />
        </Head>
        <Suspense fallback={<div>Loading...</div>}>
          <SlugPage
            product={productData.data}
            relatedProducts={relatedProducts.data}
            feedbacks={feedbacks.data.feedbacks}
            feedbacksCustomer={feedbacks.data.feedbacksCustomer}
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound(); // Fallback chung
  }
}

import ProductsPage from "./ProductsPage";

async function getProducts(q: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/sanpham?skip=0&take=50&includeSizes=true&search=${q || ""}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default async function ProductsCarousel({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { query } = await searchParams;
  // Lấy giá trị searchQuery từ URL
  const initialQuery = query || "";
  const products = await getProducts(initialQuery);
  const categories = await getCategories();

  return (
    <div>
      <ProductsPage
        key={products}
        initialProducts={products.data}
        categories={categories.data}
        searchQuery={initialQuery}
      />
    </div>
  );
}

// import Product from "@/interfaces/product";
import { createClient } from "@/lib/supabase/server";
import ProductsPageClient from "./ProductPage";

export default async function ProductPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  return <ProductsPageClient access_token={session?.access_token ?? ""} />;
}

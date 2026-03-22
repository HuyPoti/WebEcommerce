"use client";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default function AccountLockedPage() {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">🔒</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tài khoản đã bị khóa
        </h1>

        <p className="text-gray-600 mb-6">
          Vui lòng liên hệ Admin để được hỗ trợ mở khóa tài khoản.
        </p>

        <form action={logout}>
          <button
            type="submit"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Quay lại đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

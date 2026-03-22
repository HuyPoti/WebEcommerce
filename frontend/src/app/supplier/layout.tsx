"use client";

import type React from "react";

import ProtectedRoute from "@/components/protected-route";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/dashboard-header";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <ProtectedRoute Role={"NCC"}>
      <div className="flex h-screen bg-background">
        <Sidebar
          title="Nhà cung cấp"
          items={[
            {
              title: "Quản lý đơn hàng yêu cầu",
              href: "/supplier",
              icon: Truck,
            },
          ]}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            titleMap={{
              "/supplier": "Quản lý đơn hàng yêu cầu",
            }}
            showNotifications={false}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

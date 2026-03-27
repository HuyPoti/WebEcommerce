# 👕 Flex Style Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)

[[Tiếng Việt]](README_VN.md)

**Flex Style** is a modern e-commerce platform focused on providing a high-end user experience and a powerful management system. The project is developed using a Monorepo structure, ensuring consistency and ease of scalability.

---

## 🏗️ System Architecture

The system is divided into two main components:

- **Frontend (`/frontend`)**: Built with Next.js 15 (App Router), integrating Supabase Auth and Tailwind CSS for a Responsive UI.
- **Backend (`/backend`)**: A robust NestJS API, using Prisma ORM to connect with PostgreSQL, featuring advanced security layers (Helmet, Rate Limit, Audit Log).

---

## ⚡ Key Highlights

### 🔥 Complex Business Logic
- **Multi-variant product management**: Sizes (S, M, L, XL, XXL), Colors, Inventory status.
- **Cart & Order System**: Automatic total calculation, Voucher application, and Promotional events.
- **Multi-method Payment**: Integration with VNPAY and PayPal (Sandbox).
- **Detailed Analytics**: Revenue reports and visual charts (Recharts).

### 🛡️ Advanced Security
We prioritize security with standard enterprise protection layers:
- **HTTP Hardening**: `Helmet` integration to prevent XSS, Clickjacking, and Sniffing.
- **Rate Limiting**: Limited to 100 requests/minute/IP to prevent Brute-force and API spam.
- **Recursive Data Masking**: Automatically shields sensitive information (passwords, tokens) in every API response.
- **Audit Logging**: Action logs tracking all sensitive changes (who edited product, who locked account).
- **Security Headers & CSP**: Strict browser security policy in Next.js.
- **Input Neutralization**: Whitelist validation for all input data.

---

## 🛠️ System Requirements

| Tool | Version |
| --- | --- |
| Node.js | >= 20.x (LTS) |
| NPM | >= 10.x |
| PostgreSQL | >= 14 |

---

## 🚀 Quick Installation

### 1. Environment Configuration
Create an `.env` file in the respective directories based on the `env.example` templates.

### 2. Backend Deployment
```powershell
cd backend
npm install
# Initialize DB & Audit Log
npx prisma db push
npm run start:dev
```
API served at: `http://localhost:8080/api`  
Swagger: `http://localhost:8080/api/docs` (Dev only)

### 3. Frontend Deployment
```powershell
cd ../frontend
npm install
npm run dev
```
Website served at: `http://localhost:3000`

---

## 🧪 Testing & Code Quality

The project includes built-in security test tools:
```powershell
# Run Security Unit Tests (Backend)
npm run test response.interceptor.spec.ts jwt.guard.spec.ts

# Lint & Format
npm run lint
npm run format
```

---

## 📜 License

This project is released under the **MIT** license. See the [LICENSE](./LICENSE) file for more details.

---
**Flex Style Team** 🚀 - *Building the future of E-commerce*

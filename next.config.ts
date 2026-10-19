import type { NextConfig } from 'next';

/** หลังบ้าน (Go · migma-backend) · เบราว์เซอร์เรียกผ่าน origin นี้ แล้ว Next ส่งต่อ (cookie session ใช้ได้ ไม่ต้องตั้ง CORS) */
const API_ORIGIN = (process.env.API_ORIGIN || 'http://localhost:8080').replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` },
      { source: '/auth/:path*', destination: `${API_ORIGIN}/auth/:path*` },
    ];
  },
  async redirects() {
    // เส้นทางเดิมของต้นแบบ (ไฟล์ .html) → route ใหม่ ลิงก์เก่าที่แชร์ไปแล้วยังใช้ได้
    return [
      // หน้าแรกของแอป = ตัวแก้ (query เช่น ?dev=1 · ?reset=new ติดไปด้วย)
      { source: '/', destination: '/editor', permanent: false },
      { source: '/editor.html', destination: '/editor', permanent: true },
      { source: '/landing-preview.html', destination: '/site', permanent: true },
      { source: '/work.html', destination: '/site/work', permanent: true },
      { source: '/case.html', destination: '/site/case', permanent: true },
      { source: '/account.html', destination: '/account', permanent: true },
    ];
  },
};

export default nextConfig;

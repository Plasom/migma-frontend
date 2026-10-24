import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    agentUpgrade: 'security',
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

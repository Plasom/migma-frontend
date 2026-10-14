import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // โค้ดเดิมจากต้นแบบที่ย้ายมาแบบตรงตัว (ยังไม่ได้ใส่ type) · ทยอยแยกเป็นคอมโพเนนต์แล้วเอา @ts-nocheck ออก
    files: [
      'src/features/editor/engine.ts',
      'src/features/account/engine.ts',
      'src/features/site/engine/template.ts',
      'src/features/site/engine/works-browser.ts',
      'src/features/site/engine/case-study.ts',
      'src/lib/i18n/ui-dictionary.ts',
    ],
    rules: { '@typescript-eslint/ban-ts-comment': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'wireframe/**', 'playwright-report/**', 'test-results/**']),
]);

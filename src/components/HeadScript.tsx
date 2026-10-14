/** สคริปต์สั้นที่ต้องทำงานก่อนวาดหน้าแรก (ตั้งธีม · class ของหน้า) · ไม่มี JS ของ React เกี่ยว */
export function HeadScript({ code }: { code: string }) {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

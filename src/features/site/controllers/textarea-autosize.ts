/** ช่องข้อความในฟอร์มติดต่อขยายตามเนื้อหา (96–480px · ไม่หดเล็กกว่าที่ผู้ใช้ลากไว้) */
export function textareaAutosize(): void {
  document.querySelectorAll<HTMLTextAreaElement>('.field textarea').forEach((t) => {
    t.addEventListener('input', () => {
      const cur = t.offsetHeight;
      t.style.height = 'auto';
      t.style.height = Math.max(Math.min(t.scrollHeight + 2, 480), cur, 96) + 'px';
    });
  });
}

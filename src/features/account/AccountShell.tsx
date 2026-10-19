/** โครงหน้าบัญชี (ย้ายมาจาก markup ของ account.html) · เนื้อหาแต่ละแท็บวาดโดย ./engine ตอนเปิดหน้า */
export function AccountShell() {
  return (
    <>
      <main className="sgn" id="lg" hidden>
      {" "}
      <div className="lg-c">
        {" "}
        <span className="dots" aria-hidden="true">
          <svg viewBox="0 0 34 24" focusable="false">
            <path d="M3 21V11a5.5 5.5 0 0 1 11 0v10M14 11a5.5 5.5 0 0 1 11 0v10" fill="none" stroke="var(--logo-dot)" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="30.6" cy="19.6" r="2.6" fill="var(--logo-dot-accent)" />
          </svg>
        </span>
        {" "}
        <div id="lgForm">
          {" "}
          <h1>{"เข้าสู่ระบบ"}</h1>
          {" "}
          <p id="lgSub">{"เข้าด้วยบัญชีที่มีอยู่แล้ว ไม่ต้องตั้งรหัสผ่าน ยังไม่มีบัญชีก็ใช้วิธีเดียวกัน"}</p>
          {" "}
          <button type="button" className="btn outlined lg" id="lgG">
            <svg className="g-ic" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            {"เข้าด้วย Google"}
          </button>
          {" "}
          </div>
        {" "}
        <div className="lg-ui">
          <button type="button" className="btn text sm" id="lgUi" data-ui-keep=""><span className="ms" aria-hidden="true">{"language"}</span><span id="lgUiT" /></button>
        </div>
        {" "}
      </div>
      {" "}
    </main>
<div className="app" id="app" hidden>
      {" "}
      <header className="ac-top">
        {" "}
        <a className="ac-brand" href="/editor">
          <span className="dots" aria-hidden="true">
            <svg viewBox="0 0 34 24" focusable="false">
              <path d="M3 21V11a5.5 5.5 0 0 1 11 0v10M14 11a5.5 5.5 0 0 1 11 0v10" fill="none" stroke="var(--logo-dot)" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="30.6" cy="19.6" r="2.6" fill="var(--logo-dot-accent)" />
            </svg>
          </span>
          <span className="n">{"Migma"}</span>
        </a>
        {" "}
        <a className="ac-coin" href="#credits" id="acCoin" aria-label="เครดิต AI คงเหลือ"><span className="ms" aria-hidden="true">{"toll"}</span><span id="acCoinN">{"0"}</span></a>
        {" "}
        <a className="btn outlined sm ac-ed" href="/editor" aria-label="แก้ Portfolio"><span className="ms" aria-hidden="true">{"edit"}</span><span className="tx">{"แก้ Portfolio"}</span></a>
        {" "}
        <button type="button" className="btn ghost sm icon" id="acTheme" aria-label="สลับโหมดมืด"><span className="ms" aria-hidden="true">{"dark_mode"}</span></button>
        {" "}
      </header>
      {" "}
      <div className="ac">
        {" "}
        <nav className="ac-nav" aria-label="บัญชีของฉัน" id="acNav">
          {" "}
          <a className="ac-tab" href="#overview"><span className="ms" aria-hidden="true">{"home"}</span><span className="tl">{"ภาพรวม"}</span></a>
          {" "}
          <a className="ac-tab" href="#stats"><span className="ms" aria-hidden="true">{"bar_chart"}</span><span className="tl">{"สถิติ"}</span></a>
          {" "}
          <a className="ac-tab" href="#credits"><span className="ms" aria-hidden="true">{"toll"}</span><span className="tl">{"เครดิต AI"}</span></a>
          {" "}
          <a className="ac-tab" href="#usage"><span className="ms" aria-hidden="true">{"auto_awesome"}</span><span className="tl">{"การใช้ AI"}</span></a>
          {" "}
          <a className="ac-tab" href="#plan"><span className="ms" aria-hidden="true">{"receipt_long"}</span><span className="tl">{"แพ็กเกจและใบเสร็จ"}</span></a>
          {" "}
          <a className="ac-tab" href="#settings"><span className="ms" aria-hidden="true">{"settings"}</span><span className="tl">{"ตั้งค่า"}</span></a>
          {" "}
          <span className="sp" />
          {" "}
          <button type="button" className="ac-tab" id="acOut"><span className="ms" aria-hidden="true">{"logout"}</span><span className="tl">{"ออกจากระบบ"}</span></button>
          {" "}
        </nav>
        {" "}
        <div>
          <div className="tbl" id="acTabs" role="tablist" aria-label="บัญชีของฉัน" hidden />
          <main className="ac-main" id="acMain" />
        </div>
        {" "}
      </div>
      {" "}
    </div>
<div className="ed-toast" id="edToast" role="status" aria-live="polite" />
    </>
  );
}

/** โครงหน้าตัวแก้ (ย้ายมาจาก markup ของ editor.html) · ฟอร์ม เมนู และตัวอย่างหน้าเว็บวาดโดย ./engine ตอนเปิดหน้า */
export function EditorShell() {
  return (
    <>
      <header className="ed-top" id="edTop">
      {" "}
      <div className="ed-brand">
        <span className="dots" aria-hidden="true">
          <svg viewBox="0 0 34 24" focusable="false">
            <path d="M3 21V11a5.5 5.5 0 0 1 11 0v10M14 11a5.5 5.5 0 0 1 11 0v10" fill="none" stroke="var(--logo-dot)" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="30.6" cy="19.6" r="2.6" fill="var(--logo-dot-accent)" />
          </svg>
        </span>
        <b>{"Migma"}</b>
      </div>
      {" "}
      <div className="ed-mid">
        <div className="seg ed-dev" role="radiogroup" aria-label="ขนาดตัวอย่าง" id="edDev">
          <button type="button" role="radio" aria-checked="true" data-d="desk" aria-label="จอคอม" title="จอคอม"><span className="ms" aria-hidden="true">{"desktop_windows"}</span></button>
          <button type="button" role="radio" aria-checked="false" data-d="mob" aria-label="มือถือ" title="มือถือ"><span className="ms" aria-hidden="true">{"smartphone"}</span></button>
        </div>
        <button type="button" className="btn ghost sm icon ed-lgb" id="edLgBtn" aria-haspopup="dialog" aria-expanded="false" aria-label="ภาษาของเว็บ" title="ภาษาของเว็บ"><span className="ms" aria-hidden="true">{"translate"}</span></button>
      </div>
      {" "}
      <div className="ed-act">
        <button type="button" className="btn outlined sm ed-toport" id="edBack"><span className="ms" aria-hidden="true">{"arrow_back"}</span>{"กลับไปแก้ Portfolio"}</button>
        <span id="edSaveW" role="status" aria-live="polite"><span className="ed-save" id="edSave" /></span>
        <button type="button" className="btn ghost sm icon" id="edDiscard" aria-label="ทิ้งการแก้ที่ยังไม่บันทึก" title="ทิ้งการแก้ที่ยังไม่บันทึก" hidden><span className="ms" aria-hidden="true">{"undo"}</span></button>
        <button type="button" className="ed-cr" id="edCr" aria-haspopup="dialog" aria-expanded="false" hidden><span className="ms" aria-hidden="true">{"toll"}</span><b id="edCrN">{"0"}</b><span className="vh" id="edCrS" /></button>
        <button type="button" className="btn ghost sm icon" id="edTheme" aria-label="สลับโหมดมืด"><span className="ms" aria-hidden="true">{"dark_mode"}</span></button>
        <button type="button" className="btn ghost sm icon ed-mprev" id="edMPrev" aria-label="ดูตัวอย่าง"><span className="ms" aria-hidden="true">{"visibility"}</span></button>
        <button type="button" className="btn tonal sm ed-ai" id="edAI" aria-label="ให้ AI ช่วยกรอก"><span className="ms" aria-hidden="true">{"auto_awesome"}</span><span className="txt">{"ให้ AI ช่วยกรอก"}</span></button>
        <a className="btn ghost sm ed-view" href="/site" target="_blank" rel="noopener">{"ดูหน้าเว็บ"}<span className="ms" aria-hidden="true">{"arrow_outward"}</span></a>
        <button type="button" className="btn outlined sm" id="edSaveAll" aria-keyshortcuts="Control+S Meta+S">{"บันทึก"}</button>
        <button type="button" className="btn filled sm" id="edPub">{"เผยแพร่"}</button>
      </div>
      {" "}
    </header>
<div className="ed" id="ed">
      {" "}
      <div className="ed-acct" id="edAcct" hidden><iframe id="edAcctIf" title="บัญชีและตั้งค่า" /></div>
      {" "}
      <nav className="ed-nav" id="edNav" aria-label="เมนูหลัก">
        <div className="ed-tabs" role="tablist" aria-orientation="vertical" aria-label="ส่วนของหน้าเว็บ" id="edTabs" />
        <span className="ed-nav-sep" aria-hidden="true" />
        <button type="button" className="ed-tab ed-navai" id="edNavAI">
          <span className="ms" aria-hidden="true">{"auto_awesome"}</span>
          <span className="tl">{"ให้ AI ช่วยกรอก"}</span>
          <span className="ts">{"AI ช่วย"}</span>
        </button>
        <span className="ed-nav-sp" aria-hidden="true" />
        <button type="button" className="ed-tab ed-navhelp" id="edNavHelp" aria-keyshortcuts="?">
          <span className="ms" aria-hidden="true">{"help"}</span>
          <span className="tl">{"วิธีใช้และคีย์ลัด"}</span>
          <span className="ts">{"วิธีใช้"}</span>
        </button>
        <button type="button" className="ed-tab ed-navacct" id="edNavAcct" aria-pressed="false">
          <span className="ms" aria-hidden="true">{"account_circle"}</span>
          <span className="tl">{"บัญชีและตั้งค่า"}</span>
          <span className="ts">{"บัญชี"}</span>
          <span className="coin" id="edNavCoin" hidden />
        </button>
      </nav>
      {" "}
      <aside className="ed-panel" aria-label="แก้ไขเนื้อหา">
        {" "}
        <div className="ed-body" id="edBody" role="tabpanel" tabIndex={-1} />
        {" "}
        <div className="ed-foot" id="edFoot" hidden>
          <span className="st" id="edFootSt" />
          <button type="button" className="btn ghost" id="edCancel">{"ยกเลิก"}</button>
          <button type="button" className="btn filled" id="edSaveBtn" aria-keyshortcuts="Control+S Meta+S">{"บันทึก"}</button>
        </div>
        {" "}
        <div className="ed-rs" id="edRs" role="separator" aria-orientation="vertical" aria-label="ปรับความกว้างแผงแก้ไข (ลูกศรซ้ายขวา)" tabIndex={0} aria-valuemin={320} aria-valuemax={720} aria-valuenow={400} />
        {" "}
      </aside>
      {" "}
      <aside className="ed-side" id="edSide" aria-labelledby="sdT" hidden>
        {" "}
        <div className="sd-h">
          <div><b id="sdT">{"Case study"}</b><span id="sdS" /></div>
          <button type="button" className="btn ghost icon" id="sdClose" aria-label="ปิดแผง Case study"><span className="ms" aria-hidden="true">{"close"}</span></button>
        </div>
        {" "}
        <div className="ed-body" id="sdBody" />
        {" "}
        <div className="ed-rs" id="sdRs" role="separator" aria-orientation="vertical" aria-label="ปรับความกว้างแผง Case study (ลูกศรซ้ายขวา)" tabIndex={0} aria-valuemin={360} aria-valuemax={720} aria-valuenow={420} />
        {" "}
        <div className="ed-foot" id="sdFoot" hidden>
          <span className="st" id="sdFootSt" />
          <button type="button" className="btn ghost" id="sdCancel">{"ยกเลิก"}</button>
          <button type="button" className="btn filled" id="sdSave">{"บันทึก"}</button>
        </div>
        {" "}
      </aside>
      {" "}
      <section className="ed-prev" id="edPrev" aria-label="ตัวอย่างหน้าเว็บ">
        {" "}
        <button type="button" className="btn outlined sm ed-pclose" id="edPClose"><span className="ms" aria-hidden="true">{"arrow_back"}</span>{"กลับไปแก้"}</button>
        {" "}
        <div className="ed-frame" id="edFrame" data-dev="desk">
          <iframe id="edIf" title="ตัวอย่างหน้าเว็บ" />
          <iframe id="edIf2" title="ตัวอย่างหน้าเว็บ (กำลังโหลด)" aria-hidden="true" tabIndex={-1} className="bk" />
        </div>
        {" "}
      </section>
      {" "}
    </div>
<div className="ed-toast" id="edToast" role="status" aria-live="polite" />
<div className="vh" id="edLive" aria-live="polite" />
<input type="file" id="edFile" accept="image/*" hidden />
<input type="file" id="edDoc" hidden />
<input type="file" id="edResume" accept="application/pdf,.pdf" hidden />
<input type="file" id="edGal" accept="image/*" multiple hidden />
<input type="file" id="edVid" accept="video/mp4,video/webm" hidden />
<input type="file" id="edAtt" accept="application/pdf,.pdf,image/*" multiple hidden />
    </>
  );
}

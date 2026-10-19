/** โครงหน้าผลงานทั้งหมด (ย้ายมาจาก markup ของต้นแบบ) · เนื้อหาในแต่ละส่วนวาดโดย engine ตอนเปิดหน้า */
import { SiteFooter, SiteHeader } from './SiteChrome';

export function WorkShell({ base }: { base?: string } = {}) {
  return (
    <>
      <SiteHeader page="work" base={base} />
      <main className="wrap">
      {" "}
      <section id="work" className="wk wk-page" data-mode="all">
        {" "}
        <a className="wk-back" href="/site"><span className="ms" aria-hidden="true">{"arrow_back"}</span>{"หน้าแรก"}</a>
        {" "}
        <div className="wk-head">
          <h1>{"ผลงานทั้งหมด"}</h1>
          <span className="wk-n" id="wkN" aria-live="polite">{"5 ชิ้น"}</span>
          <i className="tbd-tag">{"ข้อมูลตัวอย่าง"}</i>
          <a className="wk-jump" id="wkJump" href="/site#process" hidden>{"ไปวิธีทำงาน"}<span className="ms" aria-hidden="true">{"arrow_downward"}</span></a>
        </div>
        {" "}
        <div className="wk-bar">
          {" "}
          <label className="wk-search">
            <span className="ms" aria-hidden="true">{"search"}</span>
            <input type="search" id="wkQ" placeholder="ค้นหาผลงาน" aria-label="ค้นหาผลงาน" autoComplete="off" />
            <button type="button" className="wk-clr" id="wkClr" aria-label="ล้างคำค้น" hidden><span className="ms">{"close"}</span></button>
          </label>
          {" "}
          <span className="wk-fwrap">
            <button type="button" className="wk-fb" id="wkFB" aria-haspopup="dialog" aria-expanded="false" aria-controls="wkF"><span className="ms" aria-hidden="true">{"tune"}</span>{"ตัวกรอง"}<b id="wkFN" hidden /></button>
            {" "}
            <div className="wk-scrim" id="wkFS" />
            {" "}
            <div className="wk-flt" id="wkF" role="dialog" aria-labelledby="wkFT">
              {" "}
              <div className="wk-fgrab" aria-hidden="true" />
              {" "}
              <div className="wk-fh">
                <p id="wkFT">{"ตัวกรอง"}</p>
                <button type="button" className="wk-fx" id="wkFX" aria-label="ปิด"><span className="ms">{"close"}</span></button>
              </div>
              {" "}
              <div className="wk-fbody" id="wkFBody" />
              {" "}
              <div className="wk-ff">
                <button type="button" className="wk-fclr" id="wkFClr">{"ล้างทั้งหมด"}</button>
                <button type="button" className="btn btn-primary" id="wkFDone">{"แสดงผลงาน"}</button>
              </div>
              {" "}
            </div>
          </span>
          {" "}
          <div className="wk-tools">
            {" "}
            <span className="wk-dd wk-sortdd">
              <button type="button" className="wk-sortb" id="wkSortB" aria-haspopup="menu" aria-expanded="false">
                <span className="wk-sl">{"เรียง:"}</span>
                {" "}
                <b id="wkSortL">{"ใหม่สุด"}</b>
                <span className="ms" aria-hidden="true">{"expand_more"}</span>
              </button>
              <div className="wk-mn" id="wkSortM" role="menu" aria-label="เรียงผลงาน" />
            </span>
            {" "}
            <div className="wk-seg" role="radiogroup" aria-label="มุมมอง" id="wkView">
              <span className="wk-thumb" aria-hidden="true" />
              <button type="button" role="radio" aria-checked="true" data-v="grid" aria-label="กริด" title="กริด"><span className="ms" aria-hidden="true">{"grid_view"}</span></button>
              <button type="button" role="radio" aria-checked="false" data-v="list" aria-label="รายการ" title="รายการ"><span className="ms" aria-hidden="true">{"view_list"}</span></button>
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        <div className="wk-active" id="wkActive" hidden />
        {" "}
        <div className="wk-grid" id="wkGrid" />
        {" "}
        <ul className="wk-list" id="wkList" hidden />
        {" "}
        <div className="wk-more" id="wkMore" hidden />
        {" "}
        <div className="wk-empty" id="wkEmpty" hidden>
          <p className="wk-et" id="wkEt">{"ไม่พบผลงาน"}</p>
          <p className="wk-ed">{"ลองคำอื่น หรือล้างตัวกรอง"}</p>
          <button type="button" className="btn btn-outline" id="wkReset">{"ล้างทั้งหมด"}</button>
        </div>
        {" "}
      </section>
      {" "}
      <SiteFooter page="work" base={base} />
      {" "}
    </main>
    </>
  );
}

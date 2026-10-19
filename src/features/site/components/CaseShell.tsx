/** โครงหน้าCase study (ย้ายมาจาก markup ของต้นแบบ) · เนื้อหาในแต่ละส่วนวาดโดย engine ตอนเปิดหน้า */
import { SiteFooter, SiteHeader } from './SiteChrome';

export function CaseShell({ base }: { base?: string } = {}) {
  return (
    <>
      <SiteHeader page="case" base={base} />
      <main className="wrap">
      {" "}
      <article className="cp" id="cp" data-progress="">
        {" "}
        <nav className="cp-toc" id="cpNav" aria-label="สารบัญ"><p className="cp-tl">{"สารบัญ"}</p><ol id="cpToc" /></nav>
        {" "}
        <div className="cp-main">
          {" "}
          <a className="wk-back" href="/site#case"><span className="ms" aria-hidden="true">{"arrow_back"}</span>{"หน้าแรก"}</a>
          {" "}
          <header className="cp-hd" id="part1">
            {" "}
            <div className="cp-cover" id="cpCover" aria-hidden="true" data-shared="" />
            {" "}
            <div className="cp-ht">
              <p className="cp-kind" id="cpKind" />
              <h1 id="cpTitle" />
              <p className="cp-sum" id="cpSum" />
              <div className="cp-tags" id="cpTags" />
            </div>
            {" "}
          </header>
          {" "}
          <dl className="cp-meta" id="cpMeta" />
          {" "}
          <div className="cp-act">
            <a className="btn btn-primary" href="#ch1" id="cpStart">{"เริ่มอ่าน"}</a>
            <a className="btn btn-outline" href="/site/work">{"ดูผลงานอื่น"}</a>
          </div>
          {" "}
          <div className="cp-body" id="cpBody" />
          {" "}
        </div>
        {" "}
      </article>
      {" "}
      <SiteFooter page="case" base={base} />
      {" "}
    </main>
    </>
  );
}

import { assetPath } from '@/lib/demo';

const figma = 'https://www.figma.com/design/aoRV14coQa877m2eXZZT1o/Untitled?node-id=117-2';
const pdf = assetPath('/report.pdf');
const reportPages = Array.from({ length: 12 }, (_, index) => ({
  number: index + 1,
  src: assetPath(`/report-pages/page-${String(index + 1).padStart(2, '0')}.jpg`),
}));

export default function ReportPage() {
  return (
    <main className="report-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="demo-topbar">
        <a href="/shiheng-industry-product-research/#report" className="brand-mark">食亨 <span>/ 行业与产品研究</span></a>
        <nav className="release-nav" aria-label="报告和 Demo">
          <a href="#report-reader">报告正文</a>
          <a href="/shiheng-industry-product-research/#demo" className="secondary-nav">体验厨房问答 Demo →</a>
        </nav>
      </header>
      <section className="report-intro">
        <p className="eyebrow">核心申请作品 · 12 页完整报告</p>
        <h1>食亨行业与产品研究</h1>
        <p className="report-byline">刘嘉骅｜行业与产品研究</p>
        <p className="report-lead">
          先从“连锁总部为什么需要食亨”梳理行业、客户与竞品，再回到第二家店的真实执行断点。
          厨房问答 Demo 是报告洞察延伸出的待验证假设，而不是食亨已上线的功能。
        </p>
        <div className="report-chain" aria-label="研究思路">
          <span>谁需要跨店管控</span><b>→</b><span>现在如何完成任务</span><b>→</b>
          <span>第二店的执行断点</span><b>→</b><span>批准版问答如何试验</span>
        </div>
        <div className="report-actions">
          <a href="#report-reader">立即阅读完整报告 ↓</a>
          <a href={pdf} download="食亨行业与产品研究_刘嘉骅.pdf">下载 12 页 PDF</a>
          <a href={figma} target="_blank" rel="noreferrer">查看可编辑 Figma ↗</a>
          <a href="/shiheng-industry-product-research/#demo" className="demo-action">报告读完后，体验 Demo →</a>
        </div>
      </section>
      <section id="report-reader" className="report-reader" aria-label="十二页行业与产品研究报告">
        <div className="reader-title">
          <div>
            <span>优先阅读</span>
            <strong>行业与产品研究报告 · 12 页</strong>
          </div>
          <small>页面内可滚动，也可以下载阅读</small>
        </div>
        <div className="report-pages">
          {reportPages.map((page) => (
            <figure key={page.number}>
              <span className="page-index">{String(page.number).padStart(2, '0')} / 12</span>
              <img
                src={page.src}
                alt={`食亨行业与产品研究第 ${page.number} 页`}
                loading={page.number === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}
        </div>
        <p>需要离线阅读或查看可选择文字的版本，请使用上方的 PDF 下载按钮。</p>
      </section>
      <footer className="report-footer">
        报告与 Demo 是岗位申请研究作品；案例素材为虚构演示，不代表食亨产品承诺。
      </footer>
    </main>
  );
}

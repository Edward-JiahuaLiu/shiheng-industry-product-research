import { assetPath } from '@/lib/demo';

const figma = 'https://www.figma.com/design/aoRV14coQa877m2eXZZT1o/Untitled?node-id=117-2';
const pdf = assetPath('/report.pdf');

export default function ReportPage() {
  return (
    <main className="report-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="demo-topbar">
        <a href="/shiheng-industry-product-research/#demo" className="brand-mark">食亨 <span>/ 行业与产品研究</span></a>
        <nav className="release-nav" aria-label="报告和 Demo">
          <a href="/shiheng-industry-product-research/#demo">体验厨房问答 Demo →</a>
        </nav>
      </header>
      <section className="report-intro">
        <p className="eyebrow">2026 年 9 月 · 研究报告</p>
        <h1>食亨行业与产品研究</h1>
        <p className="report-byline">刘嘉骅｜申请岗位：产品经理管培生（CEO 直带 · 核心岗位）</p>
        <p className="report-lead">
          报告从“连锁总部买什么”走到“开分店时谁在现场把事做对”。最后的问答 Demo
          是一个待验证的产品假设，不是食亨已上线的功能。
        </p>
        <div className="report-chain" aria-label="研究思路">
          <span>谁需要跨店管控</span><b>→</b><span>现在如何完成任务</span><b>→</b>
          <span>第二店的执行断点</span><b>→</b><span>批准版问答如何试验</span>
        </div>
        <div className="report-actions">
          <a href={pdf} download="食亨行业与产品研究_刘嘉骅.pdf">下载 PDF</a>
          <a href={figma} target="_blank" rel="noreferrer">查看可编辑 Figma ↗</a>
          <a href="/shiheng-industry-product-research/#demo">试用手机 Demo →</a>
        </div>
      </section>
      <section className="report-reader" aria-label="十二页行业与产品研究报告">
        <div className="reader-title"><strong>报告正文 · 12 页</strong><small>页面内可滚动，也可以下载阅读</small></div>
        <iframe src={pdf} title="食亨行业与产品研究报告 PDF" />
        <p>如果浏览器未显示 PDF，请使用上方的下载按钮。</p>
      </section>
      <footer className="report-footer">
        报告与 Demo 是岗位申请研究作品；案例素材为虚构演示，不代表食亨产品承诺。
      </footer>
    </main>
  );
}

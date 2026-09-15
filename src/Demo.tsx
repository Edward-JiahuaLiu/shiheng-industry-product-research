/* oxlint-disable jsx-a11y/media-has-caption -- local user recordings have no automatic transcript; sample narration has VTT captions. */

import { useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  FileText,
  Headphones,
  Mic,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> & {
  alt: string;
  unoptimized?: boolean;
};
function Image({ unoptimized: _unoptimized, alt, ...props }: ImageProps) {
  return <img alt={alt} {...props} />;
}
import {
  ApprovedRecipe,
  DishId,
  OfflineResult,
  dishOrder,
  dishes,
  initialApproved,
  offlineAnswer,
} from '@/lib/demo';

type Role = 'chef' | 'staff';
type QuestionResult = OfflineResult & {
  question: string;
};

export default function Home() {
  const [role, setRole] = useState<Role>('chef');
  const [dishId, setDishId] = useState<DishId>('tomato');
  const [approved, setApproved] =
    useState<Record<DishId, ApprovedRecipe | null>>(initialApproved);
  const [draft, setDraft] = useState('');
  const [ocr, setOcr] = useState('');
  const [asr, setAsr] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QuestionResult | null>(null);
  const [fullCard, setFullCard] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparison, setComparison] = useState<'a0' | 'a1' | 'a2'>('a0');
  const [askDraft, setAskDraft] = useState(false);
  const [notified, setNotified] = useState(false);
  const dish = dishes[dishId];
  const current = approved[dishId];

  function chooseDish(id: DishId) {
    setDishId(id);
    setDraft('');
    setOcr('');
    setAsr('');
    setSourceImage(null);
    setLocalImage(false);
    setQuery('');
    setResult(null);
    setFullCard(false);
    setCompareOpen(false);
    setAskDraft(false);
    setNotified(false);
  }
  function sampleImage() {
    setSourceImage(dish.noteImage);
    setLocalImage(false);
    setOcr(dish.ocr);
    setDraft(dish.approved);
  }
  function uploadImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMicError('请选择图片文件。');
      return;
    }
    setSourceImage(URL.createObjectURL(file));
    setLocalImage(true);
    setOcr('');
    setDraft('');
  }
  function sampleVoice() {
    setAsr(dish.asr);
    if (!draft) setDraft(dish.approved);
  }
  async function startRecording() {
    setMicError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMicError('此设备无法录音；可用示例口述或手工录入。');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const parts: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) parts.push(e.data);
      };
      mediaRecorder.onstop = () => {
        if (parts.length)
          setRecordedUrl(
            URL.createObjectURL(
              new Blob(parts, { type: mediaRecorder.mimeType || 'audio/webm' }),
            ),
          );
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      };
      mediaRecorder.start();
      recorder.current = mediaRecorder;
      setRecording(true);
    } catch {
      setMicError('麦克风未授权；可播放示例音频，或直接手工录入。');
    }
  }
  function stopRecording() {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }
  function approveDraft() {
    const text = draft.trim();
    if (!text) return;
    const version = (current?.version ?? 0) + 1;
    setApproved((prev) => ({
      ...prev,
      [dishId]: { version, text, approvedAt: '刚刚 · 主厨模拟确认' },
    }));
    setDraft('');
    setOcr('');
    setAsr('');
  }
  function ask() {
    const question = query.trim();
    if (!question) return;
    setAskDraft(false);
    setNotified(false);
    setCompareOpen(false);
    const offline = offlineAnswer(dishId, current, question);
    setResult({ ...offline, question });
  }
  function resetDemo() {
    setApproved(initialApproved());
    chooseDish('tomato');
    setRecordedUrl(null);
  }
  const resultText = result?.a2;
  const compareText = result?.[comparison];
  const answerReference = dishId === 'tomato'
    ? dish.referenceImages[result?.found?.step === 1 ? 0 : result?.found?.step === 2 ? 1 : 2]
    : dish.referenceImages[0];

  return (
    <main className="demo-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="demo-topbar">
        <div className="brand-mark">
          食亨 <span>/ 厨房知识实验</span>
        </div>
        <nav className="release-nav" aria-label="报告和 Demo">
          <span className="concept-label">产品经理概念 Demo · 非现售功能</span>
          <a href="/shiheng-industry-product-research/#report">看研究报告 →</a>
        </nav>
      </header>
      <div className="stage">
        <div className="stage-aside">
          <p className="eyebrow">手机端场景</p>
          <h1>
            把本店做法留下，
            <br />
            <em>让分店找得到。</em>
          </h1>
          <p>
            主厨先批准；员工先看当前卡，再问具体问题。照片留作步骤参照，问答只检索批准文字。
          </p>
          <div className="method-strip">
            主厨采集 <span>→</span> 人审发布 <span>→</span> 分店问答
          </div>
          <a href="/shiheng-industry-product-research/#report" className="report-context-link">
            阅读行业与产品研究报告，了解这条思路从哪里来 →
          </a>
          <div className="aside-note">
            <ShieldCheck size={20} />
            <div>
              <strong>全部是虚构示例</strong>
              <small>
                照片和合成口述不送外部模型；真实秘方须另核合同、权限及删除。
              </small>
            </div>
          </div>
        </div>
        <section
          className="phone-frame"
          aria-label={role === 'chef' ? '主厨手机页面' : '分店员工手机页面'}
        >
          <div className="phone-status">
            <span>9:41</span>
            <span>●●● ▰</span>
          </div>
          <div className="phone-head">
            <div>
              <small>
                {role === 'chef'
                  ? '主厨账户 · 本店知识'
                  : '分店员工 · 忙时提醒'}
              </small>
              <h2>{role === 'chef' ? '录入本店做法' : '先看，再快问'}</h2>
            </div>
            <span className="avatar">{role === 'chef' ? '厨' : '店'}</span>
          </div>
          <Tabs
            value={role}
            onValueChange={(v) => {
              setRole(v as Role);
              setAskDraft(false);
              setNotified(false);
            }}
            className="role-tabs"
          >
            <TabsList className="role-tabs-list">
              <TabsTrigger value="chef" className="role-tab">
                主厨上传
              </TabsTrigger>
              <TabsTrigger value="staff" className="role-tab">
                员工问答
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="phone-scroll">
            <div className="dish-selector" aria-label="选择菜品">
              {dishOrder.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => chooseDish(id)}
                  className={`dish-pill ${dishId === id ? 'active' : ''}`}
                >
                  {dishes[id].name}
                  <small>{dishes[id].type}</small>
                </button>
              ))}
            </div>
            {role === 'chef' ? (
              <div className="page-flow">
                <div className="surface dish-focus">
                  <Image
                    src={dish.finishedImage}
                    alt={`${dish.name}虚构示例成品，仅供人工参照`}
                    width={105}
                    height={89}
                    unoptimized
                  />
                  <div>
                    <span className="micro-label">当前选择</span>
                    <strong>{dish.name}</strong>
                    <small>
                      {current
                        ? `已批准 v${current.version}`
                        : '未批准 · 员工不可检索'}
                    </small>
                  </div>
                </div>
                <div className="section-label">
                  <span>01</span>
                  <strong>采集本店做法</strong>
                </div>
                <div className="surface capture-card">
                  <div className="capture-title">
                    <FileText size={21} />
                    <div>
                      <strong>配方资料图</strong>
                      <small>有文字的纸条/截图才载入 OCR 草稿</small>
                    </div>
                  </div>
                  <div className="action-row">
                    <Button onClick={sampleImage} className="demo-button">
                      载入示例 OCR 草稿
                    </Button>
                    <label className="file-button">
                      选本机图片
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadImage(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                  {sourceImage && (
                    <div className="document-preview">
                      <Image src={sourceImage} alt="文字配方资料预览" width={58} height={72} unoptimized />
                      <div>
                        <span>{localImage ? '本机配方资料图' : '配方资料图 · 预置 OCR'}</span>
                        <small>
                          {localImage
                            ? '无真实 OCR；请手工填写草稿'
                            : '载入了预置 OCR 草稿 · 非实时识别'}
                        </small>
                      </div>
                    </div>
                  )}
                </div>
                <div className="surface capture-card">
                  <div className="capture-title">
                    <Mic size={21} />
                    <div>
                      <strong>主厨口述</strong>
                      <small>听示例，或录音后手工校对原话</small>
                    </div>
                  </div>
                  <audio
                    controls
                    src={dish.audio}
                    className="audio-player"
                    aria-label={`${dish.name}合成示例口述`}
                  ><track kind="captions" src={dish.audioCaption} label="中文口述字幕" /></audio>
                  <small className="source-caption">
                    合成示例口述 · 不是实际主厨录音
                  </small>
                  <div className="action-row">
                    <Button onClick={sampleVoice} className="demo-button">
                      载入预置转写
                    </Button>
                    <Button
                      variant="outline"
                      onClick={recording ? stopRecording : startRecording}
                      className="demo-outline"
                    >
                      {recording ? '停止录音' : '录本机音频'}
                    </Button>
                  </div>
                  {recordedUrl && (
                    <div className="recorded">
                      <audio
                        controls
                        src={recordedUrl}
                        aria-label="本机录音回放"
                      />
                      <button onClick={() => setRecordedUrl(null)}>
                        删除录音
                      </button>
                    </div>
                  )}
                  {micError && <p className="warning-text">{micError}</p>}
                </div>
                <div className="reference-block">
                  <div className="section-label slim">
                    <span>参照图</span>
                    <strong>批准版过程参照图</strong>
                  </div>
                  <p>示例过程图仅供人工回看；改稿后不自动继承，更不会从菜品图反推配方。</p>
                  <div className="reference-gallery">
                    {dish.referenceImages.map((photo) => (
                      <figure key={photo.src}>
                        <Image src={photo.src} alt={photo.label} width={122} height={85} unoptimized />
                        <figcaption>{photo.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
                {(ocr || asr || localImage || recordedUrl) && (
                  <div className="review-zone">
                    <div className="section-label">
                      <span>02</span>
                      <strong>校对草稿</strong>
                    </div>
                    {ocr && (
                      <div className="readback">
                        <span>预置 OCR 草稿</span>
                        <p>{ocr}</p>
                      </div>
                    )}
                    {asr && (
                      <div className="readback">
                        <span>预置语音转写</span>
                        <p>{asr}</p>
                      </div>
                    )}
                    {(localImage || recordedUrl) && (
                      <p className="source-caption">
                        本机素材未接识别模型；请按原图/原音手工填写与修正。
                      </p>
                    )}
                    <label className="editor-label" htmlFor="approved-draft">
                      主厨确认后的发布文字
                    </label>
                    <textarea
                      id="approved-draft"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="逐行写清步骤与判断线索；保留本店原话。"
                      rows={7}
                    />
                    <div className="approval-note">
                      <ShieldCheck size={17} />
                      草稿不可检索；批准后才更新当前版。
                    </div>
                    <Button
                      disabled={!draft.trim()}
                      onClick={approveDraft}
                      className="approve-button"
                    >
                      <Check size={18} />
                      批准为 v{(current?.version ?? 0) + 1}
                    </Button>
                  </div>
                )}
                {!ocr && !asr && !sourceImage && (
                  <p className="quiet-tip">
                    从资料图或口述开始。番茄炒蛋示例含备菜、炒制与成品参照图。
                  </p>
                )}
              </div>
            ) : (
              <div className="page-flow">
                <div className="surface b1-card">
                  <div className="card-topline">
                    <span className="micro-label">当前批准提醒 · B1</span>
                    <span className={`version-badge ${current ? '' : 'muted'}`}>
                      {current ? `v${current.version}` : '未发布'}
                    </span>
                  </div>
                  <h3>{dish.name}</h3>
                  {current ? (
                    <>
                      <ul>
                        {current.text
                          .split(/\n+/)
                          .filter(Boolean)
                          .slice(0, fullCard ? 20 : 2)
                          .map((line, i) => (
                            <li key={`${i}-${line}`}>{line}</li>
                          ))}
                      </ul>
                      <button
                        className="text-link"
                        onClick={() => setFullCard((v) => !v)}
                      >
                        {fullCard ? '收起完整卡' : '看完整批准卡'}{' '}
                        <ChevronDown size={15} />
                      </button>
                    </>
                  ) : (
                    <p>
                      该菜还没有主厨批准版。先回主厨页面发布，员工才能检索。
                    </p>
                  )}
                </div>
                <div className="section-label">
                  <span>01</span>
                  <strong>问一个具体问题</strong>
                </div>
                <div className="query-box">
                  <label htmlFor="question">忙时卡住了哪一步？</label>
                  <textarea
                    id="question"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="例如：鸡蛋什么时候回锅？"
                    rows={2}
                  />
                  <div className="query-suggestions">
                    {dish.questions.map((item) => (
                      <button
                        type="button"
                        key={item.text}
                        onClick={() => setQuery(item.text)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={ask}
                    disabled={!query.trim()}
                    className="ask-button"
                  >
                    <Sparkles size={18} />
                    查当前版并回答
                  </Button>
                </div>
                <div className="model-line">
                  <span>GitHub Pages 离线版 · 不调用模型或外部 API</span>
                </div>
                {result && (
                  <div className="result-zone">
                    <div className="section-label">
                      <span>02</span>
                      <strong>当前版短答</strong>
                    </div>
                    <div
                      className={`surface answer-card ${result.grounded ? 'grounded' : 'no-evidence'}`}
                    >
                      <div className="card-topline">
                        <span className="micro-label">
                          离线演示 · 预置生成
                        </span>
                        <span className="version-badge">
                          {result.grounded ? '有据' : '待确认'}
                        </span>
                      </div>
                      <p className="answer-text">{resultText}</p>
                      {result.citation && (
                        <div className="citation">
                          <FileText size={16} />
                          来自：{result.citation}
                          <small>命中：{result.found?.line}</small>
                        </div>
                      )}
                      {result.grounded && current?.text === dish.approved && (
                        <div className="approved-photo">
                          <Image
                            src={answerReference.src}
                            alt={`${dish.name}人工参照图`}
                            width={62}
                            height={53}
                            unoptimized
                          />
                          <span>
                            {answerReference.label}
                            <small>图片供人工回看，不参与文本检索</small>
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      className="compare-link"
                      onClick={() => setCompareOpen((v) => !v)}
                    >
                      看同题“加入本店资料/检索”对照 <ChevronDown size={15} />
                    </button>
                    {compareOpen && (
                      <div className="surface comparison-card">
                        <span className="micro-label">
                          产品实验视角 · 同一道问题
                        </span>
                        <div className="compare-tabs">
                          {(
                            [
                              ['a0', '无本店资料'],
                              ['a1', '批准卡全文'],
                              ['a2', '检索片段 RAG'],
                            ] as const
                          ).map(([key, label]) => (
                            <button
                              key={key}
                              onClick={() => setComparison(key)}
                              className={comparison === key ? 'selected' : ''}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <p>{compareText}</p>
                        <small>
                          {comparison === 'a0'
                            ? 'A0→A2同时增加本店资料和检索，不能算RAG单独收益。'
                            : comparison === 'a1'
                              ? 'A1已有同一批准知识；三道短卡下，不预设RAG比全文更好。'
                              : 'A2只取匹配的当前版片段；与普通搜索的速度仍待现场测试。'}
                        </small>
                      </div>
                    )}
                    <div className="help-zone">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAskDraft(true);
                          setNotified(false);
                        }}
                        className="help-button"
                      >
                        <Headphones size={18} />
                        问主厨
                      </Button>
                      <small>例外做法或现场拿不准时升级。</small>
                    </div>
                    {askDraft && (
                      <div className="surface escalation-draft">
                        <span className="micro-label">求助摘要 · 尚未发送</span>
                        <strong>
                          {dish.name}{' '}
                          {current ? `v${current.version}` : '未发布'}
                        </strong>
                        <p>“{result.question}”</p>
                        <small>
                          原因：{result.reason ?? '员工需要主厨现场确认'}
                        </small>
                        <Button
                          onClick={() => {
                            setNotified(true);
                            setAskDraft(false);
                          }}
                          className="approve-button"
                        >
                          <Send size={17} />
                          发送模拟求助
                        </Button>
                      </div>
                    )}
                    {notified && (
                      <p className="sent-state">
                        <Check size={16} />
                        已生成模拟主厨通知；没有真实推送。
                      </p>
                    )}
                  </div>
                )}
                {!result && (
                  <p className="quiet-tip">
                    先看批准提醒；需要找具体步骤，再用短问答。
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="phone-bottom">
            <span className={role === 'chef' ? 'active' : ''}>主厨知识</span>
            <span className={role === 'staff' ? 'active' : ''}>分店快问</span>
          </div>
        </section>
        {role === 'staff' && notified && result && (
          <aside
            className="chef-mini-phone"
            aria-label="主厨手机收到的模拟求助通知"
          >
            <div className="mini-status">
              主厨手机 <span>9:41</span>
            </div>
            <div className="mini-content">
              <span className="mini-badge">模拟通知</span>
              <strong>分店员工请求协助</strong>
              <p>
                {dish.name} {current ? `v${current.version}` : ''}
              </p>
              <p>“{result.question}”</p>
              <small>待主厨处理 · 非真实推送</small>
            </div>
          </aside>
        )}
      </div>
      <footer className="demo-footer">
        <span>图文语音采集交互＋批准版文本 RAG · 未售概念</span>
        <button onClick={resetDemo}>
          <RotateCcw size={14} />
          重置演示
        </button>
      </footer>
    </main>
  );
}

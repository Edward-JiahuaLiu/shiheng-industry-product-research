# 食亨行业与产品研究 · 厨房知识问答 Demo

刘嘉骅｜行业与产品研究

[阅读报告和体验 Demo](https://Edward-JiahuaLiu.github.io/shiheng-industry-product-research/) · [可编辑 Figma](https://www.figma.com/design/aoRV14coQa877m2eXZZT1o/Untitled?node-id=117-2)

我先研究了食亨服务的客户和采购任务：总部在管钱、管货、管运营时，现有的人工分工、供应商、POS、美团和微信已经能完成哪些事？食亨在哪些跨店缺口上值得被选择？报告后半段转向第二家店的现场：老板或主厨不在时，员工忘记一道菜的步骤，靠什么恢复，又会打断谁？

这不是把“开分店难”直接等同于“需要 RAG”。报告先区分小型饭店和加盟连锁品牌，再讨论一个厨房知识助手的试验入口。下载版是[12 页 PDF](public/report.pdf)，源稿中的来源和口径可见[证据记录](https://github.com/Edward-JiahuaLiu/shiheng-industry-product-research/blob/main/docs/research-notes.md)。

## 怎么试 Demo

首页优先展示完整研究报告；读完后点击“体验厨房问答 Demo”。进入 Demo 后，先在“主厨上传”选番茄炒蛋。示例资料图有可读文字，按钮载入的是预置 OCR 草稿；口述音频是合成的，转写同样是预置稿。备菜、锅中鸡蛋刚凝固、成品三张照片只给人看，不会被模型“看图识配方”。主厨可以改文字，再确认发布当前版。

切到“员工问答”，先看批准卡，再问“番茄下锅前，鸡蛋要炒到什么状态？”。短答会标出版本与步骤。展开同题对照可以看 A0 无本店资料、A1 批准卡全文、A2 检索片段；三道菜的短卡并不能证明 RAG 比全文更快或更准。问资料没写的盐量时，系统会停下并提供“问主厨”。确认发送模拟求助后，右下角才出现主厨手机的通知状态。宫保鸡丁和红烧肉用于另外两类问题；只有番茄炒蛋做完整过程图，避免为了 Demo 把三道菜都拍成图库。

## 这版实际做了什么

GitHub Pages 版是静态离线演示：批准文本保存在本次浏览器页面状态；问答由本地轻量检索和预置回答组成。照片、资料图、录音和问句不会送外部模型，也没有真实店铺数据。真实 OCR、语音识别、持久化、跨设备通知和语音播报都没有接入。文件选择与本机录音只能本地预览，识别稿需要手工填写；刷新页面会回到初始虚构状态。

服务端试验版预留了 Qwen 的可选接口，但目前没有 API Key，因此没有验证过真实模型回复。GitHub Pages 不能安全保存服务端密钥，公开站点不会调用 Qwen。更不能把真实饭店秘方直接塞进这个 Demo：合同用途、角色权限、原图原音和派生记录的删除都要先谈清楚。

这是岗位申请的产品研究作品，不是食亨已经售卖或承诺上线的产品。报告里的品牌公开信息和案例有出处；厨房场景、菜谱和照片是虚构演示。

## 资料和本地运行

- [需求分析](docs/requirements.md) · [PRD](docs/PRD.md) · [素材出处](docs/media-provenance.md) · [顾问审查记录](docs/advisor-review.md)
- 本地需要 Node.js 22.13+ 和 pnpm 10：`pnpm install --frozen-lockfile`，再运行 `pnpm dev`。GitHub 项目站点位于 `/shiheng-industry-product-research/`，本地预览也使用这个路径。
- 回归测试：`node --experimental-strip-types --test tests/demo.test.mjs`。生产构建：`pnpm build`，静态页面位于 `dist/`。
- 推送到 `main` 后，`.github/workflows/pages.yml` 构建并发布 GitHub Pages。Pages 来源须在仓库设置中选 `GitHub Actions`。不需要也不应配置模型 API Key。

若要现场验证价值，应先对比原有纸条/群聊、批准卡、普通搜索和问答四条路径，记录忘步恢复时间与主厨被打断次数。若批准卡已经够用，就没必要把 RAG 当成默认方案。

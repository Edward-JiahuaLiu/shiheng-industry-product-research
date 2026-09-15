export type DishId = 'tomato' | 'kungpao' | 'pork';
export type Branch = 'a0' | 'a1' | 'a2';

// GitHub Pages hosts this project under the repository path rather than /.
export const assetPath = (path: string) =>
  `/shiheng-industry-product-research${path}`;

export type ApprovedRecipe = {
  version: number;
  text: string;
  approvedAt: string;
};

export type RetrievedLine = {
  line: string;
  step: number;
  score: number;
};

export const dishes: Record<
  DishId,
  {
    name: string;
    type: string;
    noteImage: string;
    finishedImage: string;
    referenceImages: { src: string; label: string }[];
  audio: string;
  audioCaption: string;
    ocr: string;
    asr: string;
    approved: string;
    questions: { label: string; text: string }[];
  }
> = {
  tomato: {
    name: '番茄炒蛋',
    type: '步骤顺序',
    noteImage: assetPath('/media/tomato-note.svg'),
    finishedImage: assetPath('/media/tomato-egg.png'),
    referenceImages: [
      { src: assetPath('/media/tomato-prep.png'), label: '过程参照图｜备菜：蛋液与番茄分开' },
      { src: assetPath('/media/tomato-wok.png'), label: '批准说明｜鸡蛋刚凝固时先盛出' },
      { src: assetPath('/media/tomato-egg.png'), label: '成品参照图｜仅供人工回看' },
    ],
    audio: assetPath('/media/tomato-egg.wav'),
    audioCaption: assetPath('/media/tomato-egg.vtt'),
    ocr: '备菜：打散鸡蛋，番茄切块。\n中火炒蛋，刚凝固先盛出。\n番茄炒软、出汁。\n鸡蛋回锅，轻翻至汁裹住。\n判断：鸡蛋松软，番茄汁不过干。',
    asr: '鸡蛋用中火炒到刚刚凝固，先盛出来。番茄炒软、出了汁，再把鸡蛋回锅。最后看鸡蛋是不是松软、番茄汁是不是裹住了。',
    approved:
      '备菜：打散鸡蛋，番茄切块。\n中火炒蛋，刚凝固先盛出。\n番茄炒软、出汁。\n鸡蛋回锅，轻翻至汁裹住。\n判断：鸡蛋松软，番茄汁不过干。',
    questions: [
      { label: '炒蛋状态', text: '番茄下锅前，鸡蛋要炒到什么状态？' },
      { label: '回锅顺序', text: '鸡蛋什么时候回锅？' },
      { label: '未记事项', text: '这道菜的具体盐量是多少？' },
    ],
  },
  kungpao: {
    name: '宫保鸡丁',
    type: '成分边界',
    noteImage: assetPath('/media/kung-pao-note.svg'),
    finishedImage: assetPath('/media/kung-pao.png'),
    referenceImages: [
      { src: assetPath('/media/kung-pao.png'), label: '成品参照图｜仅供人工回看' },
    ],
    audio: assetPath('/media/kung-pao.wav'),
    audioCaption: assetPath('/media/kung-pao.vtt'),
    ocr: '鸡丁先滑炒至表面变色。\n酱汁略收，再入花生。\n翻匀出锅，保留花生脆度。\n本示例明确含花生。',
    asr: '鸡丁先滑炒到表面变色。酱汁略收以后，再放花生，翻匀就出锅，这样花生才脆。这份示例做法含花生。',
    approved:
      '鸡丁先滑炒至表面变色。\n酱汁略收，再入花生。\n翻匀出锅，保留花生脆度。\n本示例明确含花生。',
    questions: [
      { label: '花生时机', text: '花生什么时候放？' },
      { label: '过敏原事实', text: '花生过敏的人能吃吗？' },
      { label: '未记事项', text: '这道菜是否完全不含芝麻？' },
    ],
  },
  pork: {
    name: '红烧肉',
    type: '经验判断',
    noteImage: assetPath('/media/braised-pork-note.svg'),
    finishedImage: assetPath('/media/braised-pork.png'),
    referenceImages: [
      { src: assetPath('/media/braised-pork.png'), label: '成品参照图｜仅供人工回看' },
    ],
    audio: assetPath('/media/braised-pork.wav'),
    audioCaption: assetPath('/media/braised-pork.vtt'),
    ocr: '焯水后煸出一些油。\n小火焖，筷子易扎入。\n开盖收汁，看颜色和稠度。\n别只按时间判断。',
    asr: '先焯水，再煸出一些油。转小火焖到筷子能比较轻松扎进去，再开盖收汁。收汁时多看颜色和稠度，别只盯时间。',
    approved:
      '焯水后煸出一些油。\n小火焖，筷子易扎入。\n开盖收汁，看颜色和稠度。\n别只按时间判断。',
    questions: [
      { label: '收汁线索', text: '收汁前怎么判断肉是否到位？' },
      { label: '操作顺序', text: '什么时候开盖收汁？' },
      { label: '未记事项', text: '这道菜的食品安全中心温度是多少？' },
    ],
  },
};

export const dishOrder: DishId[] = ['tomato', 'kungpao', 'pork'];

export function initialApproved(): Record<DishId, ApprovedRecipe | null> {
  const ready = Object.fromEntries(
    dishOrder.map((id) => [
      id,
      {
        version: 1,
        text: dishes[id].approved,
        approvedAt: '示例主厨确认',
      },
    ]),
  ) as Record<DishId, ApprovedRecipe | null>;
  ready.pork = null; // A visible unapproved state for the demo, approved on the chef page.
  return ready;
}

const stop = /[，。？！、\s：的了要到是吗呢前后时这道菜本店怎么什么如何一下]/g;
const sensitive =
  /(过敏|不含|能吃|安全|中心温度|具体.*量|克|禁忌|多少分钟|几分钟|多久|多少度)/;

export function retrieve(text: string, question: string): RetrievedLine[] {
  const query = question.replace(stop, '');
  const chars = [...new Set(query)].filter((ch) => ch.trim());
  return text
    .split(/\n+/)
    .map((line, index) => {
      const hits = chars.filter((ch) => line.includes(ch)).length;
      const long = [...query.matchAll(/.{2}/g)]
        .map((x) => x[0])
        .filter((x) => line.includes(x)).length;
      return { line, step: index + 1, score: hits + long * 2 };
    })
    .filter((x) => x.line.trim())
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

export type OfflineResult = {
  grounded: boolean;
  a0: string;
  a1: string;
  a2: string;
  citation: string | null;
  found: RetrievedLine | null;
  reason: string | null;
};

export function offlineAnswer(
  id: DishId,
  recipe: ApprovedRecipe | null,
  question: string,
): OfflineResult {
  const name = dishes[id].name;
  const general = `常见做法可以提供参考，但我没有${name}的本店批准资料，不能确认这家店的具体步骤或标准。`;
  if (!recipe)
    return {
      grounded: false,
      a0: general,
      a1: '该菜还没有主厨批准版。',
      a2: '该菜还没有主厨批准版，请先查看草稿状态或问主厨。',
      citation: null,
      found: null,
      reason: '未批准',
    };

  const lines = retrieve(recipe.text, question);
  // In a three-dish demo, intent tags avoid a common false hit: “番茄下锅前鸡蛋状态”
  // shares many characters with the prep line but should retrieve the just-set egg step.
  const intentPattern =
    id === 'tomato' && /(状态|下锅前)/.test(question)
      ? /刚凝固/
      : id === 'tomato' && /回锅/.test(question)
        ? /回锅/
        : id === 'kungpao' && /什么时候放/.test(question)
          ? /略收|再入花生/
          : id === 'pork' && /(是否到位|收汁前)/.test(question)
            ? /筷子/
            : id === 'pork' && /开盖/.test(question)
              ? /开盖/
              : null;
  const intentLine = intentPattern
    ? recipe.text.split(/\n+/).find((line) => intentPattern.test(line))
    : null;
  const found = intentLine
    ? {
        line: intentLine,
        step: recipe.text.split(/\n+/).indexOf(intentLine) + 1,
        score: 9,
      }
    : lines[0]?.score >= 2
      ? lines[0]
      : null;
  const peanutQuestion =
    id === 'kungpao' && /花生/.test(question) && /(过敏|能吃)/.test(question);
  const hasPeanut = /含花生|入花生|放花生/.test(recipe.text);
  if (peanutQuestion && hasPeanut) {
    const line =
      recipe.text.split(/\n+/).find((x) => /含花生/.test(x)) ??
      '本示例明确含花生。';
    const step = recipe.text.split(/\n+/).indexOf(line) + 1;
    const answer =
      '当前批准版明确含花生。花生过敏者不应食用；若要改做法，请问主厨确认。';
    return {
      grounded: true,
      a0: general,
      a1: answer,
      a2: answer,
      citation: `${name} · v${recipe.version} · 第${step}条`,
      found: { line, step, score: 9 },
      reason: null,
    };
  }
  // Unknown safety/ingredient facts cannot be inferred from a process or finished-dish photo.
  if (sensitive.test(question) && !peanutQuestion) {
    return {
      grounded: false,
      a0: general,
      a1: '当前批准卡没有记录这项关口，不能据常见做法判断。',
      a2: '当前批准版未记录这项信息，请问主厨确认。',
      citation: null,
      found: null,
      reason: '未记录的关口',
    };
  }
  if (!found)
    return {
      grounded: false,
      a0: general,
      a1: '全文卡中未找到能直接回答的本店线索。',
      a2: '当前批准版没有能直接回答这句问题的线索，请问主厨。',
      citation: null,
      found: null,
      reason: '资料不足',
    };
  const answer = `按本店当前批准版：${found.line.replace(/^[①②③④⑤0-9.、\s]+/, '')}`;
  return {
    grounded: true,
    a0: general,
    a1: answer,
    a2: answer,
    citation: `${name} · v${recipe.version} · 第${found.step}条`,
    found,
    reason: null,
  };
}

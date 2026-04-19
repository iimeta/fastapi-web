export interface ProviderSvgLogo {
  kind: 'svg';
  viewBox: string;
  path?: string;
  color?: string;
  markup?: string;
}

export type ProviderLogo = ProviderSvgLogo;

interface ProviderAsset {
  aliases: string[];
  color: string;
  logo?: ProviderLogo;
}

function makeSvgLogo(svg: string): ProviderSvgLogo {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const markupMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);

  return {
    kind: 'svg',
    viewBox: viewBoxMatch?.[1] || '0 0 64 64',
    markup: markupMatch?.[1]?.trim() || '',
  };
}

function makeWordmarkLogo(
  text: string,
  background: string,
  foreground = '#ffffff',
  size = 22
) {
  return makeSvgLogo(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="${background}" />
      <text
        x="32"
        y="36"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${size}"
        font-weight="700"
        fill="${foreground}"
      >${text}</text>
    </svg>
  `);
}

const googleLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M54.7 32.6c0-1.8-.2-3.5-.5-5.2H32v10h12.7c-.6 3.2-2.4 5.9-5.1 7.7v6.4h8.2c4.8-4.4 7.5-11 7.5-18.9z" fill="#4285F4"/>
    <path d="M32 55.5c6.5 0 11.9-2.2 15.8-5.9l-8.2-6.4c-2.3 1.5-5.1 2.4-7.6 2.4-5.9 0-10.9-4-12.7-9.4h-8.5v6.6c3.9 7.7 11.8 12.7 21.2 12.7z" fill="#34A853"/>
    <path d="M19.3 36.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7v-6.6h-8.5A23.5 23.5 0 0 0 8.4 31.5c0 3.8.9 7.4 2.4 10.7l8.5-6z" fill="#FBBC04"/>
    <path d="M32 18.5c3.5 0 6.7 1.2 9.2 3.5l6.9-6.9C43.9 11.2 38.5 9 32 9c-9.4 0-17.3 5-21.2 12.7l8.5 6.6c1.8-5.4 6.8-9.8 12.7-9.8z" fill="#EA4335"/>
  </svg>
`);

const geminiLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="12%" y1="10%" x2="88%" y2="90%">
        <stop offset="0%" stop-color="#4285F4"/>
        <stop offset="32%" stop-color="#7B61FF"/>
        <stop offset="68%" stop-color="#A24DFF"/>
        <stop offset="100%" stop-color="#00C7B1"/>
      </linearGradient>
    </defs>
    <path d="M32 7c3.7 14.2 10.8 21.3 25 25-14.2 3.7-21.3 10.8-25 25-3.7-14.2-10.8-21.3-25-25 14.2-3.7 21.3-10.8 25-25z" fill="url(#g)"/>
    <path d="M32 15.5c2.4 9.4 7.1 14.1 16.5 16.5-9.4 2.4-14.1 7.1-16.5 16.5-2.4-9.4-7.1-14.1-16.5-16.5 9.4-2.4 14.1-7.1 16.5-16.5z" fill="#fff" opacity=".18"/>
  </svg>
`);

const deepSeekLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 377.1 277.86">
    <path fill="#4d6bfe" d="M373.15,23.32c-4-1.95-5.72,1.77-8.06,3.66-.79.62-1.47,1.43-2.14,2.14-5.85,6.26-12.67,10.36-21.57,9.86-13.04-.71-24.16,3.38-33.99,13.37-2.09-12.31-9.04-19.66-19.6-24.38-5.54-2.45-11.13-4.9-14.99-10.23-2.71-3.78-3.44-8-4.81-12.16-.85-2.51-1.72-5.09-4.6-5.52-3.13-.5-4.36,2.14-5.58,4.34-4.93,8.99-6.82,18.92-6.65,28.97.43,22.58,9.97,40.56,28.89,53.37,2.16,1.46,2.71,2.95,2.03,5.09-1.29,4.4-2.82,8.68-4.19,13.09-.85,2.82-2.14,3.44-5.15,2.2-10.39-4.34-19.37-10.76-27.29-18.55-13.46-13.02-25.63-27.41-40.81-38.67-3.57-2.64-7.12-5.09-10.81-7.41-15.49-15.07,2.03-27.45,6.08-28.9,4.25-1.52,1.47-6.79-12.23-6.73-13.69.06-26.24,4.65-42.21,10.76-2.34.93-4.79,1.61-7.32,2.14-14.5-2.73-29.55-3.35-45.29-1.58-29.62,3.32-53.28,17.34-70.68,41.28C1.29,88.2-3.63,120.88,2.39,155c6.33,35.91,24.64,65.68,52.8,88.94,29.18,24.1,62.8,35.91,101.15,33.65,23.29-1.33,49.23-4.46,78.48-29.24,7.38,3.66,15.12,5.12,27.97,6.23,9.89.93,19.41-.5,26.79-2.02,11.55-2.45,10.75-13.15,6.58-15.13-33.87-15.78-26.44-9.36-33.2-14.54,17.21-20.41,43.15-41.59,53.3-110.19.79-5.46.11-8.87,0-13.3-.06-2.67.54-3.72,3.61-4.03,8.48-.96,16.72-3.29,24.28-7.47,21.94-12,30.78-31.69,32.87-55.33.31-3.6-.06-7.35-3.86-9.24ZM181.96,235.97c-32.83-25.83-48.74-34.33-55.31-33.96-6.14.34-5.04,7.38-3.69,11.97,1.41,4.53,3.26,7.66,5.85,11.63,1.78,2.64,3.01,6.57-1.78,9.49-10.57,6.58-28.95-2.2-29.82-2.64-21.38-12.59-39.26-29.24-51.87-52.01-12.16-21.92-19.23-45.43-20.39-70.52-.31-6.08,1.47-8.22,7.49-9.3,7.92-1.46,16.11-1.77,24.03-.62,33.49,4.9,62.01,19.91,85.9,43.63,13.65,13.55,23.97,29.71,34.61,45.49,11.3,16.78,23.48,32.75,38.97,45.84,5.46,4.59,9.83,8.09,14,10.67-12.59,1.4-33.62,1.71-47.99-9.68ZM197.69,134.65c0-2.7,2.15-4.84,4.87-4.84.6,0,1.16.12,1.66.31.67.25,1.29.62,1.77,1.18.87.84,1.36,2.08,1.36,3.35,0,2.7-2.15,4.84-4.85,4.84s-4.81-2.14-4.81-4.84ZM246.55,159.77c-3.13,1.27-6.26,2.39-9.27,2.51-4.67.22-9.77-1.68-12.55-4-4.3-3.6-7.36-5.61-8.67-11.94-.54-2.7-.23-6.85.25-9.24,1.12-5.15-.12-8.44-3.74-11.44-2.96-2.45-6.7-3.1-10.82-3.1-1.54,0-2.95-.68-4-1.24-1.72-.87-3.13-3.01-1.78-5.64.43-.84,2.53-2.92,3.02-3.29,5.58-3.19,12.03-2.14,18,.25,5.54,2.26,9.71,6.42,15.72,12.28,6.16,7.1,7.26,9.09,10.76,14.39,2.76,4.19,5.29,8.47,7.01,13.37,1.04,3.04-.31,5.55-3.94,7.1Z"/>
  </svg>
`);

const baiduLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#F5F7FF"/>
    <circle cx="20" cy="21" r="4.6" fill="#2D41FF"/>
    <circle cx="29.5" cy="15.8" r="4.6" fill="#2D41FF"/>
    <circle cx="39.5" cy="16" r="4.6" fill="#2D41FF"/>
    <circle cx="47.5" cy="23.2" r="4.6" fill="#2D41FF"/>
    <path d="M19 39c0-6.8 5.2-11.8 12.4-11.8 5.9 0 10.5 3.3 12.1 8.3 3.8.5 6.5 3.4 6.5 7.1 0 4.2-3.2 7.4-7.7 7.4H28.2C22.7 50 19 45.7 19 39z" fill="#2D41FF"/>
  </svg>
`);

const wenxinLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="wx" x1="10%" y1="12%" x2="88%" y2="88%">
        <stop offset="0%" stop-color="#5B8CFF"/>
        <stop offset="100%" stop-color="#2D41FF"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="#F3F6FF"/>
    <path d="M17 34.5c0-8.6 6.9-15.5 15.5-15.5 4.6 0 8.9 2 11.8 5.5 1.2-.5 2.5-.8 3.9-.8 5.1 0 9.3 4.1 9.3 9.3s-4.2 9.5-9.5 9.5H31.4L23 50.2c-.7.6-1.7.1-1.7-.8v-7.3A15.3 15.3 0 0 1 17 34.5z" fill="url(#wx)"/>
    <path d="M29.5 28c1.5-2.8 5.5-2.8 7 0l1.3 2.3c.4.8 1.1 1.4 2 1.6l2.6.6c3 .7 3.8 4.4 1.7 6.6l-1.8 1.9c-.6.6-.9 1.5-.8 2.4l.3 2.5c.4 3-2.8 5-5.4 3.6l-2.3-1.3c-.8-.4-1.8-.4-2.6 0l-2.3 1.3c-2.6 1.4-5.8-.6-5.4-3.6l.3-2.5c.1-.9-.2-1.8-.8-2.4l-1.8-1.9c-2.1-2.2-1.3-5.9 1.7-6.6l2.6-.6c.9-.2 1.6-.8 2-1.6l1.3-2.3z" fill="#fff"/>
  </svg>
`);

const metaLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M10 41c0-12.4 5.9-20.7 13.8-20.7 6.9 0 10.1 6.9 14.3 13.8 2.1 3.3 4.4 6.7 7.2 6.7 3 0 5.3-3.2 8.5-10.8 0 10.7-4.7 17.9-11.3 17.9-6.3 0-9.6-6.3-13-12.5-2.6-4.8-4.8-8.4-7.1-8.4-3.1 0-5.4 5-5.4 14 0 4-7 4-7 0zm44-.1c0-12.4-5.9-20.6-13.8-20.6-6.9 0-10.1 6.9-14.3 13.8 1 1.8 2.1 3.5 3.1 5.2 3.4-5.7 5.8-12.1 10.9-12.1 4.6 0 8.1 5.8 8.1 13.7 0 4 6 4 6 0z" fill="#0866FF"/>
  </svg>
`);

const mistralLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#FFF2E8"/>
    <path d="M14 48V16h8v12h6V16h8v12h6V16h8v32h-8V36h-6v12h-8V36h-6v12h-8z" fill="#FF7000"/>
  </svg>
`);

const aliyunLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#FFF4EC"/>
    <path d="M16 17h10v6h-4v18h4v6H16zM48 17H38v6h4v18h-4v6h10zM26 29h12v6H26z" fill="#FF6A00"/>
  </svg>
`);

const tencentLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#F2F8FF"/>
    <path d="M14 31c2-8.9 9.8-15 18.9-15 6.2 0 12 2.9 15.8 7.8l-6.8 1.3A13.4 13.4 0 0 0 32.3 21c-5.9 0-11 3.8-12.8 9.5L14 31z" fill="#006EFF"/>
    <path d="M19.5 33.5 34 22.5 22.3 47.8c-6 0-10.3-4.2-10.3-9.8 0-1.8.5-3.3 1.4-4.5l6.1 0z" fill="#00C8DC"/>
    <path d="M22.8 47.8 40.5 24.2c1.8-2.3 4.2-3.4 6.9-3.4 5.1 0 9.6 4.2 9.6 9.7 0 1.8-.5 3.3-1.4 4.7L46.7 47.8H22.8z" fill="#00A3FF"/>
  </svg>
`);

const minimaxLogo = makeWordmarkLogo('MM', '#FF4D4F', '#FFFFFF', 22);
const zhipuLogo = makeWordmarkLogo('Z', '#3478F6', '#FFFFFF', 28);
const xfyunLogo = makeWordmarkLogo('X', '#00A9FF', '#FFFFFF', 28);
const xLogo = makeSvgLogo(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#111111"/>
    <path d="M19 16h8.9l9.2 12.2L47 16h5L39.3 30.6 53 48H44l-9.8-13.1L22.5 48h-5l14.1-15.9z" fill="#fff"/>
  </svg>
`);
const moonshotLogo = makeWordmarkLogo('K', '#4F46E5', '#FFFFFF', 28);
const doubaoLogo = makeWordmarkLogo('DB', '#3370FF', '#FFFFFF', 20);
const volcengineLogo = makeWordmarkLogo('VE', '#FF6B3D', '#FFFFFF', 18);

const providerAssets: ProviderAsset[] = [
  {
    aliases: ['openai', 'chatgpt'],
    color: '#10a37f',
    logo: {
      kind: 'svg',
      viewBox: '0 0 24 24',
      path: 'M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z',
      color: '#10a37f',
    },
  },
  {
    aliases: ['anthropic', 'claude'],
    color: '#d97757',
    logo: {
      kind: 'svg',
      viewBox: '0 0 24 24',
      path: 'M17.304 3.541h-3.672l6.696 16.918h3.672zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541zm-.372 10.339l2.3-5.967 2.3 5.967z',
      color: '#d97757',
    },
  },
  { aliases: ['gemini', 'gcpgemini'], color: '#4285f4', logo: geminiLogo },
  { aliases: ['google'], color: '#4285f4', logo: geminiLogo },
  {
    aliases: [
      'deepseek',
      'deep-seek',
      'deepseek-ai',
      'deepseek baidu',
      'deepseek-baidu',
    ],
    color: '#4d6bfe',
    logo: deepSeekLogo,
  },
  {
    aliases: ['wenxin', '文心', 'ernie', 'erniebot', 'ernie bot'],
    color: '#2d41ff',
    logo: wenxinLogo,
  },
  { aliases: ['baidu', 'qianfan'], color: '#2932e1', logo: baiduLogo },
  { aliases: ['meta', 'llama'], color: '#0082fb', logo: metaLogo },
  { aliases: ['mistral'], color: '#ff7000', logo: mistralLogo },
  {
    aliases: [
      'aliyun',
      'alibaba',
      'alibabacloud',
      'dashscope',
      'tongyi',
      'qwen',
      '阿里云',
      '通义',
    ],
    color: '#ff6a00',
    logo: aliyunLogo,
  },
  {
    aliases: ['tencent', 'hunyuan', '腾讯', '混元'],
    color: '#0052d9',
    logo: tencentLogo,
  },
  { aliases: ['minimax'], color: '#ff4d4f', logo: minimaxLogo },
  {
    aliases: ['zhipu', 'zhipuai', 'bigmodel', 'glm', 'z.ai', '智谱'],
    color: '#3478f6',
    logo: zhipuLogo,
  },
  {
    aliases: ['xunfei', 'xfyun', 'spark', '讯飞', '星火'],
    color: '#00a9ff',
    logo: xfyunLogo,
  },
  { aliases: ['x', 'xai', 'grok'], color: '#111111', logo: xLogo },
  {
    aliases: ['moonshot', 'kimi', '月之暗面'],
    color: '#4f46e5',
    logo: moonshotLogo,
  },
  { aliases: ['doubao', '豆包'], color: '#3370ff', logo: doubaoLogo },
  {
    aliases: ['volcengine', '火山引擎'],
    color: '#ff6b3d',
    logo: volcengineLogo,
  },
];

const fallbackPalette = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#06b6d4',
];

function normalizeProviderKey(providerCode?: string, providerName?: string) {
  return `${providerCode || ''} ${providerName || ''}`.trim().toLowerCase();
}

function findProviderAsset(providerCode?: string, providerName?: string) {
  const key = normalizeProviderKey(providerCode, providerName);
  return providerAssets.find((item) =>
    item.aliases.some((alias) => key.includes(alias.toLowerCase()))
  );
}

export function getProviderLogo(providerCode?: string, providerName?: string) {
  return findProviderAsset(providerCode, providerName)?.logo || null;
}

export function getProviderBrandColor(
  providerCode?: string,
  providerName?: string
) {
  const asset = findProviderAsset(providerCode, providerName);
  if (asset) return asset.color;

  const key = normalizeProviderKey(providerCode, providerName);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + (hash * 31 - hash);
  }
  return fallbackPalette[Math.abs(hash) % fallbackPalette.length];
}

export function getProviderInitial(providerName?: string) {
  return providerName ? providerName.charAt(0).toUpperCase() : '?';
}

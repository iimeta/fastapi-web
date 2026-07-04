export interface TimeRule {
  time_type: string;
  name: string;
  start_time: any;
  end_time: any;
  discount: any;
  days?: number[];
  day_mode?: string;
  priority: any;
  models: string[];
  model_names?: string[];
}

export interface TextPricing {
  service_tier?: string;
  input_ratio: any;
  output_ratio: any;
  reasoning_ratio: any;
  mode?: string;
  gt?: any;
  lte?: any;
  read_ratio?: any;
}

export interface CachePricing {
  service_tier?: string;
  read_ratio: any;
  write_ratio?: any;
  write_5m_ratio?: any;
  write_1h_ratio?: any;
  mode?: string;
  gt?: any;
  lte?: any;
}

export interface ImagePricing {
  input_ratio: any;
  output_ratio: any;
  read_ratio?: any;
}

export interface ImageGenerationPricing {
  quality: any;
  width: any;
  height: any;
  once_ratio: any;
  is_default: string;
}

export interface VisionPricing {
  mode: string;
  once_ratio: any;
  is_default: string;
}

export interface AudioPricing {
  input_ratio: any;
  output_ratio: any;
  read_ratio?: any;
}

export interface VideoPricing {
  input_ratio: any;
  output_ratio: any;
  read_ratio?: any;
}

export interface VideoGenerationPricing {
  mode: any;
  width: any;
  height: any;
  once_ratio: any;
  is_default: string;
}

export interface SearchPricing {
  context_size?: string;
  once_ratio: any;
  is_default: string;
}

export interface OncePricing {
  once_ratio: any;
}

export interface Pricing {
  currency_symbol?: string;
  billing_rule: any;
  billing_methods: number[];
  billing_items: string[];
  text: TextPricing[];
  text_cache: CachePricing[];
  tiered_text: TextPricing[];
  tiered_text_cache: CachePricing[];
  image: ImagePricing;
  image_generation: ImageGenerationPricing[];
  image_cache: CachePricing;
  vision: VisionPricing[];
  audio: AudioPricing;
  audio_cache: CachePricing;
  video: VideoPricing;
  video_generation: VideoGenerationPricing[];
  video_cache: CachePricing;
  search: SearchPricing[];
  once: OncePricing;
}

export interface TextSpend {
  pricing: TextPricing;
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  spend_tokens: number;
}

export interface CacheSpend {
  pricing: CachePricing;
  read_tokens: number;
  write_tokens: number;
  write_5m_tokens: number;
  write_1h_tokens: number;
  spend_tokens: number;
}

export interface ImageSpend {
  pricing: ImagePricing;
  input_tokens: number;
  output_tokens: number;
  spend_tokens: number;
}

export interface ImageGenerationSpend {
  pricing: ImageGenerationPricing;
  n: number;
  spend_tokens: number;
}

export interface VisionSpend {
  pricing: VisionPricing;
  spend_tokens: number;
}

export interface AudioSpend {
  pricing: AudioPricing;
  input_tokens: number;
  output_tokens: number;
  spend_tokens: number;
}

export interface VideoSpend {
  pricing: VideoPricing;
  input_tokens: number;
  output_tokens: number;
  spend_tokens: number;
}

export interface VideoGenerationSpend {
  pricing: VideoGenerationPricing;
  seconds: number;
  spend_tokens: number;
}

export interface SearchSpend {
  pricing: SearchPricing;
  spend_tokens: number;
}

export interface OnceSpend {
  pricing: OncePricing;
  spend_tokens: number;
  input_tokens: number;
  output_tokens: number;
}

export interface Spend {
  currency_symbol?: string;
  billing_rule: number;
  billing_methods: number[];
  billing_items: string[];
  text: TextSpend;
  text_cache: CacheSpend;
  tiered_text: TextSpend;
  tiered_text_cache: CacheSpend;
  image: ImageSpend;
  image_generation: ImageGenerationSpend;
  image_cache: CacheSpend;
  vision: VisionSpend;
  audio: AudioSpend;
  audio_cache: CacheSpend;
  video: VideoSpend;
  video_generation: VideoGenerationSpend;
  video_cache: CacheSpend;
  search: SearchSpend;
  once: OnceSpend;
  group_id: string;
  group_name: string;
  model_time_rule?: TimeRule;
  group_time_rule?: TimeRule;
  total_spend_tokens: number;
}

// 支持的端点可选项[OpenAI风格用规范化路径, Google用action, general用请求路径属动态特例不放入]
export const ENDPOINTS = [
  // OpenAI 风格 (value = 规范化路径)
  { value: '/v1/chat/completions', label: '/v1/chat/completions' },
  { value: '/v1/responses', label: '/v1/responses' },
  { value: '/v1/responses/compact', label: '/v1/responses/compact' },
  { value: '/v1/messages', label: '/v1/messages' },
  { value: '/v1/images/generations', label: '/v1/images/generations' },
  { value: '/v1/images/edits', label: '/v1/images/edits' },
  { value: '/v1/videos', label: '/v1/videos' },
  { value: '/v1/audio/speech', label: '/v1/audio/speech' },
  { value: '/v1/audio/transcriptions', label: '/v1/audio/transcriptions' },
  { value: '/v1/embeddings', label: '/v1/embeddings' },
  { value: '/v1/moderations', label: '/v1/moderations' },
  { value: '/v1/realtime', label: '/v1/realtime' },
  // Google (value = action)
  { value: 'generateContent', label: 'generateContent' },
  { value: 'streamGenerateContent', label: 'streamGenerateContent' },
];

export interface TextPricing {
  service_tier?: string;
  input_ratio: any;
  output_ratio: any;
  mode?: string;
  gt?: any;
  lte?: any;
  read_ratio?: any;
}

export interface CachePricing {
  service_tier?: string;
  read_ratio: any;
  write_ratio?: any;
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

export interface MidjourneyPricing {
  name: any;
  action: any;
  path: any;
  once_ratio: any;
}

export interface OncePricing {
  once_ratio: any;
}

export interface Pricing {
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
  video: VideoPricing[];
  search: SearchPricing[];
  midjourney: MidjourneyPricing[];
  once: OncePricing;
}

export interface TextSpend {
  pricing: TextPricing;
  input_tokens: number;
  output_tokens: number;
  spend_tokens: number;
}

export interface CacheSpend {
  pricing: CachePricing;
  read_tokens: number;
  write_tokens: number;
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
  spend_tokens: number;
}

export interface SearchSpend {
  pricing: SearchPricing;
  spend_tokens: number;
}

export interface MidjourneySpend {
  pricing: MidjourneyPricing;
  spend_tokens: number;
}

export interface OnceSpend {
  pricing: OncePricing;
  spend_tokens: number;
  input_tokens: number;
  output_tokens: number;
}

export interface Spend {
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
  search: SearchSpend;
  midjourney: MidjourneySpend;
  once: OnceSpend;
  group_id: string;
  group_name: string;
  group_discount: number;
  total_spend_tokens: number;
}

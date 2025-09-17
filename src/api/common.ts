export interface TextPricing {
  input_ratio: number;
  output_ratio: number;
  thinking: string;
  input_gt: number;
  input_lte: number;
}

export interface ImageGenerationPricing {
  quality: string;
  width: number;
  height: number;
  fixed_quota: number;
  is_default: string;
}

export interface AudioPricing {
  input_ratio: number;
  output_ratio: number;
}

export interface VisionPricing {
  mode: string;
  fixed_quota: number;
  is_default: string;
}

export interface SearchPricing {
  search_context_size: string;
  fixed_quota: number;
  is_default: string;
}

export interface CachePricing {
  input_ratio: number;
  output_ratio: number;
  input_gt: number;
  input_lte: number;
}

export interface Pricing {
  billing_rule: number;
  billing_items: string[];
  text_pricing: TextPricing;
  text_cache_pricing: CachePricing;
  tiered_text_pricing: TextPricing[];
  tiered_text_cache_pricing: CachePricing[];
  image_generation_pricing: ImageGenerationPricing[];
  image_cache_pricing: CachePricing;
  audio_pricing: AudioPricing;
  audio_cache_pricing: CachePricing;
  vision_pricing: VisionPricing[];
  search_pricing: SearchPricing[];
}

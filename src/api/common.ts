export interface TextPricing {
  input_ratio: any;
  output_ratio: any;
  mode?: string;
  input_gt: any;
  input_lte: any;
}

export interface CachePricing {
  read_ratio: any;
  write_ratio: any;
  mode?: string;
  input_gt: any;
  input_lte: any;
}

export interface ImagePricing {
  input_ratio: any;
  output_ratio: any;
}

export interface ImageGenerationPricing {
  quality: any;
  width: any;
  height: any;
  fixed_quota: any;
  is_default: string;
}

export interface VisionPricing {
  mode: string;
  fixed_quota: any;
  is_default: string;
}

export interface AudioPricing {
  input_ratio: any;
  output_ratio: any;
}

export interface SearchPricing {
  search_context_size?: string;
  fixed_quota: any;
  is_default: string;
}

export interface MidjourneyPricing {
  name: any;
  action: any;
  path: any;
  fixed_quota: any;
}

export interface Pricing {
  billing_rule:  any;
  billing_items: string[];
  text: TextPricing;
  text_cache: CachePricing;
  tiered_text: TextPricing[];
  tiered_text_cache: CachePricing[];
  image: ImagePricing;
  image_generation: ImageGenerationPricing[];
  image_cache: CachePricing;
  vision: VisionPricing[];
  audio: AudioPricing;
  audio_cache: CachePricing;
  search: SearchPricing[];
  midjourney: MidjourneyPricing[];
}

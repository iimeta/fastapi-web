export interface TextPricing {
  input_ratio: any;
  output_ratio: any;
  mode?: string;
  input_gt?: any;
  input_lte?: any;
  read_ratio?: any;
}

export interface CachePricing {
  read_ratio: any;
  write_ratio?: any;
  mode?: string;
  input_gt?: any;
  input_lte?: any;
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
  once: OncePricing;
}

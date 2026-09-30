export type ProductionMode = "AUTO" | "SEMI-AUTO" | "MANUAL" | "NOT AVAILABLE";
export type OverallStatus =
  | "draft"
  | "in_production"
  | "qc1_pending"
  | "master_stored"
  | "archived";
export type AssetType = "A" | "B";
export type ProductionStatus =
  | "pending"
  | "in_production"
  | "result_ready"
  | "registered"
  | "qc1_pending"
  | "qc1_passed"
  | "qc1_failed"
  | "master_stored";
export type CloudinaryStatus = "not_stored" | "pending" | "stored" | "error";
export type QC1Status = "pending" | "passed" | "failed";
export type CampaignStatus =
  | "draft"
  | "preview"
  | "qc2_pending"
  | "approved"
  | "scheduled"
  | "distributing"
  | "completed"
  | "rejected";
export type QC2Status = "pending" | "passed" | "failed";
export type TargetPlatform = "tiktok" | "facebook" | "youtube";
export type BufferStatus = "not_scheduled" | "scheduled" | "distributed" | "error";

export interface Product {
  id: string;
  product_code: string;
  name: string;
  category: string | null;
  product_type: string;
  production_mode: ProductionMode;
  overall_status: OverallStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  product_id: string;
  asset_type: AssetType;
  asset_code: string;
  content_type: string;
  production_mode: ProductionMode;
  production_status: ProductionStatus;
  version: string;
  master_url: string | null;
  cloudinary_status: CloudinaryStatus;
  qc1_status: QC1Status;
  qc1_notes: string | null;
  console2_available: boolean;
  file_name: string | null;
  file_size_bytes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingCampaign {
  id: string;
  asset_id: string;
  product_id: string;
  title: string;
  description: string | null;
  cta: string | null;
  product_link: string | null;
  target_platform: TargetPlatform;
  channel_name: string | null;
  channel_id: string | null;
  campaign_status: CampaignStatus;
  qc2_status: QC2Status;
  qc2_notes: string | null;
  scheduled_at: string | null;
  buffer_status: BufferStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductWithAssets extends Product {
  assets: Asset[];
}

export const PRODUCT_TYPES = [
  "pdf",
  "xlsx",
  "zip",
  "template",
  "planner",
  "journal",
  "ebook",
  "canva-template",
  "capcut-template",
  "other",
] as const;

export const CONTENT_TYPES_A = [
  "pdf",
  "xlsx",
  "zip",
  "template",
  "planner",
  "journal",
  "ebook",
  "canva-template",
  "capcut-template",
  "other",
] as const;

export const CONTENT_TYPES_B = ["video/mp4", "video/mov", "image", "other"] as const;

export const CATEGORIES = [
  "Budget/Financial Planner",
  "Financial Tracker",
  "UMKM Bookkeeping",
  "Life Planner",
  "Journal",
  "Canva Template",
  "Business Template",
  "Content Template",
  "Ebook/Guide",
  "Spreadsheet",
  "Niche Template",
  "CapCut Template",
  "Other",
] as const;

export const PRODUCTION_MODES: ProductionMode[] = [
  "AUTO",
  "SEMI-AUTO",
  "MANUAL",
  "NOT AVAILABLE",
];

export const TARGET_PLATFORMS: TargetPlatform[] = ["tiktok", "facebook", "youtube"];

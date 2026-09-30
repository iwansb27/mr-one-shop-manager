import { supabase } from "./supabase";
import type {
  Product,
  Asset,
  MarketingCampaign,
  ProductWithAssets,
} from "../types";

function generateProductCode(existing: Product[]): string {
  let max = 0;
  for (const p of existing) {
    const match = p.product_code.match(/MRONE-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  }
  return `MRONE-${String(max + 1).padStart(3, "0")}`;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function fetchProductWithAssets(
  id: string
): Promise<ProductWithAssets | null> {
  const { data: product, error: pErr } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!product) return null;

  const { data: assets, error: aErr } = await supabase
    .from("assets")
    .select("*")
    .eq("product_id", id)
    .order("asset_type", { ascending: true })
    .order("created_at", { ascending: true });
  if (aErr) throw aErr;

  return { ...(product as Product), assets: assets as Asset[] };
}

export async function createProduct(input: {
  name: string;
  category?: string;
  product_type: string;
  production_mode: Product["production_mode"];
  description?: string;
}): Promise<Product> {
  const existing = await fetchProducts();
  const product_code = generateProductCode(existing);

  const { data, error } = await supabase
    .from("products")
    .insert({
      product_code,
      name: input.name,
      category: input.category || null,
      product_type: input.product_type,
      production_mode: input.production_mode,
      description: input.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAssetsByType(assetType: "A" | "B"): Promise<
  (Asset & { products: Product })[]
> {
  const { data, error } = await supabase
    .from("assets")
    .select(
      `
      *,
      products (*)
    `
    )
    .eq("asset_type", assetType)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (Asset & { products: Product })[];
}

export async function fetchAssetsByProduct(
  productId: string
): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("product_id", productId)
    .order("asset_type", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Asset[];
}

export async function createAsset(input: {
  product_id: string;
  asset_type: "A" | "B";
  asset_code: string;
  content_type: string;
  production_mode: Asset["production_mode"];
  version?: string;
  file_name?: string;
  notes?: string;
}): Promise<Asset> {
  const { data, error } = await supabase
    .from("assets")
    .insert({
      product_id: input.product_id,
      asset_type: input.asset_type,
      asset_code: input.asset_code,
      content_type: input.content_type,
      production_mode: input.production_mode,
      version: input.version || "V1",
      file_name: input.file_name || null,
      notes: input.notes || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Asset;
}

export async function updateAsset(
  id: string,
  updates: Partial<Asset>
): Promise<Asset> {
  const { data, error } = await supabase
    .from("assets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Asset;
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchCampaigns(): Promise<
  (MarketingCampaign & { assets: Asset; products: Product })[]
> {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select(
      `
      *,
      assets (*),
      products (*)
    `
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (MarketingCampaign & { assets: Asset; products: Product })[];
}

export async function fetchCampaignsByAsset(
  assetId: string
): Promise<MarketingCampaign[]> {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq("asset_id", assetId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as MarketingCampaign[];
}

export async function createCampaign(input: {
  asset_id: string;
  product_id: string;
  title: string;
  description?: string;
  cta?: string;
  product_link?: string;
  target_platform: MarketingCampaign["target_platform"];
  channel_name?: string;
  channel_id?: string;
  scheduled_at?: string;
}): Promise<MarketingCampaign> {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .insert({
      asset_id: input.asset_id,
      product_id: input.product_id,
      title: input.title,
      description: input.description || null,
      cta: input.cta || null,
      product_link: input.product_link || null,
      target_platform: input.target_platform,
      channel_name: input.channel_name || null,
      channel_id: input.channel_id || null,
      scheduled_at: input.scheduled_at || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as MarketingCampaign;
}

export async function updateCampaign(
  id: string,
  updates: Partial<MarketingCampaign>
): Promise<MarketingCampaign> {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as MarketingCampaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from("marketing_campaigns")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function fetchDashboardStats(): Promise<{
  totalProducts: number;
  totalAssetsA: number;
  totalAssetsB: number;
  totalCampaigns: number;
  storedMasters: number;
  pendingQC1: number;
  pendingQC2: number;
  console2Ready: number;
}> {
  const [products, assetsA, assetsB, campaigns, stored, qc1Pending, qc2Pending, c2Ready] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("asset_type", "A"),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("asset_type", "B"),
      supabase
        .from("marketing_campaigns")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("cloudinary_status", "stored"),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("qc1_status", "pending"),
      supabase
        .from("marketing_campaigns")
        .select("id", { count: "exact", head: true })
        .eq("qc2_status", "pending"),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("asset_type", "B")
        .eq("console2_available", true),
    ]);

  return {
    totalProducts: products.count || 0,
    totalAssetsA: assetsA.count || 0,
    totalAssetsB: assetsB.count || 0,
    totalCampaigns: campaigns.count || 0,
    storedMasters: stored.count || 0,
    pendingQC1: qc1Pending.count || 0,
    pendingQC2: qc2Pending.count || 0,
    console2Ready: c2Ready.count || 0,
  };
}

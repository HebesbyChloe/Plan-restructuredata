/**
 * Marketing Brands - Supabase Query Utilities
 * 
 * CRUD operations for:
 * - sys_brands (main brands table)
 * - mkt_brand_settings (brand identity)
 * - mkt_brand_colors (brand colors)
 * - mkt_brand_typography (brand typography)
 * - mkt_brand_logos (brand logos)
 * - mkt_brand_guidelines (brand guidelines)
 */

import { supabase } from "../client";

// ============================================
// TYPES
// ============================================

export interface Brand {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  status: "active" | "inactive" | "archived";
  websiteUrl?: string | null;
}

export interface BrandSettings {
  id?: number;
  brandId?: number | null;
  story?: string | null;
  slogan?: string | null;
  tagline?: string | null;
  vision?: string | null;
  mission?: string | null;
}

export interface BrandColor {
  id: number;
  name: string;
  hex: string;
  category: "primary" | "secondary" | "neutral";
  usage?: string | null;
  sortOrder: number;
}

export interface BrandTypography {
  id: number;
  name: string;
  size: string;
  weight: string;
  lineHeight: string;
  category: "headings" | "body";
  usage?: string | null;
  sortOrder: number;
}

export interface BrandLogo {
  id: number;
  name: string;
  variationType: "primary" | "dark" | "icon_only" | "monochrome";
  logoUrl: string;
  thumbnailUrl?: string | null;
  backgroundColor?: string | null;
  isDark: boolean;
  description?: string | null;
  sortOrder: number;
}

export interface BrandGuideline {
  id: number;
  title: string;
  category: "logo_usage" | "typography_rules" | "color_application" | "voice_tone";
  items: string[];
  sortOrder: number;
}

// ============================================
// BRANDS (sys_brands)
// ============================================

export async function getBrands(
  tenantId: number
): Promise<{ data: Brand[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('sys_brands')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching brands:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const brands: Brand[] = data.map((row: any) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description || null,
      logoUrl: row.logo_url || null,
      status: row.status as "active" | "inactive" | "archived",
      websiteUrl: row.website_url || null,
    }));

    return { data: brands, error: null };
  } catch (err) {
    console.error('Unexpected error fetching brands:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createBrand(
  tenantId: number,
  brand: Omit<Brand, 'id'>
): Promise<{ data: Brand | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('sys_brands')
      .insert({
        tenant_id: tenantId,
        code: brand.code,
        name: brand.name,
        description: brand.description || null,
        logo_url: brand.logoUrl || null,
        status: brand.status,
        website_url: brand.websiteUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating brand:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description || null,
        logoUrl: data.logo_url || null,
        status: data.status as "active" | "inactive" | "archived",
        websiteUrl: data.website_url || null,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error creating brand:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateBrand(
  id: number,
  updates: Partial<Omit<Brand, 'id'>>,
  tenantId: number
): Promise<{ data: Brand | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.code !== undefined) updateData.code = updates.code;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl || null;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.websiteUrl !== undefined) updateData.website_url = updates.websiteUrl || null;

    const { data, error } = await supabase
      .from('sys_brands')
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating brand:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description || null,
        logoUrl: data.logo_url || null,
        status: data.status as "active" | "inactive" | "archived",
        websiteUrl: data.website_url || null,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error updating brand:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// BRAND SETTINGS (mkt_brand_settings)
// ============================================

export async function getBrandSettings(
  tenantId: number,
  brandId?: number | null
): Promise<{ data: BrandSettings | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_brand_settings')
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(1);

    if (brandId !== undefined && brandId !== null) {
      query = query.eq('brand_id', brandId);
    }

    const { data, error } = await query.single();

    if (error) {
      // If no settings exist, return empty object
      if (error.code === 'PGRST116') {
        return { data: {}, error: null };
      }
      console.error('Error fetching brand settings:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: data.id,
        brandId: data.brand_id || null,
        story: data.story || null,
        slogan: data.slogan || null,
        tagline: data.tagline || null,
        vision: data.vision || null,
        mission: data.mission || null,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error fetching brand settings:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function upsertBrandSettings(
  tenantId: number,
  settings: BrandSettings
): Promise<{ data: BrandSettings | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_brand_settings')
      .upsert({
        tenant_id: tenantId,
        brand_id: settings.brandId || null,
        story: settings.story || null,
        slogan: settings.slogan || null,
        tagline: settings.tagline || null,
        vision: settings.vision || null,
        mission: settings.mission || null,
      }, {
        onConflict: 'tenant_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting brand settings:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: {
        id: data.id,
        brandId: data.brand_id || null,
        story: data.story || null,
        slogan: data.slogan || null,
        tagline: data.tagline || null,
        vision: data.vision || null,
        mission: data.mission || null,
      },
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error upserting brand settings:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// BRAND COLORS (mkt_brand_colors)
// ============================================

export async function getBrandColors(
  tenantId: number,
  brandId?: number | null
): Promise<{ data: BrandColor[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_brand_colors')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (brandId !== undefined && brandId !== null) {
      query = query.eq('brand_id', brandId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching brand colors:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const colors: BrandColor[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      hex: row.hex,
      category: row.category as "primary" | "secondary" | "neutral",
      usage: row.usage || null,
      sortOrder: row.sort_order || 0,
    }));

    return { data: colors, error: null };
  } catch (err) {
    console.error('Unexpected error fetching brand colors:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function upsertBrandColors(
  tenantId: number,
  colors: Omit<BrandColor, 'id'>[],
  brandId?: number | null
): Promise<{ data: BrandColor[] | null; error: Error | null }> {
  try {
    // Delete existing colors for this tenant/brand
    let deleteQuery = supabase
      .from('mkt_brand_colors')
      .delete()
      .eq('tenant_id', tenantId);
    
    if (brandId !== undefined && brandId !== null) {
      deleteQuery = deleteQuery.eq('brand_id', brandId);
    } else {
      deleteQuery = deleteQuery.is('brand_id', null);
    }

    await deleteQuery;

    // Insert new colors
    const insertData = colors.map((color, index) => ({
      tenant_id: tenantId,
      brand_id: brandId || null,
      name: color.name,
      hex: color.hex,
      category: color.category,
      usage: color.usage || null,
      sort_order: color.sortOrder || index,
    }));

    const { data, error } = await supabase
      .from('mkt_brand_colors')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Error upserting brand colors:', error);
      return { data: null, error: new Error(error.message) };
    }

    const result: BrandColor[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      hex: row.hex,
      category: row.category as "primary" | "secondary" | "neutral",
      usage: row.usage || null,
      sortOrder: row.sort_order || 0,
    }));

    return { data: result, error: null };
  } catch (err) {
    console.error('Unexpected error upserting brand colors:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// BRAND TYPOGRAPHY (mkt_brand_typography)
// ============================================

export async function getBrandTypography(
  tenantId: number,
  brandId?: number | null
): Promise<{ data: BrandTypography[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_brand_typography')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (brandId !== undefined && brandId !== null) {
      query = query.eq('brand_id', brandId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching brand typography:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const typography: BrandTypography[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      size: row.size,
      weight: row.weight,
      lineHeight: row.line_height,
      category: row.category as "headings" | "body",
      usage: row.usage || null,
      sortOrder: row.sort_order || 0,
    }));

    return { data: typography, error: null };
  } catch (err) {
    console.error('Unexpected error fetching brand typography:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function upsertBrandTypography(
  tenantId: number,
  typography: Omit<BrandTypography, 'id'>[],
  brandId?: number | null
): Promise<{ data: BrandTypography[] | null; error: Error | null }> {
  try {
    // Delete existing typography for this tenant/brand
    let deleteQuery = supabase
      .from('mkt_brand_typography')
      .delete()
      .eq('tenant_id', tenantId);
    
    if (brandId !== undefined && brandId !== null) {
      deleteQuery = deleteQuery.eq('brand_id', brandId);
    } else {
      deleteQuery = deleteQuery.is('brand_id', null);
    }

    await deleteQuery;

    // Insert new typography
    const insertData = typography.map((item, index) => ({
      tenant_id: tenantId,
      brand_id: brandId || null,
      name: item.name,
      size: item.size,
      weight: item.weight,
      line_height: item.lineHeight,
      category: item.category,
      usage: item.usage || null,
      sort_order: item.sortOrder || index,
    }));

    const { data, error } = await supabase
      .from('mkt_brand_typography')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Error upserting brand typography:', error);
      return { data: null, error: new Error(error.message) };
    }

    const result: BrandTypography[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      size: row.size,
      weight: row.weight,
      lineHeight: row.line_height,
      category: row.category as "headings" | "body",
      usage: row.usage || null,
      sortOrder: row.sort_order || 0,
    }));

    return { data: result, error: null };
  } catch (err) {
    console.error('Unexpected error upserting brand typography:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// BRAND LOGOS (mkt_brand_logos)
// ============================================

export async function getBrandLogos(
  tenantId: number,
  brandId?: number | null
): Promise<{ data: BrandLogo[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_brand_logos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('sort_order', { ascending: true });

    if (brandId !== undefined && brandId !== null) {
      query = query.eq('brand_id', brandId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching brand logos:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const logos: BrandLogo[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      variationType: row.variation_type as "primary" | "dark" | "icon_only" | "monochrome",
      logoUrl: row.logo_url,
      thumbnailUrl: row.thumbnail_url || null,
      backgroundColor: row.background_color || null,
      isDark: row.is_dark || false,
      description: row.description || null,
      sortOrder: row.sort_order || 0,
    }));

    return { data: logos, error: null };
  } catch (err) {
    console.error('Unexpected error fetching brand logos:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// BRAND GUIDELINES (mkt_brand_guidelines)
// ============================================

export async function getBrandGuidelines(
  tenantId: number,
  brandId?: number | null
): Promise<{ data: BrandGuideline[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_brand_guidelines')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (brandId !== undefined && brandId !== null) {
      query = query.eq('brand_id', brandId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching brand guidelines:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const guidelines: BrandGuideline[] = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category as "logo_usage" | "typography_rules" | "color_application" | "voice_tone",
      items: Array.isArray(row.items) ? row.items : [],
      sortOrder: row.sort_order || 0,
    }));

    return { data: guidelines, error: null };
  } catch (err) {
    console.error('Unexpected error fetching brand guidelines:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function upsertBrandGuidelines(
  tenantId: number,
  guidelines: Omit<BrandGuideline, 'id'>[],
  brandId?: number | null
): Promise<{ data: BrandGuideline[] | null; error: Error | null }> {
  try {
    // Delete existing guidelines for this tenant/brand
    let deleteQuery = supabase
      .from('mkt_brand_guidelines')
      .delete()
      .eq('tenant_id', tenantId);
    
    if (brandId !== undefined && brandId !== null) {
      deleteQuery = deleteQuery.eq('brand_id', brandId);
    } else {
      deleteQuery = deleteQuery.is('brand_id', null);
    }

    await deleteQuery;

    // Insert new guidelines
    const insertData = guidelines.map((item, index) => ({
      tenant_id: tenantId,
      brand_id: brandId || null,
      title: item.title,
      category: item.category,
      items: item.items,
      sort_order: item.sortOrder || index,
    }));

    const { data, error } = await supabase
      .from('mkt_brand_guidelines')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Error upserting brand guidelines:', error);
      return { data: null, error: new Error(error.message) };
    }

    const result: BrandGuideline[] = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category as "logo_usage" | "typography_rules" | "color_application" | "voice_tone",
      items: Array.isArray(row.items) ? row.items : [],
      sortOrder: row.sort_order || 0,
    }));

    return { data: result, error: null };
  } catch (err) {
    console.error('Unexpected error upserting brand guidelines:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}


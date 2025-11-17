/**
 * Promotions - Supabase Query Utilities
 * 
 * CRITICAL: Uses `promo` table (not `mkt_promotions`)
 * All junction tables use `promo_` prefix
 * 
 * CRUD operations for promo table and junction tables
 */

import { supabase } from "../client";
import { PromoRow, PromoInsert, PromoUpdate } from "../../../types/database/marketing";
import { Promotion } from "../../../types/modules/marketing";
import { mapPromotionFromDB, mapPromotionToDB, mapPromotionToDBUpdate } from "../../../utils/marketing/mappers";

// ============================================
// HELPER FUNCTIONS FOR MAPPING NAMES TO IDs
// ============================================

/**
 * Map channel names to channel IDs from mkt_marketing_channels
 */
async function mapChannelNamesToIds(channelNames: string[], tenantId: number): Promise<number[]> {
  if (!channelNames || channelNames.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('mkt_marketing_channels')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .in('name', channelNames);
    
    if (error) {
      console.error('Error fetching channels:', error);
      return [];
    }
    
    return (data || []).map(ch => ch.id);
  } catch (err) {
    console.error('Error mapping channel names to IDs:', err);
    return [];
  }
}

/**
 * Map product names to product IDs
 * Note: This assumes products have a name field. Adjust based on actual schema.
 */
async function mapProductNamesToIds(productNames: string[], tenantId: number): Promise<number[]> {
  if (!productNames || productNames.length === 0) return [];
  
  try {
    // Try to find products by name or SKU
    const { data, error } = await supabase
      .from('product')
      .select('id, name, sku')
      .eq('tenant_id', tenantId)
      .in('name', productNames);
    
    if (error) {
      console.error('Error fetching products:', error);
      // If products don't exist, return empty array (user needs to create products first)
      return [];
    }
    
    return (data || []).map(p => p.id);
  } catch (err) {
    console.error('Error mapping product names to IDs:', err);
    return [];
  }
}

/**
 * Map category names to category IDs
 */
async function mapCategoryNamesToIds(categoryNames: string[], tenantId: number): Promise<number[]> {
  if (!categoryNames || categoryNames.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .in('name', categoryNames);
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return (data || []).map(c => c.id);
  } catch (err) {
    console.error('Error mapping category names to IDs:', err);
    return [];
  }
}

/**
 * Map attribute names to attribute IDs
 * Note: This may need adjustment based on actual attribute table structure
 */
async function mapAttributeNamesToIds(attributeNames: string[], tenantId: number): Promise<number[]> {
  if (!attributeNames || attributeNames.length === 0) return [];
  
  try {
    // Try product_attribute_value table
    const { data, error } = await supabase
      .from('product_attribute_value')
      .select('id, value')
      .in('value', attributeNames);
    
    if (error) {
      console.error('Error fetching attributes:', error);
      return [];
    }
    
    return (data || []).map(a => a.id);
  } catch (err) {
    console.error('Error mapping attribute names to IDs:', err);
    return [];
  }
}

/**
 * Map store names to store IDs from sys_stores
 */
async function mapStoreNamesToIds(storeNames: string[], tenantId: number): Promise<number[]> {
  if (!storeNames || storeNames.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('sys_stores')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .in('name', storeNames)
      .is('deleted_at', null);
    
    if (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
    
    return (data || []).map(s => s.id);
  } catch (err) {
    console.error('Error mapping store names to IDs:', err);
    return [];
  }
}

// ============================================
// QUERY INTERFACES
// ============================================

export interface PromotionFilters {
  status?: Promotion['status'];
  type?: Promotion['type'];
  isActive?: boolean;
  search?: string; // Search in name, code
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all promotions for a tenant with optional filters
 * IMPORTANT: Queries from `promo` table (not `mkt_promotions`)
 */
export async function getPromotions(
  tenantId: number,
  filters?: PromotionFilters
): Promise<{ data: Promotion[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('promo') // CRITICAL: Use 'promo' table name
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null); // Only non-deleted promotions

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching promotions:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Map database rows to frontend types
    const promotions = await Promise.all(
      data.map(async (row: PromoRow) => {
        const promotion = mapPromotionFromDB(row);
        
        // Load junction table relationships and map IDs to names
        const promoId = row.id;
        
        // Load channels
        let channelRelations = null;
        try {
          const result = await supabase
            .from('promo_channels')
            .select('channel_id')
            .eq('promotion_id', promoId);
          channelRelations = result.data;
        } catch (err) {
          // Table might not exist, ignore
          channelRelations = null;
        }
        
        if (channelRelations && channelRelations.length > 0) {
          const channelIds = channelRelations.map((r: any) => r.channel_id);
          const { data: channelData } = await supabase
            .from('mkt_marketing_channels')
            .select('id, name')
            .in('id', channelIds)
            .eq('tenant_id', tenantId);
          promotion.channels = (channelData || []).map(ch => ch.name);
        }
        
        // Load products
        const { data: productRelations } = await supabase
          .from('promo_products')
          .select('product_id')
          .eq('promotion_id', promoId);
        
        if (productRelations && productRelations.length > 0) {
          const productIds = productRelations.map((r: any) => r.product_id);
          const { data: productData } = await supabase
            .from('product')
            .select('id, name')
            .in('id', productIds)
            .eq('tenant_id', tenantId);
          promotion.products = (productData || []).map(p => p.name);
        }
        
        // Load categories
        const { data: categoryRelations } = await supabase
          .from('promo_categories')
          .select('category_id')
          .eq('promotion_id', promoId);
        
        if (categoryRelations && categoryRelations.length > 0) {
          const categoryIds = categoryRelations.map((r: any) => r.category_id);
          const { data: categoryData } = await supabase
            .from('category')
            .select('id, name')
            .in('id', categoryIds)
            .eq('tenant_id', tenantId);
          promotion.categories = (categoryData || []).map(c => c.name);
        }
        
        // Load attributes
        let attributeRelations = null;
        try {
          const result = await supabase
            .from('promo_attributes')
            .select('attribute_id')
            .eq('promotion_id', promoId);
          attributeRelations = result.data;
        } catch (err) {
          // Table might not exist, ignore
          attributeRelations = null;
        }
        
        if (attributeRelations && attributeRelations.length > 0) {
          const attributeIds = attributeRelations.map((r: any) => r.attribute_id);
          const { data: attributeData } = await supabase
            .from('product_attribute_value')
            .select('id, value')
            .in('id', attributeIds);
          promotion.attributes = (attributeData || []).map(a => a.value);
        }
        
        // Load stores
        let storeRelations = null;
        try {
          const result = await supabase
            .from('promo_stores')
            .select('store_id')
            .eq('promotion_id', promoId);
          storeRelations = result.data;
        } catch (err) {
          // Table might not exist, ignore
          storeRelations = null;
        }
        
        if (storeRelations && storeRelations.length > 0) {
          const storeIds = storeRelations.map((r: any) => r.store_id);
          const { data: storeData } = await supabase
            .from('sys_stores')
            .select('id, name')
            .in('id', storeIds)
            .eq('tenant_id', tenantId)
            .is('deleted_at', null);
          promotion.stores = (storeData || []).map(s => s.name);
        }
        
        return promotion;
      })
    );

    return { data: promotions, error: null };
  } catch (err) {
    console.error('Unexpected error fetching promotions:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Get a single promotion by ID with all junction table relationships
 * IMPORTANT: Queries from `promo` table (not `mkt_promotions`)
 */
export async function getPromotionById(
  id: number,
  tenantId: number
): Promise<{ data: Promotion | null; error: Error | null }> {
  try {
    // Get promotion
    const { data: promoData, error: promoError } = await supabase
      .from('promo') // CRITICAL: Use 'promo' table name
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (promoError) {
      console.error('Error fetching promotion:', promoError);
      return { data: null, error: new Error(promoError.message) };
    }

    if (!promoData) {
      return { data: null, error: null };
    }

    const promotion = mapPromotionFromDB(promoData as PromoRow);

    // Fetch junction table relationships
    // Note: These queries use promo_* table names (not mkt_promotion_*)
    const [campaignsResult, channelsResult, productsResult, categoriesResult, attributesResult] = await Promise.all([
      // promo_campaigns
      supabase
        .from('promo_campaigns')
        .select('campaign_id')
        .eq('promotion_id', id),
      // promo_channels (if table exists)
      (async () => {
        try {
          return await supabase
            .from('promo_channels')
            .select('channel_id')
            .eq('promotion_id', id);
        } catch {
          return { data: null, error: null };
        }
      })(),
      // promo_products
      supabase
        .from('promo_products')
        .select('product_id')
        .eq('promotion_id', id),
      // promo_categories
      supabase
        .from('promo_categories')
        .select('category_id')
        .eq('promotion_id', id),
      // promo_attributes
      (async () => {
        try {
          return await supabase
            .from('promo_attributes')
            .select('attribute_id')
            .eq('promotion_id', id);
        } catch {
          return { data: null, error: null };
        }
      })(),
    ]);

    // Map IDs to names for frontend display
    if (campaignsResult.data) {
      promotion.campaigns = campaignsResult.data.map((r: any) => String(r.campaign_id));
    }
    
    // Map channel IDs to names
    if (channelsResult.data && channelsResult.data.length > 0) {
      const channelIds = channelsResult.data.map((r: any) => r.channel_id);
      const { data: channelData } = await supabase
        .from('mkt_marketing_channels')
        .select('id, name')
        .in('id', channelIds)
        .eq('tenant_id', tenantId);
      promotion.channels = (channelData || []).map(ch => ch.name);
    }
    
    // Map product IDs to names
    if (productsResult.data && productsResult.data.length > 0) {
      const productIds = productsResult.data.map((r: any) => r.product_id);
      const { data: productData } = await supabase
        .from('product')
        .select('id, name')
        .in('id', productIds)
        .eq('tenant_id', tenantId);
      promotion.products = (productData || []).map(p => p.name);
    }
    
    // Map category IDs to names
    if (categoriesResult.data && categoriesResult.data.length > 0) {
      const categoryIds = categoriesResult.data.map((r: any) => r.category_id);
      const { data: categoryData } = await supabase
        .from('category')
        .select('id, name')
        .in('id', categoryIds)
        .eq('tenant_id', tenantId);
      promotion.categories = (categoryData || []).map(c => c.name);
    }
    
    // Map attribute IDs to names
    if (attributesResult.data && attributesResult.data.length > 0) {
      const attributeIds = attributesResult.data.map((r: any) => r.attribute_id);
      const { data: attributeData } = await supabase
        .from('product_attribute_value')
        .select('id, value')
        .in('id', attributeIds);
      promotion.attributes = (attributeData || []).map(a => a.value);
    }

    return { data: promotion, error: null };
  } catch (err) {
    console.error('Unexpected error fetching promotion:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new promotion with junction table relationships
 * IMPORTANT: Inserts into `promo` table (not `mkt_promotions`)
 */
export async function createPromotion(
  promotion: Partial<Promotion>,
  tenantId: number
): Promise<{ data: Promotion | null; error: Error | null }> {
  try {
    // Validate required fields
    if (!promotion.name || !promotion.code || !promotion.type || !promotion.status) {
      return { data: null, error: new Error('Missing required fields: name, code, type, status') };
    }
    
    if (!promotion.startDate || !promotion.endDate) {
      return { data: null, error: new Error('Missing required fields: startDate, endDate') };
    }
    
    // Validate date constraint
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    if (endDate < startDate) {
      return { data: null, error: new Error('End date must be greater than or equal to start date') };
    }
    
    // Validate percentage value if provided
    if (promotion.percentageValue !== undefined && promotion.percentageValue !== null) {
      if (promotion.percentageValue < 0 || promotion.percentageValue > 100) {
        return { data: null, error: new Error('Percentage value must be between 0 and 100') };
      }
    }
    
    // Validate unique code per tenant
    if (promotion.code) {
      const { data: existingPromo } = await supabase
        .from('promo')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('code', promotion.code)
        .is('deleted_at', null)
        .maybeSingle();
      
      if (existingPromo) {
        return { data: null, error: new Error(`Promotion code "${promotion.code}" already exists for this tenant`) };
      }
    }

    const insertData = mapPromotionToDB(promotion);
    insertData.tenant_id = tenantId;

    const { data, error } = await supabase
      .from('promo') // CRITICAL: Use 'promo' table name
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating promotion:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('No data returned from insert') };
    }

    const newPromotion = mapPromotionFromDB(data as PromoRow);

    // Map names to IDs for junction tables
    const promoId = newPromotion.id as number;
    
    // Map channels (names to IDs)
    const channelIds = promotion.channels && Array.isArray(promotion.channels) && promotion.channels.length > 0
      ? await mapChannelNamesToIds(promotion.channels as string[], tenantId)
      : [];
    
    // Map products (names to IDs)
    const productIds = promotion.products && Array.isArray(promotion.products) && promotion.products.length > 0
      ? await mapProductNamesToIds(promotion.products as string[], tenantId)
      : [];
    
    // Map categories (names to IDs)
    const categoryIds = promotion.categories && Array.isArray(promotion.categories) && promotion.categories.length > 0
      ? await mapCategoryNamesToIds(promotion.categories as string[], tenantId)
      : [];
    
    // Map attributes (names to IDs)
    const attributeIds = promotion.attributes && Array.isArray(promotion.attributes) && promotion.attributes.length > 0
      ? await mapAttributeNamesToIds(promotion.attributes as string[], tenantId)
      : [];
    
    // Map campaigns (names to IDs)
    const campaignIds = promotion.campaigns && Array.isArray(promotion.campaigns) && promotion.campaigns.length > 0
      ? await (async () => {
          try {
            const { data } = await supabase
              .from('mkt_campaigns')
              .select('id, name')
              .eq('tenant_id', tenantId)
              .in('name', promotion.campaigns as string[])
              .is('deleted_at', null);
            return (data || []).map(c => c.id);
          } catch {
            return [];
          }
        })()
      : [];
    
    // Map stores (names to IDs)
    const storeIds = promotion.stores && Array.isArray(promotion.stores) && promotion.stores.length > 0
      ? await mapStoreNamesToIds(promotion.stores as string[], tenantId)
      : [];

    // Insert junction table relationships
    await Promise.all([
      // promo_campaigns
      campaignIds.length > 0
        ? supabase.from('promo_campaigns').insert(
            campaignIds.map((campaignId) => ({
              promotion_id: promoId,
              campaign_id: campaignId,
            }))
          )
        : Promise.resolve({ error: null }),
      // promo_channels
      channelIds.length > 0
        ? (async () => {
            try {
              return await supabase.from('promo_channels').insert(
                channelIds.map((channelId) => ({
                  promotion_id: promoId,
                  channel_id: channelId,
                }))
              );
            } catch {
              return { error: null };
            }
          })()
        : Promise.resolve({ error: null }),
      // promo_products
      productIds.length > 0
        ? supabase.from('promo_products').insert(
            productIds.map((productId) => ({
              promotion_id: promoId,
              product_id: productId,
            }))
          )
        : Promise.resolve({ error: null }),
      // promo_categories
      categoryIds.length > 0
        ? supabase.from('promo_categories').insert(
            categoryIds.map((categoryId) => ({
              promotion_id: promoId,
              category_id: categoryId,
            }))
          )
        : Promise.resolve({ error: null }),
      // promo_attributes
      attributeIds.length > 0
        ? (async () => {
            try {
              return await supabase.from('promo_attributes').insert(
                attributeIds.map((attributeId) => ({
                  promotion_id: promoId,
                  attribute_id: attributeId,
                }))
              );
            } catch {
              return { error: null };
            }
          })()
        : Promise.resolve({ error: null }),
      // promo_stores
      storeIds.length > 0
        ? (async () => {
            try {
              return await supabase.from('promo_stores').insert(
                storeIds.map((storeId) => ({
                  promotion_id: promoId,
                  store_id: storeId,
                }))
              );
            } catch {
              return { error: null };
            }
          })()
        : Promise.resolve({ error: null }),
    ]);

    return { data: newPromotion, error: null };
  } catch (err) {
    console.error('Unexpected error creating promotion:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update an existing promotion
 * IMPORTANT: Updates `promo` table (not `mkt_promotions`)
 */
export async function updatePromotion(
  id: number,
  updates: Partial<Promotion>,
  tenantId: number
): Promise<{ data: Promotion | null; error: Error | null }> {
  try {
    // Validate date constraint if both dates are provided
    if (updates.startDate && updates.endDate) {
      const startDate = new Date(updates.startDate);
      const endDate = new Date(updates.endDate);
      if (endDate < startDate) {
        return { data: null, error: new Error('End date must be greater than or equal to start date') };
      }
    }
    
    // Validate percentage value if provided
    if (updates.percentageValue !== undefined && updates.percentageValue !== null) {
      if (updates.percentageValue < 0 || updates.percentageValue > 100) {
        return { data: null, error: new Error('Percentage value must be between 0 and 100') };
      }
    }
    
    // Validate unique code per tenant if code is being updated
    if (updates.code) {
      const { data: existingPromo } = await supabase
        .from('promo')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('code', updates.code)
        .neq('id', id) // Exclude current promotion
        .is('deleted_at', null)
        .maybeSingle();
      
      if (existingPromo) {
        return { data: null, error: new Error(`Promotion code "${updates.code}" already exists for this tenant`) };
      }
    }
    
    const updateData = mapPromotionToDBUpdate(updates);
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('promo') // CRITICAL: Use 'promo' table name
      .update(updateData)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating promotion:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Promotion not found or already deleted') };
    }

    const updatedPromotion = mapPromotionFromDB(data as PromoRow);

    // Update junction table relationships if provided
    if (updates.campaigns !== undefined || updates.channels !== undefined || 
        updates.products !== undefined || updates.categories !== undefined || 
        updates.attributes !== undefined || updates.stores !== undefined) {
      // Delete existing relationships
      await Promise.all([
        supabase.from('promo_campaigns').delete().eq('promotion_id', id),
        (async () => {
          try {
            return await supabase.from('promo_channels').delete().eq('promotion_id', id);
          } catch {
            return { error: null };
          }
        })(),
        supabase.from('promo_products').delete().eq('promotion_id', id),
        supabase.from('promo_categories').delete().eq('promotion_id', id),
        (async () => {
          try {
            return await supabase.from('promo_attributes').delete().eq('promotion_id', id);
          } catch {
            return { error: null };
          }
        })(),
        (async () => {
          try {
            return await supabase.from('promo_stores').delete().eq('promotion_id', id);
          } catch {
            return { error: null };
          }
        })(),
      ]);

      // Map names to IDs for junction tables
      const channelIds = updates.channels && Array.isArray(updates.channels) && updates.channels.length > 0
        ? await mapChannelNamesToIds(updates.channels as string[], tenantId)
        : [];
      
      const productIds = updates.products && Array.isArray(updates.products) && updates.products.length > 0
        ? await mapProductNamesToIds(updates.products as string[], tenantId)
        : [];
      
      const categoryIds = updates.categories && Array.isArray(updates.categories) && updates.categories.length > 0
        ? await mapCategoryNamesToIds(updates.categories as string[], tenantId)
        : [];
      
      const attributeIds = updates.attributes && Array.isArray(updates.attributes) && updates.attributes.length > 0
        ? await mapAttributeNamesToIds(updates.attributes as string[], tenantId)
        : [];
      
      const campaignIds = updates.campaigns && Array.isArray(updates.campaigns) && updates.campaigns.length > 0
        ? await (async () => {
            try {
              const { data } = await supabase
                .from('mkt_campaigns')
                .select('id, name')
                .eq('tenant_id', tenantId)
                .in('name', updates.campaigns as string[])
                .is('deleted_at', null);
              return (data || []).map(c => c.id);
            } catch {
              return [];
            }
          })()
        : [];
      
      const storeIds = updates.stores && Array.isArray(updates.stores) && updates.stores.length > 0
        ? await mapStoreNamesToIds(updates.stores as string[], tenantId)
        : [];

      // Insert new relationships
      await Promise.all([
        campaignIds.length > 0
          ? supabase.from('promo_campaigns').insert(
              campaignIds.map((campaignId) => ({
                promotion_id: id,
                campaign_id: campaignId,
              }))
            )
          : Promise.resolve({ error: null }),
        channelIds.length > 0
          ? (async () => {
              try {
                return await supabase.from('promo_channels').insert(
                  channelIds.map((channelId) => ({
                    promotion_id: id,
                    channel_id: channelId,
                  }))
                );
              } catch {
                return { error: null };
              }
            })()
          : Promise.resolve({ error: null }),
        productIds.length > 0
          ? supabase.from('promo_products').insert(
              productIds.map((productId) => ({
                promotion_id: id,
                product_id: productId,
              }))
            )
          : Promise.resolve({ error: null }),
        categoryIds.length > 0
          ? supabase.from('promo_categories').insert(
              categoryIds.map((categoryId) => ({
                promotion_id: id,
                category_id: categoryId,
              }))
            )
          : Promise.resolve({ error: null }),
        attributeIds.length > 0
          ? (async () => {
              try {
                return await supabase.from('promo_attributes').insert(
                  attributeIds.map((attributeId) => ({
                    promotion_id: id,
                    attribute_id: attributeId,
                  }))
                );
              } catch {
                return { error: null };
              }
            })()
          : Promise.resolve({ error: null }),
        storeIds.length > 0
          ? (async () => {
              try {
                return await supabase.from('promo_stores').insert(
                  storeIds.map((storeId) => ({
                    promotion_id: id,
                    store_id: storeId,
                  }))
                );
              } catch {
                return { error: null };
              }
            })()
          : Promise.resolve({ error: null }),
      ]);
    }

    return { data: updatedPromotion, error: null };
  } catch (err) {
    console.error('Unexpected error updating promotion:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Soft delete a promotion (sets deleted_at timestamp)
 * IMPORTANT: Updates `promo` table (not `mkt_promotions`)
 */
export async function deletePromotion(
  id: number,
  tenantId: number
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('promo') // CRITICAL: Use 'promo' table name
      .update({ 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (error) {
      console.error('Error deleting promotion:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting promotion:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}


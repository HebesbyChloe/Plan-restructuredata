/**
 * Products Module - Data Access Hooks
 * React hooks for querying Product module tables
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductWithRelations,
  Category,
  CategoryInsert,
  CategoryUpdate,
  Stock,
  StockInsert,
  StockUpdate,
  Material,
  MaterialInsert,
  MaterialUpdate,
  ProductAttribute,
  ProductAttributeInsert,
  ProductAttributeValue,
  ProductAttributeValueInsert,
  ProductImage,
  ProductImageInsert,
  ProductCategory,
  ProductCategoryInsert,
  ProductTag,
  ProductTagInsert,
  ProductSetItem,
  ProductSetItemInsert,
  ProductVariant,
  ProductVariantInsert,
  ProductCustomize,
  ProductCustomizeInsert,
  Diamond,
  DiamondInsert,
  Gemstone,
  GemstoneInsert,
  MaterialAttribute,
  MaterialProduct,
} from '../types/database/products'

// ============================================
// PRODUCTS
// ============================================

export function useProducts(tenantId: number | null, filters?: {
  product_type?: Product['product_type']
  status?: Product['status']
  category_id?: number
  search?: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [tenantId, filters?.product_type, filters?.status, filters?.category_id, filters?.search])

  const loadProducts = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      
      // Build base query with relations
      let query = supabase
        .from('product')
        .select(`
          *,
          product_category(
            category_id,
            category:category(*)
          ),
          product_image(*),
          product_tag(tag_name)
        `)
        .eq('tenant_id', tenantId)

      if (filters?.product_type) {
        query = query.eq('product_type', filters.product_type)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`)
      }

      // If filtering by category, need to join with product_category
      if (filters?.category_id) {
        const { data: productCategories } = await supabase
          .from('product_category')
          .select('product_id')
          .eq('category_id', filters.category_id)

        if (productCategories && productCategories.length > 0) {
          const productIds = productCategories.map(pc => pc.product_id)
          query = query.in('id', productIds)
        } else {
          // No products in this category
          setProducts([])
          setLoading(false)
          return
        }
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err
      
      // Transform the data to include relations properly
      const productsWithRelations = (data || []).map((p: any) => ({
        ...p,
        categories: p.product_category?.map((pc: any) => pc.category).filter(Boolean) || [],
        tags: p.product_tag?.map((pt: any) => pt.tag_name) || [],
        images: p.product_image?.[0] || null,
      }))
      
      setProducts(productsWithRelations as Product[])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (product: ProductInsert) => {
    const { data, error: err } = await supabase
      .from('product')
      .insert({ ...product, tenant_id: tenantId || undefined })
      .select()
      .single()

    if (err) throw err
    await loadProducts()
    return data
  }

  const updateProduct = async (id: number, updates: ProductUpdate) => {
    const { data, error: err } = await supabase
      .from('product')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadProducts()
    return data
  }

  const deleteProduct = async (id: number) => {
    const { error: err } = await supabase
      .from('product')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadProducts()
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh: loadProducts,
  }
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (id) {
      loadProduct()
    } else {
      setProduct(null)
      setLoading(false)
    }
  }, [id])

  const loadProduct = async () => {
    if (!id) return
    try {
      setLoading(true)
      
      // Load product with all relations
      const { data: productData, error: productErr } = await supabase
        .from('product')
        .select('*')
        .eq('id', id)
        .single()

      if (productErr) throw productErr
      if (!productData) {
        setProduct(null)
        setLoading(false)
        return
      }

      // Load relations in parallel
      const [
        categoriesResult,
        tagsResult,
        imagesResult,
        stockResult,
        attributesResult,
        setItemsResult,
        variantsResult,
        customizeResult,
        diamondResult,
        gemstoneResult,
        materialsResult,
      ] = await Promise.all([
        // Categories
        supabase
          .from('product_category')
          .select('category_id, category:category(*)')
          .eq('product_id', id),
        // Tags
        supabase
          .from('product_tag')
          .select('tag_name')
          .eq('product_id', id),
        // Images
        supabase
          .from('product_image')
          .select('*')
          .eq('product_id', id)
          .maybeSingle(),
        // Stock
        supabase
          .from('stock')
          .select('*')
          .eq('product_sku', productData.sku)
          .maybeSingle(),
        // Attributes
        supabase
          .from('product_attribute_value')
          .select('*, product_attribute:product_attribute(*)')
          .eq('product_id', id),
        // Set items (if product_type='set')
        productData.product_type === 'set'
          ? supabase
              .from('product_set_item')
              .select('*, item_product:product!item_product_id(*)')
              .eq('set_product_id', id)
          : Promise.resolve({ data: null, error: null }),
        // Variants (if product_type='variant' or is a variant child)
        supabase
          .from('product_variant')
          .select('*, variant_product:product!variant_product_id(*)')
          .or(`parent_product_id.eq.${id},variant_product_id.eq.${id}`),
        // Customize (if product_type='customize')
        productData.product_type === 'customize'
          ? supabase
              .from('product_customize')
              .select('*')
              .eq('product_id', id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        // Diamond (if product_type='diamond')
        productData.product_type === 'diamond'
          ? supabase
              .from('diamond')
              .select('*')
              .eq('product_id', id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        // Gemstone (if product_type='gemstone')
        productData.product_type === 'gemstone'
          ? supabase
              .from('gemstone')
              .select('*')
              .eq('product_id', id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        // Materials (BOM)
        supabase
          .from('material_product')
          .select('*, material:material(*)')
          .eq('product_id', id),
      ])

      // Build product with relations
      const productWithRelations: ProductWithRelations = {
        ...productData,
        categories: categoriesResult.data?.map((pc: any) => pc.category).filter(Boolean) || [],
        tags: tagsResult.data?.map((pt: ProductTag) => pt.tag_name) || [],
        images: imagesResult.data || undefined,
        stock: stockResult.data || undefined,
        attributes: attributesResult.data?.map((av: any) => ({
          attribute: av.product_attribute,
          value: av,
        })) || [],
        set_items: setItemsResult.data?.map((si: any) => ({
          item: si.item_product,
          quantity: si.quantity,
          sort_order: si.sort_order,
        })) || [],
        variants: variantsResult.data?.map((v: any) => ({
          variant: v.variant_product,
          attribute: v.variant_attribute,
          value: v.variant_value,
        })) || [],
        customize: customizeResult.data || undefined,
        diamond: diamondResult.data || undefined,
        gemstone: gemstoneResult.data || undefined,
        materials: materialsResult.data?.map((mp: any) => ({
          material: mp.material,
          quantity: mp.quantity,
          unit: mp.unit,
        })) || [],
      }

      setProduct(productWithRelations)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  return { product, loading, error, refresh: loadProduct }
}

// ============================================
// CATEGORIES
// ============================================

export function useCategories(tenantId: number | null) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadCategories()
    } else {
      setCategories([])
      setLoading(false)
    }
  }, [tenantId])

  const loadCategories = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('category')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (err) throw err
      setCategories(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (category: CategoryInsert) => {
    const { data, error: err } = await supabase
      .from('category')
      .insert({ ...category, tenant_id: tenantId || undefined })
      .select()
      .single()

    if (err) throw err
    await loadCategories()
    return data
  }

  const updateCategory = async (id: number, updates: CategoryUpdate) => {
    const { data, error: err } = await supabase
      .from('category')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadCategories()
    return data
  }

  const deleteCategory = async (id: number) => {
    const { error: err } = await supabase
      .from('category')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadCategories()
  }

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories,
  }
}

// ============================================
// STOCK
// ============================================

export function useStock(tenantId: number | null, productSku?: string) {
  const [stock, setStock] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadStock()
    } else {
      setStock([])
      setLoading(false)
    }
  }, [tenantId, productSku])

  const loadStock = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      let query = supabase
        .from('stock')
        .select('*')

      if (productSku) {
        query = query.eq('product_sku', productSku)
      }

      const { data, error: err } = await query.order('updated_at', { ascending: false })

      if (err) throw err
      setStock(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading stock:', err)
    } finally {
      setLoading(false)
    }
  }

  const createStock = async (stockData: StockInsert) => {
    const { data, error: err } = await supabase
      .from('stock')
      .insert(stockData)
      .select()
      .single()

    if (err) throw err
    await loadStock()
    return data
  }

  const updateStock = async (id: number, updates: StockUpdate) => {
    const { data, error: err } = await supabase
      .from('stock')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadStock()
    return data
  }

  return {
    stock,
    loading,
    error,
    createStock,
    updateStock,
    refresh: loadStock,
  }
}

// ============================================
// MATERIALS
// ============================================

export function useMaterials(tenantId: number | null) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadMaterials()
    } else {
      setMaterials([])
      setLoading(false)
    }
  }, [tenantId])

  const loadMaterials = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('material')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (err) throw err
      setMaterials(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading materials:', err)
    } finally {
      setLoading(false)
    }
  }

  const createMaterial = async (material: MaterialInsert) => {
    const { data, error: err } = await supabase
      .from('material')
      .insert({ ...material, tenant_id: tenantId || undefined })
      .select()
      .single()

    if (err) throw err
    await loadMaterials()
    return data
  }

  const updateMaterial = async (id: number, updates: MaterialUpdate) => {
    const { data, error: err } = await supabase
      .from('material')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadMaterials()
    return data
  }

  const deleteMaterial = async (id: number) => {
    const { error: err } = await supabase
      .from('material')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadMaterials()
  }

  return {
    materials,
    loading,
    error,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    refresh: loadMaterials,
  }
}

// ============================================
// PRODUCT ATTRIBUTES
// ============================================

export function useProductAttributes(tenantId: number | null) {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadAttributes()
    } else {
      setAttributes([])
      setLoading(false)
    }
  }, [tenantId])

  const loadAttributes = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('product_attribute')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (err) throw err
      setAttributes(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading product attributes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createAttribute = async (attribute: ProductAttributeInsert) => {
    const { data, error: err } = await supabase
      .from('product_attribute')
      .insert({ ...attribute, tenant_id: tenantId || undefined })
      .select()
      .single()

    if (err) throw err
    await loadAttributes()
    return data
  }

  const updateAttribute = async (id: number, updates: Partial<ProductAttribute>) => {
    const { data, error: err } = await supabase
      .from('product_attribute')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    await loadAttributes()
    return data
  }

  const deleteAttribute = async (id: number) => {
    const { error: err } = await supabase
      .from('product_attribute')
      .delete()
      .eq('id', id)

    if (err) throw err
    await loadAttributes()
  }

  return {
    attributes,
    loading,
    error,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    refresh: loadAttributes,
  }
}

// ============================================
// DIAMONDS
// ============================================

export function useDiamonds(tenantId: number | null) {
  const [diamonds, setDiamonds] = useState<Array<Diamond & { product: Product }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadDiamonds()
    } else {
      setDiamonds([])
      setLoading(false)
    }
  }, [tenantId])

  const loadDiamonds = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('diamond')
        .select('*, product:product(*)')
        .order('created_at', { ascending: false })

      if (err) throw err
      
      // Filter by tenant_id from product
      const filtered = (data || []).filter((d: any) => d.product?.tenant_id === tenantId)
      setDiamonds(filtered)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading diamonds:', err)
    } finally {
      setLoading(false)
    }
  }

  const createDiamond = async (diamond: DiamondInsert) => {
    const { data, error: err } = await supabase
      .from('diamond')
      .insert(diamond)
      .select('*, product:product(*)')
      .single()

    if (err) throw err
    await loadDiamonds()
    return data
  }

  const updateDiamond = async (id: number, updates: Partial<Diamond>) => {
    const { data, error: err } = await supabase
      .from('diamond')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, product:product(*)')
      .single()

    if (err) throw err
    await loadDiamonds()
    return data
  }

  return {
    diamonds,
    loading,
    error,
    createDiamond,
    updateDiamond,
    refresh: loadDiamonds,
  }
}

// ============================================
// GEMSTONES
// ============================================

export function useGemstones(tenantId: number | null) {
  const [gemstones, setGemstones] = useState<Array<Gemstone & { product: Product }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (tenantId) {
      loadGemstones()
    } else {
      setGemstones([])
      setLoading(false)
    }
  }, [tenantId])

  const loadGemstones = async () => {
    if (!tenantId) return
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('gemstone')
        .select('*, product:product(*)')
        .order('created_at', { ascending: false })

      if (err) throw err
      
      // Filter by tenant_id from product
      const filtered = (data || []).filter((g: any) => g.product?.tenant_id === tenantId)
      setGemstones(filtered)
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading gemstones:', err)
    } finally {
      setLoading(false)
    }
  }

  const createGemstone = async (gemstone: GemstoneInsert) => {
    const { data, error: err } = await supabase
      .from('gemstone')
      .insert(gemstone)
      .select('*, product:product(*)')
      .single()

    if (err) throw err
    await loadGemstones()
    return data
  }

  const updateGemstone = async (id: number, updates: Partial<Gemstone>) => {
    const { data, error: err } = await supabase
      .from('gemstone')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, product:product(*)')
      .single()

    if (err) throw err
    await loadGemstones()
    return data
  }

  return {
    gemstones,
    loading,
    error,
    createGemstone,
    updateGemstone,
    refresh: loadGemstones,
  }
}

// ============================================
// MATERIAL ATTRIBUTES
// ============================================

export function useMaterialAttributes() {
  const [attributes, setAttributes] = useState<MaterialAttribute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadAttributes()
  }, [])

  const loadAttributes = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('material_attribute')
        .select('*')
        .order('type', { ascending: true })
        .order('value', { ascending: true })

      if (err) throw err
      setAttributes(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading material attributes:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    attributes,
    loading,
    error,
    refresh: loadAttributes,
  }
}

// ============================================
// JUNCTION TABLE HELPERS
// ============================================

export async function assignProductCategories(productId: number, categoryIds: number[]) {
  // Delete existing
  await supabase.from('product_category').delete().eq('product_id', productId)
  
  // Insert new
  if (categoryIds.length > 0) {
    const inserts: ProductCategoryInsert[] = categoryIds.map(categoryId => ({
      product_id: productId,
      category_id: categoryId,
    }))
    const { error } = await supabase.from('product_category').insert(inserts)
    if (error) throw error
  }
}

export async function assignProductTags(productId: number, tags: string[]) {
  // Delete existing
  await supabase.from('product_tag').delete().eq('product_id', productId)
  
  // Insert new
  if (tags.length > 0) {
    const inserts: ProductTagInsert[] = tags.map(tag_name => ({
      product_id: productId,
      tag_name,
    }))
    const { error } = await supabase.from('product_tag').insert(inserts)
    if (error) throw error
  }
}

export async function assignProductAttributes(productId: number, attributes: ProductAttributeValueInsert[]) {
  // Delete existing
  await supabase.from('product_attribute_value').delete().eq('product_id', productId)
  
  // Insert new
  if (attributes.length > 0) {
    const { error } = await supabase.from('product_attribute_value').insert(attributes)
    if (error) throw error
  }
}

export async function assignProductImages(productId: number, images: ProductImageInsert) {
  // Upsert (one-to-one)
  const { error } = await supabase
    .from('product_image')
    .upsert({ ...images, product_id, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function assignSetItems(setProductId: number, items: ProductSetItemInsert[]) {
  // Delete existing
  await supabase.from('product_set_item').delete().eq('set_product_id', setProductId)
  
  // Insert new
  if (items.length > 0) {
    const { error } = await supabase.from('product_set_item').insert(items)
    if (error) throw error
  }
}

export async function assignVariants(parentProductId: number, variants: ProductVariantInsert[]) {
  // Delete existing
  await supabase.from('product_variant').delete().eq('parent_product_id', parentProductId)
  
  // Insert new
  if (variants.length > 0) {
    const { error } = await supabase.from('product_variant').insert(variants)
    if (error) throw error
  }
}

// ============================================
// SET STOCK CALCULATION
// ============================================

export async function calculateSetStock(setProductId: number): Promise<number> {
  // Get set items
  const { data: setItems, error: itemsErr } = await supabase
    .from('product_set_item')
    .select('item_product_id, quantity')
    .eq('set_product_id', setProductId)

  if (itemsErr) throw itemsErr
  if (!setItems || setItems.length === 0) return 0

  // Get stock for each item
  const itemIds = setItems.map(si => si.item_product_id)
  const { data: products, error: productsErr } = await supabase
    .from('product')
    .select('sku')
    .in('id', itemIds)

  if (productsErr) throw productsErr
  if (!products) return 0

  const skus = products.map(p => p.sku)
  const { data: stocks, error: stocksErr } = await supabase
    .from('stock')
    .select('product_sku, quantity_vn, quantity_us')
    .in('product_sku', skus)

  if (stocksErr) throw stocksErr
  if (!stocks) return 0

  // Calculate: MIN(item_stock / item_quantity_in_set)
  const stockMap = new Map(stocks.map(s => [s.product_sku, s.quantity_vn + s.quantity_us]))
  const productSkuMap = new Map(products.map(p => [p.id, p.sku]))

  let minStock = Infinity
  for (const setItem of setItems) {
    const itemSku = productSkuMap.get(setItem.item_product_id)
    if (!itemSku) continue
    const itemStock = stockMap.get(itemSku) || 0
    const availableSets = Math.floor(itemStock / setItem.quantity)
    minStock = Math.min(minStock, availableSets)
  }

  return minStock === Infinity ? 0 : minStock
}


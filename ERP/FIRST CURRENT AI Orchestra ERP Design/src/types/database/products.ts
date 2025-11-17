/**
 * Products Module - Database Type Definitions
 * Types matching the database schema from product_schema_map.md
 */

// ============================================
// PRODUCT
// ============================================

export interface Product {
  id: number
  tenant_id?: number // Should be added for multi-tenancy
  sku: string
  name: string
  product_type: 'standard' | 'customize' | 'variant' | 'set' | 'jewelry' | 'diamond' | 'gemstone'
  retail_price: number // NUMERIC(12,2)
  sale_price: number // NUMERIC(12,2)
  description: string
  is_pre_order: boolean
  promotion_id: number | null
  created_at: string // TIMESTAMPTZ
  updated_at: string // TIMESTAMPTZ
  created_by_id: number | null // FK → staff.id
  status: 'draft' | 'publish' | 'updated' | 'do_not_import'
  published_at: string | null // TIMESTAMPTZ
}

export interface ProductInsert {
  tenant_id?: number
  sku: string
  name: string
  product_type?: 'standard' | 'customize' | 'variant' | 'set' | 'jewelry' | 'diamond' | 'gemstone'
  retail_price?: number
  sale_price?: number
  description?: string
  is_pre_order?: boolean
  promotion_id?: number | null
  created_by_id?: number | null
  status?: 'draft' | 'publish' | 'updated' | 'do_not_import'
  published_at?: string | null
}

export interface ProductUpdate {
  sku?: string
  name?: string
  product_type?: 'standard' | 'customize' | 'variant' | 'set' | 'jewelry' | 'diamond' | 'gemstone'
  retail_price?: number
  sale_price?: number
  description?: string
  is_pre_order?: boolean
  promotion_id?: number | null
  status?: 'draft' | 'publish' | 'updated' | 'do_not_import'
  published_at?: string | null
  updated_at?: string
}

// ============================================
// CATEGORY
// ============================================

export interface Category {
  id: number
  tenant_id?: number // Should be added for multi-tenancy
  name: string
  parent_id: number // FK → category.id, DEFAULT 0
}

export interface CategoryInsert {
  tenant_id?: number
  name: string
  parent_id?: number
}

export interface CategoryUpdate {
  name?: string
  parent_id?: number
}

// ============================================
// PRODUCT_CATEGORY (Junction)
// ============================================

export interface ProductCategory {
  id: number
  product_id: number // FK → product.id
  category_id: number // FK → category.id
  created_at: string
}

export interface ProductCategoryInsert {
  product_id: number
  category_id: number
}

// ============================================
// PRODUCT_TAG (Junction)
// ============================================

export interface ProductTag {
  id: number
  product_id: number // FK → product.id
  tag_name: string
  created_at: string
}

export interface ProductTagInsert {
  product_id: number
  tag_name: string
}

// ============================================
// STOCK
// ============================================

export interface Stock {
  id: number
  product_sku: string // UNIQUE, soft FK to product.sku
  quantity_vn: number // CHECK >= 0
  quantity_us: number // CHECK >= 0
  outbound_vn: number // CHECK >= 0
  outbound_us: number // CHECK >= 0
  inbound_vn: number // CHECK >= 0
  inbound_us: number // CHECK >= 0
  name_product: string // Denormalized from product.name
  updated_by_id: number | null // FK → staff.id
  time_group_sku: string // TIMESTAMPTZ
  created_at: string // TIMESTAMPTZ
  updated_at: string // TIMESTAMPTZ
}

export interface StockInsert {
  product_sku: string
  quantity_vn?: number
  quantity_us?: number
  outbound_vn?: number
  outbound_us?: number
  inbound_vn?: number
  inbound_us?: number
  name_product: string
  updated_by_id?: number | null
}

export interface StockUpdate {
  quantity_vn?: number
  quantity_us?: number
  outbound_vn?: number
  outbound_us?: number
  inbound_vn?: number
  inbound_us?: number
  name_product?: string
  updated_by_id?: number | null
  updated_at?: string
}

// ============================================
// PRODUCT_ATTRIBUTE
// ============================================

export interface ProductAttribute {
  id: number
  tenant_id?: number // Should be added for multi-tenancy
  name: string // UNIQUE (e.g., "Color", "Size", "Material")
  type: string // (e.g., "text", "number", "select")
  value: string // Default/example value
  description: string
}

export interface ProductAttributeInsert {
  tenant_id?: number
  name: string
  type: string
  value?: string
  description?: string
}

export interface ProductAttributeUpdate {
  name?: string
  type?: string
  value?: string
  description?: string
}

// ============================================
// PRODUCT_ATTRIBUTE_VALUE (Junction)
// ============================================

export interface ProductAttributeValue {
  id: number
  product_id: number // FK → product.id
  attribute_id: number // FK → product_attribute.id
  value: string
  is_variant_value: boolean // If TRUE, used for variant SKU generation
  created_at: string
  updated_at: string
}

export interface ProductAttributeValueInsert {
  product_id: number
  attribute_id: number
  value: string
  is_variant_value?: boolean
}

export interface ProductAttributeValueUpdate {
  value?: string
  is_variant_value?: boolean
  updated_at?: string
}

// ============================================
// PRODUCT_IMAGE
// ============================================

export interface ProductImage {
  id: number
  product_id: number // FK → product.id, UNIQUE (one-to-one)
  thumbnail: string // URL
  gallery: string // JSON array or comma-separated URLs
  updated_by_id: number | null // FK → staff.id
  updated_at: string
}

export interface ProductImageInsert {
  product_id: number
  thumbnail?: string
  gallery?: string // JSON array string
  updated_by_id?: number | null
}

export interface ProductImageUpdate {
  thumbnail?: string
  gallery?: string
  updated_by_id?: number | null
  updated_at?: string
}

// ============================================
// PRODUCT_SET_ITEM (Junction)
// ============================================

export interface ProductSetItem {
  id: number
  set_product_id: number // FK → product.id (parent set/bundle)
  item_product_id: number // FK → product.id (component item)
  quantity: number // CHECK > 0
  sort_order: number
  created_at: string
}

export interface ProductSetItemInsert {
  set_product_id: number
  item_product_id: number
  quantity: number
  sort_order?: number
}

export interface ProductSetItemUpdate {
  quantity?: number
  sort_order?: number
}

// ============================================
// PRODUCT_VARIANT (Junction)
// ============================================

export interface ProductVariant {
  id: number
  parent_product_id: number // FK → product.id (variant parent)
  variant_product_id: number // FK → product.id (variant instance)
  variant_attribute: string // (e.g., "Size", "Color")
  variant_value: string // (e.g., "S", "M", "L", "Red", "Blue")
  sort_order: number
  created_at: string
}

export interface ProductVariantInsert {
  parent_product_id: number
  variant_product_id: number
  variant_attribute: string
  variant_value: string
  sort_order?: number
}

export interface ProductVariantUpdate {
  variant_attribute?: string
  variant_value?: string
  sort_order?: number
}

// ============================================
// PRODUCT_CUSTOMIZE
// ============================================

export interface ProductCustomize {
  id: number
  product_id: number // FK → product.id, UNIQUE (one-to-one, only for customize products)
  customization: Record<string, any> // JSONB
  created_at: string
  updated_at: string
  updated_by_id: number | null // FK → staff.id
}

export interface ProductCustomizeInsert {
  product_id: number
  customization: Record<string, any>
  updated_by_id?: number | null
}

export interface ProductCustomizeUpdate {
  customization?: Record<string, any>
  updated_by_id?: number | null
  updated_at?: string
}

// ============================================
// DIAMOND
// ============================================

export interface Diamond {
  id: number
  product_id: number // FK → product.id, UNIQUE (one-to-one, only for certified diamonds)
  item_id: string | null // UNIQUE, External Item ID
  shape: string
  cut_grade: string
  carat: number // NUMERIC(5,3), CHECK > 0
  color: string
  clarity: string
  grading_lab: string
  certificate_number: string | null // UNIQUE
  certificate_path: string
  image_path: string
  total_price: number // NUMERIC(12,2)
  measurement_length: number // NUMERIC(6,2)
  measurement_width: number // NUMERIC(6,2)
  measurement_height: number // NUMERIC(6,2)
  country: string
  state_region: string
  guaranteed_availability: boolean
  created_at: string
  updated_at: string
}

export interface DiamondInsert {
  product_id: number
  item_id?: string | null
  shape?: string
  cut_grade?: string
  carat?: number
  color?: string
  clarity?: string
  grading_lab?: string
  certificate_number?: string | null
  certificate_path?: string
  image_path?: string
  total_price?: number
  measurement_length?: number
  measurement_width?: number
  measurement_height?: number
  country?: string
  state_region?: string
  guaranteed_availability?: boolean
}

export interface DiamondUpdate {
  item_id?: string | null
  shape?: string
  cut_grade?: string
  carat?: number
  color?: string
  clarity?: string
  grading_lab?: string
  certificate_number?: string | null
  certificate_path?: string
  image_path?: string
  total_price?: number
  measurement_length?: number
  measurement_width?: number
  measurement_height?: number
  country?: string
  state_region?: string
  guaranteed_availability?: boolean
  updated_at?: string
}

// ============================================
// GEMSTONE
// ============================================

export interface Gemstone {
  id: number
  product_id: number // FK → product.id, UNIQUE (one-to-one, only for certified gemstones)
  item_id: string | null // UNIQUE, External Item ID
  shape: string
  cut_grade: string
  carat: number // NUMERIC(5,3), CHECK > 0
  color: string
  clarity: string
  grading_lab: string
  certificate_number: string | null // UNIQUE
  certificate_path: string
  image_path: string
  total_price: number // NUMERIC(12,2)
  measurement_length: number // NUMERIC(6,2)
  measurement_width: number // NUMERIC(6,2)
  measurement_height: number // NUMERIC(6,2)
  country: string
  state_region: string
  guaranteed_availability: boolean
  created_at: string
  updated_at: string
}

export interface GemstoneInsert {
  product_id: number
  item_id?: string | null
  shape?: string
  cut_grade?: string
  carat?: number
  color?: string
  clarity?: string
  grading_lab?: string
  certificate_number?: string | null
  certificate_path?: string
  image_path?: string
  total_price?: number
  measurement_length?: number
  measurement_width?: number
  measurement_height?: number
  country?: string
  state_region?: string
  guaranteed_availability?: boolean
}

export interface GemstoneUpdate {
  item_id?: string | null
  shape?: string
  cut_grade?: string
  carat?: number
  color?: string
  clarity?: string
  grading_lab?: string
  certificate_number?: string | null
  certificate_path?: string
  image_path?: string
  total_price?: number
  measurement_length?: number
  measurement_width?: number
  measurement_height?: number
  country?: string
  state_region?: string
  guaranteed_availability?: boolean
  updated_at?: string
}

// ============================================
// MATERIAL
// ============================================

export interface Material {
  id: number
  tenant_id?: number // Should be added for multi-tenancy
  sku: string // UNIQUE
  name: string
  category: string
  unit: string
  price: number // NUMERIC(12,2)
  cost: number // NUMERIC(12,2)
  weight: number | null // NUMERIC(10,3)
  bead: number | null // NUMERIC(10,3)
  stock_vn: number // NUMERIC(10,2), CHECK >= 0
  stock_us: number // NUMERIC(10,2), CHECK >= 0
  total_bead_vn: number | null
  total_bead_us: number | null
  metal: string | null
  stone: string | null
  size: string | null
  collection: string
  thumbnail: string
  created_at: string
  updated_at: string
  updated_by_id: number | null // FK → staff.id
}

export interface MaterialInsert {
  tenant_id?: number
  sku: string
  name: string
  category: string
  unit: string
  price?: number
  cost?: number
  weight?: number | null
  bead?: number | null
  stock_vn?: number
  stock_us?: number
  total_bead_vn?: number | null
  total_bead_us?: number | null
  metal?: string | null
  stone?: string | null
  size?: string | null
  collection?: string
  thumbnail?: string
  updated_by_id?: number | null
}

export interface MaterialUpdate {
  sku?: string
  name?: string
  category?: string
  unit?: string
  price?: number
  cost?: number
  weight?: number | null
  bead?: number | null
  stock_vn?: number
  stock_us?: number
  total_bead_vn?: number | null
  total_bead_us?: number | null
  metal?: string | null
  stone?: string | null
  size?: string | null
  collection?: string
  thumbnail?: string
  updated_by_id?: number | null
  updated_at?: string
}

// ============================================
// MATERIAL_ATTRIBUTE
// ============================================

export interface MaterialAttribute {
  id: number
  name: string // (e.g., "Collection", "Stone", "Color", "Charm")
  type: string // (e.g., "collection", "stone", "color", "charm")
  value: string // (e.g., "Spring 2024", "Diamond", "Red", "10mm")
}

export interface MaterialAttributeInsert {
  name: string
  type: string
  value: string
}

export interface MaterialAttributeUpdate {
  name?: string
  type?: string
  value?: string
}

// ============================================
// MATERIAL_PRODUCT (Junction - BOM)
// ============================================

export interface MaterialProduct {
  id: number
  material_id: number // FK → material.id
  product_id: number // FK → product.id
  quantity: number // NUMERIC(10,3)
  unit: string
  inbound: number
  created_at: string
}

export interface MaterialProductInsert {
  material_id: number
  product_id: number
  quantity: number
  unit: string
  inbound?: number
}

export interface MaterialProductUpdate {
  quantity?: number
  unit?: string
  inbound?: number
}

// ============================================
// PRODUCT WITH RELATIONS (Helper Types)
// ============================================

export interface ProductWithRelations extends Product {
  categories?: Category[]
  tags?: string[]
  images?: ProductImage
  stock?: Stock
  attributes?: Array<{
    attribute: ProductAttribute
    value: ProductAttributeValue
  }>
  set_items?: Array<{
    item: Product
    quantity: number
    sort_order: number
  }>
  variants?: Array<{
    variant: Product
    attribute: string
    value: string
  }>
  customize?: ProductCustomize
  diamond?: Diamond
  gemstone?: Gemstone
  materials?: Array<{
    material: Material
    quantity: number
    unit: string
  }>
}


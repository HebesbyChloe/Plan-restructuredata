/**
 * Products Module - Data Transformation Utilities
 * Transform between normalized database structure and flat UI structure
 */

import type {
  Product,
  ProductWithRelations,
  Category,
  ProductImage,
  Stock,
  ProductAttributeValue,
  ProductAttribute,
} from '../types/database/products'

// ============================================
// PRODUCT TRANSFORMATIONS
// ============================================

/**
 * Transform product from database (normalized) to flat UI structure
 */
export function transformProductFromDB(
  product: ProductWithRelations,
  options?: {
    includeStock?: boolean
    includeImages?: boolean
    includeAttributes?: boolean
    includeCategories?: boolean
  }
) {
  const {
    includeStock = true,
    includeImages = true,
    includeAttributes = true,
    includeCategories = true,
  } = options || {}

  // Get categories as comma-separated string
  const categoryString = includeCategories && product.categories
    ? product.categories.map(c => c.name).join(', ')
    : ''

  // Get stock totals
  const vnStock = includeStock && product.stock ? product.stock.quantity_vn : 0
  const usStock = includeStock && product.stock ? product.stock.quantity_us : 0
  const totalStock = vnStock + usStock

  // Get images
  const thumbnail = includeImages && product.images ? product.images.thumbnail : ''
  const gallery = includeImages && product.images
    ? parseGalleryJSON(product.images.gallery)
    : []

  // Get attributes as flat object
  const attributes: Record<string, string> = {}
  if (includeAttributes && product.attributes) {
    product.attributes.forEach(({ attribute, value }) => {
      attributes[attribute.name] = value.value
    })
  }

  return {
    id: product.id.toString(),
    sku: product.sku,
    name: product.name,
    category: categoryString,
    collection: attributes['Collection'] || '',
    intention: attributes['Intention'] || '',
    retailPrice: Number(product.retail_price),
    salePrice: product.sale_price ? Number(product.sale_price) : undefined,
    vnStock,
    usStock,
    totalStock,
    material: attributes['Material'] || '',
    stone: attributes['Stone'] || '',
    charm: attributes['Charm'] || '',
    charmSize: attributes['Charm Size'] || '',
    beadSize: attributes['Bead Size'] || '',
    color: attributes['Color'] || '',
    element: attributes['Element'] || '',
    size: attributes['Size'] || '',
    gender: attributes['Gender'] || '',
    origin: attributes['Origin'] || '',
    year: attributes['Year'] || '',
    grade: attributes['Grade'] || '',
    description: product.description,
    images: gallery,
    thumbnail,
    status: product.status === 'publish' ? 'published' : product.status === 'do_not_import' ? 'pending' : product.status,
    lastUpdate: product.updated_at,
    product_type: product.product_type,
  }
}

/**
 * Parse gallery JSON string to array
 */
export function parseGalleryJSON(gallery: string | null | undefined): string[] {
  if (!gallery) return []
  
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(gallery)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    // If not JSON, try comma-separated
    if (typeof gallery === 'string') {
      return gallery.split(',').map(url => url.trim()).filter(Boolean)
    }
  }
  
  return []
}

/**
 * Transform gallery array to JSON string for database
 */
export function transformGalleryToDB(gallery: string[]): string {
  if (gallery.length === 0) return ''
  return JSON.stringify(gallery)
}

/**
 * Get product categories as array of names
 */
export function getProductCategories(
  productId: number,
  productCategories: Array<{ category_id: number; category: Category }>
): string[] {
  return productCategories
    .map(pc => pc.category?.name)
    .filter(Boolean) as string[]
}

/**
 * Get product attributes as flat object
 */
export function getProductAttributes(
  productId: number,
  attributeValues: Array<{
    attribute: ProductAttribute
    value: ProductAttributeValue
  }>
): Record<string, string> {
  const attributes: Record<string, string> = {}
  attributeValues.forEach(({ attribute, value }) => {
    attributes[attribute.name] = value.value
  })
  return attributes
}

/**
 * Get product images (handle variant inheritance)
 */
export function getProductImages(
  productId: number,
  productImages: ProductImage | null | undefined,
  parentProduct?: ProductWithRelations
): { thumbnail: string; gallery: string[] } {
  // If product has images, use them
  if (productImages) {
    return {
      thumbnail: productImages.thumbnail || '',
      gallery: parseGalleryJSON(productImages.gallery),
    }
  }

  // If variant and parent has images, inherit from parent
  if (parentProduct?.images) {
    return {
      thumbnail: parentProduct.images.thumbnail || '',
      gallery: parseGalleryJSON(parentProduct.images.gallery),
    }
  }

  return { thumbnail: '', gallery: [] }
}

/**
 * Calculate set stock from items
 */
export function calculateSetStockFromItems(
  setItems: Array<{ item: Product; quantity: number }>,
  stocks: Map<string, Stock>
): number {
  if (!setItems || setItems.length === 0) return 0

  let minStock = Infinity

  for (const setItem of setItems) {
    const stock = stocks.get(setItem.item.sku)
    if (!stock) {
      minStock = 0
      break
    }

    const itemStock = stock.quantity_vn + stock.quantity_us
    const availableSets = Math.floor(itemStock / setItem.quantity)
    minStock = Math.min(minStock, availableSets)
  }

  return minStock === Infinity ? 0 : minStock
}

/**
 * Transform flat UI product data to database structure
 */
export function transformProductToDB(data: {
  sku: string
  name: string
  product_type?: Product['product_type']
  retail_price?: number
  sale_price?: number
  description?: string
  is_pre_order?: boolean
  status?: Product['status']
  categoryIds?: number[]
  tags?: string[]
  attributes?: Record<string, string>
  thumbnail?: string
  gallery?: string[]
  tenant_id?: number
}): {
  product: {
    sku: string
    name: string
    product_type: Product['product_type']
    retail_price: number
    sale_price: number
    description: string
    is_pre_order: boolean
    status: Product['status']
    tenant_id?: number
  }
  categoryIds: number[]
  tags: string[]
  attributes: Array<{ attribute_id: number; value: string; is_variant_value: boolean }>
  images: {
    thumbnail: string
    gallery: string
  }
} {
  return {
    product: {
      sku: data.sku,
      name: data.name,
      product_type: data.product_type || 'standard',
      retail_price: data.retail_price || 0,
      sale_price: data.sale_price || 0,
      description: data.description || '',
      is_pre_order: data.is_pre_order || false,
      status: data.status || 'draft',
      tenant_id: data.tenant_id,
    },
    categoryIds: data.categoryIds || [],
    tags: data.tags || [],
    attributes: Object.entries(data.attributes || {}).map(([name, value]) => ({
      attribute_id: 0, // Will need to be resolved from attribute name
      value,
      is_variant_value: false,
    })),
    images: {
      thumbnail: data.thumbnail || '',
      gallery: transformGalleryToDB(data.gallery || []),
    },
  }
}

/**
 * Build category tree from flat category list
 */
export function buildCategoryTree(categories: Category[]): Array<Category & { children: Category[] }> {
  const categoryMap = new Map<number, Category & { children: Category[] }>()
  const rootCategories: Array<Category & { children: Category[] }> = []

  // First pass: create all category nodes
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // Second pass: build tree
  categories.forEach(category => {
    const node = categoryMap.get(category.id)!
    if (category.parent_id === 0 || !category.parent_id) {
      rootCategories.push(node)
    } else {
      const parent = categoryMap.get(category.parent_id)
      if (parent) {
        parent.children.push(node)
      } else {
        // Orphaned category, add to root
        rootCategories.push(node)
      }
    }
  })

  return rootCategories
}

/**
 * Get category path (breadcrumb) for a category
 */
export function getCategoryPath(
  categoryId: number,
  categories: Category[]
): Category[] {
  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const path: Category[] = []
  let currentId: number | null = categoryId

  while (currentId) {
    const category = categoryMap.get(currentId)
    if (!category) break
    path.unshift(category)
    currentId = category.parent_id === 0 ? null : category.parent_id
  }

  return path
}

/**
 * Format product type for display
 */
export function formatProductType(type: Product['product_type']): string {
  const typeMap: Record<Product['product_type'], string> = {
    standard: 'Standard',
    customize: 'Custom',
    variant: 'Variant',
    set: 'Bundle/Set',
    jewelry: 'Jewelry',
    diamond: 'Certified Diamond',
    gemstone: 'Certified Gemstone',
  }
  return typeMap[type] || type
}

/**
 * Get product type badge color
 */
export function getProductTypeColor(type: Product['product_type']): string {
  const colorMap: Record<Product['product_type'], string> = {
    standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    customize: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    variant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    set: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    jewelry: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    diamond: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    gemstone: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  }
  return colorMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

/**
 * Check if product is low stock
 */
export function isLowStock(stock: Stock | undefined, threshold: number = 15): boolean {
  if (!stock) return true
  const total = stock.quantity_vn + stock.quantity_us
  return total < threshold
}

/**
 * Get stock status badge
 */
export function getStockStatus(stock: Stock | undefined, threshold: number = 15): {
  label: string
  color: string
} {
  if (!stock) {
    return { label: 'No Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
  }

  const total = stock.quantity_vn + stock.quantity_us
  if (total === 0) {
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
  }
  if (total < threshold) {
    return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' }
  }
  return { label: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
}


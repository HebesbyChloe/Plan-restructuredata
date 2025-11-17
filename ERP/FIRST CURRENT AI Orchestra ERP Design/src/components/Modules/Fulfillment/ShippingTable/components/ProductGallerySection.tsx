import React from "react";
import { ZoomIn, Package } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { OrderData } from "../../../../../types/modules/crm";
import { getOrderImagesByOrderId } from "../../../../../sampledata/internalOrderDataExtra";

interface ProductGallerySectionProps {
  order: OrderData;
  onImageClick?: (imageUrl: string) => void;
}

export function ProductGallerySection({ order, onImageClick }: ProductGallerySectionProps) {
  // Get product images from internalOrderDataExtra
  const orderImages = getOrderImagesByOrderId(order.id);
  const images = orderImages.map(img => ({
    image: img.url,
    name: img.description || img.type,
    quantity: 1, // Default quantity for display
    type: img.type
  }));

  if (images.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No product images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 auto-rows-min">
      {images.map((item, index) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          onClick={() => {
            if (onImageClick && item.image) onImageClick(item.image);
          }}
        >
          {/* Image Container */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 hover:ring-2 hover:ring-[#4B6BFB] transition-all shadow-sm hover:shadow-lg relative">
            <img
              src={item.image!}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Zoom Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-7 h-7 text-white" />
            </div>
            {/* Quantity Badge on Image - Only show if quantity > 1 */}
            {item.quantity > 1 && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-[#4B6BFB] text-white text-xs h-6 px-2 shadow-lg">
                  ×{item.quantity}
                </Badge>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

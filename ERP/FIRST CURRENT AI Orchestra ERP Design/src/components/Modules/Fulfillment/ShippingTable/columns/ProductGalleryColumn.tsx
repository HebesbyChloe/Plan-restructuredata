import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "../../../../ui/button";
import type { ShipmentData } from "../types";

interface ProductGalleryColumnProps {
  shipment: ShipmentData;
  onImageClick?: (imageUrl: string) => void;
}

export function ProductGalleryColumn({ shipment, onImageClick }: ProductGalleryColumnProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get all product images from line items
  const images = shipment.items
    ?.filter((item) => item.image)
    .map((item) => ({
      url: item.image!,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
    })) || [];

  if (images.length === 0) {
    return (
      <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(currentImage.url);
    }
  };

  return (
    <div className="relative group">
      {/* Main Image */}
      <div 
        className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all hover:ring-2 hover:ring-[#4B6BFB]"
        onClick={handleZoom}
      >
        <img
          src={currentImage.url}
          alt={currentImage.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        
        {/* Zoom Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {/* Product Info Below */}
      <div className="mt-2 text-xs text-muted-foreground">
        <div className="truncate max-w-[96px]">{currentImage.name}</div>
        <div className="flex items-center justify-between">
          <span>SKU: {currentImage.sku}</span>
          <span>×{currentImage.quantity}</span>
        </div>
      </div>
    </div>
  );
}

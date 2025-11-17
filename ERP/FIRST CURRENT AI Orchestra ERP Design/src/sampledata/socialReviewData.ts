// Social Review Data - Reviews from different social platforms

export interface SocialReview {
  id: string;
  orderId: string;
  platform: "Facebook" | "Instagram" | "Google" | "Yelp" | "TikTok" | "Twitter" | "None";
  reviewText: string;
  images: string[];
  rating?: number;
  reviewerName?: string;
  datePosted?: string;
  notes?: string;
}

export const SOCIAL_PLATFORMS = [
  "None",
  "Facebook",
  "Instagram",
  "Google",
  "Yelp",
  "TikTok",
  "Twitter",
] as const;

// Sample social reviews mapped to order numbers
export const socialReviewsData: SocialReview[] = [
  {
    id: "sr-001",
    orderId: "#12345",
    platform: "Instagram",
    reviewText: "Absolutely love my new engagement ring! The quality is amazing and the customer service was top-notch. Highly recommend! 💍✨",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"
    ],
    rating: 5,
    reviewerName: "@sarah_jewels",
    datePosted: "2024-01-15",
    notes: "Customer posted unboxing video - gained 2.5k views"
  },
  {
    id: "sr-002",
    orderId: "#12346",
    platform: "Google",
    reviewText: "Great experience from start to finish. The custom design process was easy and the final product exceeded expectations.",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400"],
    rating: 5,
    reviewerName: "Michael Chen",
    datePosted: "2024-01-14"
  },
  {
    id: "sr-003",
    orderId: "#12347",
    platform: "Facebook",
    reviewText: "Beautiful necklace! Shipping was fast and packaging was elegant. Will definitely order again.",
    images: [],
    rating: 5,
    reviewerName: "Emma Rodriguez",
    datePosted: "2024-01-13"
  },
  {
    id: "sr-004",
    orderId: "#12348",
    platform: "Yelp",
    reviewText: "Outstanding quality and fair pricing. The staff was patient with all my questions about gemstone options.",
    images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400"],
    rating: 5,
    reviewerName: "David Park",
    datePosted: "2024-01-12"
  },
  {
    id: "sr-005",
    orderId: "#12349",
    platform: "TikTok",
    reviewText: "OMG this bracelet is EVERYTHING! 😍 The sparkle is insane and it fits perfectly. #jewelry #luxurylifestyle",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400"
    ],
    reviewerName: "@glam_lifestyle",
    datePosted: "2024-01-11",
    notes: "Viral video - 150k+ views, drove significant traffic"
  },
  {
    id: "sr-006",
    orderId: "#12350",
    platform: "None",
    reviewText: "",
    images: [],
  }
];

// Helper function to get social review by order ID
export const getSocialReviewByOrderId = (orderId: string): SocialReview | undefined => {
  return socialReviewsData.find(review => review.orderId === orderId);
};

// Helper function to get all reviews for a platform
export const getReviewsByPlatform = (platform: string): SocialReview[] => {
  return socialReviewsData.filter(review => review.platform === platform);
};

// Helper to check if order has social review
export const hasReview = (orderId: string): boolean => {
  const review = getSocialReviewByOrderId(orderId);
  return review !== undefined && review.platform !== "None";
};

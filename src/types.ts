export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  longDescription?: string;
  image: string;
  images: string[];
  dietary: ('vegan' | 'gluten-free' | 'eggless' | 'organic' | 'nut-free')[];
  rating: number;
  reviewsCount: number;
  sizes: string[];
  flavors?: string[];
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    fat: string;
    carbs: string;
    protein: string;
  };
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  flavor?: string;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Received' | 'Baking' | 'Decorating' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
    flavor?: string;
    image: string;
  }[];
  total: number;
  paymentMethod: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  deliveryType: 'delivery' | 'pickup';
  trackingSteps: {
    title: string;
    description: string;
    time?: string;
    status: 'complete' | 'current' | 'upcoming';
  }[];
}

export type PageType =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-details'
  | 'about'
  | 'gallery'
  | 'reviews'
  | 'blog'
  | 'faq'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'contact'
  | 'login'
  | 'register'
  | 'dashboard';

export interface UserSession {
  user: {
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints: number;
    savedAddresses: {
      id: string;
      label: string;
      street: string;
      city: string;
      zipCode: string;
    }[];
  } | null;
}

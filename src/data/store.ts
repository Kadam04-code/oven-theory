import croissantImg from '@/assets/croissant.png';
import sourdoughImg from '@/assets/sourdough.png';
import cookiesImg from '@/assets/cookies.png';
import cakeImg from '@/assets/cake.png';
import baguetteImg from '@/assets/baguette.png';
import cinnamonRollsImg from '@/assets/cinnamon-rolls.png';
import muffinsImg from '@/assets/muffins.png';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Breads' | 'Pastries' | 'Cakes' | 'Cookies';
  image_url: string;
};

export const initialProducts: Product[] = [];

export type OrderStatus = 'Pending' | 'Cooking' | 'Ready' | 'Out for Delivery' | 'Delivered';

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer_email: string;
  customer_address: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  delivery_fee: number;
  total_price: number;
  payment_method: 'Cash on Delivery' | 'Online Payment';
  status: OrderStatus;
  created_at: string;
};

export type StaffRole = 'Cook' | 'Housekeeping' | 'Cleaner' | 'Sales';

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  contact: string;
  date_joined: string;
};

export const initialStaff: Staff[] = [];

export const DELIVERY_FEE = 5.00;
export const GST_RATE = 0.05;

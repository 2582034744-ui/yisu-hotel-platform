// 酒店信息类型
export interface Hotel {
  id: number;
  name: string;
  name_en?: string;
  address: string;
  city?: string;
  star_rating: number;
  images?: string[];
  description?: string;
  facilities?: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected' | 'offline';
  merchant_id?: number;
  merchant_name?: string;
  created_at?: string;
  updated_at?: string;
  // 扩展字段
  rooms?: RoomType[];
  nearby_places?: NearbyPlace[];
  min_price?: number;
  rating?: number;
  review_count?: number;
  distance?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

// 房型类型
export interface RoomType {
  id?: number;
  name: string;
  price: number;
  discount_price?: number;
  bed_type: string;
  area?: number;
  max_guests: number;
  description?: string;
  images?: string[];
}

// 周边地点类型
export interface NearbyPlace {
  id?: number;
  name: string;
  type: 'attraction' | 'transport' | 'shopping';
  distance: string;
}

// 搜索参数
export interface SearchParams {
  keyword?: string;
  city?: string;
  star_rating?: number;
  min_price?: number;
  max_price?: number;
  checkin_date?: string;
  checkout_date?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'distance';
  nearby_type?: 'attraction' | 'transport' | 'shopping';
  page: number;
  pageSize: number;
}

// 分页响应
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API响应
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
}

// 预订信息
export interface BookingInfo {
  hotel_id: number;
  room_id: number;
  checkin_date: string;
  checkout_date: string;
  guest_name: string;
  guest_phone: string;
  total_price: number;
}

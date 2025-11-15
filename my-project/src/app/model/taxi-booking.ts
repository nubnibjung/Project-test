export interface Taxi {
  id: number;
  name: string;
  brand: string;
  type: string;
  imageUrl: string;
  price: number;
  discountPercent?: number;
  rating: number;
  seats: number;
  hasParking: boolean;
  hasAC: boolean;
  isNewCar: boolean;
  nonStop: boolean;
}

export type TaxiCategory = 'All' | 'Branded' | 'Non-branded';

export interface TaxiFilter {
  minPrice: number;
  maxPrice: number;
  seat?: number;
  category: TaxiCategory;
  ac: boolean;
  newCar: boolean;
  nonStop: boolean;
}

export interface TaxiBooking {
  id: number;
  taxiId: number;
  taxiName: string;
  price: number;
  seats: number;
  pickupDate: string;   // 'YYYY-MM-DD'
  pickupTime: string;   // 'HH:mm'
  from: string;
  to: string;
  createdAt: string;    // ISO string
  status: 'active' | 'cancelled';
  cancelledAt?: string;
}

/** เงื่อนไขค้นหาเที่ยว (วันที่ + เวลา + route) */
export interface TripSearch {
  date: string;
  time: string;
  from: string;
  to: string;
  country?: string;
}

export interface Taxi {
  id: number;
  name: string;
  brand: string;
  type: string;
  imageUrl: string;
  price: number;
  discountPercent?: number;
  rating: number;
  seats: number;
  hasParking: boolean;
  hasAC: boolean;
  isNewCar: boolean;
  nonStop: boolean;
  country: string;        
  from: string;         
  to: string;           
  departureDate: string;  
  departureTime: string;  
}

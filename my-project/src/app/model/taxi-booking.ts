// ========== Taxi main model ==========
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

  // ข้อมูลเส้นทาง/เที่ยว
  country: string;        // เช่น 'Thailand'
  from: string;           // เมืองต้นทาง
  to: string;             // เมืองปลายทาง
  departureDate: string;  // 'YYYY-MM-DD'
  departureTime: string;  // 'HH:mm'
}

// ========== Filter model (ใช้กับ sidebar) ==========

export interface TaxiFilter {
  minPrice: number;
  maxPrice: number;
  seat?: number;
  brand?: string | null;  // 👈 ใช้ brand สำหรับ dropdown
  ac?: boolean;
  newCar?: boolean;
  nonStop?: boolean;
}

// ========== Booking model ==========

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

// ========== Search condition (แบบ form ด้านบน) ==========

export interface TripSearch {
  date: string;   // 'YYYY-MM-DD'
  time: string;   // 'HH:mm'
  from: string;
  to: string;
  country?: string;
}

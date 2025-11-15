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

export interface TaxiFilter {
  minPrice: number;
  maxPrice: number;
  seat?: number;
  brand?: string | null;  
  ac?: boolean;
  newCar?: boolean;
  nonStop?: boolean;
}

export interface TaxiBooking {
  id: number;
  taxiId: number;
  taxiName: string;
  price: number;
  seats: number;
  pickupDate: string;   
  pickupTime: string;  
  from: string;
  to: string;
  createdAt: string;    
  status: 'active' | 'cancelled';
  cancelledAt?: string;
}


export interface TripSearch {
  date: string;   
  time: string;   
  from: string;
  to: string;
  country?: string;
}

import { Injectable, computed, signal } from '@angular/core';
import {
  Taxi,
  TaxiBooking,
  TaxiFilter,
  TripSearch,
} from '../model/taxi-booking';

const BOOKING_STORAGE_KEY = 'taxi_bookings_v1';
@Injectable({ providedIn: 'root' })
export class TaxiService {
private readonly mockTaxis: Taxi[] = [
  {
    id: 1,
    name: 'Toyota Corolla ',
    brand: 'Toyota',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 950,
    discountPercent: 10,
    rating: 4.3,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-16',
    departureTime: '08:00',
  },
  {
    id: 2,
    name: 'Honda Civic',
    brand: 'Honda',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&w=800',
    price: 1050,
    discountPercent: 5,
    rating: 4.6,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-16',
    departureTime: '09:00',
  },
  {
    id: 3,
    name: 'Nissan Skyline',
    brand: 'Nissan',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=800',
    price: 890,
    discountPercent: 0,
    rating: 4.0,
    seats: 4,
    hasParking: true,
    hasAC: false,
    isNewCar: false,
    nonStop: false,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-17',
    departureTime: '08:30',
  },
  {
    id: 4,
    name: 'Mazda CX-5',
    brand: 'Mazda',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&w=800',
    price: 1200,
    discountPercent: 15,
    rating: 4.8,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-17',
    departureTime: '10:00',
  },
  {
    id: 5,
    name: 'Hyundai H1 ',
    brand: 'Hyundai',
    type: 'Van',
    imageUrl: 'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&w=800',
    price: 1500,
    discountPercent: 20,
    rating: 4.7,
    seats: 6,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-18',
    departureTime: '09:30',
  },

  // ===== Phuket =====
  {
    id: 6,
    name: 'Mercedes C-Class ',
    brand: 'Mercedes',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 1600,
    discountPercent: 10,
    rating: 4.9,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-16',
    departureTime: '08:00',
  },
  {
    id: 7,
    name: 'Mercedes Benz S-Class ',
    brand: 'Mercedes',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&w=800',
    price: 1800,
    discountPercent: 15,
    rating: 5.0,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-16',
    departureTime: '10:00',
  },
  {
    id: 8,
    name: 'Toyota Innova ',
    brand: 'Toyota',
    type: 'MPV',
    imageUrl: 'https://images.pexels.com/photos/3861485/pexels-photo-3861485.jpeg?auto=compress&w=800',
    price: 1300,
    discountPercent: 5,
    rating: 4.4,
    seats: 6,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: false,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-17',
    departureTime: '09:00',
  },
  {
    id: 9,
    name: 'Lexus LS',
    brand: 'Lexus',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 1400,
    discountPercent: 0,
    rating: 4.2,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-17',
    departureTime: '11:00',
  },
  {
    id: 10,
    name: 'BMW 5 Series ',
    brand: 'BMW',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&w=800',
    price: 1900,
    discountPercent: 20,
    rating: 4.9,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-18',
    departureTime: '09:30',
  },

  // ===== Khon Kaen =====
  {
    id: 11,
    name: 'Toyota Camry',
    brand: 'Toyota',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 800,
    discountPercent: 0,
    rating: 4.0,
    seats: 4,
    hasParking: true,
    hasAC: false,
    isNewCar: false,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-16',
    departureTime: '07:30',
  },
  {
    id: 12,
    name: 'Honda Jazz',
    brand: 'Honda',
    type: 'Hatchback',
    imageUrl: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&w=800',
    price: 900,
    discountPercent: 5,
    rating: 4.3,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-16',
    departureTime: '09:30',
  },
  {
    id: 13,
    name: 'Nissan Teana',
    brand: 'Nissan',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&w=800',
    price: 1100,
    discountPercent: 10,
    rating: 4.1,
    seats: 6,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: false,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-17',
    departureTime: '08:00',
  },
  {
    id: 14,
    name: 'Mazda CX-5 ',
    brand: 'Mazda',
    type: 'SUV',
    imageUrl: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=800',
    price: 1250,
    discountPercent: 15,
    rating: 4.6,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-17',
    departureTime: '10:30',
  },
  {
    id: 15,
    name: 'Hyundai H1 ',
    brand: 'Hyundai',
    type: 'Van',
    imageUrl: 'https://images.pexels.com/photos/3861485/pexels-photo-3861485.jpeg?auto=compress&w=800',
    price: 1350,
    discountPercent: 20,
    rating: 4.5,
    seats: 6,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-18',
    departureTime: '09:00',
  },

  {
    id: 16,
    name: 'Toyota vios',
    brand: 'Toyota',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 700,
    discountPercent: 0,
    rating: 3.9,
    seats: 4,
    hasParking: true,
    hasAC: false,
    isNewCar: false,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-18',
    departureTime: '07:00',
  },
  {
    id: 17,
    name: 'Toyota Alpard ',
    brand: 'Toyota',
    type: 'Van',
    imageUrl: 'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&w=800',
    price: 1950,
    discountPercent: 25,
    rating: 4.9,
    seats: 6,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-18',
    departureTime: '07:45',
  },
  {
    id: 18,
    name: 'Honda City ',
    brand: 'Honda',
    type: 'Hatchback',
    imageUrl: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg',
    price: 650,
    discountPercent: 0,
    rating: 3.8,
    seats: 4,
    hasParking: true,
    hasAC: false,
    isNewCar: false,
    nonStop: false,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Khon Kaen',
    departureDate: '2020-10-18',
    departureTime: '06:30',
  },
  {
    id: 19,
    name: 'Volvo S80',
    brand: 'Volvo',
    type: 'Sedan',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 1250,
    discountPercent: 0,
    rating: 4.1,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: false,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Phuket',
    departureDate: '2020-10-17',
    departureTime: '08:15',
  },
  {
    id: 20,
    name: 'BMW X7',
    brand: 'BMW',
    type: 'SUV',
    imageUrl: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&w=800',
    price: 1800,
    discountPercent: 10,
    rating: 5.0,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Thailand',
    from: 'Bangkok',
    to: 'Chiang Mai',
    departureDate: '2020-10-16',
    departureTime: '11:30',
  },
  
];


  // ===== state: taxis =====
  private readonly _allTaxis = signal<Taxi[]>([]);
  readonly allTaxis = this._allTaxis.asReadonly();

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // ===== state: filter & sort =====
  readonly selectedSort = signal<'cheapest' | 'best' | 'quickest'>('cheapest');
  readonly filter = signal<TaxiFilter>({
    minPrice: 0,
    maxPrice: 2000,    
    seat: 4,
    brand: null,
    ac: false,
    newCar: false,
    nonStop: false,
  });

    readonly brands = computed(() => {
    const taxis = this._allTaxis();
    const unique = Array.from(new Set(taxis.map(t => t.brand))).sort();
    return ['All', ...unique];
  });

  private readonly _bookings = signal<TaxiBooking[]>(this.safeLoadBookings());
  readonly bookings = this._bookings.asReadonly();

  private readonly _tripSearch = signal<TripSearch | null>(null);
  readonly tripSearch = this._tripSearch.asReadonly();

  private safeLoadBookings(): TaxiBooking[] {
    try {
      const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  private saveBookingsToStorage() {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(this._bookings()));
  }

readonly filteredTaxis = computed(() => {
  const taxis = this._allTaxis();
  const f = this.filter();
  const sort = this.selectedSort();
  const trip = this._tripSearch();
  const bookings = this._bookings();

 let result = taxis.filter(
  t =>
    t.price >= f.minPrice &&
    t.price <= f.maxPrice &&
    (!f.seat || t.seats === f.seat) &&
    (!f.ac || t.hasAC) &&
    (!f.newCar || t.isNewCar) &&
    (!f.nonStop || t.nonStop) &&
    (
      !f.brand ||                
      f.brand === 'All' ||       
      t.brand === f.brand        
    )
);

  if (trip) {
    const tripCountry = (trip.country ?? 'All').toLowerCase();

    result = result.filter(t => {
      const matchCountry =
        tripCountry === 'all' || t.country.toLowerCase() === tripCountry;

      const matchFrom =
        !trip.from || t.from.toLowerCase() === trip.from.toLowerCase();

      const matchTo =
        !trip.to || t.to.toLowerCase() === trip.to.toLowerCase();

      const matchDate = !trip.date || t.departureDate === trip.date;
      const matchTime = !trip.time || t.departureTime === trip.time;

      return matchCountry && matchFrom && matchTo && matchDate && matchTime;
    });

    const occupiedIds = bookings
      .filter(
        b =>
          b.pickupDate === trip.date &&
          b.pickupTime === trip.time &&
          b.from.toLowerCase() === (trip.from ?? '').toLowerCase() &&
          b.to.toLowerCase() === (trip.to ?? '').toLowerCase()
      )
      .map(b => b.taxiId);

    result = result.filter(t => !occupiedIds.includes(t.id));
  }

  if (sort === 'cheapest') {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === 'best') {
    result = [...result].sort((a, b) => {
      if (b.rating === a.rating) {
        return Number(b.nonStop) - Number(a.nonStop);
      }
      return b.rating - a.rating;
    });
  } else {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    result = [...result].sort((a, b) => {
      const timeDiff = toMinutes(a.departureTime) - toMinutes(b.departureTime);
      if (timeDiff !== 0) {
        return timeDiff;            
      }
      return Number(b.nonStop) - Number(a.nonStop); 
    });
  }

  return result;
});

  loadTaxis() {
    this.isLoading.set(true);
    this.error.set(null);

    setTimeout(() => {
      try {
        this._allTaxis.set(this.mockTaxis);
      } catch {
        this.error.set('Failed to load taxis');
      } finally {
        this.isLoading.set(false);
      }
    }, 500);
  }

  updateFilter(partial: Partial<TaxiFilter>) {
    this.filter.update((f) => ({ ...f, ...partial }));
  }

  setSort(sort: 'cheapest' | 'best' | 'quickest') {
    this.selectedSort.set(sort);
  }

  setTripSearch(trip: TripSearch | null) {
    this._tripSearch.set(trip);
  }

 createBooking(
  taxi: Taxi,
  payload: { pickupDate: string; pickupTime: string; from: string; to: string }
): TaxiBooking {
  const current = this._bookings();
  const newBooking: TaxiBooking = {
    id: current.length ? Math.max(...current.map((b) => b.id)) + 1 : 1,
    taxiId: taxi.id,
    taxiName: taxi.name,
    price: taxi.price,
    seats: taxi.seats,
    pickupDate: payload.pickupDate,
    pickupTime: payload.pickupTime,
    from: payload.from,
    to: payload.to,
    createdAt: new Date().toISOString(),
    status: 'active',                
  };

  this._bookings.set([...current, newBooking]);
  this.saveBookingsToStorage();
  return newBooking;
}


  clearAllBookings() {
    this._bookings.set([]);
    this.saveBookingsToStorage();
  }
  private getPickupDateTime(b: TaxiBooking): Date {
  return new Date(`${b.pickupDate}T${b.pickupTime}:00`);
}
canCancelBooking(b: TaxiBooking): boolean {
  const status = b.status ?? 'active';
  if (status !== 'active') return false;
  const pickup = this.getPickupDateTime(b);
  const now = new Date();
  const diffMs = pickup.getTime() - now.getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return diffMs >= twoHoursMs;   
}
cancelBooking(id: number): { ok: boolean; reason?: string } {
  const list = this._bookings();
  const idx = list.findIndex((b) => b.id === id);

  if (idx === -1) {
    return { ok: false, reason: 'Booking not found' };
  }

  const newList = list.filter((b) => b.id !== id);

  this._bookings.set(newList);
  this.saveBookingsToStorage();

  return { ok: true };
}



}

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
    name: 'White Jaguar XF 2 Car',
    brand: 'Jaguar',
    type: 'Sedan',
    imageUrl:
      'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
    price: 473,
    discountPercent: 25,
    rating: 4.9,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'India',
    from: 'Mumbai',
    to: 'Goa',
    departureDate: '2020-10-16',
    departureTime: '03:00',
  },
  {
    id: 2,
    name: 'Mercede, Rusell',
    brand: 'Mercedes',
    type: 'Sedan',
    imageUrl:
      'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&w=800',
    price: 520,
    discountPercent: 15,
    rating: 4.8,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: false,
    nonStop: false,

    country: 'India',
    from: 'Mumbai',
    to: 'Goa',
    departureDate: '2020-10-16',
    departureTime: '05:00',
  },
  {
    id: 3,
    name: 'Audi, dididi',
    brand: 'Audi',
    type: 'Sedan',
    imageUrl:
      'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&w=800',
    price: 610,
    discountPercent: 20,
    rating: 4.9,
    seats: 4,
    hasParking: true,
    hasAC: true,
    isNewCar: true,
    nonStop: true,

    country: 'Japan',
    from: 'Tokyo',
    to: 'Osaka',
    departureDate: '2020-10-16',
    departureTime: '09:00',
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
    maxPrice: 800,
    seat: 4,
    category: 'Branded',
    ac: false,
    newCar: false,
    nonStop: false,
  });

  // ===== state: bookings =====
  private readonly _bookings = signal<TaxiBooking[]>(this.safeLoadBookings());
  readonly bookings = this._bookings.asReadonly();

  // ===== state: trip search (วัน–เวลา–เส้นทางที่ user เลือก) =====
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

  // ===== filtered taxis =====
 readonly filteredTaxis = computed(() => {
  const taxis = this._allTaxis();
  const f = this.filter();
  const sort = this.selectedSort();
  const trip = this._tripSearch();
  const bookings = this._bookings();

  let result = taxis.filter(
    (t) =>
      t.price >= f.minPrice &&
      t.price <= f.maxPrice &&
      (!f.seat || t.seats === f.seat) &&
      (!f.ac || t.hasAC) &&
      (!f.newCar || t.isNewCar) &&
      (!f.nonStop || t.nonStop)
  );

  // ----- กรองตามประเทศ / วัน / เวลา / route จาก header -----
 if (trip) {
  const tripCountry = (trip.country ?? 'All').toLowerCase();

  result = result.filter((t) => {
    const matchCountry =
      tripCountry === 'all' ||
      t.country.toLowerCase() === tripCountry;

    const matchFrom =
      !trip.from ||                    // ถ้า trip.from = '' ตรงนี้จะ true ทุกคัน
      t.from.toLowerCase() === trip.from.toLowerCase();

    const matchTo =
      !trip.to ||
      t.to.toLowerCase() === trip.to.toLowerCase();

    const matchDate =
      !trip.date || t.departureDate === trip.date;

    const matchTime =
      !trip.time || t.departureTime === trip.time;

    return matchCountry && matchFrom && matchTo && matchDate && matchTime;
  });

  const occupiedIds = bookings
    .filter(
      (b) =>
        b.pickupDate === trip.date &&
        b.pickupTime === trip.time &&
        b.from.toLowerCase() === (trip.from ?? '').toLowerCase() &&
        b.to.toLowerCase() === (trip.to ?? '').toLowerCase()
    )
    .map((b) => b.taxiId);

  result = result.filter((t) => !occupiedIds.includes(t.id));
}


  // ----- sort เหมือนเดิม -----
  if (sort === 'cheapest') {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === 'best') {
    result = [...result].sort((a, b) => b.rating - a.rating);
  } else {
    result = [...result].sort(
      (a, b) => Number(b.nonStop) - Number(a.nonStop)
    );
  }

  return result;
});

  // ===== public methods =====
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

  // ตั้งค่าทริปที่ user กดค้นหา (ใช้ในการกรอง)
  setTripSearch(trip: TripSearch | null) {
    this._tripSearch.set(trip);
  }

  createBooking(
    taxi: Taxi,
    payload: {
      pickupDate: string;
      pickupTime: string;
      from: string;
      to: string;
    }
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
    };

    this._bookings.set([...current, newBooking]);
    this.saveBookingsToStorage();
    return newBooking;
  }

  clearAllBookings() {
    this._bookings.set([]);
    this.saveBookingsToStorage();
  }
}

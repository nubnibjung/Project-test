import { Injectable, computed, signal } from '@angular/core';

export interface Taxi {
  id: number;
  name: string;
  brand: string;
  type: 'Sedan' | 'SUV' | 'Hatchback';
  imageUrl: string;
  price: number;          // ต่อทริป
  discountPercent?: number;
  rating: number;         // 0–5
  seats: number;
  hasParking: boolean;
  hasAC: boolean;
  isNewCar: boolean;
  nonStop: boolean;
}

export interface TaxiFilter {
  minPrice: number;
  maxPrice: number;
  seat?: number;
  category?: 'All' | 'Branded' | 'Non-branded';
  ac?: boolean;
  newCar?: boolean;
  nonStop?: boolean;
}


@Injectable({ providedIn: 'root' })
export class TaxiService {
  // ===== mock data จำลองเหมือนมาจาก API =====
  private readonly mockTaxis: Taxi[] = [
    {
      id: 1,
      name: 'White Jaguar XF 2 Car',
      brand: 'Jaguar',
      type: 'Sedan',
      imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=800',
      price: 473,
      discountPercent: 25,
      rating: 4.9,
      seats: 4,
      hasParking: true,
      hasAC: true,
      isNewCar: true,
      nonStop: true,
    },
    {
      id: 2,
      name: 'Mercede, Rusell',
      brand: 'Mercedes',
      type: 'Sedan',
      imageUrl: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&w=800',
      price: 473,
      discountPercent: 25,
      rating: 4.9,
      seats: 4,
      hasParking: true,
      hasAC: true,
      isNewCar: false,
      nonStop: false,
    },
    {
      id: 3,
      name: 'Audi, dididi',
      brand: 'Audi',
      type: 'Sedan',
      imageUrl: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&w=800',
      price: 473,
      discountPercent: 25,
      rating: 4.9,
      seats: 4,
      hasParking: true,
      hasAC: true,
      isNewCar: true,
      nonStop: true,
    },
  ];

  // ===== signals =====
  private readonly _allTaxis = signal<Taxi[]>([]);
  readonly allTaxis = this._allTaxis.asReadonly();

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedSort = signal<'cheapest' | 'best' | 'quickest'>('cheapest');

  readonly filter = signal<TaxiFilter>({
    minPrice: 0,
    maxPrice: 800,
    seat: 4,
    category: 'Branded',
  });

  // list สุดท้ายที่ผ่าน filter + sort แล้ว
  readonly filteredTaxis = computed(() => {
    const taxis = this._allTaxis();
    const f = this.filter();
    const sort = this.selectedSort();

    let result = taxis.filter(t =>
      t.price >= f.minPrice &&
      t.price <= f.maxPrice &&
      (!f.seat || t.seats === f.seat) &&
      (!f.ac || t.hasAC) &&
      (!f.newCar || t.isNewCar) &&
      (!f.nonStop || t.nonStop)
    );

    if (sort === 'cheapest') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'best') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      // quickest = mock: เอา nonStop ก่อน
      result = [...result].sort((a, b) => Number(b.nonStop) - Number(a.nonStop));
    }

    return result;
  });

  // เรียกเหมือนโหลดจาก API
  loadTaxis() {
    this.isLoading.set(true);
    this.error.set(null);

    // จำลอง delay 800ms
    setTimeout(() => {
      try {
        this._allTaxis.set(this.mockTaxis);
      } catch (e) {
        this.error.set('Failed to load taxis');
      } finally {
        this.isLoading.set(false);
      }
    }, 800);
  }

  updateFilter(partial: Partial<TaxiFilter>) {
    this.filter.update(f => ({ ...f, ...partial }));
  }

  setSort(sort: 'cheapest' | 'best' | 'quickest') {
    this.selectedSort.set(sort);
  }
}

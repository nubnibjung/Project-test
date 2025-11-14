import { Component, computed, inject, OnInit } from '@angular/core';
import { TaxiService } from '../../service/taxi.service';
import { NgFor, NgIf, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent implements OnInit {
  private readonly taxiSvc = inject(TaxiService);

  readonly taxis = this.taxiSvc.filteredTaxis;
  readonly isLoading = this.taxiSvc.isLoading;
  readonly error = this.taxiSvc.error;
  readonly filter = this.taxiSvc.filter;
  readonly selectedSort = this.taxiSvc.selectedSort;

  // ข้อความ summary
  readonly totalText = computed(
    () => `Total ${this.taxis().length} result`
  );

  ngOnInit(): void {
    this.taxiSvc.loadTaxis();
  }

  // === event handlers ===
  onChangeSeat(seat: string) {
    const value = seat ? Number(seat) : undefined;
    this.taxiSvc.updateFilter({ seat: value });
  }

  onChangeCategory(category: string) {
    this.taxiSvc.updateFilter({
      category: category as any,
    });
  }

  toggleFilterFlag(key: 'ac' | 'newCar' | 'nonStop') {
    const current = this.filter()[key];
    this.taxiSvc.updateFilter({ [key]: !current } as any);
  }

  onChangePriceRange(event: Event, edge: 'minPrice' | 'maxPrice') {
    const value = Number((event.target as HTMLInputElement).value);
    this.taxiSvc.updateFilter({ [edge]: value });
  }

  setSort(sort: 'cheapest' | 'best' | 'quickest') {
    this.taxiSvc.setSort(sort);
  }

}

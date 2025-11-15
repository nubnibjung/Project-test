import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaxiService } from '../../service/taxi.service';
import { NgFor, NgIf, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Taxi, TaxiBooking } from '../../model/taxi-booking';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css',
})
export class TaxiComponent implements OnInit {
  private readonly taxiSvc = inject(TaxiService);
  showBookingPanel = false;
  selectedCountry = 'Thailand';
  selectedTaxi: Taxi | null = null;

  readonly taxis = this.taxiSvc.filteredTaxis;
  readonly isLoading = this.taxiSvc.isLoading;
  readonly error = this.taxiSvc.error;
  readonly filter = this.taxiSvc.filter;
  readonly selectedSort = this.taxiSvc.selectedSort;
  readonly bookings = this.taxiSvc.bookings;

  // ===== HEADER STATE =====
  fromCity = 'Bangkok'; // fix route: Bangkok -> [Chiang Mai / Phuket / Khon Kaen]
  toCity = '';
  pickupDate = '';
  pickupTime = '';

  // ===== PAGINATION =====
  readonly pageSize = 5;
  readonly currentPage = signal(1);

  readonly pagedTaxis = computed(() => {
    const all = this.taxis(); // หลัง filter + search แล้ว
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.taxis().length / this.pageSize))
  );

  readonly totalText = computed(() => `Total ${this.taxis().length} result`);

  ngOnInit(): void {
    this.taxiSvc.loadTaxis(); // เริ่มต้น: แสดงทั้งหมด (tripSearch = null)
  }

  // ========= helper =========
  private resetPage() {
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    const p = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(p);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }
  onViewDetails(taxi: Taxi) {
    this.selectedTaxi = taxi;
  }

  closeDetails() {
    this.selectedTaxi = null;
  }
  // ========= dropdown route =========
  onCountryChange(country: string) {
    this.selectedCountry = country;
    this.pickupDate = '';
    this.pickupTime = '';
    this.resetPage();
  }

  onFromChange(from: string) {
    this.fromCity = from;
    this.pickupDate = '';
    this.pickupTime = '';
    this.resetPage();
  }

  onToChange(to: string) {
    this.toCity = to;
    this.pickupDate = '';
    this.pickupTime = '';
    this.resetPage();
  }
  openBookingPanel() {
    this.showBookingPanel = true;
  }

  closeBookingPanel() {
    this.showBookingPanel = false;
  }

  // helper เรียกใช้จาก template
  canCancel(b: TaxiBooking): boolean {
    return this.taxiSvc.canCancelBooking(b);
  }

  onCancelBooking(b: TaxiBooking) {
    const res = this.taxiSvc.cancelBooking(b.id);

    if (!res.ok) {
      Swal.fire({
        title: 'Cannot cancel',
        text: res.reason ?? 'Booking cannot be cancelled.',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Cancelled',
      text: `Booking #${b.id} has been cancelled.`,
      icon: 'success',
    });
  }
  get availableDates(): string[] {
    const taxis: Taxi[] = this.taxiSvc.allTaxis();
    const country = this.selectedCountry;
    const from = this.fromCity.trim().toLowerCase();
    const to = this.toCity.trim().toLowerCase();

    const filtered = taxis.filter(
      (t) =>
        (!country || t.country === country) &&
        (!from || t.from.toLowerCase() === from) &&
        (!to || t.to.toLowerCase() === to)
    );

    const unique = Array.from(new Set(filtered.map((t) => t.departureDate)));
    return unique.sort();
  }

  get availableTimes(): string[] {
    const taxis: Taxi[] = this.taxiSvc.allTaxis();
    const country = this.selectedCountry;
    const from = this.fromCity.trim().toLowerCase();
    const to = this.toCity.trim().toLowerCase();
    const date = this.pickupDate;

    const filtered = taxis.filter(
      (t) =>
        (!country || t.country === country) &&
        (!from || t.from.toLowerCase() === from) &&
        (!to || t.to.toLowerCase() === to) &&
        (!date || t.departureDate === date)
    );

    const unique = Array.from(new Set(filtered.map((t) => t.departureTime)));
    return unique.sort();
  }


  onSearchTrip() {
    if (
      !this.selectedCountry ||
      !this.fromCity ||
      !this.toCity ||
      !this.pickupDate ||
      !this.pickupTime
    ) {
      Swal.fire({
        title: 'Missing information',
        text: 'Please select country, from, destination, date and time.',
        icon: 'warning',
      });
      return;
    }

    this.taxiSvc.setTripSearch({
      date: this.pickupDate,
      time: this.pickupTime,
      from: this.fromCity,
      to: this.toCity,
      country: this.selectedCountry,
    });

    this.resetPage();

    Swal.fire({
      title: 'Trips filtered',
      text: `Showing taxis from Bangkok to ${this.toCity} on ${this.pickupDate} at ${this.pickupTime}.`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
    });
  }


  onChangeSeat(seat: any) {
    const value =
      seat === null || seat === '' || seat === undefined
        ? undefined
        : Number(seat);
    this.taxiSvc.updateFilter({ seat: value });
    this.resetPage();
  }

  onChangeCategory(category: string) {
    this.taxiSvc.updateFilter({ category: category as any });
    this.resetPage();
  }

  toggleFilterFlag(key: 'ac' | 'newCar' | 'nonStop') {
    const current = this.filter()[key];
    this.taxiSvc.updateFilter({ [key]: !current } as any);
    this.resetPage();
  }

  onChangePriceRange(event: Event, edge: 'minPrice' | 'maxPrice') {
    const value = Number((event.target as HTMLInputElement).value);
    this.taxiSvc.updateFilter({ [edge]: value });
    this.resetPage();
  }

  setSort(sort: 'cheapest' | 'best' | 'quickest') {
    this.taxiSvc.setSort(sort);
    this.resetPage();
  }

  async onBookNow(taxi: any) {
    const result = await Swal.fire({
      title: 'Confirm booking',
      html: `
        <div style="text-align:left;font-size:14px;">
          <p>You are going to book:</p>
          <p><b>${taxi.name}</b></p>
          <p>From <b>${this.fromCity}</b> to <b>${this.toCity}</b></p>
          <p>Pickup: <b>${this.pickupDate}</b> at <b>${this.pickupTime}</b></p>
          <p>Price: <b>$${taxi.price}</b></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Book now',
      cancelButtonText: 'Cancel',
      icon: 'question',
    });

    if (result.isConfirmed) {
      const booking = this.taxiSvc.createBooking(taxi, {
        pickupDate: this.pickupDate,
        pickupTime: this.pickupTime,
        from: this.fromCity,
        to: this.toCity,
      });

      await Swal.fire({
        title: 'Booking success',
        text: `Your booking #${booking.id} has been saved.`,
        icon: 'success',
      });
    }
  }

  onOpenBookingHistory() {
    this.showBookingPanel = true;
  }

  onCloseBookingPanel() {
    this.showBookingPanel = false;
  }
}

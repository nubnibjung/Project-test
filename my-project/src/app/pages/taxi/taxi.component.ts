import { Component, computed, inject, OnInit } from '@angular/core';
import { TaxiService } from '../../service/taxi.service';
import { NgFor, NgIf, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Taxi } from '../../model/taxi-booking';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent implements OnInit {
  private readonly taxiSvc = inject(TaxiService);
  selectedCountry = 'All';

  readonly taxis = this.taxiSvc.filteredTaxis;
  readonly isLoading = this.taxiSvc.isLoading;
  readonly error = this.taxiSvc.error;
  readonly filter = this.taxiSvc.filter;
  readonly selectedSort = this.taxiSvc.selectedSort;
  readonly bookings = this.taxiSvc.bookings;

  // header state
  tripType = 'Outstation One-way';
  fromCity = '';
  toCity = 'Goa';
  pickupDate = '2020-10-16';
  pickupTime = 'D';

get availableTimes(): string[] {
  const taxis = this.taxiSvc.allTaxis();
  const country = this.selectedCountry;
  const to = this.toCity.trim().toLowerCase();
  const date = this.pickupDate;

  const filtered = taxis.filter(t =>
    (country === 'All' || t.country === country) &&
    (!to || t.to.toLowerCase() === to) &&
    (!date || t.departureDate === date)
  );

  const unique = Array.from(new Set(filtered.map(t => t.departureTime)));
  return unique.sort();
}

  readonly totalText = computed(
    () => `Total ${this.taxis().length} result`
  );

  ngOnInit(): void {
    this.taxiSvc.loadTaxis();
  }

onSearchTrip() {
  if (!this.pickupDate || !this.toCity) {
    Swal.fire({
      title: 'Missing information',
      text: 'Please select date and destination city first.',
      icon: 'warning',
    });
    return;
  }

  if (!this.pickupTime) {
    Swal.fire({
      title: 'Missing time',
      text: 'Please select an available time from the list.',
      icon: 'warning',
    });
    return;
  }

  this.taxiSvc.setTripSearch({
    date: this.pickupDate,
    time: this.pickupTime,
    from: this.fromCity,
    to: this.toCity,
    country: this.selectedCountry || 'All',
  });

  Swal.fire({
    title: 'Trips filtered',
    text: `Showing taxis available on ${this.pickupDate} at ${this.pickupTime}.`,
    icon: 'info',
    timer: 1500,
    showConfirmButton: false,
  });
}
  onChangeSeat(seat: any) {
    const value =
      seat === null || seat === '' || seat === undefined ? undefined : Number(seat);
    this.taxiSvc.updateFilter({ seat: value });
  }

  onChangeCategory(category: string) {
    this.taxiSvc.updateFilter({ category: category as any });
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

  // --------- View Details & Book Now ใช้เหมือนเดิม ---------
  onViewDetails(taxi: any) {
    Swal.fire({
      title: taxi.name,
      html: `
        <div style="text-align:left;font-size:14px;">
          <p><b>Brand:</b> ${taxi.brand}</p>
          <p><b>Type:</b> ${taxi.type}</p>
          <p><b>Seats:</b> ${taxi.seats}</p>
          <p><b>Price:</b> $${taxi.price}</p>
          <p><b>AC:</b> ${taxi.hasAC ? 'Yes' : 'No'}</p>
          <p><b>Non stop:</b> ${taxi.nonStop ? 'Yes' : 'No'}</p>
        </div>
      `,
      imageUrl: taxi.imageUrl,
      imageWidth: 400,
      imageAlt: taxi.name,
      confirmButtonText: 'Close',
    });
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
    const list = this.bookings();
    if (!list.length) {
      Swal.fire({
        title: 'No bookings yet',
        text: 'Try booking a taxi first.',
        icon: 'info',
      });
      return;
    }

    const html = list
      .map(
        (b) => `
        <div style="margin-bottom:8px;border-bottom:1px solid #eee;padding-bottom:6px;">
          <div><b>#${b.id}</b> - ${b.taxiName}</div>
          <div style="font-size:12px;">
            ${b.from} → ${b.to} | ${b.pickupDate} ${b.pickupTime} | $${b.price}
          </div>
        </div>
      `
      )
      .join('');

    Swal.fire({
      title: 'My bookings',
      html,
      width: 500,
      confirmButtonText: 'Close',
    });
  }
}
import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { Country } from '../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.html',
})
export class CountryPage {

  fb = inject(FormBuilder);
  countryService = inject(CountryService)

  regions = signal(this.countryService.regions)
  countrybyRegion = signal<Country[]>([]);
  countryBorder = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  onFormChanged = effect((onCleanUp) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    onCleanUp(() => {
      regionSubscription.unsubscribe()
      countrySubscription.unsubscribe()
    });
  });

  onRegionChanged() {
    return this.myForm
    .get('region')!
    .valueChanges.pipe(
      tap(() => this.myForm.get('country')!.setValue('')),
      tap(() => this.myForm.get('border')!.setValue('')),
      tap(() => {
        this.countryBorder.set([]);
        this.countrybyRegion.set([]);
      }),
      switchMap( region => this.countryService.getCountriesByRegion(region!))
    )
    .subscribe((countries) => {
      this.countrybyRegion.set(countries);

    });
  }

  onCountryChanged() {
    return this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('')),
      filter(country => country!.length > 0),
      switchMap(code => this.countryService.getCountryByCode(code ?? '')),
      switchMap(country => this.countryService.getCountryByBorders(country.borders)),
    )

    .subscribe((borders) => {
      this.countryBorder.set(borders)
    })
  }


 }

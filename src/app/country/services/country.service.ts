import { combineLatest, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {

  private baseUrl = 'https://restcountries.com/v3.1';
  private http = inject(HttpClient);

  private _regions = [
    'Africa',
    'America',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);

    console.log({region});
    const url = `${this.baseUrl}/region/${ region }?fields=cca3,name,borders`
    return this.http.get<Country[]>(url);

  }

  getCountryByCode(code: string): Observable<Country> {

    const url = `${this.baseUrl}/alpha/${code}/?fields=cca3,name,borders`
    return this.http.get<Country>(url);


  }

  getCountryByBorders(countryCodes: string[]): Observable<Country[]> {

    if (!countryCodes || countryCodes.length === 0) return of([]);

    const countriesRequest: Observable<Country>[] = [];

    countryCodes.forEach((code) => {
      const request = this.getCountryByCode(code);
      countriesRequest.push(request);
    });

    return combineLatest(countriesRequest);

  }

}

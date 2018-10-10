import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, ValidationErrors, FormControl } from '@angular/forms';
import { Address } from '../../domain';
import { Subject, Observable, Subscription, combineLatest, from, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getProvinces, getCitiesByProvince, getAreaByCity } from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }
  ]
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  }
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  sub: Subscription;

  private propagateChange = (_: any) => {}
  constructor() { }

  ngOnInit() {
    // 使用startWith目的，是为了第一次就触发combineLatest
    const province$ = this._province.asObservable().pipe(startWith(''));
    const city$ = this._city.asObservable().pipe(startWith(''));
    const district$ = this._district.asObservable().pipe(startWith(''));
    const street$ = this._street.asObservable().pipe(startWith(''));
    const val$ = combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    })
    this.sub = val$.subscribe(d => this.propagateChange(d));
    this.provinces$ = of(getProvinces());
    this.cities$ = province$.pipe(
      map((p: string) => getCitiesByProvince(p))
    );
    this.districts$ = combineLatest([province$, city$], (p: string, c: string) => getAreaByCity(p, c))
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {

  }

  validate(c: FormControl): ValidationErrors | null {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }
  
  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }

}

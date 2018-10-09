import { Component, OnInit, forwardRef, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { map, filter, startWith, distinctUntilChanged, debounceTime, tap } from 'rxjs/operators';
import { combineLatest, merge, Subscription } from 'rxjs';
import {
  format, parse, isBefore, subDays,
  differenceInDays, subMonths, differenceInMonths,
  differenceInYears, subYears
} from 'date-fns';
import { isValidDate } from '../../utils/date.util';

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}
export interface Age {
  age: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    }
  ]
})
export class AgeInputComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() daysTop = 90; // 天数的上限，没超过的话就显示天数
  @Input() daysBottom = 1; // 天数的下限，没超过则invalid
  @Input() monthTop = 24;
  @Input() monthBottom = 1;
  @Input() yearTop = 150;
  @Input() yearBottom = 1;
  @Input() format = 'YYYY-MM-DD';
  @Input() debounceTime = 300;

  // selectedUnit = AgeUnit.Year; // 是不是多余的？ 是多余的，已经有patchValue了
  ageUnits = [
    {
      value: AgeUnit.Year, label: '岁'
    },
    {
      value: AgeUnit.Month, label: '月'
    },
    {
      value: AgeUnit.Day, label: '天'
    }
  ];
  form: FormGroup;
  sub: Subscription;

  private propagateChange = (_: any) => { };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, {
          validator: this.validateAge('ageNum', 'ageUnit')
        })
    });

    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges.pipe(
      tap(_ => console.log('birthday$-changed')),
      map(d => {
        return {
          date: d,
          from: 'birthday'
        }
      }),
      filter(_ => birthday.valid));

    const ageNum$ = ageNum.valueChanges.pipe(
      startWith(ageNum.value),
      tap(d => {
        console.log('ageNum$-valueChange');
      }),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );

    const ageUnit$ = ageUnit.valueChanges.pipe(
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      tap(d => {
        console.log('ageUnit$-valueChange');
      }),
      distinctUntilChanged()
    );

    const age$ = combineLatest(ageNum$, ageUnit$, (_n, _u) => {
      return this.toDate({
        age: _n,
        unit: _u
      })
    }).pipe(
      map(d => {
        return {
          date: d,
          from: 'age'
        }
      }),
      filter(_ => this.form.get('age').valid)
    );

    const merge$ = merge(birthday$, age$).pipe(
      filter(_ => this.form.valid)
    );
    this.sub = merge$.subscribe(d => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
          // patchValue是为ageNum赋值，emitEvent:不触发valuechanges和statusChanges
          ageNum.patchValue(age.age, { emitEvent: false });
        }
        if (age.unit !== ageUnit.value) {
          // this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, { emitEvent: false });
        }
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          this.form.get('birthday').patchValue(d.date, { emitEvent: false });
        }
      }
      this.propagateChange(d.date);
    });
  }

  writeValue(val: any) {
    if (val) {
      console.log('writeValue:', val);
      const date = format(val, this.format);
      this.form.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.form.get('age').get('ageNum').patchValue(age.age);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private toAge(dateStr: string) {
    const date = parse(dateStr);
    const now = Date.now();
    // 减去daysTop比date早则显示天数
    return isBefore(subDays(now, this.daysTop), date) ?
      {
        age: differenceInDays(now, date), unit: AgeUnit.Day
      } :
      isBefore(subMonths(now, this.monthTop), date) ?
        {
          age: differenceInMonths(now, date), unit: AgeUnit.Month
        } :
        {
          age: differenceInYears(now, date), unit: AgeUnit.Year
        }
  }

  private toDate(age: Age): string | null {
    const date = Date.now();
    switch (age.unit) {
      case AgeUnit.Year:
        return format(subYears(date, age.age), this.format);
      case AgeUnit.Month:
        return format(subMonths(date, age.age), this.format);
      case AgeUnit.Day:
        return format(subDays(date, age.age), this.format);
    }
    return null;
  }

  // 进行验证，从form到birthday以及age
  validate(c: FormControl): { [key: string]: any } {
    const value = c.value;
    if (!value) {
      return null;
    }
    if (isValidDate(value)) {
      return null;
    }
    return {
      dateOfBirthInvalid: true
    };
  }

  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    console.log('validateDate:', val)
    console.log('isValidDate(val) :', isValidDate(val))
    return isValidDate(val) ? null : {
      birthdayInvalid: true
    }
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      console.log('validateAge:', ageNumVal, ageUnit.value)
      switch (ageUnit.value) {
        case AgeUnit.Year:
          result = ageNumVal >= this.yearBottom && ageNumVal < this.yearTop;
          break;
        case AgeUnit.Month:
          result = ageNumVal >= this.monthBottom && ageNumVal < this.monthTop;
          break;
        case AgeUnit.Day:
          result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop;
          break;
        default:
          break;
      }

      return result ? null : {
        ageInvalid: true
      }
    }
  }

}

import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormGroup, FormBuilder } from '@angular/forms';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';

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
export class AgeInputComponent implements OnInit, ControlValueAccessor {

  form: FormGroup;

  private propagateChange = (_: any) => { };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      birthday: [],
      age: this.fb.group({
        ageNum: [],
        ageUnit: []
      })
    });

    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges.pipe(map(d => {
      return {
        date: d,
        from: 'birthday'
      }
    }))
    const ageNum$ = ageNum.valueChanges;
    const ageUnit$ = ageUnit.valueChanges;
    const age$ = combineLatest(ageNum$, ageUnit$, (_n, _u) => {
      return this.toDate({
        age: _n,
        unit: _u
      })
    }).pipe(map(d => {
      return {
        date: d,
        from: 'age'
      }
    }));
    const merge$ = merge(birthday$, age$);
  }

  writeValue(val: any) {

  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {

  }

  validate() {

  }

  private toDate(param: {
    age: any,
    unit: any
  }) {

  }

}

import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, ValidationErrors, FormControl } from '@angular/forms';

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

  private propagateChange = (_: any) => {}
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {

  }

  validate(c: FormControl): ValidationErrors | null {
    if (!c.value) {
      return null;
    }
    return {
      areaListInvalid: true
    };
  }
  

}

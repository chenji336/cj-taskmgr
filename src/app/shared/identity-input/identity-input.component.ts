import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, Subscription } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, FormBuilder } from '@angular/forms';
import { Identity, IdentityType } from '../../domain';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  identityTypes = [
    { value: IdentityType.IdCard, label: '身份证' },
    { value: IdentityType.Insurance, label: '医保' },
    { value: IdentityType.Passport, label: '护照' },
    { value: IdentityType.Military, label: '军官证' },
    { value: IdentityType.Other, label: '其他' },
  ];
  identity: Identity = { identityType: null, identityNo: null };
  identityLabelType: string;

  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private propagateChange = (_: any) => { };
  private sub: Subscription;

  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  constructor(
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    const val$ = combineLatest(this.idNo, this.idType, (_no, _type) => {
      return {
        identityType: _type,
        identityNo: _no,
      };
    });
    this.sub = val$.subscribe(id => this.propagateChange(id));
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  validate(c: FormControl): ValidationErrors {
    const val = c.value;
    if (!val) {
      return null;
    }
    switch (val.identityType) {
      case IdentityType.IdCard:
        return this.validateIdCard(c);
      case IdentityType.Passport:
        return this.validatePassport(c);
      case IdentityType.Military:
        return this.validateMilitary(c);
      case IdentityType.Insurance:
        return null;
      default:
        return null;
    }
  }

  onIdTypeChange(idType: IdentityType) {
    this.identityTypes.forEach(d => {
      if (idType === d.value) {
        this.identityLabelType = d.label;
      }
    });
    this._idType.next(idType);
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get idNo(): Observable<string> {
    return this._idNo.asObservable();
  }

  private validateIdCard(c: FormControl): ValidationErrors {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return { idInvalid: true };
    }
    const patter = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return patter.test(val) ? null : { idNotValid: true };
  }

  private validatePassport(c: FormControl): ValidationErrors {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return { idInvalid: true };
    }
    const patter = /^[GgEe]\d{8}$/;
    return patter.test(val) ? null : { idNotValid: true };
  }

  private validateMilitary(c: FormControl): ValidationErrors {
    const val = c.value.identityNo;
    const patter = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return patter.test(val) ? null : { idNotValid: true };
  }
}
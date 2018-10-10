import { ValidatorFn, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, AbstractControl, FormControl } from "@angular/forms";
import { Directive } from "@angular/core";

// 使用identityDirective只是为了验证 模板表单的 mat-errors
export const validateIdCard: ValidatorFn = (c: FormControl): ValidationErrors => {
    if (!c.value) {
        return null;
    }
    const val = c.value;
    if (val.length !== 18) {
      return { idInvalid: true };
    }
    const patter = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return patter.test(val) ? null : { idNotValid: true };
  }

@Directive({
    selector: '[appIdentifyIdCard]',
    providers:[{
        provide: NG_VALIDATORS, useExisting: IdentityDirective, multi: true
    }]
})
export class IdentityDirective implements Validator {
    validate(control: FormControl): ValidationErrors {
        return validateIdCard(control);
    }
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['111wang@163.com', Validators.compose([
        Validators.required, Validators.email, this.validate
      ])],
      password: ['', Validators.required]
    });
  }

  validate(c: FormControl): {[key: string]: any} | null {
    if (!c.value) {
      return null;
    }
    const pattern = /^wang+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNoValid: 'The email must start with wang'
    };
  }

  onSubmit({value, valid}, ev: Event): void {
    console.log('value:', JSON.stringify(value)); // {"email":"111wang@163.com","password":"fsdfds"}
    console.log('valid:', JSON.stringify(valid)); // valid: false
    // setValidators会覆盖email的所有Validators，所以required和email都会消失
    this.form.controls['email'].setValidators(this.validate);
  }

}

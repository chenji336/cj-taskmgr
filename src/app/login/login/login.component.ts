import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Quote } from '../../domain/quote.model';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote: Quote =  {
    cn: '慧妍',
    en: 'Aliquam erat volutpat.',
    pic: '/assets/img/quotes/1.jpg'
  };
  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      // 不要Validators.compose，直接用数组也是ok的
      email: ['wang@163.com', Validators.compose([
        Validators.required, Validators.email, this.validate
      ])],
      password: ['', Validators.required]
    });

    this.quoteService.getQuote().subscribe(q => this.quote = q);
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
    ev.preventDefault();
    console.log('value:', JSON.stringify(value)); // {"email":"111wang@163.com","password":"fsdfds"}
    console.log('valid:', JSON.stringify(valid)); // valid: false
    // setValidators会覆盖email的所有Validators，所以required和email都会消失
    // 这个可以作为动态验证，比如异步返回的内容进行判断
    this.form.controls['email'].setValidators(this.validate);
  }

}

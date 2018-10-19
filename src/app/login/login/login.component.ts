import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';


import { Quote } from '../../domain/quote.model';
import { QuoteService } from '../../services/quote.service';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable<Quote>;
  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private store$: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      // 不要Validators.compose，直接用数组也是ok的
      email: ['wang@163.com', Validators.compose([
        Validators.required, Validators.email, this.validate
      ])],
      password: ['', Validators.required]
    });

    this.quote$ = this.store$.select(fromRoot.getQuote); // 1.fromRoot.getQuote => state.quote；2. .slect理解成filter+distinctUntilChanged
    this.quote$.subscribe(q => {
      console.log('quote$-q:', q);
      // q['ttt'] = 123; // 如果进行了storeFreeze，那么这里扩展属性就会报错
    })
    this.store$.dispatch(new actions.LoadAction(null));
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

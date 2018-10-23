import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { extractInfo, isValidAddr, getAddrByCode } from '../../utils/identity.util';
import { isValidDate } from '../../utils/date.util';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { RegisterAction } from '../../actions/auth.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  private readonly avatarName = 'avatars';
  form: FormGroup;
  items: string[];
  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.ceil(Math.random() * 16).toFixed(0)}`;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    this.form = this.fb.group({
      email: [],
      name: [],
      password: [],
      repeat: [],
      avatar: [img],
      dateOfBirth: ['1990-01-01'],
      address: [], 
      identity: []
    });

    // 验证通过之后，在获取地址和日期
    const id$ = this.form.get('identity').valueChanges.pipe(
      debounceTime(300),
      filter(_ => {
        return this.form.get('identity').valid;
      })
    );
    id$.subscribe(id => {
      const info = extractInfo(id.identityNo);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.get('address').patchValue(addr);
      } 
      if (isValidDate(info.dateOfBirth)) {
        this.form.get('dateOfBirth').patchValue(info.dateOfBirth);
      }
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    console.log('value:', JSON.stringify(value));
    console.log('valid:', JSON.stringify(valid));
    if (!valid) {
      return;
    }
    this.store$.dispatch(new RegisterAction(value));
  }

}

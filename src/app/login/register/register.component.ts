import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    private fb: FormBuilder
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
      dateOfBirth: ['1990-01-01']
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    console.log('value:', JSON.stringify(value));
    console.log('valid:', JSON.stringify(valid));
  }

}

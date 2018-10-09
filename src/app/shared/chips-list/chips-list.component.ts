import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { User } from '../../domain';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true
    },
  ]

})
export class ChipsListComponent implements OnInit, ControlValueAccessor {

  @Input() multiple = true;
  @Input() placehoderText = '请输入成员 email';
  @Input() label = '添加/修改成员';
  form: FormGroup;
  items: User[] = [];
  memberResults$: Observable<User[]>;

  private propagateChange = (_: any) => {
  }

  constructor(private fb: FormBuilder, private service: UserService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });
    this.memberResults$ = this.form.get('memberSearch').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(s => s.length > 1),
        switchMap(str => this.service.searchUsers(str))
      );
  }

  writeValue(obj: User[]): void {
    if (obj && this.multiple) {
      // 视频里这一句是有问题的，获取不到id为key的obj；而且一开始不会有重合项这一出
      // const userEntities = obj.reduce((e, c) => ({ ...e, c }), {}); 
      const userEntities = obj.reduce((e, c) => {
        const newValue = {};
        newValue[c.id] = c;
        return {...e, ...newValue};
      }, {});
      if (this.items) {
        // 排除重合的项
        const remaining = this.items.filter(item => !userEntities[item.id]);
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: FormControl): { [key: string]: any } {
    return this.items ? null : {
      chipListInvalid: true
    };
  }

  removeMember(member) {
    const ids = this.items.map(item => item.id);
    const i = ids.indexOf(member.id);
    if (this.multiple) {
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
    } else {
      this.items = [];
    }
    this.form.patchValue({ memberSearch: '' });
    this.propagateChange(this.items);
  }

  handleMemberSelection(member: User) {
    if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
      return;
    }
    this.items = this.multiple ? [...this.items, member] : [member];
    // console.log('member.name:', member.name);
    // memberSearch: member.name为空也是可以的，下面并不会一直保留在input 上面
    this.form.patchValue({ memberSearch: member.name });
    this.propagateChange(this.items);
  }

  displayUser(user: User): string {
    return user ? user.name : '';
  }

  get displayInput() {
    return this.multiple || this.items.length === 0;
  }
}
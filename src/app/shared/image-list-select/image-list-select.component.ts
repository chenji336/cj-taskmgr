import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS, // 响应式表单验证时候需要(对应validate方法进行验证)
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true,
    }
  ]
})
export class ImageListSelectComponent implements ControlValueAccessor {

  private propagateChange = (_: any) => {};
  @Input() title = '选择';
  @Input() cols = 6;
  @Input() rowHeight = '64px';
  @Input() items: string[] = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = '80px';

  selected: string;
  constructor() { }

  ngOnInit() {
  }

  // 对应this.form.setValue()
  writeValue(val: string) {
    this.selected = val;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {

  }

  // 对应着NG_VALIDATORS，会在使用这个控件时候默认带上，一般用于响应式表单
  validate(c: FormControl): {[key: string]: any} {
    console.log('validate');
    return this.selected ? null : {
      imageListInvalid: {
        valid: false
      }
    };
  }

  onChange(i: number) {
    this.selected = this.items[i];
    this.propagateChange(this.selected);
  }

}

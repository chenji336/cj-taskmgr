import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {

  form: FormGroup;
  coverImages = [];
  title = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewProjectComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // 接受调用者传递过来的数据，传递的数据有格式要求
    this.coverImages = this.data.thumbnails;
    if (this.data.project) {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg],
      });
      this.title = '修改项目';
    } else {
      this.form = this.fb.group({
        name: [, Validators.required],
        desc: [],
        coverImg: [this.data.img],
      });
      this.title = '创建项目';
    }
  }

  onSubmit({value, valid}, ev: Event) {
    // 对应着projectList的dialog.open().afterClose(cb)中的cb，传递数据给调用者
    ev.preventDefault();
    if (!valid) {
        return;
    }
    this.dialogRef.close(value);
  }
}

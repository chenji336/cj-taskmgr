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

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {

  title = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewProjectComponent>
  ) { }

  ngOnInit() {
    // 接受调用者传递过来的数据，传递的数据有格式要求
    this.title = this.data.title;
    console.log('received data:', JSON.stringify(this.data));
  }

  onClick() {
    // 对应着projectList的dialog.open().afterClose(cb)中的cb，传递数据给调用者
    // 关闭dialog
    this.dialogRef.close('I received your message');
  }
}

import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent implements OnInit {

  priorities = [
    {
      label: '紧急',
      value: '1',
    },
    {
      label: '重要',
      value: '2',
    },
    {
      label: '普通',
      value: '3',
    },
  ];
  title = '';
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewTaskComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      desc: [this.data.task ? this.data.task.desc : '', Validators.required],
      priority: [this.data.task ? this.data.task.priority : 3, Validators.required],
      owner: [this.data.task ? [this.data.task.owner] : [this.data.owner]],
      followers: [this.data.task ? [...this.data.task.participants] : []],
      dueDate: [this.data.task ? this.data.task.dueDate : '',],
      reminder: [this.data.task ? this.data.task.reminder : '',],
      remark: [this.data.task ? this.data.task.remark : ''],
    });
  }

  ngOnInit() {
    this.title = this.data.title;
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({
      ...value,
      ownerId: value.owner.length > 0 ? value.owner[0].id : null,
      participantIds: value.followers.map(f => f.id)
    });
  }

}

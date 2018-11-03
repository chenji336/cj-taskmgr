import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { User } from '../../domain';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteComponent implements OnInit {

  members: User[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<InviteComponent>
  ) { }

  ngOnInit() {
    console.log('this.data.members:', this.data.members);
    this.members = [...this.data.members];
  }

  onSubmit(ev: Event, {value, valid}) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(this.members); // 使用的是model绑定，所以直接使用members
  }

}

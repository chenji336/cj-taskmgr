import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects = [
    {
      'name': 'itemMame-1',
      'desc': 'this is a ent project',
      'coverImg': 'assets/img/covers/0.jpg'
    },
    {
      'name': 'Auto test',
      'desc': 'this is a ent project',
      'coverImg': 'assets/img/covers/1.jpg'
    }
  ];
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openNewProjectDialog() {
    // 配置显示出来的弹框
    const config = {
      width: '100px',
      height: '100px',
      position: {
        left: '0', 
        top: '0'
      }
    };
    const data = {
      data: { // 一定要命名为data才可以被dialog获取到
        title: '新增项目：'
      }
    }
    
    // 这里使用的就是Class而不是实例
    const dialogRef = this.dialog.open(NewProjectComponent, data);
    dialogRef.afterClosed().subscribe(result => console.log('result:', result))
  }

  launchInviteDialog() {
     // 配置显示出来的弹框
     const config = {
      width: '300px',
      height: '300px'
    };
    this.dialog.open(InviteComponent);
  }

  launchUpdateDialog() {
    this.dialog.open(NewProjectComponent, {data: {title: '编辑项目：'}});
  }

  launchConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目：',
        content: '您确定删除该项目吗？'
      }
    });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

}

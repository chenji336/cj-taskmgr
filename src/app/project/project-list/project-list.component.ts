import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ]
})
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;
  projects = [
    {
      'id': 1,
      'name': 'itemMame-1',
      'desc': 'this is a ent project',
      'coverImg': 'assets/img/covers/0.jpg'
    },
    {
      'id': 2,
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
    dialogRef.afterClosed().subscribe(result => {
      console.log('新增项目-afterClosed');
      this.projects = [
        ...this.projects,
        { id: 3, name: '一个新项目', desc: '这是一个新项目', coverImg: 'assets/img/covers/1.jpg' },
        { id: 4, name: '又一个新项目', desc: '这是又一个新项目', coverImg: 'assets/img/covers/0.jpg' }
      ]
    });
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
    this.dialog.open(NewProjectComponent, { data: { title: '编辑项目：' } });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目：',
        content: '您确定删除该项目吗？'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = this.projects.filter(p => p.id !== project.id);
    });
  }

  trackByProjectId(index: number, project: any) {
    return project.id;
  }

}

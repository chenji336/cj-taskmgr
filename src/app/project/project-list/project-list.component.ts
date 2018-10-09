import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../domain';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { take, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;
  projects: Project[] = [];
  sub: Subscription;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.sub = this.service$.get('1').subscribe(projects => {
      this.projects = projects;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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

    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`; // 随机取一个图片
    console.log(selectedImg);
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        thumbnails: this.getThumbnails(),
        img: selectedImg
      }
    });
    dialogRef.afterClosed().pipe(
      take(1), // take之后就是complete，相当于unsubscribe
      filter(n => n), // 过滤掉undefined null
      map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(v => this.service$.add(v))
    ).subscribe(project => {
      this.projects = [...this.projects, project];
      this.cd.markForCheck();
    });
  }

  launchInviteDialog() {
    // 配置显示出来的弹框
    const config = {
      width: '300px',
      height: '300px'
    };
    const dialogRef = this.dialog.open(InviteComponent, {data: {
      members: [
        {
          "password": 123456,
          "name": "李四",
          "avatar": "avatars:svg-1",
          "email": "lisixxx@independent.co.uk",
          "id": 1,
          "projectIds": [
            "1"
          ]
        },
        {
          "password": 123456,
          "name": "李明",
          "avatar": "avatars:svg-2",
          "email": "liming@reddit.com",
          "id": 2,
          "projectIds": [
            "1"
          ]
        }]
    }});
  }

  auncherUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        thumbnails: this.getThumbnails(),
        project: project
      }
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(v => this.service$.update(v))
    ).subscribe(project => {
      const index = this.projects.map(p => p.id).indexOf(project.id);
      this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index + 1)]
      this.cd.markForCheck();
    });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      switchMap(v => this.service$.del(project))
    ).subscribe(prj => {
      this.projects = this.projects.filter(p => p.id !== project.id)
      this.cd.markForCheck();
    });
  }

  trackByProjectId(index: number, project: any) {
    return project.id;
  }

  // 获取缩略图
  private getThumbnails() {
    return _.range(0, 40) // 形成0-40的数组
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  // 开始使用的是缩略图，所以要转成正常图片的链接
  private buildImgSrc(img: string): string {
    console.log(img);
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

}

import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../domain';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import { take, filter, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../reducers';
import { Store } from '@ngrx/store';
import * as actions from '../../actions/project.action';

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
  projects$: Observable<Project[]>;
  listAnim$: Observable<number>;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store$: Store<fromRoot.State>
  ) {
    this.store$.dispatch(new actions.LoadAction(null));
    // projects$根据getProjects: Project[]来获取的，
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.projects$.subscribe(projects => console.log('projects:', projects))
    this.listAnim$ = this.projects$.pipe(
      map(p => p.length)
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {

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
    ).subscribe(project => {
      this.store$.dispatch(new actions.AddAction(project));
    });
  }

  launchInviteDialog(project: Project) {
    this.store$.select(fromRoot.getProjectUsers(project.id)).pipe(
      take(1),
      map(users => this.dialog.open(InviteComponent, { data: { members: users } })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(
        take(1),
        filter(n => n)
      ))
    ).subscribe(val => this.store$.dispatch(new actions.InviteAction({
        projectId: project.id,
        members: val
      })));
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      data: {
        thumbnails: this.getThumbnails(),
        project: project
      }
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) }))
    ).subscribe(project => {
      this.store$.dispatch(new actions.UpdateAction(project));
    });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { thumbnails: this.getThumbnails(), project: project, title: '删除项目' } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
    ).subscribe(_ => {
      this.store$.dispatch(new actions.DeleteAction(project));
    });
  }

  selectProject(project: Project) {
    this.store$.dispatch(new actions.SelectAction(project));
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

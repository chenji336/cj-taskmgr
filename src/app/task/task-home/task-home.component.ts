import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from '../../anims/router.anim';
import { Observable } from 'rxjs';
import { TaskList } from '../../domain';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { pluck, take, filter, tap, map, switchMap } from 'rxjs/operators';
import * as actions from '../../actions/task-list.action';
import * as taskActions from '../../actions/task.action';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim') state;
  list$: Observable<TaskList[]>;
  projectId$: Observable<string>;
  projectId: string;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store$: Store<fromRoot.State>
  ) {
    this.projectId$ = this.route.paramMap.pipe(
      map(p => p.get('id'))
    );
    this.projectId$.subscribe(id => {
      this.projectId = id;
    });
    this.list$ = this.store$.select(fromRoot.getTasksByLists);
    this.list$.subscribe(d => console.log('task-home-d:', d));
  }

  ngOnInit() {
  }

  launchNewTaskDialog(list: TaskList) {
    // this.dialog.open(NewTaskComponent, {data: {
    //   title: '新建任务:'
    // }});
    const user$ = this.store$.select(fromRoot.getAuthState).pipe(
      map(auth => auth.user),
      take(1), // 一次之后直接complete
      map(user => this.dialog.open(NewTaskComponent, {
        data: {
          title: '新建任务',
          owner: user
        }
      })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(
        take(1),
        tap(n => console.log('launchNewTaskDialog-d:', n)),
        filter(n => n)
      ))
    );
    user$.subscribe(val => this.store$.dispatch(new taskActions.AddAction({ ...val, completed: false, taskListId: list.id, createDate: new Date() })));
  }

  launchCopyTaskDialog(list: TaskList) {
    // const dialogRef = this.dialog.open(CopyTaskComponent, {width: '250px', data: {lists: this.lists}});
    this.list$.pipe(
      take(1), // 需要添加take(1)，否则每次list$改变都会触发
      map(l => l.filter(n => n.id !== list.id)),
      map(li => this.dialog.open(CopyTaskComponent,{
        data: {lists: li}
      })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(
        take(1),
        filter(n => n)
      ))
    ).subscribe(val => this.store$.dispatch(new taskActions.MoveAllAction({
      srcListId: list.id,
      targetListId: val
    })));
  }

  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: '修改任务:', task: task } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n)
    ).subscribe(val => this.store$.dispatch(new taskActions.UpdateAction({...task, ...val})));
  }

  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除任务列表:', content: '您确认删除该列表么' } });
    dialogRef.afterClosed().pipe(
      take(1),
      tap(n => console.log('launchConfirmDialog:', n)),
      filter(n => n)
    ).subscribe(result => this.store$.dispatch(new actions.DeleteAction(list)));
  }

  launchEditListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '更改列表名称:', taskList: list } });
    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(result => this.store$.dispatch(new actions.UpdateAction({ ...result, id: list.id })));
  }

  launchNewListDialog(ev: Event) {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '新建列表:' } }); // 传入projectId
    dialogRef.afterClosed().subscribe(result => this.store$.dispatch(new actions.AddAction({ ...result, projectId: this.projectId })));
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item');
        break;
      case 'task-list':
        console.log('handling list');
        // 进行order交换，进行顺序排序(如果没有效果，看看order是否为空)
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string, list: TaskList) {
    this.store$.select(fromRoot.getAuthState).pipe(
      map(auth => auth.user),
      take(1)
    ).subscribe(user => this.store$.dispatch(new taskActions.AddAction({
      desc: desc,
      priority: 3,
      taskListId: list.id,
      ownerId: user.id,
      completed: false,
      createDate: new Date(),
      participantIds: []
    })));
  }

}

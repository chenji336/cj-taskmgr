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
import { pluck, take, filter, tap } from 'rxjs/operators';
import * as actions from '../../actions/task-list.action';

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
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store$: Store<fromRoot.State>
  ) { 
    this.projectId$ = this.route.paramMap.pipe(
      pluck('id')
    );
    this.list$ = this.store$.select(fromRoot.getTaskLists);
    this.list$.subscribe(d => console.log('task-home-d:', d));
  }

  ngOnInit() {
  }

  launchNewTaskDialog() {
    this.dialog.open(NewTaskComponent, {data: {
      title: '新建任务:'
    }});
  }

  launchCopyTaskDialog() {
    // const dialogRef = this.dialog.open(CopyTaskComponent, {width: '250px', data: {lists: this.lists}});
  }

  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {width: '250px', data: {title: '修改任务:', task: task}});
  }

  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除任务列表:', content: '您确认删除该列表么'}});
    dialogRef.afterClosed().pipe(
      take(1),
      tap(n => console.log('launchConfirmDialog:', n)),
      filter(n => n)
    ).subscribe(result => this.store$.dispatch(new actions.DeleteAction(list)));
  }

  launchEditListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '更改列表名称:', taskList: list}});
    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(result => this.store$.dispatch(new actions.UpdateAction({...result, id: list.id})));
  }

  launchNewListDialog(ev: Event) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '新建列表:'}});
    dialogRef.afterClosed().subscribe(result => this.store$.dispatch(new actions.AddAction(result)));
  }

  handleMove(srcData, list) {
    switch(srcData.tag) {
      case 'task-item':
        console.log('handling item');
        break;
      case 'task-list':
        console.log('handling list');
        // 进行order交换，进行顺序排序
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string) {
    console.log('desc:', desc);
  }

}

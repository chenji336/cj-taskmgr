import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { getDate } from 'date-fns';
import { Store } from '@ngrx/store';
import * as actions from '../../actions/project.action';
import { Project } from '../../domain';
import * as fromRoot from '../../reducers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() navClick = new EventEmitter<void>();
  today = 'day';
  projects$: Observable<Project[]>;

  constructor(
    private store$: Store<fromRoot.State>
  ) { 
    this.projects$ = this.store$.select(fromRoot.getProjects);
  }

  ngOnInit() {
    // getDay获取的是星期几而不是这个月的天数
    this.today = `day${getDate(new Date)}`;
  }

  onNavClick() {
    this.navClick.emit();
  }

  onPrjClick(prj: Project) {
    this.store$.dispatch(new actions.SelectAction(prj));
    this.navClick.emit();
  }

}

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Auth } from '../../domain/auth.model';
import { Observable } from 'rxjs';
import { getAuthState } from '../../reducers';
import * as fromRoot from '../../reducers';
import { LogOutAction } from '../../actions/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  auth$: Observable<Auth>;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<boolean>();
  constructor(
    private store$: Store<fromRoot.State>
  ) {
    this.auth$ = this.store$.select(getAuthState);
  }

  ngOnInit() {
  }

  openSidebar() {
    this.toggle.emit();
  }

  onChange(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }

  logout() {
    this.store$.dispatch(new LogOutAction(null));
  }
}

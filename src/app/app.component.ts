import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cj-taskmgr';
  darkTheme = false;
  constructor(
    private oc: OverlayContainer
  ) {

  }

  switchTheme(dark) {
    this.darkTheme = dark;
    // 给浮层容器添加主题
    this.oc.getContainerElement().classList.add(this.darkTheme ? 'myapp-dark-theme' : null);
  }
}

import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('square', [
      state('green', style({
        backgroundColor: 'green', width: '100px', height: '100px', transform: 'translateX(0)'
      })),
      state('red', style({
        backgroundColor: 'red', width: '50px', height: '50px', transform: 'translateX(0)'
      })),
      transition('green => red', animate('.2s 1s')),
      transition('red => green', animate(1000)),
    ])
  ]
})
export class AppComponent {
  title = 'cj-taskmgr';
  darkTheme = false;
  squareState = 'red';
  constructor(
    private oc: OverlayContainer
  ) {

  }

  switchTheme(dark) {
    this.darkTheme = dark;
    // 给浮层容器添加主题
    this.oc.getContainerElement().classList.add(this.darkTheme ? 'myapp-dark-theme' : null);
  }

  onClick() {
    this.squareState = this.squareState === 'red' ? 'green' : 'red';
  }
}

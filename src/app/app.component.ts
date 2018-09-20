import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('square', [
      state('green', style({
        backgroundColor: 'green', width: '100px', height: '100px', transform: 'translateY(-100%)'
      })),
      state('red', style({
        backgroundColor: 'red', width: '100px', height: '100px', transform: 'translateY(100%)'
      })),
      transition('green => red', animate('.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
      transition('red => green', animate(5000, keyframes([
        style({transform: 'translateY(100%)'}),
        style({transform: 'translateY(98%)'}),
        style({transform: 'translateY(95%)'}),
        style({transform: 'translateY(90%)'}),
        style({transform: 'translateY(80%)'}),
        style({transform: 'translateY(60%)'}),
        style({transform: 'translateY(30%)'}),
        style({transform: 'translateY(0%)'}),
        style({transform: 'translateY(-10%)'}),
        style({transform: 'translateY(-5%)'}),
        style({transform: 'translateY(-2%)'}),
        style({transform: 'translateY(0)'}),
        style({transform: 'translateY(10%)'}),
        style({transform: 'translateY(15%)'}),
        style({transform: 'translateY(-15%)'}),
        style({transform: 'translateY(-40%)'}),
        style({transform: 'translateY(-80%)'}),
        style({transform: 'translateY(-90%)'}),
        style({transform: 'translateY(-95%)'}),
      ]))),
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

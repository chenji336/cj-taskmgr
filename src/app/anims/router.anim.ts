import {trigger, state, transition, style, animate, group} from '@angular/animations';

// 64是header和footer分别的高度
const routerHeight = window.innerHeight - 64*2 + 'px';

export const slideToRight = trigger('routeAnim', [
  state('void', style({position: 'fixed', width: '100%', height: routerHeight, overflow: 'auto'})),
  state('*', style({position: 'fixed', width: '100%', height: routerHeight, overflow: 'auto'})),
  transition(':enter', [
    // style里面的内容放在state里面的style也是一样的
    style({transform: 'translateX(-100%)', opacity: 0}),
    group([
      animate('.5s ease-in-out', style({transform: 'translateX(0)'})),
      animate('.3s ease-in', style({opacity: 1})),
    ])
  ]),
  transition(':leave', [
    style({transform: 'translateX(0)', opacity: 1}),
    group([
      animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
      animate('.3s ease-in', style({opacity: 0})),
    ])
  ]),
]);

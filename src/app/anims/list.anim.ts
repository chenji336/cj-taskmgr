import {trigger, transition, style, animate, query, stagger} from '@angular/animations';

export const listAnimation = trigger('listAnim', [
  transition('* => *', [
    query(':enter', style({opacity: 0}), { optional: true}),
    query(':enter', stagger(1000, [
      animate('1s', style({opacity: 1}))
    ]), { optional: true}),
    // 离开动画没看到什么特别的效果(以后如果有相同的问题在找原因)
    // 初步找到的原因应该是animate没有起作用，如果在item中使用animate就可以
    query(':leave', style({opacity: 1}), { optional: true}),
    query(':leave', stagger(1000, [
      animate('1s', style({opacity: 0}))
    ]), { optional: true}),
  ])
]);
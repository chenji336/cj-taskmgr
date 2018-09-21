import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { cardAnim } from '../../anims/card.anim';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim,
    // 这个是自己额外加的，在list.anim中leave的时候总是出不来，很气
    // 主要是animate配合list.anim的leave使用
    trigger('fade', [
      // state注释都没问题，因为list.anim中有state可用
      // state('void', style({ opacity: 0 })),
      // state('*', style({ opacity: 1 })),
      transition(':enter',animate('3s')),
      transition(':leave',animate('3s'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent implements OnInit {

@Input() item: any;
@Output() onInvite = new EventEmitter<void>();
@Output() onEdit = new EventEmitter<void>();
@Output() onDel = new EventEmitter<void>();
@HostBinding('@card') cardState = 'out';
// @HostBinding('@fade') state;

@HostListener('mouseenter')
onMouseenter() { // 这个名字任意取
  this.cardState = 'hover';
}
@HostListener('mouseleave')
onMouseleave() {
  this.cardState = 'out';
}

constructor() { }

ngOnInit() {
}

onInviteClick() {
  this.onInvite.emit();
}

onEditClick() {
  this.onEdit.emit();
}

onDelClick() {
  this.onDel.emit();
}

}

import { Directive, Input, Renderer2, ElementRef, HostListener, Host } from '@angular/core';

import { DragDropService } from '../drag-drop.service';

@Directive({
  selector: '[appDraggable]'
})
export class DragDirective {

  private _isDraggable = false;

  get isDraggable(): boolean {
    return this._isDraggable;
  }
  @Input('appDraggable')
  set isDraggable(draggable: boolean) {
    this._isDraggable = draggable;
    this.render.setAttribute(this.el.nativeElement, 'draggable', `${draggable}`);
  }
  @Input() dragTag: string;
  @Input() dragData: string;
  @Input() draggedClass: string;

  constructor(
    private render: Renderer2,
    private el: ElementRef,
    private service: DragDropService
  ) { }

  @HostListener('dragstart', ['$event'])
  onDragStart(ev: Event) {
    // 阻止冒泡，否则会触发两次，所以下面才有this.el.nativeElement === ev.target
    ev.stopPropagation();
    console.log('dragStart');
    // ev.target不是一直等于this.el.nativeElement吗？
    // 答：防止冒泡啊
    if (this.el.nativeElement === ev.target) {
      console.log('ev.target:', ev.target);
      this.render.addClass(this.el.nativeElement, this.draggedClass);
      this.service.setDragData({
        tag: this.dragTag,
        data: this.dragData
      })
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(ev: Event) {
    console.log('onDragEnd');
    if (this.el.nativeElement === ev.target) {
      this.render.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }

}

import { Directive, ElementRef, Renderer2, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { DragDropService, DragData } from '../drag-drop.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appDroppable]'
})
export class DropDirective {

  private data$;
  @Output() dropped = new EventEmitter<DragData>();
  @Input() dropEnterClass: string;
  @Input() dropTags: string[];

  constructor(
    private el: ElementRef,
    private render: Renderer2,
    private service: DragDropService
  ) { 
    // 为啥只执行一次？
    // clearDragData会再次next，如果后续在执行就会报错
    this.data$ = this.service.getDragData()
      .pipe(take(1));
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    // dragenter执行多次，ev.target可能会是子元素
    if (this.el.nativeElement === ev.target) {
      console.log('dragenter===ev.target');
      this.data$.subscribe(dragData => {
        console.log('dragData:', dragData)
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.render.addClass(this.el.nativeElement, this.dropEnterClass);
        }
      })
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          // 不是setAttribute而是setProperty
          this.render.setProperty(ev, 'dataTransfer.effectAllowed', 'all');
          this.render.setProperty(ev, 'dataTransfer.dropEffect', 'move');
        } else {
          this.render.setProperty(ev, 'dataTransfer.effectAllowed', 'none');
          this.render.setProperty(ev, 'dataTransfer.dropEffect', 'none');
        }
      })
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.render.removeClass(this.el.nativeElement, this.dropEnterClass);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.render.removeClass(this.el.nativeElement, this.dropEnterClass);
          this.dropped.emit(dragData);
          this.service.clearDragData();
        }
      });
    }
  }

}

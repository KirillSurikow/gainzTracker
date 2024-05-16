import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPreventHover]'
})
export class PreventHoverDirective {

  @Input('appToggle') toggled: boolean = false;

  constructor(private elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    this.toggled = true;
    this.elementRef.nativeElement.style.backgroundColor = 'white';
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.toggled) {
      this.elementRef.nativeElement.style.backgroundColor = 'rgb(211, 205, 205, 0.5)';
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.toggled) {
      this.elementRef.nativeElement.style.backgroundColor = 'white';
    }
  }
}

import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';


@Directive({
  selector: '[appReformatVideoThumbnail]'
})
export class ReformatVideoThumbnailDirective implements OnInit {

  constructor(private renderer: Renderer2, private elemRef: ElementRef) { }

  ngOnInit(){
  }

}

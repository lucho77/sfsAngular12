import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

/*
  transform(value: any, args?: any): any {
    return null;
  }
*/
  constructor(protected sanitizer: DomSanitizer) {}

 public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
    case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
    case 'url': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    default: throw new Error(`Invalid safe type specified: ${type}`);
  }
  }
}

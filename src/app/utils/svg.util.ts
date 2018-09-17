import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export const loadSvgResources = (ir: MatIconRegistry, ds: DomSanitizer) => {
     // 进行svg的添加，bypassSecurityTrustResourceUrl路径默认是在src下面
     ir.addSvgIcon('answer', ds.bypassSecurityTrustResourceUrl('assets/answer.svg'));
}
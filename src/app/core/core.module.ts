import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
// 这里是因为引入的svg图表需要使用http服务
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { loadSvgResources } from '../utils/svg.util';

import { MatToolbarModule, MatIconModule, MatButtonModule, MatIconRegistry } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ]
})
// 只需要在跟模块下面引入一次，如果其他模块也引入了应该报错
export class CoreModule {
  constructor(
      @Optional() @SkipSelf() parent: CoreModule,
      ir: MatIconRegistry,
      ds: DomSanitizer
  ) {
    if (parent) {
      throw new Error('模块已存在，不能在此加载！');
    }
    loadSvgResources(ir, ds);
  }
}

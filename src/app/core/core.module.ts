import { NgModule, SkipSelf, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// 这里是因为引入的svg图表需要使用http服务
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs'; // 有些materila需要使用到hammerjs
import { RouterModule } from '@angular/router'; // routerLink使用需要routerModule（如果引入appRouting也可以，因为里面有routerMoule)

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { loadSvgResources } from '../utils/svg.util';

import { MatIconRegistry } from '@angular/material';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    HttpClientModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SharedModule,
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

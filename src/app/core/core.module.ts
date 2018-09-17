import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule
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
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('模块已存在，不能在此加载！');
    }
  }
}

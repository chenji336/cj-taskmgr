import { NgModule, ModuleWithProviders } from '@angular/core';

import { QuoteService } from './quote.service';
import { ProjectService } from './project.service';

@NgModule(
  // 使用forRoot代替（当然名字是随意更改的）
  // {
  //   imports: [
  //     CommonModule
  //   ],
  //   declarations: []
  // }
)
export class ServicesModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        QuoteService,
        ProjectService,
      ]
    };
  }
}

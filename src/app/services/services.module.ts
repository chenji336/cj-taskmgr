import { NgModule, ModuleWithProviders } from '@angular/core';

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
      providers: []
    };
  }
}

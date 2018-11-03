import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProjectListRoutingModule } from './project-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { InviteComponent } from './invite/invite.component';

@NgModule({
  imports: [
    SharedModule,
    ProjectListRoutingModule
  ],
  declarations: [ProjectListComponent, ProjectItemComponent, NewProjectComponent, InviteComponent],
  entryComponents: [ // 在ts中使用了，需要在entryComponents中引入
    NewProjectComponent,
    InviteComponent
  ]
})
export class ProjectModule { }

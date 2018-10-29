import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskHomeComponent } from './task-home/task-home.component';

const routes: Routes = [
    { path: 'tasklists/:id', component: TaskHomeComponent } // 跟app-routing.module没对应上没问题？
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule {}

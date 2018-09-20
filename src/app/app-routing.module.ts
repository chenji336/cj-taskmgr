import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // 这里没用懒加载，而是直接加载过去
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'projects', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'tasklists', redirectTo: '/tasklists', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

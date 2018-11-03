import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
    // 这里没用懒加载，而是直接加载过去
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'projects',
        loadChildren: 'src/app/project#ProjectModule',
        pathMatch: 'full',
        canActivate: [AuthGuardService]
    },
    {
        path: 'tasklists/:id',
        loadChildren: 'src/app/task#TaskModule',
        pathMatch: 'full',
        canActivate: [AuthGuardService]
    },
    {
        path: 'mycal/:view',
        loadChildren: 'src/app/my-calendar#MyCalendarModule',
        pathMatch: 'full',
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

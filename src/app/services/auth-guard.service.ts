import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Auth } from '../domain/auth.model';
import { defaultIfEmpty, map } from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private store$: Store<fromRoot.State>,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.store$.select(fromRoot.getAuthState).pipe(
            map((auth: Auth) => {
                const result = auth.token !== null && auth.token !== undefined;
                if (!result) {
                    this.router.navigate(['/login']);
                }
                return result
            }),
            defaultIfEmpty(false)
        );
    }
}

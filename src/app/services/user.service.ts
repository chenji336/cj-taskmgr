import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';

import { User } from '../domain/user.model';
import { Project } from '../domain/project.model';
import { switchMap, filter, reduce } from 'rxjs/operators';

@Injectable()
export class UserService {

    private readonly domain = 'users';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    })
    constructor(
        private http: HttpClient,
        @Inject('BASE_CONFIG') private config
    ) { }

    searchUsers(filter: string): Observable<User[]> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(uri, {
            params: {
                'email_like': filter
            }
        });
    }

    gethUsersByProject(projectId: string): Observable<User[]> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(uri, { params: { 'projectId_like': projectId } });
    }

    // 给用户添加project(应该是邀请组成员)
    addProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds;
        if (projectIds.indexOf(projectId) > 0) {
            return of(user);
        }
        return this.http.patch<User>(uri, JSON.stringify({
            projectIds: [...projectIds, projectId]
        }), {
                headers: this.headers
            }
        );
    }

    removeProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);
        if (index === -1) {
            return of(user);
        }
        const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http.patch<User>(uri, JSON.stringify({ projectIds: toUpdate }), { headers: this.headers });
    }

    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        const memebersIds = project.memebers? project.memebers : [];
        return from(memebersIds).pipe(
            switchMap(id => {
                const uri = `${this.config.uri}/${this.domain}/id`;
                return this.http.get<User>(uri);
            }),
            filter(user => user.projectIds.indexOf(projectId) === -1),
            switchMap(u => this.addProjectRef(u, projectId)),
            reduce((arr: User[], curr: User) => [...arr, curr], [])
        );
    }
}
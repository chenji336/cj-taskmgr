import { Injectable, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Project, User } from '../domain';
import { mergeMap, count, switchMap, mapTo } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class ProjectService {

  private readonly domain = 'projects';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) { }

  // get
  get(userId: string): Observable<Project[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Project[]>(
      uri,
      {
        params: {
          'members_like': userId
        }
      }
    );
  }

  // post
  add(project: Project): Observable<Project> {
    project.id = null;
    const uri =`${this.config.uri}/${this.domain}`;
    return this.http.post<Project>(
      uri,
      JSON.stringify(project),
      {
        headers: this.headers
      }
    );
  }

  // put(update)
  update(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.put<Project>(
      uri,
      JSON.stringify(toUpdate),
      {
        headers: this.headers
      }
    );
  }

  // delete
  del(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const delTasks$ = from(project.taskLists ? project.taskLists : []).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    return delTasks$.pipe(
      switchMap(_ => this.http.delete(uri)),
      mapTo(project)
    );
  }

  invite(projectId: string, users: User[]): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${projectId}`;
    return this.http.get(uri).pipe(
      switchMap((project: Project) => {
        const existingMembers = project.members;
        const inviteIds = users.map(user => user.id);
        const newIds = _.union(existingMembers, inviteIds);
        return this.http.patch<Project>(uri, JSON.stringify({members: newIds}), {headers: this.headers})
      })
    );
  }
}

import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskList } from '../domain';
import { Observable, concat } from 'rxjs';
import { mapTo, reduce } from 'rxjs/operators';

@Injectable()
export class TaskListService {

    private readonly domain = 'taskLists';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {
    }

    // POST
    add(taskList: TaskList): Observable<TaskList> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .post<TaskList>(uri, JSON.stringify(taskList), { headers: this.headers });
    }

    // PUT
    update(taskList: TaskList): Observable<TaskList> {
        const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
        const toUpdate = {
            name: taskList.name
        }
        // patch只更新一部分，如果用put，则需要写一个完整对象，没写的自动清空
        return this.http
            .patch<TaskList>(uri, JSON.stringify(toUpdate), { headers: this.headers });
    }

    // DELETE
    del(taskList: TaskList): Observable<TaskList> {
        const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
        return this.http.delete(uri).pipe(
            mapTo(taskList)
        );  
    }

    // GET
    get(projectId: string): Observable<TaskList[]> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get<TaskList[]>(uri, { params: { 'projectId': projectId } });
    }

    // 顺序的交换
    swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
        const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
        const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;
        const drag$ = this.http.patch(dragUri, JSON.stringify({ order: target.order }), { headers: this.headers });
        const drop$ = this.http.patch(dropUri, JSON.stringify({ order: src.order }), { headers: this.headers });
        return concat(drag$, drop$).pipe(
            reduce((arrs, list) => [...arrs, list], [])
        );
    }


}
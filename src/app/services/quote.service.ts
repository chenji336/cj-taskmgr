import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quote } from '../domain/quote.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { debug } from '../utils/debug.util';

@Injectable()
export class QuoteService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) { }

  getQuote(): Observable<Quote> {
    const uri = `${this.config.uri}/quotes/${Math.ceil(Math.random() * 6)}`;
    return this.http.get<Quote>(uri).pipe(
      // map(d => {
      //   console.log(d);
      //   return d as Quote; // 直接在get上添加Quote就好
      // }),
      // debug(x => x) // 自定义操作符
    );
  }
}

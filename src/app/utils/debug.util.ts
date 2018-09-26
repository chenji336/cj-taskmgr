import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export const debug = (someCallback) => {
    // 注意这里返回的是函数
    // 我对source理解：上面的Observable，如果之前的就有错误，那么终止
    return function debugImplementation(source) {
      // Observable.create详解https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-create
      return Observable.create(subscriber => {
        var subscription = source.subscribe(value => {
          // 重点：从用户提供的回调函数中捕获错误
          try {
            if (!environment.production) {
                console.log('next:', value);
            }
            subscriber.next(someCallback(value));
          } catch(err) {
            subscriber.error(err);
          }
        },
        err => {
            if (!environment.production) {
                console.error('Error:', err);
            }
            return subscriber.error(err);
        },
        () => {
            if (!environment.production) {
                console.log('complete--');
            }
            return subscriber.complete();
        });
        return subscription;
     });
    }
  }
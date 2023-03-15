import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { UseRequest } from '../utils/typings.d';
import { HttpVerbs } from '../utils/enums';

@Injectable({
  providedIn: 'root',
})
export class UseRequestService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    baseUrl: 'http://localhost:8080',
    withCredentials: true,
  };

  private handleError(result?: any) {
    return (error: any) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      console.error(error.error?.errors);

      const errorStatus = error.status;
      if (errorStatus === 463) {
        console.log('fixing');
        this.http
          .post('/api/users/refresh-token', {}, this.httpOptions)
          .subscribe();
        window.location.reload();
      }
      return of({
        errors: error.error?.errors || [],
        data: null,
        errorStatus,
      });
    };
  }

  useRequest({ url, method, body, onSuccess }: UseRequest) {
    const doRequest = (props = {}, extUrl = '') => {
      console.log('body', body);
      console.log('props', props);
      if (method === HttpVerbs.GET) {
        const res = this.http.get(url + extUrl, this.httpOptions).pipe(
          tap((_) => console.log('made request')),
          catchError(this.handleError())
        );
        return res;
      } else if (method === HttpVerbs.DELETE) {
        const res = this.http.delete(url + extUrl, this.httpOptions).pipe(
          tap((_) => console.log('made request')),
          catchError(this.handleError())
        );
        return res;
      } else if (method === HttpVerbs.PUT) {
        const res = this.http
          .put(url + extUrl, { ...body, ...props }, this.httpOptions)
          .pipe(
            tap((_) => console.log('made request')),
            catchError(this.handleError())
          );
        return res;
      } else if (method === HttpVerbs.POST) {
        const res = this.http
          .post(url + extUrl, { ...body, ...props }, this.httpOptions)
          .pipe(
            tap((_) => console.log('made request')),
            catchError(this.handleError())
          );
        return res;
      } else if (method === HttpVerbs.PATCH) {
        const res = this.http
          .patch(url + extUrl, { ...body, ...props }, this.httpOptions)
          .pipe(
            tap((_) => console.log('made request')),
            catchError(this.handleError())
          );
        return res;
      }
      console.log('don"t show');
      // @ts-ignore
      const res = this.http[method](
        url + extUrl,
        // @ts-ignore
        !body && Object.keys(props) === 0
          ? this.httpOptions
          : { ...body, ...props },
        this.httpOptions
      ).pipe(
        tap((_) => console.log('made request')),
        catchError(this.handleError())
      ) as Observable<any>;
      // if (onSuccess) {
      //   onSuccess(res.data);
      // }
      return res;
    };
    return { doRequest };
  }
}

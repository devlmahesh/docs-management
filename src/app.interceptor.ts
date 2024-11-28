import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as express from 'express';
import { map, Observable } from 'rxjs';
export interface Response<T> {
  code: number;
  message: string;
  data: T | any[];
}
@Injectable()
export class AppInterceptor<T>
  implements NestInterceptor<T, Response<T | any[]>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req: express.Request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        code: data?.code
          ? data.code
          : context.switchToHttp().getResponse().statusCode,
        message: data?.['message'] ? data['message'] : 'Success',
        data: Array.isArray(data) ? data : this.removeMessageKey(data),
      })),
    );
  }

  private removeMessageKey(data: T): T | null {
    data['code'] ? delete data?.['code'] : null;
    data['message'] ? delete data?.['message'] : null;
    console.log('--- sending response:', data);
    return Object.keys(data).length > 0 ? data : null;
  }
}

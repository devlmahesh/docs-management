import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  message: string;
  data: T | any[];
}

@Injectable()
export class AppInterceptor<T extends Record<string, any>>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const httpResponse = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        code: data?.code ?? httpResponse.statusCode,
        message: data?.message ?? 'Success',
        data: Array.isArray(data) ? data : this.cleanResponse(data),
      })),
    );
  }

  private cleanResponse(data: T): T | null {
    if (data && typeof data === 'object') {
      const { code, message, ...rest } = data as Record<string, any>;
      return Object.keys(rest).length > 0 ? (rest as T) : null;
    }
    return null;
  }
}

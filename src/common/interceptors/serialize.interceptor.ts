import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { serialize } from "../utils/serialize";

export interface ClassConstructor<T> {
  new (...args: T[]): T;
}

/**
 * Binds interceptors to the scope of the controller or method, depending on its context.
 *
 * @param {object} dto - Date transfer object
 * @returns {MethodDecorator & ClassDecorator} - Decorator
 */
export function Serialize<T>(dto: ClassConstructor<T>): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * Class implements an interface describing implementation of an interceptor
 */
@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  /**
   * Method to implement a custom interceptor. Converts plain (literal) object to class (constructor) object
   *
   * @param {ExecutionContext} _ - Details about the current request
   * @param {CallHandler} handler - A reference to the `CallHandler`, which provides access to an
   * `Observable` representing the response stream from the route handler
   * @returns {Observable} - Response stream from the route handler
   */
  public intercept(_: ExecutionContext, handler: CallHandler): Observable<T> {
    return handler.handle().pipe(map((data: T) => serialize(this.dto, data)));
  }
}

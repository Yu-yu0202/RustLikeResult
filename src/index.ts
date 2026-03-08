import type { ResultAsync, ResultPayload, Awaitable } from "./types.ts";

export type { ResultAsync, ResultPayload, Awaitable, AwaitableResult } from "./types.js";

export function Ok<T>(): Result<void, never>
export function Ok<T>( value: T ): Result<T, never>
export function Ok<T>( value?: T ): Result<T | void, never> {
  if (arguments.length === 0) {
    return Result.Ok();
  } else {
    return Result.Ok( value );
  }
}

export function Err<E = string>( error: E ): Result<never, E> {
  return Result.Err<E>(error);
}

export class Result<T, E = string> {
  // Static menbers
  public static Ok<T>(): Result<void, never>
  public static Ok<T>( value: T ): Result<T, never>
  public static Ok<T>( value?: T ): Result<T | void, never> {
    if (arguments.length === 0) {
      return new Result<void, never>({ ok: true, value: undefined });
    } else {
      return new Result<T, never>({ ok: true, value: value as T });
    }
  }
  
  public static Err<E = Error>( error: E ): Result<never, E> {
    return new Result<never, E>({ ok: false, error });
  }
  
  public static async fromAsync<T, Fn extends (...args: any[]) => Awaitable<T>>( fn: Fn, ...args: Parameters<Fn> ): ResultAsync<Awaited<T>> {
    try {
      return Result.Ok<Awaited<T>>(await fn(...args));
    } catch (e) {
      return Result.Err(e instanceof Error ? e.message : String(e));
    }
  }
  
  public static from<T, Fn extends (...args: any[]) => T>( fn: Fn, ...args: Parameters<Fn> ): Result<T> {
    try {
      return Result.Ok<T>(fn(...args));
    } catch (e) {
      return Result.Err(e instanceof Error ? e.message : String(e));
    }
  }
  
  // Instance members
  public readonly success: boolean;
  public readonly value?: T;
  public readonly error?: E;
  
  private constructor(payload: ResultPayload<T, E>) {
    this.success = payload.ok;
    if ( payload.ok ) {
      this.value = payload.value;
    } else {
      this.error = payload.error;
    }
  }
  
  public unwrap(): T {
    if ( this.success ) {
      return this.value as T;
    }
    throw this.error;
  }
  
  public unwrapOr( defaultValue: T ): T {
    return this.isOk() ? (this.value as T) : defaultValue;
  }
  
  public unwrapOrElse( defaultFn: () => T ): T {
    return this.isOk() ? (this.value as T) : defaultFn();
  }
  
  public ok(): T | undefined {
    return this.isOk() ? this.value : undefined;
  }
  
  public err(): E | undefined {
    return this.isOk() ? undefined : this.error;
  }
  
  public isOk(): this is Result<T,E> & { ok: true; value: T } {
    return this.success;
  }
  
  public isErr(): this is Result<T,E> & { ok: false; error: E } {
    return !this.success;
  }
  
  public match<U>(handlers: Readonly<{
    ok: (v: T) => U
    err: (e: E) => U
  }>): U {
    return this.isOk()
           ? handlers.ok(this.value as T)
           : handlers.err(this.error as E);
  }
  
  public map<U>(fn: (v: T) => U): Result<U, E> {
    return this.isOk() ? Result.Ok(fn(this.value as T)) : Result.Err(this.error as E);
  }
  
  public mapErr<F>(fn: (e: E) => F): Result<T, F> {
    return this.isErr() ? Result.Err(fn(this.error as E)) : Result.Ok(this.value as T);
  }
  
  public andThen<U>(fn: (v: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? fn(this.value as T) : Result.Err(this.error as E);
  }
}
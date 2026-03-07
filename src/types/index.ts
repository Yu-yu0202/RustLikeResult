import type { Result } from "../index";

export type Awaitable<T> = T | Promise<T>;

export type ResultPayload<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ResultAsync<T, E = Error> = Promise<Result<T, E>>;

export type AwaitableResult<T, E = Error> = Awaitable<Result<T, E>>;


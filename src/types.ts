import type { Result } from './index.js';

export type Awaitable<T> = T | Promise<T>;

export type ResultPayload<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ResultAsync<T, E = string> = Promise<Result<T, E>>;

export type AwaitableResult<T, E = string> = Awaitable<Result<T, E>>;
# RustLikeResult

Rust-like `Result<T, E>` for TypeScript, with sync/async helpers.

## Install

```bash
npm install rustlikeresult
```

## Quick start

```ts
import { Ok, Err, Result } from "rustlikeresult";

const success = Ok(123);
const failure = Err(new Error("boom"));

const fromSync = Result.from(() => JSON.parse('{"ok":true}'));
const fromAsync = await Result.fromAsync(async () => {
  return 42;
});

const value = success.unwrapOr(0);

const text = failure.match({
  ok: (v) => `value=${v}`,
  err: (e) => `error=${e.message}`,
});
```

## API

- `Ok(value?)`: create a success result.
- `Err(error)`: create a failure result.
- `Result.from(fn)`: wrap a sync function and catch thrown errors.
- `Result.fromAsync(fn)`: wrap an async function and catch rejected/thrown errors.
- `result.unwrap()`: get value or throw stored error.
- `result.unwrapOr(defaultValue)`: get value or fallback.
- `result.isOk()` / `result.isErr()`: type guards.
- `result.match({ ok, err })`: pattern-match style branching.

## Development

```bash
npm run typecheck
npm run build
```

## License

MIT


# `lazyBarrel`: false `MISSING_EXPORT` for an unused named re-export from an `export *` barrel

```sh
pnpm install
pnpm repro
```

```
lazyBarrel: false -> ok
lazyBarrel: true -> Build failed with 1 error:

[MISSING_EXPORT] "Foo" is not exported by "packages/barrel/index.js".
   ╭─[ packages/lib/mod.js:4:10 ]
   │
 4 │ export { Foo as LibFoo } from "barrel";
   │          ─┬─
   │           ╰─── Missing export
───╯
```

Reproduces on rolldown 1.2.13 and 1.2.15.

## Setup

```js
// entry.js
import { value } from "lib/mod.js";
console.log(value);

// lib/mod.js        (package "lib", "sideEffects": false)
export const value = 1;
export { Foo as LibFoo } from "barrel"; // unused by the entry

// barrel/index.js   (package "barrel", "sideEffects": false)
export * from "./foo.js";

// barrel/foo.js
export class Foo {}
```

`Foo` is exported by `barrel` through `export *`, so the re-export is valid. With `experimental.lazyBarrel: true`, rolldown reports it missing.

## What triggers it

All of these must hold:

- The importing module (`lib/mod.js`) is in a `"sideEffects": false` package and is imported for one of its own local exports.
- It has a named re-export (`export { Foo } from "barrel"`) whose target only provides the name through `export *`.
- Nothing in the bundle uses the re-exported name.

Any of these makes the build pass:

- `lazyBarrel: false`
- `"sideEffects": true` in `lib`'s `package.json`
- `lib/mod.js` uses `import { Foo } from "barrel"` instead of re-exporting it
- the re-export points at the defining module (`export { Foo } from "barrel/foo.js"`)
- the entry imports `LibFoo`
- `lib/mod.js` is a pure barrel imported through its package entry

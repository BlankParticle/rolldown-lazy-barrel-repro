export const value = 1;

// Unused by the entry. `barrel` only provides `Foo` through `export *`.
export { Foo as LibFoo } from "barrel";

import { rolldown } from "rolldown";

for (const lazyBarrel of [false, true]) {
  try {
    const bundle = await rolldown({ input: "./entry.js", experimental: { lazyBarrel } });
    await bundle.generate({ format: "esm" });
    console.log(`lazyBarrel=${lazyBarrel} -> ok`);
  } catch (error) {
    console.log(`lazyBarrel=${lazyBarrel} -> ${error.message}`);
  }
}

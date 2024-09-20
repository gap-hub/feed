import type { RollupOptions } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const pluginEsbuild = esbuild({
  target: "es2020",
});
const pluginDts = dts();

const input = "./src/index.ts";
const outDir = "./lib";

export default [
  {
    input,
    output: [
      {
        file: `${outDir}/index.mjs`,
        format: "es",
      },
      {
        file: `${outDir}/index.cjs`,
        format: "cjs",
      },
    ],
    plugins: [pluginEsbuild],
  },
  {
    input,
    output: [
      { file: `${outDir}/index.d.cts` },
      { file: `${outDir}/index.d.mts` },
      { file: `${outDir}/index.d.ts` },
    ],
    plugins: [pluginDts],
  },
] as RollupOptions[];

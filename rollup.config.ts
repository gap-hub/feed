import terser from "@rollup/plugin-terser";
import type { RollupOptions } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const pluginEsbuild = esbuild({
  target: "es2020",
});
const pluginDts = dts();
const pluginTerser = terser({
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
  mangle: true,
  format: {
    comments: false,
  },
});

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
    plugins: [pluginEsbuild, pluginTerser],
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

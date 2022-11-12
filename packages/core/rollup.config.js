const { babel } = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const { defineConfig } = require("rollup");
const { terser } = require("rollup-plugin-terser");
const typescript = require("rollup-plugin-typescript2");
const builtins = require("rollup-plugin-node-builtins");
const commonjs = require("@rollup/plugin-commonjs");
const pkg = require("./package.json");

const extensions = [".ts", ".js"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };
const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
].map((name) => RegExp(`^${name}($|/)`));

/** @type {import('rollup').RollupOptions} */
const commonJSOptions = {
  input: "src/index.ts",
  output: {
    file: "build/lib/rx-controller.core.common.js",
    format: "cjs",
    indent: false,
  },
  external,
  plugins: [
    resolve({ extensions, preferBuiltins: true }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      extensions,
      plugins: [
        ["@babel/plugin-transform-runtime", { version: babelRuntimeVersion }],
      ],
      babelHelpers: "runtime",
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
const esOptions = {
  input: "src/index.ts",
  output: {
    file: "build/lib/rx-controller.core.es.js",
    format: "es",
    indent: false,
  },
  external,
  plugins: [
    resolve({
      extensions,
      preferBuiltins: true,
    }),
    typescript({ tsconfigOverride: noDeclarationFiles }),
    babel({
      extensions,
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          { version: babelRuntimeVersion, useESModules: true },
        ],
      ],
      babelHelpers: "runtime",
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
const esBrowserOptions = {
  input: "src/index.ts",
  output: {
    file: "build/lib/rx-controller.core.es.mjs",
    format: "es",
    indent: false,
  },
  plugins: [
    resolve({
      extensions,
      browser: true,
      preferBuiltins: true,
    }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: "auto",
    }),
    typescript({ tsconfigOverride: noDeclarationFiles }),
    babel({
      extensions,
      exclude: "node_modules/**",
      skipPreflightCheck: true,
      babelHelpers: "bundled",
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
const umdDevelopmentOptions = {
  input: "src/index.ts",
  output: {
    file: "build/lib/rx-controller.core.umd.js",
    format: "umd",
    name: "rxController",
    indent: false,
  },
  plugins: [
    builtins(),
    resolve({
      extensions,
      preferBuiltins: true,
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: "auto",
    }),
    typescript({ tsconfigOverride: noDeclarationFiles }),
    babel({
      extensions,
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
const umdProductionOptions = {
  input: "src/index.ts",
  output: {
    file: "build/lib/rx-controller.core.umd.min.js",
    format: "umd",
    name: "rxController",
    indent: false,
  },
  plugins: [
    builtins(),
    resolve({
      extensions,
      preferBuiltins: true,
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: "auto",
    }),
    typescript({ tsconfigOverride: noDeclarationFiles }),
    babel({
      extensions,
      exclude: "node_modules/**",
      skipPreflightCheck: true,
      babelHelpers: "bundled",
    }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  ],
};

module.exports = defineConfig([
  commonJSOptions,
  esOptions,
  esBrowserOptions,
  umdDevelopmentOptions,
  umdProductionOptions,
]);

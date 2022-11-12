const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const { terser } = require("rollup-plugin-terser");
const pkg = require("./package.json");

const env = process.env.NODE_ENV;
const extensions = [".js", ".ts", ".tsx", ".json"];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "src/index.ts",
  external: Object.keys(pkg.peerDependencies || {}).concat("react-dom"),
  output: {
    format: "umd",
    name: "rxController React",
    globals: {
      react: "React",
      events: "event.EventEmitter",
      "@rx-controller/core": "rxControllerCore",
      "react-dom": "ReactDOM",
    },
  },
  plugins: [
    resolve({
      extensions,
    }),
    babel({
      include: "src/**/*",
      exclude: "**/node_modules/**",
      babelHelpers: "runtime",
      extensions,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env),
      preventAssignment: true,
    }),
    commonjs(),
  ],
};

if (env === "production") {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

module.exports = config;

const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["ie >= 11"],
        },
        exclude: ["transform-async-to-generator", "transform-regenerator"],
        modules: false,
        loose: true,
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    NODE_ENV === "test" && "@babel/plugin-transform-modules-commonjs",
  ].filter(Boolean),
};

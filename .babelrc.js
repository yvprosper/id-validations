const plugins = () => {
  const defaultPlugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
        version: "7.0.0-beta.0",
      },
    ],
    [
      "module-resolver",
      {
        cwd: "babelrc",
        alias: {
          src: "./src",
          test: "./src/test/",
          app: "./src/app",
          infra: "./src/infra/",
          data: "./src/infra/support/data/",
          base: "./src/base/",
          config: "./src/config/",
          domain: "./src/domain/",
          interfaces: "./src/interfaces/",
          scripts: "./src/scripts/",
          views: "./src/app/",
          seeds: "./src/seeds/",
          validators: "./src/interfaces/http/validators/",
          routes: "./src/interfaces/http/routes/",
          stubs: "./src/interfaces/grpc/services-protos-nodejs/services/",
        },
      },
    ],
  ];

  if (["development"].indexOf(process.env.NODE_ENV) === -1) {
    defaultPlugins.push(["transform-remove-console"]);
  }

  return defaultPlugins;
};

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "14.18.3",
        },
      },
    ],
  ],
  plugins: plugins(),
};

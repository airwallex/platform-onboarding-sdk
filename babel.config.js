module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: false }]],
    plugins: [['@babel/plugin-transform-runtime', { regenerator: true }], '@babel/plugin-proposal-class-properties'],
  };
};

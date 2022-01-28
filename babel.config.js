module.exports = function (api) {
  api.cache(true);
  const presets = [
    ['@parcel/babel-preset-env', { targets: { node: 'current' } }],
  ];
  const plugins = [];

  return { presets, plugins };
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/components': './src/components',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/types': './src/types',
            '@/constants': './constants',
          },
        },
      ],
    ],
  };
};
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
      // Optional
      // {
      //   loader: require.resolve('react-docgen-typescript-loader'),
      // },
    ],
  });
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.plugins = [
    new TsconfigPathsPlugin({
      // configFile: './tsconfig.json'
    }),
  ];
  return config;
};

const path = require("path");

const HTMLWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const ESLintPlugin = require("eslint-webpack-plugin");

const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isAnalyze = process.env.NOVE_ANALYZE === "YES";

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (!isDev) {
    config.minimizer = [
      // new OptimizeCssAssetWebpackPlugin(),
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, "css-loader"];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions(),
    },
  ];

  return loaders;
};

const plugins = () => {
  const base = [
    new ESLintPlugin(),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HTMLWebpackPlugin({
      title: "Snake Game",
      minify: {
        collapseWhitespace: !isDev,
      },
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ];

  if (!isDev && isAnalyze) base.push(new BundleAnalyzerPlugin());

  return base;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: ["@babel/polyfill", "./index.js"],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "public"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: true,
    static: {
      publicPath: "/assets/", // here's the change
    },
  },
  devtool: isDev ? "source-map" : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.{png|jpg|svg|gif}$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
};

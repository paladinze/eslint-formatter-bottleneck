# eslint-formatter-bottleneck

An Eslint formatter that only shows what matters

## Install

```sh
npm install --save-dev eslint-formatter-bottleneck
```

## Usage

```sh
% eslint --format bottleneck src
```

## Configuration

Configuration is done through environment variables. The following is supported:

- MAX_WARN_ALLOWED: display a warning when actual violations exceeds this number (default: 0)
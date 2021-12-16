# eslint-formatter-bottleneck

An Eslint formatter that only shows what matters

## Install

```sh
npm install --save-dev eslint-formatter-bottleneck
```

## Usage

```sh
eslint --format bottleneck src
```

<img width="750" alt="formatter demo" src="https://github.com/paladinze/eslint-formatter-bottleneck/blob/main/screenshots/demo.png?raw=true">


## Configuration

Configuration is done through environment variables. The following is supported:

- MAX_VIOLATIONS: display a warning when total violations exceeds this number. By default, no warning will be displayed for number of violations.
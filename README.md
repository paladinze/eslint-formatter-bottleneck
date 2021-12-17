# eslint-formatter-bottleneck

An Eslint formatter that only shows what matters

## Features
- no over-reporting: only show top errors and warnings
- identify bottlenecks: rank rule violations by their occurrences with intuitive distribution chart
- actionable summary: clearly state and highlight must-fix issues
- detailed errors：list top files with errors with clear rule name and file path 

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

## Attribution

This package is inspired by [eslint-summary-chart-formatter](https://www.npmjs.com/package/eslint-summary-chart-formatter) and [eslint-formatter-stylish
](https://www.npmjs.com/package/eslint-formatter-stylish)
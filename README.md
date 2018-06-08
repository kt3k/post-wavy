# post-wavy v1.0.2

> use ~ in require and import calls

# :cd: Install

Via npm:

    yarn add --dev post-wavy

This installs `wavy` command.

# :leaves: Usage

Set the wavy command on `postinstall` of your package.json's script:

```json
{
  "scripts": {
    ...
    "postinstall": "wavy"
  }
}
```

Then this sets up the `node_modules/~` after each `npm install` or `yarn [add]`.

# Motivation

This library is inspired by [wavy][]. [wavy][] is a tool which symlinks `node_modules/~` only when [wavy][] installed. This behavior doesn't work well with yarn because yarn removes the symlink which [wavy][] created when you install any new package and [wavy][] cannot restore it automcatically. So if you use [wavy][] with yarn, you need to hit `yarn add --dev wavy` again and again after each install of a new package.

This tool fixes the above problem by using `postinstall` hook of the user's package.json.

# License

MIT

[wavy]: https://www.npmjs.com/package/wavy

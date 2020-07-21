---
title: WordPress Website Structure
order: 80
---

## `gulp`
Gulp tasks configuration. You can customize development workflow here, but usually it's not necessary.

## `node_modules`
[Node.js](https://nodejs.org/) modules for various project tasks.

## `src`
**This is where you do front-end development**. The project source files are organized in the following subfolders:

- `assets` - static asset files (images, fonts, etc.) - everything from this folder will be copied to the `dist` folder
- `scripts` - JavaScript files, check out [JavaScript documentation](/docs/development/javascript)
- `styles` - Sass files with ITCSS structure, check out [ITCSS documentation](/docs/development/itcss)

### Moving `src` folder to the theme folder
It's possible to have the `src` folder in your theme folder, just choose this option when setting up the project. If you haven't and would like to move it manually, follow these steps:

1. Move the `src` folder to the theme folder - `wp/wp-content/themes/your-theme`
2. Change `chisel.src.base` property on line 13 in `package.json` to `wp/wp-content/themes/your-theme/src`

## `wp`
This is where WordPress is installed.

## `wp/wp-config-local.php`
WordPress `wp-config.php` file is altered to provide support for local configuration. All settings except Authentication Unique Keys and Salts, database charset and ABS_PATH can be set in `wp-config-local.php` file for purposes of local development. The file is added automatically to `.gitignore` and should not be committed and stored on the production server.

If there is `wp-config-local.php` file available in this directory then the environment is recognized as local and configuration from this file is used. If it doesn't exist then settings from `wp-config.php` are used.

## `wp/wp-content/themes/your-theme`
**This is where you do theme development**. The theme folder includes Chisel starter theme with the following structure:

- `dist` - production ready files are automatically generated here.
- `Chisel` - various classes used to extend or add new functionality to your theme. Check out [WordPress development](/docs/development/wordpress)
- `src` - if you've chosen to have the `src` folder inside your theme folder, it will appear here
- `templates` - Twig templates, check out [Twig documentation](/docs/development/twig)
- `functions.php` - Chisel starter theme files
- `index.php`
- etc.

## Configuration files
Chisel uses various configurations files. Usually, it's not necessary to touch these files, unless stated otherwise.

- `.babelrc` - Babel configuration file
- `.editorconfig` - [EditorConfig](http://editorconfig.org/) configuration file to achieve consistent coding style
- `.eslintignore` - [ESLint](http://eslint.org/) ignore file
- `.eslintrc.yml` - [ESLint](http://eslint.org/) configuration file to achieve consistent JavaScript coding style (you can update it to your preference)
- `.gitattributes` - [Git](http://git-scm.com/) configuration file to force Unix line ending in text files
- `.gitignore` - default Git ignore files and folders
- `.htmlhintrc` - [HTMLHint](https://github.com/yaniswang/HTMLHint) configuration file
- `.prettierignore` - [Prettier](https://prettier.io/) ignore file
- `.prettierrc` - [Prettier](https://prettier.io/) config file
- `.stylelintignore` - [stylelint](http://stylelint.io/) ignore file
- `.stylintrc.yml` - [stylelint](http://stylelint.io/) configuration file to achieve consistent CSS coding style (you can update it to your preference)
- `.yo-rc.json` - [Yeoman](http://yeoman.io/) generator configuration file
- `dev-vhost.conf` - automatically generated virtual host configuration (not needed if you use [wildcard virtual hosts](/docs/installation/wildcard-virtual-hosts))
- `gulpfile.js` - Gulp configuration file
- `package.json` - project metadata and dependencies
- `package-lock.json` - [npm lock file](https://docs.npmjs.com/files/package-locks), if you use npm
- `README.md` - project readme; you can use it for the project documentation
- `webpack.chisel.config.js` - [webpack](https://webpack.js.org/) configuration file
- `yarn.lock` - [Yarn lock file](https://yarnpkg.com/lang/en/docs/yarn-lock/), if you use Yarn

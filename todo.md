# TODO LIST
> Date: December 07, 2015

### `bloggity.json`

- configure `:postDate`; ex: `"url": "blog/:postDate-:title/"`

### `templates/archives.jade`

- fix pagination group section

### `.tasks/grunt-bloggity.js`

- establish defaults
- add config/check for local env vs deploy
- generate `.dist/page/index.html files`
- generate `.dist/atom.xml`
- generate `.dist/sitemap.xml`
- generate `.dist/404.html`
- generate `.dist/index.html`
- generate `.dist/post-listings` files (ie: `blog.html`)

### `.tasks/grunt-todolist.js`

- break this out into its own NPM module
- ([\s\S]+?)(?:[\r\n])/g);
- \s*|[\r\n]/g, ''));

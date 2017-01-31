# escape-html-whitelist

[![npm version](https://badge.fury.io/js/escape-html-whitelist.svg)](https://badge.fury.io/js/escape-html-whitelist)

Escapes HTML tags with user-defined whitelist support.

Inspired by [punkave/sanitize-html](https://github.com/punkave/sanitize-html),
but this library **escapes** codes instead of removing them.

## Installation

```bash
npm install escape-html-whitelist
```

## Usage

```javascript
const escapeHtml = require('escape-html-whitelist');

// ...

escapeHtml(dirty, {
    allowedTags: escapeHtml.defaultOptions.concat(['img']),
    allowedAttrs: {
        'a': ['href'],
        '*': ['style']
    }
});
```

### escapeHtml(dirty[, options])

 Argument                    | Default                      | Description
-----------------------------|------------------------------|-------------
 dirty                       |                              | A dirty HTML code that will be escaped
 [options.allowedTags]       | See [index.js](index.js#L7)  | See [Writing a Whitelist](#writing-a-whitelist)
 [options.allowedAttrs]      | See [index.js](index.js#L18) | "
 [options.allowedProtocols]  | See [index.js](index.js#L21) | "
 [options.allowNullProtocol] | `true`                       | Whether to allow relative url for the `href` value

### Writing a Whitelist

#### Allowing Tags

You can choose tags not to escape by its name.
`options.allowedTags` is an array of tag names that will *not* be escaped.

For example, following options will escape every tag except `<br>`

```javascript
{
    allowedTags: ['br']
}
```

Default options are at `escapeHtml.defaultOptions`, so you can also extend the default whitelist.

```javascript
{
    allowedTags: escapeHtml.defaultOptions.concat(['img'])
}
```

#### Allowing Tag Attributes

You can also choose attributes to leave out.
Any attribute listed on `options.allowedAttrs` will not be removed, but escaped if needed.

You can define `options.allowedAttrs` as an object whose key is tag name and value is an array of attribute names.
When the tag name is `'*'`, it will match all tags.

```javascript
{
    allowedAttrs: {
        'a': ['href'],
        '*': ['style']
    }
}
```

#### Allowing Protocols

Especially for `href` attribute, *escape-html-whitelist* checks its content.
When its content contains URL not listed on `options.allowedProtocols`, the content will be removed.
The key of the `options.allowedProtocols` object is a tag name, and the value is an array of protocol names.

For example, following options will allow any HTTP(S) link or inline-data,
but deny any other thing such as a mailto link or javascript code.

```javascript
{
    allowedProtocols: {
        '*': ['http', 'https', 'data']
    }
}
```
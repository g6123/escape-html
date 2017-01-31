const _ = require('lodash');
const url = require('url');

const htmlTagRegExp = /<\s*(\/?)\s*([a-z][a-z0-9]*)\b([^>]*)>/gi;

const defaultOptions = {
    allowedTags: [
        'br', 'hr',
        'div', 'p',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote',
        'pre', 'code',
        'ul', 'ol', 'nl', 'li',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'b', 'strong', 'i', 'em', 'strike',
        'a'
    ],
    allowedAttrs: {
        'a': ['href', 'target'],
    },
    allowedProtocols: {
        '*': ['http', 'https', 'ftp', 'mailto']
    },
    allowNullProtocol: true
};

function escapeHtml(text, options) {
    options = _.extend(defaultOptions, options);

    return text.replace(htmlTagRegExp, function(match, isClosing, tagName, tagAttrs) {
        if (options.allowedTags.indexOf(tagName) < 0) {
            return _.escape(match);
        } else {
            return escapeTag((isClosing === '/'), tagName, tagAttrs, options);
        }
    });
}

function escapeTag(isClosing, tagName, tagAttrs, options) {
    let _tagAttrs = '';

    if (!isClosing) {
        tagAttrs.split(' ').forEach(function(attr) {
            let [attrName, attrValue] = attr.trim().split('=', 2);

            if (!isAllowed(tagName, attrName, options.allowedAttrs)) {
                return;
            }

            if (attrValue) {
                attrValue = trimQuotes(attrValue);

                if (attrName === 'href') {
                    attrValue = escapeHref(tagName, attrValue, options);
                } else {
                    attrValue = _.escape(attrValue);
                }
            }

            _tagAttrs += (' ' + attrName);
            _tagAttrs += (attrValue ? ('="' + attrValue + '"') : '');
        });
    }

    return '<' + (isClosing ? '/' : '') + tagName + _tagAttrs + '>';
}

function isAllowed(tagName, value, whitelist) {
    if (whitelist[tagName] && whitelist[tagName].indexOf(value) >= 0) {
        return true;
    }

    if (whitelist['*'] && whitelist['*'].indexOf(value) >= 0) {
        return true;
    }

    return false;
}

function trimQuotes(text) {
    if ((text.startsWith('"') && text.endsWith('"')) ||
        (text.startsWith("'") && text.endsWith("'"))) {
        return text.substring(1, text.length - 1);
    } else {
        return text;
    }
}

function escapeHref(tagName, href, options) {
    console.log(tagName, href);
    const parsed = url.parse(href);

    let protocol = parsed.protocol;
    href = parsed.href;

    if (protocol === null) {
        if (!options.allowNullProtocol) {
            return '';
        }
    } else {
        protocol = protocol.substr(0, protocol.length - 1);

        if (!isAllowed(tagName, protocol, options.allowedProtocols)) {
            return '';
        }
    }

    return href;
}

module.exports = escapeHtml;
module.exports.defaultOptions = defaultOptions;
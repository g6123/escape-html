const _assign = require('lodash.assign');
const _escape = require('lodash.escape');
const url = require('url');

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

const htmlTagRegExp = /<\s*(\/?)\s*([a-z][a-z0-9]*)\b(.*)>/gi;
const htmlAttrsRegExp = /([a-z]+)(?:=(?:"(.+?)"|'(.+?)'))?\s*/gi;

function escapeHtml(text, options) {
    options = _assign(defaultOptions, options);

    return text.replace(htmlTagRegExp, function(match, isClosing, tagName, tagAttrs) {
        if (options.allowedTags.indexOf(tagName) < 0) {
            return _escape(match);
        } else {
            return escapeTag((isClosing === '/'), tagName, tagAttrs, options);
        }
    });
}

function escapeTag(isClosing, tagName, tagAttrs, options) {
    let _tagAttrs = '';

    if (!isClosing) {
        let match = null;

        while ((match = htmlAttrsRegExp.exec(tagAttrs)) !== null) {
            const attrName = match[1];
            let attrValue = (match[2] || match[3]);

            if (!isAllowed(tagName, attrName, options.allowedAttrs)) {
                continue;
            }

            if (attrValue) {
                attrValue = trimQuotes(attrValue);

                if (attrName === 'href') {
                    attrValue = escapeHref(tagName, attrValue, options);
                } else {
                    attrValue = _escape(attrValue);
                }
            }

            _tagAttrs += (' ' + attrName);
            _tagAttrs += (attrValue ? ('="' + attrValue + '"') : '');
        }
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
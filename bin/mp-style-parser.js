(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MPStyle, Parser;

Parser = require('./Parser').Parser;

MPStyle = (typeof exports !== "undefined" && exports !== null) && this || (this.MPStyle = {});

MPStyle.Parser = Parser;

window.MPStyle = MPStyle;


},{"./Parser":5}],2:[function(require,module,exports){
var Color;

Color = (function() {
  function Color() {}

  Color.hex2rgb = function(hex_color) {
    var color;
    color = parseInt(hex_color, 16);
    return [(color & 0xff0000) >> 16, (color & 0xff00) >> 8, color & 0xff];
  };

  Color.rgb12to24 = function(color) {
    return (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11;
  };

  Color.rgbToLuminance = function(rgb) {
    return 0.2126 * Math.pow(rgb[0] / 255, 2.2) + 0.7151 * Math.pow(rgb[1] / 255, 2.2) + 0.0721 * Math.pow(rgb[2] / 255, 2.2);
  };

  Color.contrastRatio = function(rgb1, rgb2) {
    return (this.rgbToLuminance(this.hex2rgb(rgb1)) + 0.05) / (this.rgbToLuminance(this.hex2rgb(rgb2)) + 0.05);
  };

  return Color;

})();

exports.Color = Color;


},{}],3:[function(require,module,exports){
var LinkToken;

LinkToken = (function() {
  function LinkToken(link) {
    this.link = link != null ? link : '';
  }

  LinkToken.prototype.toHTML = function() {
    return '<a href="' + this.link + '">';
  };

  return LinkToken;

})();

exports.LinkToken = LinkToken;


},{}],4:[function(require,module,exports){
var LinkTokenEnd;

LinkTokenEnd = (function() {
  function LinkTokenEnd() {}

  LinkTokenEnd.prototype.toHTML = function() {
    return '</a>';
  };

  return LinkTokenEnd;

})();

exports.LinkTokenEnd = LinkTokenEnd;


},{}],5:[function(require,module,exports){
var LinkToken, LinkTokenEnd, Parser, Style, Token;

Token = require('./Token').Token;

Style = require('./Style').Style;

LinkTokenEnd = require('./LinkTokenEnd').LinkTokenEnd;

LinkToken = require('./LinkToken').LinkToken;

Parser = (function() {
  function Parser(text) {
    return this.toHTML(text);
  }

  Parser.toHTML = function(text) {
    var tokens;
    return ((function() {
      var i, len, ref, results;
      ref = this.parse(text);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tokens = ref[i];
        results.push(tokens.toHTML());
      }
      return results;
    }).call(this)).join('');
  };

  Parser.parse = function(text) {
    var c, color, endLink, endText, i, index, isCode, isPrettyLink, isQuickLink, len, linkLevel, nextLinkToken, nextToken, ref, ref1, ref2, style, styleStack, tok, tokens;
    isCode = false;
    isQuickLink = false;
    isPrettyLink = false;
    style = 0;
    tokens = [];
    styleStack = [];
    nextToken = new Token;
    nextLinkToken = null;
    linkLevel = 0;
    endLink = function() {
      if (nextToken.text !== '') {
        tokens.push(nextToken);
        nextToken = new Token(style);
        tokens.push(new LinkTokenEnd);
      } else if (tokens[tokens.length - 1] === nextLinkToken) {
        tokens.pop();
      } else {
        tokens.push(new LinkTokenEnd);
      }
      nextLinkToken = null;
      isQuickLink = false;
      return isPrettyLink = false;
    };
    endText = function(force) {
      if (force == null) {
        force = false;
      }
      if (force || style !== nextToken.style) {
        if (nextToken.text !== '') {
          tokens.push(nextToken);
          return nextToken = new Token(style);
        } else {
          return nextToken.style = style;
        }
      }
    };
    ref = text.split('');
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      c = ref[index];
      if (isCode === true) {
        tok = c.toLowerCase();
        switch (tok) {
          case 'i':
            style = style ^ Style.ITALIC;
            break;
          case 'o':
            style = style ^ Style.BOLD;
            break;
          case 's':
            style = style ^ Style.SHADOWED;
            break;
          case 'w':
            style = style | Style.WIDE;
            style = style & ~Style.NARROW;
            break;
          case 'n':
            style = style | Style.NARROW;
            style = style & ~Style.WIDE;
            break;
          case 'l':
          case 'h':
          case 'p':
            if (nextLinkToken != null) {
              endLink();
            } else {
              endText(true);
              nextLinkToken = new LinkToken;
              tokens.push(nextLinkToken);
              isQuickLink = true;
              isPrettyLink = true;
              linkLevel = styleStack.length;
            }
            break;
          case 'z':
            style = (ref1 = styleStack.length === 0) != null ? ref1 : {
              0: styleStack[styleStack.length - 1]
            };
            if (nextLinkToken != null) {
              endLink(true);
            }
            break;
          case 'm':
            style = style & ~(Style.NARROW | Style.WIDE);
            break;
          case 'g':
            style = style & ((ref2 = styleStack.length === 0) != null ? ref2 : ~{
              0x1fff: stylesStack[stylesStack.length(-1)] | ~0x1fff
            });
            break;
          case '<':
            styleStack.push(style);
            break;
          case '>':
            if (styleStack.length !== 0) {
              style = styleStack.pop();
              if ((nextLinkToken != null) && linkLevel > styleStack.length) {
                endLink();
              }
            }
            break;
          case '$':
            nextToken.text += '$';
            break;
          default:
            if (/[a-f0-9]/i.test(c)) {
              color = c;
            }
        }
        endText();
        isCode = false;
      } else if (c === '$') {
        isCode = true;
        if (isQuickLink && isPrettyLink) {
          isPrettyLink = false;
        }
      } else if (color != null) {
        color += c.replace(/[^a-f0-9]/gi, '0');
        if (color.length === 3) {
          style = style & ~0xfff;
          style = style | Style.COLORED | (parseInt(color, 16) & 0xfff);
          endText();
          color = null;
        }
      } else if (isQuickLink && isPrettyLink) {
        if (c === '[') {
          isQuickLink = false;
        } else {
          isPrettyLink = false;
          nextToken.text += c;
          nextLinkToken.link += c;
        }
      } else if (isPrettyLink) {
        if (c === ']') {
          isPrettyLink = false;
        } else {
          nextLinkToken.link += c;
        }
      } else {
        nextToken.text += c;
        if (isQuickLink) {
          nextLinkToken.link += c;
        }
      }
    }
    if (nextToken.text !== '') {
      tokens.push(nextToken);
    }
    if (nextLinkToken != null) {
      tokens.push(new LinkTokenEnd);
    }
    return tokens;
  };

  return Parser;

})();

exports.Parser = Parser;


},{"./LinkToken":3,"./LinkTokenEnd":4,"./Style":6,"./Token":7}],6:[function(require,module,exports){
var Style;

Style = (function() {
  function Style() {}

  Style.COLORED = 0x1000;

  Style.ITALIC = 0x2000;

  Style.BOLD = 0x4000;

  Style.SHADOWED = 0x8000;

  Style.CAPITALIZED = 0x10000;

  Style.WIDE = 0x20000;

  Style.NARROW = 0x40000;

  return Style;

})();

exports.Style = Style;


},{}],7:[function(require,module,exports){
var Color, Style, Token;

Style = require('./Style').Style;

Color = require('./Color').Color;

Token = (function() {
  function Token(style, text) {
    this.style = style != null ? style : 0;
    this.text = text != null ? text : '';
  }

  Token.prototype.toHTML = function() {
    var color, styleStack;
    styleStack = [];
    if (this.style) {
      if (this.style & Style.COLORED) {
        color = parseInt(Color.rgb12to24(this.style & 0xfff), 10).toString(16);
        if (color.length === 1) {
          color = '00000' + color;
        } else if (color.length === 2) {
          color = '0000' + color;
        } else if (color.length === 4) {
          color = '00' + color;
        }
        styleStack.push('color: #' + color + ';');
      }
      if (this.style & Style.ITALIC) {
        styleStack.push('font-style:italic;');
      }
      if (this.style & Style.BOLD) {
        styleStack.push('font-weight:bold;');
      }
      if (this.style & Style.SHADOWED) {
        styleStack.push('text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);');
      }
      if (this.style & Style.WIDE) {
        styleStack.push('letter-spacing:.1em;font-size:105%;');
      } else if (this.style & Style.NARROW) {
        styleStack.push('letter-spacing:-.1em;font-size:95%;');
      }
      return '<span style="' + styleStack.join(' ') + '">' + this.text + '</span>';
    } else {
      return this.text;
    }
  };

  return Token;

})();

exports.Token = Token;


},{"./Color":2,"./Style":6}]},{},[1]);

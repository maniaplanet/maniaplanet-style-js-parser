(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/*
Maniaplanet-style-js-parser
Copyright (C) 2012 Baptiste Lafontaine (http://magnetik.org)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var MPStyle, Parser;

Parser = require('./Parser.coffee').Parser;

MPStyle = (typeof exports !== "undefined" && exports !== null) && this || (this.MPStyle = {});

MPStyle.Parser = Parser;

window.MPStyle = MPStyle;


},{"./Parser.coffee":5}],2:[function(require,module,exports){
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

  Color.invertLight = function(hex_color) {
    var b, g, grey, r, upper;
    r = parseInt(hex_color[0], 16) * 17;
    g = parseInt(hex_color[1], 16) * 17;
    b = parseInt(hex_color[2], 16) * 17;
    grey = (r + g + b) / 3;
    if (grey > 160) {
      upper = 255 + 74;
      r = Math.min(15, Math.floor((upper - r) / 17));
      g = Math.min(15, Math.floor((upper - g) / 17));
      b = Math.min(15, Math.floor((upper - b) / 17));
      return r.toString(16) + g.toString(16) + b.toString(16);
    }
    return hex_color;
  };

  return Color;

})();

exports.Color = Color;


},{}],3:[function(require,module,exports){
var LinkToken;

LinkToken = (function() {
  function LinkToken(manialink, link) {
    this.manialink = manialink != null ? manialink : false;
    this.link = link != null ? link : "";
  }

  LinkToken.prototype.toHTML = function() {
    if (this.manialink && !/^maniaplanet:/i.test(this.link)) {
      this.link = "maniaplanet://#manialink=" + this.link;
    }
    if (!this.manialink && !/^http:/i.test(this.link)) {
      this.link = "http://" + this.link;
    }
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
var Color, LinkToken, LinkTokenEnd, Parser, Style, Token;

Token = require('./Token.coffee').Token;

Style = require('./Style.coffee').Style;

LinkTokenEnd = require('./LinkTokenEnd.coffee').LinkTokenEnd;

LinkToken = require('./LinkToken.coffee').LinkToken;

Color = require('./Color.coffee').Color;

Parser = (function() {
  function Parser(text) {
    return this.toHTML(text);
  }

  Parser.toHTML = function(text, options) {
    var tokens;
    this.options = {
      disableLinks: options.disableLinks,
      lightBackground: options.lightBackground
    };
    return ((function() {
      var j, len, ref, results;
      ref = this.parse(text);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        tokens = ref[j];
        results.push(tokens.toHTML());
      }
      return results;
    }).call(this)).join('');
  };

  Parser.parse = function(text) {
    var addChar, c, color, endColor, endLink, endText, i, index, isCode, isPrettyLink, isQuickLink, j, k, len, linkLevel, nextLinkToken, nextToken, ref, ref1, ref2, ref3, style, styleStack, tok, tokens;
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
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
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
              nextLinkToken = new LinkToken(tok === "h");
              if (!this.options.disableLinks) {
                tokens.push(nextLinkToken);
              }
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
        endColor = false;
        addChar = false;
        if (/[a-f0-9]/i.test(c)) {
          color += c.replace(/[^a-f0-9]/gi, '0');
          endColor = color.length === 3;
        } else {
          for (i = k = 0, ref3 = 3 - color.length; 0 <= ref3 ? k < ref3 : k > ref3; i = 0 <= ref3 ? ++k : --k) {
            color += '0';
          }
          endColor = true;
          addChar = true;
        }
        if (endColor) {
          if (this.options.lightBackground) {
            color = Color.invertLight(color);
          }
          style = style & ~0xfff;
          style = style | Style.COLORED | (parseInt(color, 16) & 0xfff);
          endText();
          color = null;
          if (addChar) {
            nextToken.text += c;
          }
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
    if ((nextLinkToken != null) && !this.options.disableLinks) {
      tokens.push(new LinkTokenEnd);
    }
    return tokens;
  };

  return Parser;

})();

exports.Parser = Parser;


},{"./Color.coffee":2,"./LinkToken.coffee":3,"./LinkTokenEnd.coffee":4,"./Style.coffee":6,"./Token.coffee":7}],6:[function(require,module,exports){
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

Style = require('./Style.coffee').Style;

Color = require('./Color.coffee').Color;

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


},{"./Color.coffee":2,"./Style.coffee":6}]},{},[1]);

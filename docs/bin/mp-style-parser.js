(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
var LinkToken, LinkTokenEnd, Parser, Style, Token;

Token = require('./Token.coffee').Token;

Style = require('./Style.coffee').Style;

LinkTokenEnd = require('./LinkTokenEnd.coffee').LinkTokenEnd;

LinkToken = require('./LinkToken.coffee').LinkToken;

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
              nextLinkToken = new LinkToken((tok === "h" ? true : false));
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


},{"./LinkToken.coffee":3,"./LinkTokenEnd.coffee":4,"./Style.coffee":6,"./Token.coffee":7}],6:[function(require,module,exports){
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


},{"./Color.coffee":2,"./Style.coffee":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQnJvd3Nlck1vZHVsZS5jb2ZmZWUiLCJzcmMvQ29sb3IuY29mZmVlIiwic3JjL0xpbmtUb2tlbi5jb2ZmZWUiLCJzcmMvTGlua1Rva2VuRW5kLmNvZmZlZSIsInNyYy9QYXJzZXIuY29mZmVlIiwic3JjL1N0eWxlLmNvZmZlZSIsInNyYy9Ub2tlbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFrQkMsU0FBVSxPQUFBLENBQVEsaUJBQVIsRUFBVjs7QUFFRCxPQUFBLEdBQVUsb0RBQUEsSUFBYSxJQUFiLElBQWtCLENBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYOztBQUU1QixPQUFPLENBQUMsTUFBUixHQUFpQjs7QUFFakIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUN4QmpCLElBQUE7O0FBQU07OztFQUNKLEtBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxTQUFEO0FBQ1QsUUFBQTtJQUFBLEtBQUEsR0FBUSxRQUFBLENBQVMsU0FBVCxFQUFvQixFQUFwQjtBQUNSLFdBQU8sQ0FBQyxDQUFDLEtBQUEsR0FBUSxRQUFULENBQUEsSUFBc0IsRUFBdkIsRUFBMkIsQ0FBQyxLQUFBLEdBQVEsTUFBVCxDQUFBLElBQW9CLENBQS9DLEVBQWtELEtBQUEsR0FBUSxJQUExRDtFQUZFOztFQUlWLEtBQUMsQ0FBQSxTQUFELEdBQVksU0FBQyxLQUFEO0FBQ1YsV0FBTyxDQUFDLEtBQUEsR0FBUSxLQUFULENBQUEsR0FBa0IsTUFBbEIsR0FBMkIsQ0FBQyxLQUFBLEdBQVEsSUFBVCxDQUFBLEdBQWlCLEtBQTVDLEdBQW9ELENBQUMsS0FBQSxHQUFRLEdBQVQsQ0FBQSxHQUFnQjtFQURqRTs7RUFHWixLQUFDLENBQUEsY0FBRCxHQUFpQixTQUFDLEdBQUQ7QUFD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IihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjXG5NYW5pYXBsYW5ldC1zdHlsZS1qcy1wYXJzZXJcbkNvcHlyaWdodCAoQykgMjAxMiBCYXB0aXN0ZSBMYWZvbnRhaW5lIChodHRwOi8vbWFnbmV0aWsub3JnKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4jIyNcblxue1BhcnNlcn0gPSByZXF1aXJlICcuL1BhcnNlci5jb2ZmZWUnXG5cbk1QU3R5bGUgPSBleHBvcnRzPyBhbmQgQCBvciBATVBTdHlsZSA9IHt9XG5cbk1QU3R5bGUuUGFyc2VyID0gUGFyc2VyXG5cbndpbmRvdy5NUFN0eWxlID0gTVBTdHlsZVxuIiwiY2xhc3MgQ29sb3JcbiAgQGhleDJyZ2I6IChoZXhfY29sb3IpIC0+XG4gIFx0Y29sb3IgPSBwYXJzZUludChoZXhfY29sb3IsIDE2KVxuICBcdHJldHVybiBbKGNvbG9yICYgMHhmZjAwMDApID4+IDE2LCAoY29sb3IgJiAweGZmMDApID4+IDgsIGNvbG9yICYgMHhmZl1cblxuICBAcmdiMTJ0bzI0OiAoY29sb3IpIC0+XG4gICAgcmV0dXJuIChjb2xvciAmIDB4ZjAwKSAqIDB4MTEwMCArIChjb2xvciAmIDB4ZjApICogMHgxMTAgKyAoY29sb3IgJiAweGYpICogMHgxMVxuXG4gIEByZ2JUb0x1bWluYW5jZTogKHJnYikgLT5cbiAgXHRyZXR1cm4gMC4yMTI2ICogTWF0aC5wb3cocmdiWzBdIC8gMjU1LCAyLjIpICsgMC43MTUxICogTWF0aC5wb3cocmdiWzFdIC8gMjU1LCAyLjIpICsgMC4wNzIxICogTWF0aC5wb3cocmdiWzJdIC8gMjU1LCAyLjIpXG5cbiAgIyBNYXhpbXVtIHJldHVybmVkIGlzIDIxXG4gICMgTWluaW11bSBpcyAxXG4gICMgV0NBRyAyLjAgbGV2ZWwgQUEgIG1pbmltdW0gcmF0aW86IDQuNToxXG4gICMgV0NBRyAyLjAgbGV2ZWwgQUFBIG1pbmltdW0gcmF0aW86ICA3OjFcbiAgQGNvbnRyYXN0UmF0aW86IChyZ2IxLCByZ2IyKSAtPlxuICBcdHJldHVybiAoQHJnYlRvTHVtaW5hbmNlKEBoZXgycmdiKHJnYjEpKSArIDAuMDUpIC8gKEByZ2JUb0x1bWluYW5jZShAaGV4MnJnYihyZ2IyKSkgKyAwLjA1KVxuXG5leHBvcnRzLkNvbG9yID0gQ29sb3IiLCJjbGFzcyBMaW5rVG9rZW5cblxuICBjb25zdHJ1Y3RvcjogKEBtYW5pYWxpbmsgPSBmYWxzZSwgQGxpbmsgPSBcIlwiKSAtPlxuXG4gIHRvSFRNTDogLT5cbiAgICBpZiBAbWFuaWFsaW5rIGFuZCBub3QgL15tYW5pYXBsYW5ldDovaS50ZXN0KEBsaW5rKVxuICAgICAgQGxpbmsgPSBcIm1hbmlhcGxhbmV0Oi8vI21hbmlhbGluaz1cIiArIEBsaW5rXG4gICAgaWYgbm90IEBtYW5pYWxpbmsgYW5kIG5vdCAvXmh0dHA6L2kudGVzdChAbGluaylcbiAgICAgIEBsaW5rID0gXCJodHRwOi8vXCIgKyBAbGlua1xuICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBAbGluayArICdcIj4nXG5cdFxuZXhwb3J0cy5MaW5rVG9rZW4gPSBMaW5rVG9rZW4iLCJjbGFzcyBMaW5rVG9rZW5FbmRcbiAgY29uc3RydWN0b3I6ICgpIC0+XG5cbiAgdG9IVE1MOiAtPlxuICBcdHJldHVybiAnPC9hPidcblxuZXhwb3J0cy5MaW5rVG9rZW5FbmQgPSBMaW5rVG9rZW5FbmQiLCJ7VG9rZW59ID0gcmVxdWlyZSAnLi9Ub2tlbi5jb2ZmZWUnXG57U3R5bGV9ID0gcmVxdWlyZSAnLi9TdHlsZS5jb2ZmZWUnXG57TGlua1Rva2VuRW5kfSA9IHJlcXVpcmUgJy4vTGlua1Rva2VuRW5kLmNvZmZlZSdcbntMaW5rVG9rZW59ID0gcmVxdWlyZSAnLi9MaW5rVG9rZW4uY29mZmVlJ1xuXG5jbGFzcyBQYXJzZXJcbiAgY29uc3RydWN0b3I6ICh0ZXh0KSAtPlxuICAgIHJldHVybiBAdG9IVE1MIHRleHRcblxuICBAdG9IVE1MOiAodGV4dCkgLT5cbiAgICByZXR1cm4gKHRva2Vucy50b0hUTUwoKSBmb3IgdG9rZW5zIGluIEBwYXJzZSh0ZXh0KSkuam9pbignJylcblxuICBAcGFyc2U6ICh0ZXh0KSAtPlxuICAgIGlzQ29kZSA9IGZhbHNlXG4gICAgaXNRdWlja0xpbmsgPSBmYWxzZVxuICAgIGlzUHJldHR5TGluayA9IGZhbHNlXG5cbiAgICBzdHlsZSA9IDBcbiAgICB0b2tlbnMgPSBbXVxuICAgIHN0eWxlU3RhY2sgPSBbXVxuICAgIG5leHRUb2tlbiA9IG5ldyBUb2tlblxuICAgIG5leHRMaW5rVG9rZW4gPSBudWxsXG4gICAgbGlua0xldmVsID0gMFxuXG4gICAgZW5kTGluayA9ICgpIC0+XG4gICAgICBpZiBuZXh0VG9rZW4udGV4dCBpc250ICcnXG4gICAgICAgIHRva2Vucy5wdXNoIG5leHRUb2tlblxuICAgICAgICBuZXh0VG9rZW4gPSBuZXcgVG9rZW4gc3R5bGVcbiAgICAgICAgdG9rZW5zLnB1c2ggbmV3IExpbmtUb2tlbkVuZFxuICAgICAgZWxzZSBpZiB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdIGlzIG5leHRMaW5rVG9rZW5cbiAgICAgICAgdG9rZW5zLnBvcCgpXG4gICAgICBlbHNlXG4gICAgICAgIHRva2Vucy5wdXNoIG5ldyBMaW5rVG9rZW5FbmRcblxuICAgICAgbmV4dExpbmtUb2tlbiA9IG51bGxcbiAgICAgIGlzUXVpY2tMaW5rID0gZmFsc2VcbiAgICAgIGlzUHJldHR5TGluayA9IGZhbHNlXG5cbiAgICBlbmRUZXh0ID0gKGZvcmNlID0gZmFsc2UpIC0+XG4gICAgICBpZiBmb3JjZSBvciBzdHlsZSAhPSBuZXh0VG9rZW4uc3R5bGVcbiAgICAgICAgaWYgbmV4dFRva2VuLnRleHQgaXNudCAnJ1xuICAgICAgICAgIHRva2Vucy5wdXNoIG5leHRUb2tlblxuICAgICAgICAgIG5leHRUb2tlbiA9IG5ldyBUb2tlbihzdHlsZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5leHRUb2tlbi5zdHlsZSA9IHN0eWxlXG5cbiAgICBmb3IgYywgaW5kZXggaW4gdGV4dC5zcGxpdCAnJ1xuICAgICAgaWYgaXNDb2RlIGlzIHRydWVcbiAgICAgICAgdG9rID0gYy50b0xvd2VyQ2FzZSgpXG4gICAgICAgIHN3aXRjaCB0b2tcbiAgICAgICAgICB3aGVuICdpJ1xuICAgICAgICAgICAgc3R5bGUgPSBzdHlsZSBeIFN0eWxlLklUQUxJQ1xuICAgICAgICAgIHdoZW4gJ28nXG4gICAgICAgICAgICBzdHlsZSA9IHN0eWxlIF4gU3R5bGUuQk9MRFxuICAgICAgICAgIHdoZW4gJ3MnXG4gICAgICAgICAgICBzdHlsZSA9IHN0eWxlIF4gU3R5bGUuU0hBRE9XRURcbiAgICAgICAgICB3aGVuICd3J1xuICAgICAgICAgICAgc3R5bGUgPSBzdHlsZSB8IFN0eWxlLldJREVcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgJiB+U3R5bGUuTkFSUk9XXG4gICAgICAgICAgd2hlbiAnbidcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgfCBTdHlsZS5OQVJST1dcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgJiB+U3R5bGUuV0lERVxuICAgICAgICAgIHdoZW4gJ2wnLCAnaCcsICdwJ1xuICAgICAgICAgICAgaWYgbmV4dExpbmtUb2tlbj9cbiAgICAgICAgICAgICAgZW5kTGluaygpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGVuZFRleHQgdHJ1ZVxuICAgICAgICAgICAgICBuZXh0TGlua1Rva2VuID0gbmV3IExpbmtUb2tlbiAoaWYgdG9rIGlzIFwiaFwiIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlKVxuICAgICAgICAgICAgICB0b2tlbnMucHVzaCBuZXh0TGlua1Rva2VuXG4gICAgICAgICAgICAgIGlzUXVpY2tMaW5rID0gdHJ1ZVxuICAgICAgICAgICAgICBpc1ByZXR0eUxpbmsgPSB0cnVlXG4gICAgICAgICAgICAgIGxpbmtMZXZlbCA9IHN0eWxlU3RhY2subGVuZ3RoXG5cbiAgICAgICAgICB3aGVuICd6J1xuICAgICAgICAgICAgc3R5bGUgPSAoc3R5bGVTdGFjay5sZW5ndGggaXMgMCA/IDAgOiBzdHlsZVN0YWNrW3N0eWxlU3RhY2subGVuZ3RoIC0gMV0pXG4gICAgICAgICAgICBpZiBuZXh0TGlua1Rva2VuP1xuICAgICAgICAgICAgICBlbmRMaW5rKHRydWUpXG4gICAgICAgICAgd2hlbiAnbSdcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgJiB+KFN0eWxlLk5BUlJPVyB8IFN0eWxlLldJREUpXG4gICAgICAgICAgd2hlbiAnZydcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgJiAoc3R5bGVTdGFjay5sZW5ndGggPT0gMCA/IH4weDFmZmYgOiAoc3R5bGVzU3RhY2tbc3R5bGVzU3RhY2subGVuZ3RoIC0xXSB8IH4weDFmZmYpKVxuICAgICAgICAgIHdoZW4gJzwnXG4gICAgICAgICAgICBzdHlsZVN0YWNrLnB1c2ggc3R5bGVcbiAgICAgICAgICB3aGVuICc+J1xuICAgICAgICAgICAgaWYgc3R5bGVTdGFjay5sZW5ndGggaXNudCAwXG4gICAgICAgICAgICAgIHN0eWxlID0gc3R5bGVTdGFjay5wb3AoKVxuICAgICAgICAgICAgICBpZiBuZXh0TGlua1Rva2VuPyBhbmQgbGlua0xldmVsID4gc3R5bGVTdGFjay5sZW5ndGhcbiAgICAgICAgICAgICAgICBlbmRMaW5rKClcbiAgICAgICAgICB3aGVuICckJ1xuICAgICAgICAgICAgbmV4dFRva2VuLnRleHQgKz0gJyQnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgI1RoaXMgbXVzdCBiZSBhIGNvbG9yIGNvZGUsIHZlcmlmeWluZyBpdFxuICAgICAgICAgICAgaWYgL1thLWYwLTldL2kudGVzdChjKVxuICAgICAgICAgICAgICBjb2xvciA9IGNcbiAgICAgICAgZW5kVGV4dCgpXG4gICAgICAgIGlzQ29kZSA9IGZhbHNlXG5cbiAgICAgICNXZSBkZXRlY3QgYSBjb2RlIHN0YXJ0XG4gICAgICBlbHNlIGlmIGMgaXMgJyQnXG4gICAgICAgIGlzQ29kZSA9IHRydWVcbiAgICAgICAgaWYgaXNRdWlja0xpbmsgYW5kIGlzUHJldHR5TGlua1xuICAgICAgICAgIGlzUHJldHR5TGluayA9IGZhbHNlXG5cbiAgICAgICNJZiB3ZSBoYWQgZGV0ZWN0ZWQgYSBjb2xvciBjb2RlIGFmdGVyIGEgY29kZSBzdGFydFxuICAgICAgZWxzZSBpZiBjb2xvcj9cbiAgICAgICAgY29sb3IgKz0gYy5yZXBsYWNlKC9bXmEtZjAtOV0vZ2ksICcwJyk7XG4gICAgICAgIGlmIGNvbG9yLmxlbmd0aCBpcyAzXG4gICAgICAgICAgc3R5bGUgPSBzdHlsZSAmIH4weGZmZjtcbiAgICAgICAgICBzdHlsZSA9IHN0eWxlIHwgU3R5bGUuQ09MT1JFRCB8IChwYXJzZUludChjb2xvciwgMTYpICYgMHhmZmYpXG4gICAgICAgICAgZW5kVGV4dCgpICNmb3JjZSBlbmQgc3RyaW5nXG4gICAgICAgICAgY29sb3IgPSBudWxsXG5cbiAgICAgIGVsc2UgaWYgaXNRdWlja0xpbmsgYW5kIGlzUHJldHR5TGlua1xuICAgICAgICBpZiBjIGlzICdbJ1xuICAgICAgICAgIGlzUXVpY2tMaW5rID0gZmFsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlzUHJldHR5TGluayA9IGZhbHNlXG4gICAgICAgICAgbmV4dFRva2VuLnRleHQgKz0gY1xuICAgICAgICAgIG5leHRMaW5rVG9rZW4ubGluayArPSBjXG5cbiAgICAgIGVsc2UgaWYgaXNQcmV0dHlMaW5rXG4gICAgICAgIGlmIGMgaXMgJ10nXG4gICAgICAgICAgaXNQcmV0dHlMaW5rID0gZmFsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5leHRMaW5rVG9rZW4ubGluayArPSBjXG5cbiAgICAgIGVsc2VcbiAgICAgICAgbmV4dFRva2VuLnRleHQgKz0gY1xuICAgICAgICBpZiBpc1F1aWNrTGlua1xuICAgICAgICAgIG5leHRMaW5rVG9rZW4ubGluayArPSBjXG5cbiAgICBpZiBuZXh0VG9rZW4udGV4dCBpc250ICcnXG4gICAgICB0b2tlbnMucHVzaCBuZXh0VG9rZW5cbiAgIFxuICAgIGlmIG5leHRMaW5rVG9rZW4/XG4gICAgICB0b2tlbnMucHVzaCBuZXcgTGlua1Rva2VuRW5kXG5cbiAgICByZXR1cm4gdG9rZW5zXG4gICAgXG5leHBvcnRzLlBhcnNlciA9IFBhcnNlclxuIiwiY2xhc3MgU3R5bGVcbiAgQENPTE9SRUQ6ICAgICAgIDB4MTAwMFxuICBASVRBTElDOiAgICAgICAgMHgyMDAwXG4gIEBCT0xEOiAgICAgICAgICAweDQwMDBcbiAgQFNIQURPV0VEOiAgICAgIDB4ODAwMFxuICBAQ0FQSVRBTElaRUQ6ICAgMHgxMDAwMFxuICBAV0lERTogICAgICAgICAgMHgyMDAwMFxuICBATkFSUk9XOiAgICAgICAgMHg0MDAwMFxuICBcbmV4cG9ydHMuU3R5bGUgPSBTdHlsZSIsIntTdHlsZX0gPSByZXF1aXJlICcuL1N0eWxlLmNvZmZlZSdcbntDb2xvcn0gPSByZXF1aXJlICcuL0NvbG9yLmNvZmZlZSdcblxuY2xhc3MgVG9rZW5cbiAgY29uc3RydWN0b3I6IChAc3R5bGUgPSAwLCBAdGV4dCA9ICcnKSAtPlxuXG4gIHRvSFRNTDogLT5cbiAgICBzdHlsZVN0YWNrID0gW11cbiAgICBpZiBAc3R5bGVcbiAgICAgIGlmIEBzdHlsZSAmIFN0eWxlLkNPTE9SRURcbiAgICAgICAgIyBDb252ZXJ0aW5nIHN0cmluZyB0byBoZXhcbiAgICAgICAgY29sb3IgPSBwYXJzZUludChDb2xvci5yZ2IxMnRvMjQoQHN0eWxlICYgMHhmZmYpLCAxMCkudG9TdHJpbmcoMTYpXG4gICAgICAgIGlmIChjb2xvci5sZW5ndGggPT0gMSlcbiAgICAgICAgICBjb2xvciA9ICcwMDAwMCcgKyBjb2xvclxuICAgICAgICBlbHNlIGlmIChjb2xvci5sZW5ndGggPT0gMilcbiAgICAgICAgICBjb2xvciA9ICcwMDAwJyArIGNvbG9yXG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmxlbmd0aCA9PSA0KVxuICAgICAgICAgIGNvbG9yID0gJzAwJyArIGNvbG9yXG4gICAgICAgIHN0eWxlU3RhY2sucHVzaCAnY29sb3I6ICMnICsgY29sb3IgKyAnOydcbiAgICAgIGlmIEBzdHlsZSAmIFN0eWxlLklUQUxJQ1xuICAgICAgICBzdHlsZVN0YWNrLnB1c2ggJ2ZvbnQtc3R5bGU6aXRhbGljOydcbiAgICAgIGlmIEBzdHlsZSAmIFN0eWxlLkJPTERcbiAgICAgICAgc3R5bGVTdGFjay5wdXNoICdmb250LXdlaWdodDpib2xkOydcbiAgICAgIGlmIEBzdHlsZSAmIFN0eWxlLlNIQURPV0VEXG4gICAgICAgIHN0eWxlU3RhY2sucHVzaCAndGV4dC1zaGFkb3c6MXB4IDFweCAxcHggcmdiYSgwLCAwLCAwLCAwLjUpOydcbiAgICAgIGlmIEBzdHlsZSAmIFN0eWxlLldJREVcbiAgICAgICAgc3R5bGVTdGFjay5wdXNoICdsZXR0ZXItc3BhY2luZzouMWVtO2ZvbnQtc2l6ZToxMDUlOydcbiAgICAgIGVsc2UgaWYgQHN0eWxlICYgU3R5bGUuTkFSUk9XXG4gICAgICAgIHN0eWxlU3RhY2sucHVzaCAnbGV0dGVyLXNwYWNpbmc6LS4xZW07Zm9udC1zaXplOjk1JTsnXG4gICAgICByZXR1cm4gJzxzcGFuIHN0eWxlPVwiJyArIHN0eWxlU3RhY2suam9pbignICcpICsgJ1wiPicgKyBAdGV4dCArICc8L3NwYW4+J1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAdGV4dFxuXG5leHBvcnRzLlRva2VuID0gVG9rZW5cbiJdfQ==

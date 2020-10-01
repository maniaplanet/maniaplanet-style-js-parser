{Parser} = require '../src/Parser'

chai = require 'chai'
expect = chai.expect

describe 'Parser', ->
  it 'should not modify text without codes', ->
    expect(Parser.toHTML('foo')).to.equal('foo')
  it 'should parse $otag', ->
    expect(Parser.toHTML('$otag')).to.equal('<span style="font-weight:bold;">tag</span>')
  it 'should ignore non color codes', ->
    expect(Parser.toHTML('$uhi there')).to.equal('hi there')
  it 'should parse $l with specified url', ->
    expect(Parser.toHTML('$l[http://maniaplanet.com]trackmania.com$l')).to.equal('<a href="http://maniaplanet.com">trackmania.com</a>')
  it 'should parse $l with no text', ->
    expect(Parser.toHTML('$lhttp://maniaplanet.com$l')).to.equal('<a href="http://maniaplanet.com">http://maniaplanet.com</a>')
  it 'should automatically adds a link end tag', ->
    expect(Parser.toHTML('$lhttp://maniaplanet.com')).to.equal('<a href="http://maniaplanet.com">http://maniaplanet.com</a>')
  it 'should handle links with only code as text', ->
    expect(Parser.toHTML('$l[www.clan-nuitblanche.org]$fff$l')).to.equal('')
  it 'should add http protocol to external links', ->
    expect(Parser.toHTML('$l[maniaplanet.com]maniaplanet$l')).to.equal('<a href="http://maniaplanet.com">maniaplanet</a>')
  it 'should add maniaplanet protocol to internal links', ->
    expect(Parser.toHTML('$h[maniaflash]ManiaFlash$h')).to.equal('<a href="maniaplanet://#manialink=maniaflash">ManiaFlash</a>')
  it 'should handle color codes', ->
    expect(Parser.toHTML('$f00Red')).to.equal('<span style="color: #ff0000;">Red</span>')
  it 'should handle incomplete color codes', ->
    expect(Parser.toHTML('$fRed')).to.equal('<span style="color: #ff0000;">Red</span>')
  it 'should not add links with disableLinks', ->
    expect(Parser.toHTML('$lmaniaplanet.com', disableLinks: true)).to.equal('maniaplanet.com')
  it 'should not add links with specified url with disableLinks', ->
    expect(Parser.toHTML('$l[maniaplanet.com]Maniaplanet', disableLinks: true)).to.equal('Maniaplanet')
  it 'should be darker text with lightBackground', ->
    expect(Parser.toHTML('$fffText', lightBackground: true)).to.equal('<span style="color: #444444;">Text</span>')

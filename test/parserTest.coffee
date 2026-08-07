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
  it 'shouldn\'t add http to links already starting with https', ->
    expect(Parser.toHTML('$l[https://maniaplanet.com]a')).to.equal('<a href="https://maniaplanet.com">a</a>')
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
  it 'should encode html tags', ->
    expect(Parser.toHTML('<script>alert("foo")</script>')).to.equal('&#60;script&#62;alert(&#34;foo&#34;)&#60;/script&#62;')
  it 'should encode html attributes', ->
    expect(Parser.toHTML('<img onerror="alert(\'foo\')" />')).to.equal('&#60;img onerror=&#34;alert(&#39;foo&#39;)&#34; /&#62;')
  it 'should encode html comments', ->
    expect(Parser.toHTML('<!-- foo -->')).to.equal('&#60;!-- foo --&#62;')
  it 'should encode html entities', ->
    expect(Parser.toHTML('foo &amp; bar & baz')).to.equal('foo &#38;amp; bar &#38; baz')
  it 'should encode html entities in links', ->
    expect(Parser.toHTML('$l[http://test.com"><script>alert("foo")</script>]foo & bar$l')).to.equal('<a href="http://test.com&#34;&#62;&#60;script&#62;alert(&#34;foo&#34;)&#60;/script&#62;">foo &#38; bar</a>')
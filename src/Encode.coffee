class Encode
  @htmlEntities: (text) ->
    return text.replace /[&<>'"]/g, (match) -> '&#' + match.charCodeAt(0) + ';'

exports.Encode = Encode
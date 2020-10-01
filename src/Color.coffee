class Color
  @hex2rgb: (hex_color) ->
  	color = parseInt(hex_color, 16)
  	return [(color & 0xff0000) >> 16, (color & 0xff00) >> 8, color & 0xff]

  @rgb12to24: (color) ->
    return (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11

  @rgbToLuminance: (rgb) ->
  	return 0.2126 * Math.pow(rgb[0] / 255, 2.2) + 0.7151 * Math.pow(rgb[1] / 255, 2.2) + 0.0721 * Math.pow(rgb[2] / 255, 2.2)

  # Maximum returned is 21
  # Minimum is 1
  # WCAG 2.0 level AA  minimum ratio: 4.5:1
  # WCAG 2.0 level AAA minimum ratio:  7:1
  @contrastRatio: (rgb1, rgb2) ->
  	return (@rgbToLuminance(@hex2rgb(rgb1)) + 0.05) / (@rgbToLuminance(@hex2rgb(rgb2)) + 0.05)

  @invertLight: (hex_color) ->
    r = parseInt(hex_color[0], 16) * 17
    g = parseInt(hex_color[1], 16) * 17
    b = parseInt(hex_color[2], 16) * 17
    grey = (r + g + b) / 3
    if grey > 160
      upper = 255 + 74
      r = Math.min(15, Math.floor((upper - r) / 17))
      g = Math.min(15, Math.floor((upper - g) / 17))
      b = Math.min(15, Math.floor((upper - b) / 17))
      return r.toString(16) + g.toString(16) + b.toString(16)
    return hex_color

exports.Color = Color
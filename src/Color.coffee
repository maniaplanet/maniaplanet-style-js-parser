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
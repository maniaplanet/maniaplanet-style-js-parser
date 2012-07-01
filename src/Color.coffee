class Color
  @rgb12to24: (color) ->
    return (color & 0xf00) * 0x1100 + (color & 0xf0) * 0x110 + (color & 0xf) * 0x11
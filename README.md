# gcode-parser

Parses g-code

## `require("gcode-parser")(gcodeStr)`
Parses gcode.  Input is a string of gcode.  Output is all relevent lines of code (G0, G1, G90, G91, G92, M82, M83, G28 commands) formatted as an array.

* `gcodeStr` 
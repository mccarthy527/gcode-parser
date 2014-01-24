# gcode-parser

Parses g-code

## `require("gcode-parser")(gcodeStr)`
Includes several useful functions for parsing the flavor of gcode used by RepRap firmwares.

Functions

## `prepGCode(fileContent)`
*filecontent contains gcode stored in a string
*split gcode into an array of strings (one for each line) and extract those that are relevent (G0, G1, G90, G91, G92, M82, M83, G28 commands).  Inline comments are also removed.
## `isCommand(line, command)`
*return true if line is of type command.
## `removeInLineComment(line)`
*removes inline comment from a line of gcode
## `getValue(line, type`
*type should be E,X,Y,F,..
*line is a single line of gcode

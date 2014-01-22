//var gcode = require("./node_modules/gcodejs/parser.js")
var fs = require("fs")
var parseGCode = require("../index.js")

console.log("let's parse some gcode")

var data = fs.readFileSync("text.gcode")
var fileContent = data.toString()
var gcode = parseGCode(fileContent)

console.log(gcode)
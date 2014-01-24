var fs = require("fs")
var prepGCode = require("../index.js")


var data = fs.readFileSync("test/text.gcode")
var fileContent = data.toString()
var gcode = prepGCode(fileContent)

console.log(gcode)
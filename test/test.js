var fs = require("fs")
var prepGCode = require("../index.js")


var data = fs.readFileSync("test/text.gcode")
var fileContent = data.toString()
var gcode = prepGCode(fileContent)


console.log(gcode[1])
//console.log(getValue(gcode[1], 'E'))	//I don't know how to set the file up to allow me to do this
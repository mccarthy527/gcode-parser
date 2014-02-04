var fs = require("fs")
var gc = require("../index.js")
var dp = require("../doparse.js")

var data
problem = 2
if(problem == 1)
{
	data = fs.readFileSync("test/text.gcode")
}
else if(problem == 2)
{
	data = fs.readFileSync("test/5mmcubefullsupport2.gcode")
}

var fileContent = data.toString()
var gcode = gc.prepGCode(fileContent)
model = gc.doParse(gcode)


/*
console.log(gcode[1])
console.log(gc.getValue(gcode[1], 'E'))	//I don't know how to set the file up to allow me to do this
*/
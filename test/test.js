var fs = require("fs")
var gc = require("../index.js")
var dp = require("../doparse.js")

problem=2
var data

if(problem==1)
{
	data = fs.readFileSync("test/simpletest1.gcode")
}
else if(problem==2)
{
	data = fs.readFileSync("test/simpletest2.gcode")
}
else if(problem==3)
{
	data = fs.readFileSync("test/text.gcode")
}


var fileContent = data.toString()

history = gc(fileContent)
console.log(history)
console.log(history.length)


if(problem==1)
{
	laststate = history[history.length-1];
	
	if(!((laststate.x[0] == 98.132) && (laststate.x[0] == 98.132) && (laststate.x[0] == 98.132) && (laststate.e == 0.9889899999999999) && (laststate.f == 600) && (laststate.erel == -0.28188) && (laststate.xrel[0] == 0)))
	{
		throw new Error("failed test case")
	}
	else
	{
		console.log('passed test!')
	}
}
else if(problem==2)
{
	secondtolaststate = history[history.length-2];
	if(secondtolaststate.fp == -0.5)
	{
		console.log('passed test!')
	}
	else
	{
		throw new Error("failed test case")
	}
}

/*
console.log(gcode[1])
console.log(gc.getValue(gcode[1], 'E'))	//I don't know how to set the file up to allow me to do this
*/
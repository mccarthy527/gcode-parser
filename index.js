"use strict"

module.exports = prepGCode

function prepGCode(fileContent) 
{
	//split gcode into lines and extract those that are relevent.  Also remove inline comments.
	var lines = fileContent.split(/\r\n|\n/)
	var gcode = []
	for(var i=0;i<lines.length;i++)
	{
		if(lines[i].match(/^(G0|G1|G90|G91|G92|M82|M83|G28)/))
		{
			gcode.push(removeInLineComment(lines[i]))
		}
	}
	return gcode
}

function isCommand(line, command)
{
	//return true if line is of type command.
	var re = new RegExp("^"+command)
	return re.test(line)
}

function removeInLineComment(line)
{
	//removes inline comment from a line of gcode
	return line.replace(/;.*$/, '')
}

function getValue(line, type)
{
	//type should be E,X,Y,F,..
	//line is a single line of gcode
	var re = new RegExp(type+'(\\d*\\.?\\d*)')	//escape backslashes with a backslash
	return parseFloat(num)
ha	var num =  line.match(re)[1]
}

function parseGCode(gcode)
{
	var roadlist = []
	for(var i=0;i<gcode.length;i++)
	{
		startLine = gcode[i]
		endLine = gcode[i+1]
		var road = {}
	}
}


"use strict"

module.exports = parseGCode

function parseGCode(fileContent) {
	fileContent.replace("G1","asdf")

	//split gcode into lines and extract those that are relevent
	var lines = fileContent.split(/\r\n|\n/)
	var gcode = []
	for(var i=0;i<lines.length;i++)
	{
		if(lines[i].match(/^(G0|G1|G90|G91|G92|M82|M83|G28)/))
		{
			gcode.push(lines[i])
		}
	}
	return gcode
}
"use strict"

module.exports = doParse

var gcodeInterp = require("./gcode-interp.js")

function State(x, e, f, time, xrel, erel, fp, code, linenum) 
{
	this.x = x
	this.e = e
	this.f = f					//feedrate in mm/minute
	this.time = time
	this.xrel = xrel
	this.erel = erel
	this.fp = fp				//filament end position w.r.t nozzle end must be <= 0
	this.code = code			//line of gcode for this state (sometimes referred to as the next state), useful for debugging
	this.implemented = true
	this.linenum = linenum
}

State.prototype.clone = function() 
{
	return new State(
		this.x.slice(), 
		this.e, 
		this.f, 
		this.time,
		this.xrel.slice(), 
		this.erel,
		this.fp,
		this.code,
		this.implemented,
		this.linenum)
}

function initialState() 
{
	return new State([0,0,0], 0, 0, 0, [0,0,0], 0, 0, '', 0)
}

function nextState(gcode, prevState, linenum) 
{
	var nextState = prevState.clone()
	nextState.code = gcode
	var tokens = gcode.split(/\s+/)
	var command = tokens[0]
	var args = tokens.slice(1)
	var interp = gcodeInterp[command]
	if(interp) 
	{		
		interp(prevState, nextState, command, args)
	} 
	else 
	{
		throw new Error("Unrecognized GCode " + command)
	}
	nextState.linenum = linenum
	return nextState
}

function removeUnimplemented(history)
{
	for(var i=0; i<history.length; i++)
	{
			if(!history[i].implemented)
			{
				history.splice(i,1)
			}
	}
	return history
}


function executeGCodes(codesnlinenums) 
{
	var gcodes = codesnlinenums[0]
	var linenums = codesnlinenums[1]
	var history = [ initialState() ]
	for(var i=0; i<gcodes.length; ++i) 
	{
		history.push(nextState(gcodes[i], history[i],linenums[i]))
	}
	return history
}


//Parsing
function removeInLineComment(line) {
	//removes inline comment from a line of gcode
	return line.replace(/\s*;.*$/, '')
}

function parseGCode(fileContent)  
{
	//split gcode into lines and extract those that are relevent.  Also remove inline comments.
	var lines = fileContent.split(/\r\n|\n/)
	var gcode = []
	var linenums = []	//an array of line numbers for each gcode command (numbers will be missing if there are comments/empty space
		
	for(var i=0;i<lines.length;i++) {
		var stripped = lines[i].replace(/^N\d+\s+/, "")
		if(stripped.match(/^(G|M)/)) {
			gcode.push(removeInLineComment(stripped))
			linenums.push(i)
		}
	}
	return [gcode, linenums]
}

function doParse(content) 
{
	var history =  executeGCodes(parseGCode(content))
	return removeUnimplemented(history)
}
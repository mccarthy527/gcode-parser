"use strict"

module.exports = doParse

var gcodeInterp = require("./gcode-interp.js")

function State(x, e, f, time, xrel, erel, fp, code) {
	this.x = x
	this.e = e
	this.f = f
	this.time = time
	this.xrel = xrel
	this.erel = erel
	this.fp = fp				//filament end position w.r.t nozzle end must be <= 0
	this.code = code			//line of gcode for this state (sometimes referred to as the next state), useful for debugging
	this.implemented = true
}

State.prototype.clone = function() {
	return new State(
		this.x, 
		this.e, 
		this.f, 
		this.time,
		this.xrel, 
		this.erel,
		this.fp,
		this.code,
		this.implemented)
}

function initialState() {
	return new State([0,0,0], 0, 0, 0, [0,0,0], 0, 0, '')
}

function nextState(gcode, prevState) 
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


function executeGCodes(gcodes) {
	var history = [ initialState() ]
	for(var i=0; i<gcodes.length; ++i) 
	{
		history.push(nextState(gcodes[i], history[i]))
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
		
	for(var i=0;i<lines.length;i++) {
		var stripped = lines[i].replace(/^N\d+\s+/, "")
		if(stripped.match(/^(G|M)/)) {
			gcode.push(removeInLineComment(stripped))
		}
	}
	return gcode
}

function doParse(content) 
{
	var history =  executeGCodes(parseGCode(content))
	return removeUnimplemented(history)
}
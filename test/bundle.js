(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

function G0(prevState, nextState, command, args) {
	for(var j=0; j<args.length; j++)
	{
		switch(args[j].charAt(0).toLowerCase())
		{
			case 'x':
				nextState.x[0]=prevState.xrel[0]+parseFloat(args[j].slice(1));
				break;
			case 'y':
				nextState.x[1]=prevState.xrel[1]+parseFloat(args[j].slice(1));
				break;
			case 'z':
				nextState.x[2]=prevState.xrel[2]+parseFloat(args[j].slice(1));
				break;
			case 'f':
				nextState.f=parseFloat(args[j].slice(1));
				break;
			case 'e':
				nextState.e=prevState.erel+parseFloat(args[j].slice(1));
				nextState.fp = prevState.fp+(nextState.e - prevState.e)			
				if(nextState.fp > 0)
				{
					nextState.fp = 0
				}
				break;
			default:	
				throw new Error('error I do not understand this arguement' + '<'+args[j]+'>')
				break;		
		}
	}
}

function G92(prevState, nextState, command, args) 
{
	if(args.length === 0) 
	{
		//TODO: Reset everything
		throw new Error("Reset all coordinates not implemented yet")
	} 
	else 
	{
		for(var j=0;j<args.length;j++) 
		{
			switch(args[j].charAt(0).toLowerCase()) 
			{
				case 'x':
					nextState.xrel[0] = prevState.x[0] - parseFloat(args[j].slice(1))
					break;
				case 'y':
					nextState.xrel[1] = prevState.xrel[1] - parseFloat(args[j].slice(1))
					break;
				case 'z':
					nextState.xrel[2] = prevState.xrel[2] - parseFloat(args[j].slice(1))
					break;						
				case 'e':
					nextState.erel = prevState.e - parseFloat(args[j].slice(1))
					break;
				default:
					throw new Error('error I do not understand this arguement' + '<'+args[j]+'>')
					break;		
			}
		}
	}
}

function G91(prevState, nextState, command, args)
{
	console.error('relative positioning is not implemented')
}

function noop(prevState, nextState, command, args) 
{
	nextState.implemented = false
	console.warn("Unimplemented GCode: ", command)
}

module.exports = {
	"G0": G0,
	"G1": G0,
	"G92": G92,
	"G91": G91,
	
	"G28": noop,
	"G90": noop,
	"M82": noop,
	"G21": noop,
	"M48": noop,
	"M84": noop,
	"M107": noop,
	"M104": noop,
	"M106": noop,
	"M109": noop,
	"M190": noop
	
}
},{}],2:[function(require,module,exports){
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
	var history = [ initialState() ]
	var linenums = codesnlinenums[1]
	for(var i=0; i<gcodes.length; ++i) 
	{
		history.push(nextState(gcodes[i], history[i],linenums[i]))
	}
	return history
}


//Parsingage
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
},{"./gcode-interp.js":1}],3:[function(require,module,exports){
var gc = require("../index.js")
//var test = require('tape')
//var path = require('path')



var fileContent = "G1 Z0.200 F7800.000\nG1 X92.960 Y92.960"

history = gc(fileContent)
console.log(history)


},{"../index.js":2}]},{},[3]);

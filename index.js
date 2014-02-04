"use strict"


module.exports = {	prepGCode: 				prepGCode, 
					isCommand:				isCommand,
					getValue: 				getValue,
					removeInLineComment:	removeInLineComment,
					doParse:				doParse}

function State(x, e, f, time, xrel, erel) {
	this.x = x
	this.e = e
	this.f = f
	this.time = time
	this.xrel = xrel
	this.erel = erel
}

State.prototype.clone = function() {
	return new State(
		this.x, 
		this.e, 
		this.f, 
		this.time,
		this.xrel, 
		this.erel)
}

function initialState() {
	return new State([0,0,0], 0, 0, 0, [0,0,0], 0)
}

function nextState(gcode, prevState) {
	var nextState = prevState.clone()
	
	/*
	gcode[i] = gcode[i].split(/[\(;]/)[0] 						//remove any inline comments
		
		if(isCommand(gcode[i], 'G1') || isCommand(gcode[i], 'G0'))	//move and rapid move are the same for rep rap gcode
		{
			var args = gcode[i].split(/\s+/)
			args.shift() 						//remove the first element since it will be the command: 'G92'
			for(var j=0;j<args.length;j++)
			{
				switch(args[j].charAt(0).toLowerCase())
				{
					case 'x':
						x=xrel+parseFloat(args[j].slice(1));
						break;
					case 'y':
						y=yrel+parseFloat(args[j].slice(1));
						break;
					case 'z':
						z=zrel+parseFloat(args[j].slice(1));
						break;
					case 'f':
						f=parseFloat(args[j].slice(1));
						break;
					case 'e':
						e=erel+parseFloat(args[j].slice(1));
						break;
					case '':
						break;
					default:	
						console.log('error I do not understand this arguement' + '<'+args[j]+'>')
						console.log(gcode[i])
						break;
				
				}
			}
		}
		else if(isCommand(gcode[i], 'G92'))
		{
			var args = gcode[i].split(/\s+/)
			args.shift() 						//remove the first element since it will be the command: 'G92'
			for(var j=0;j<args.length;j++)		
			{
				switch(args[j].charAt(0).toLowerCase())		
				{
					case 'x':
						xrel= x - parseFloat(args[j].slice(1))
						break;
					case 'y':
						yrel= y - parseFloat(args[j].slice(1))
						break;
					case 'z':
						zrel= z - parseFloat(args[j].slice(1))
						break;						
					case 'e':
						erel= e - parseFloat(args[j].slice(1))
						break;
					case '':
						break;
					default:	
						console.log('error I do not understand this arguement' + '<'+args[j]+'>')
						break;		
				
				}
				//TODO if no arguments need to reset everything
			}
			
		}
		else if(isCommand(gcode[i], 'G91'))
		{
			console.error('relative positioning is not implemented')
		}
	*/
	return nextState
}


function executeGCodes(gcodes) {
	var history = [ initialState() ]
	for(var i=0; i<gcodes.length; ++i) {
		history.push(nextState(gcodes[i], history[i]))
	}
	return history
}

//Extract linesegments/post process
function extractLineSegments(history) {
	//Join pairs together
	return history
}


//Parsing
function removeInLineComment(line) {
	//removes inline comment from a line of gcode
	return line.replace(/;.*$/, '')
}

function parseGCode(fileContent)  {
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



function getValue(line, type)
{
	//type should be E,X,Y,F,..
	//line is a single line of gcode
	var re = new RegExp(type+'(\\d*\\.?\\d*)')	//escape backslashes with a backslash
	var num =  line.match(re)[1]
	return parseFloat(num)
}


function doParse(gcode)												//gcode must be an array where each entry is a line of gcode.
{
	var model = []
	var x=0
	var y=0
	var z=0
	var e=0
	var f=0
	var xprev,yprev,zprev,eprev,fprev
	
	var xrel=0;	//specifies location of relative coordinate system.  initially cooresponds to absolute
	var yrel=0;
	var zrel=0;
	var erel=0;
	
	for(var i=0;i<gcode.length;i++)
	{
		xprev=x	
		yprev=y
		zprev=z
		eprev=e
		fprev=f
		
		gcode[i] = gcode[i].split(/[\(;]/)[0] 						//remove any inline comments
		
		if(isCommand(gcode[i], 'G1') || isCommand(gcode[i], 'G0'))	//move and rapid move are the same for rep rap gcode
		{
			var args = gcode[i].split(/\s+/)
			args.shift() 						//remove the first element since it will be the command: 'G92'
			for(var j=0;j<args.length;j++)
			{
				switch(args[j].charAt(0).toLowerCase())
				{
					case 'x':
						x=xrel+parseFloat(args[j].slice(1));
						break;
					case 'y':
						y=yrel+parseFloat(args[j].slice(1));
						break;
					case 'z':
						z=zrel+parseFloat(args[j].slice(1));
						break;
					case 'f':
						f=parseFloat(args[j].slice(1));
						break;
					case 'e':
						e=erel+parseFloat(args[j].slice(1));
						break;
					case '':
						break;
					default:	
						console.log('error I do not understand this arguement' + '<'+args[j]+'>')
						console.log(gcode[i])
						break;
				
				}
			}
		}
		else if(isCommand(gcode[i], 'G92'))
		{
			var args = gcode[i].split(/\s+/)
			args.shift() 						//remove the first element since it will be the command: 'G92'
			for(var j=0;j<args.length;j++)		
			{
				switch(args[j].charAt(0).toLowerCase())		
				{
					case 'x':
						xrel= x - parseFloat(args[j].slice(1))
						break;
					case 'y':
						yrel= y - parseFloat(args[j].slice(1))
						break;
					case 'z':
						zrel= z - parseFloat(args[j].slice(1))
						break;						
					case 'e':
						erel= e - parseFloat(args[j].slice(1))
						break;
					case '':
						break;
					default:	
						console.log('error I do not understand this arguement' + '<'+args[j]+'>')
						break;		
				
				}
				//TODO if no arguments need to reset everything
			}
			
		}
		else if(isCommand(gcode[i], 'G91'))
		{
			console.error('relative positioning is not implemented')
		}
	}
}


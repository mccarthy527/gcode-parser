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
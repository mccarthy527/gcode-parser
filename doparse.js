module.exports = {	doParse: 				doParse}

    function doParse(gcode)		//gcode must be an array where each entry is a line of gcode.
	{
        var argChar, numSlice;
        model=[];
        var sendLayer = undefined;
        var sendLayerZ = 0;
        var sendMultiLayer = [];
        var sendMultiLayerZ = [];
        var lastSend = 0;
    //            console.time("parseGCode timer");
        var reg = new RegExp(/^(?:G0|G1)\s/i);
        var comment = new RegExp()
        var j, layer= 0, extrude=false, prevRetract= {e: 0, a: 0, b: 0, c: 0}, retract=0, x, y, z=0, f, prevZ=0, prevX, prevY,lastF=4000, prev_extrude = {a: undefined, b: undefined, c: undefined, e: undefined, abs: undefined}, extrudeRelative=false, volPerMM, extruder;
        var dcExtrude=false;
        var assumeNonDC = false;
		var z_heights = {};

		
		

        for(var i=0;i<gcode.length;i++){
    //            for(var len = gcode.length- 1, i=0;i!=len;i++){
            x=undefined;
            y=undefined;
            z=undefined;
            volPerMM=undefined;
            retract = 0;


            extrude=false;
            extruder = null;
            prev_extrude["abs"] = 0;
            gcode[i] = gcode[i].split(/[\(;]/)[0];
			console.log(gcode[i])

    //                prevRetract=0;
    //                retract=0;
    //                if(gcode[i].match(/^(?:G0|G1)\s+/i)){
            if(reg.test(gcode[i])){
                var args = gcode[i].split(/\s/);
                for(j=0;j<args.length;j++){
    //                        console.log(args);
    //                        if(!args[j])continue;
                    switch(argChar = args[j].charAt(0).toLowerCase()){
                        case 'x':
                            x=args[j].slice(1);
//                            if(x === prevX){
//                                x=undefined;
//                            }
                            break;
                        case 'y':
                            y=args[j].slice(1);
//                            if(y===prevY){
//                                y=undefined;
//                            }
                            break;
                        case 'z':
                            z=args[j].slice(1);
                            z = Number(z);
                            if(z == prevZ)continue;
//                            z = Number(z);
                            if(z_heights.hasOwnProperty(z)){
                                layer = z_heights[z];
                            }else{
                                layer = model.length;
                                z_heights[z] = layer;
                            }
                            sendLayer = layer;
                            sendLayerZ = z;
                            //                                if(parseFloat(prevZ) < )
    //                                if(args[j].charAt(1) === "-")layer--;
    //                                else layer++;
                            prevZ = z;
                            break;
                        case 'e':
                        case 'a':
                        case 'b':
                        case 'c':
                            assumeNonDC = true;
                            extruder = argChar;
                            numSlice = parseFloat(args[j].slice(1)).toFixed(3);

                            if(!extrudeRelative){
                                // absolute extrusion positioning
                                prev_extrude["abs"] = parseFloat(numSlice)-parseFloat(prev_extrude[argChar]);

                            }else{
                                prev_extrude["abs"] = parseFloat(numSlice);
                            }
                            extrude = prev_extrude["abs"]>0;
                            if(prev_extrude["abs"]<0){
                                prevRetract[extruder] = -1;
                                retract = -1;
                            }
                            else if(prev_extrude["abs"]==0){
    //                                        if(prevRetract <0 )prevRetract=retract;
                                retract = 0;
                            }else if(prev_extrude["abs"]>0&&prevRetract[extruder] < 0){
                                prevRetract[extruder] = 0;
                                retract = 1;
                            } else {
    //                                        prevRetract = retract;
                                retract = 0;
                            }
                            prev_extrude[argChar] = numSlice;

                            break;
                        case 'f':
                            numSlice = args[j].slice(1);
                            lastF = numSlice;
                            break;
                        default:
                            break;
                    }
                }
                if(dcExtrude&&!assumeNonDC){
                    extrude = true;
                    prev_extrude["abs"] = Math.sqrt((prevX-x)*(prevX-x)+(prevY-y)*(prevY-y));
                }
                if(extrude&&retract == 0){
                    volPerMM = Number(prev_extrude['abs']/Math.sqrt((prevX-x)*(prevX-x)+(prevY-y)*(prevY-y)));
                }
                if(!model[layer])model[layer]=[];
                //if(typeof(x) !== 'undefined' || typeof(y) !== 'undefined' ||typeof(z) !== 'undefined'||retract!=0)
                    model[layer][model[layer].length] = {x: Number(x), y: Number(y), z: Number(z), extrude: extrude, retract: Number(retract), noMove: false, extrusion: (extrude||retract)?Number(prev_extrude["abs"]):0, extruder: extruder, prevX: Number(prevX), prevY: Number(prevY), prevZ: Number(prevZ), speed: Number(lastF), gcodeLine: Number(i), volPerMM: typeof(volPerMM)==='undefined'?-1:volPerMM.toFixed(3)};
                //{x: x, y: y, z: z, extrude: extrude, retract: retract, noMove: false, extrusion: (extrude||retract)?prev_extrude["abs"]:0, prevX: prevX, prevY: prevY, prevZ: prevZ, speed: lastF, gcodeLine: i};
                if(typeof(x) !== 'undefined') prevX = x;
                if(typeof(y) !== 'undefined') prevY = y;
            } else if(gcode[i].match(/^(?:M82)/i)){
                extrudeRelative = false;
            }else if(gcode[i].match(/^(?:G91)/i)){
                extrudeRelative=true;
            }else if(gcode[i].match(/^(?:G90)/i)){
                extrudeRelative=false;
            }else if(gcode[i].match(/^(?:M83)/i)){
                extrudeRelative=true;
            }else if(gcode[i].match(/^(?:M101)/i)){
                dcExtrude=true;
            }else if(gcode[i].match(/^(?:M103)/i)){
                dcExtrude=false;
            }else if(gcode[i].match(/^(?:G92)/i)){
                var args = gcode[i].split(/\s/);
                for(j=0;j<args.length;j++){
                    switch(argChar = args[j].charAt(0).toLowerCase()){
                        case 'x':
                            x=args[j].slice(1);
                            break;
                        case 'y':
                            y=args[j].slice(1);
                            break;
                        case 'z':
                            z=args[j].slice(1);
                            prevZ = z;
                            break;
                        case 'e':
                        case 'a':
                        case 'b':
                        case 'c':
                            numSlice = parseFloat(args[j].slice(1)).toFixed(3);
                            extruder = argChar;
                            if(!extrudeRelative)
                                prev_extrude[argChar] = 0;
                            else {
                                prev_extrude[argChar] = numSlice;
                            }
//                            prevZ = z;
                            break;
                        default:
                            break;
                    }
                }
                if(!model[layer])model[layer]=[];
                if(typeof(x) !== 'undefined' || typeof(y) !== 'undefined' ||typeof(z) !== 'undefined')
                    model[layer][model[layer].length] = {x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), extrude: extrude, retract: parseFloat(retract), noMove: true, extrusion: 0, extruder: extruder, prevX: parseFloat(prevX), prevY: parseFloat(prevY), prevZ: parseFloat(prevZ), speed: parseFloat(lastF), gcodeLine: parseFloat(i)};
            }else if(gcode[i].match(/^(?:G28)/i)){
                var args = gcode[i].split(/\s/);
                for(j=0;j<args.length;j++){
                    switch(argChar = args[j].charAt(0).toLowerCase()){
                        case 'x':
                            x=args[j].slice(1);
                            break;
                        case 'y':
                            y=args[j].slice(1);
                            break;
                        case 'z':
                            z=args[j].slice(1);
                            z = Number(z);
                            if(z === prevZ)continue;
                            sendLayer = layer;
                            sendLayerZ = z;//}
                            if(z_heights.hasOwnProperty(z)){
                                layer = z_heights[z];
                            }else{
                                layer = model.length;
                                z_heights[z] = layer;
                            }
                            prevZ = z;
                            break;
                        default:
                            break;
                    }
                }
                // G28 with no arguments
                if(args.length == 1){
                    //need to init values to default here
                }
                // if it's the first layer and G28 was without
                if(layer==0&&typeof(z) === 'undefined'){
                    z=0;
                    if(z_heights.hasOwnProperty(z)){
                        layer = z_heights[z];
                    }else{
                        layer = model.length;
                        z_heights[z] = layer;
                    }
                    prevZ = z;
                }
//                x=0, y=0,z=0,prevZ=0, extrude=false;
//                if(typeof(prevX) === 'undefined'){prevX=0;}
//                if(typeof(prevY) === 'undefined'){prevY=0;}

                if(!model[layer])model[layer]=[];
//                if(typeof(x) !== 'undefined' || typeof(y) !== 'undefined' ||typeof(z) !== 'undefined'||retract!=0)
                    model[layer][model[layer].length] = {x: Number(x), y: Number(y), z: Number(z), extrude: extrude, retract: Number(retract), noMove: false, extrusion: (extrude||retract)?Number(prev_extrude["abs"]):0, extruder: extruder, prevX: Number(prevX), prevY: Number(prevY), prevZ: Number(prevZ), speed: Number(lastF), gcodeLine: Number(i)};
//                if(typeof(x) !== 'undefined' || typeof(y) !== 'undefined' ||typeof(z) !== 'undefined') model[layer][model[layer].length] = {x: x, y: y, z: z, extrude: extrude, retract: retract, noMove:false, extrusion: (extrude||retract)?prev_extrude["abs"]:0, prevX: prevX, prevY: prevY, prevZ: prevZ, speed: lastF, gcodeLine: parseFloat(i)};
            }
			/*
			if(typeof(sendLayer) !== "undefined")
			{
//          	sendLayerToParent(sendLayer, sendLayerZ, i/gcode.length*100);
//          	sendLayer = undefined;

                if(i-lastSend > gcode.length*0.02 && sendMultiLayer.length != 0)
				{
                    lastSend = i;
                    sendMultiLayerToParent(sendMultiLayer, sendMultiLayerZ, i/gcode.length*100);
                    sendMultiLayer = [];
                    sendMultiLayerZ = [];
                }
                sendMultiLayer[sendMultiLayer.length] = sendLayer;
                sendMultiLayerZ[sendMultiLayerZ.length] = sendLayerZ;
                sendLayer = undefined;
                sendLayerZ = undefined;
				
            }
			*/

        }
		
/*
//        sendMultiLayer[sendMultiLayer.length] = layer;
//        sendMultiLayerZ[sendMultiLayerZ.length] = z;
        sendMultiLayerToParent(sendMultiLayer, sendMultiLayerZ, i/gcode.length*100); 

//            if(gCodeOptions["sortLayers"])sortLayers();
//            if(gCodeOptions["purgeEmptyLayers"])purgeLayers();
*/
	console.log(model)
	//console.log(model)
	return model
    };
var fs = require("fs")
var gc = require("../index.js")
var test = require('tape')
var path = require('path')

function runTest(t, fileName) {
	var data = fs.readFileSync(path.join(__dirname, fileName))
	var fileContent = data.toString()
	var history = [[]]
	t.doesNotThrow(function() {
		history = gc(fileContent)
	})
	return history
}

function testcase(t)
{
	/*
	var history = runTest(t, "simpletest1.gcode")
	var laststate = history[history.length-1];
	t.equal(laststate.x[0],98.132)
	t.equal(laststate.e, 0.9889899999999999)
	t.equal(laststate.f,600)
	t.equal(laststate.erel, -0.28188)
	t.equal(laststate.xrel[0],0)

	var history = runTest(t, "simpletest2.gcode")
	var secondtolaststate = history[history.length-2]
	t.equals(secondtolaststate.fp, -0.5)
	*/
	
	var history = runTest(t, "testbox.gcode")
	console.log(history)
	t.end()
}
test('test1', testcase)
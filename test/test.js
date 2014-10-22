var fs = require("fs")
var gc = require("../index.js")
var test = require('tape')
var path = require('path')


var data = fs.readFileSync("simpletest1.gcode")
var fileContent = data.toString()

history = gc(fileContent)
console.log(history)


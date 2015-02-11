var gc = require("../index.js")
//var test = require('tape')
//var path = require('path')



var fileContent = "G1 Z0.200 F7800.000\nG1 X92.960 Y92.960"

history = gc(fileContent)
console.log(history)


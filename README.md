# interpret-gcode

Interprets some [gcode commands](http://reprap.org/wiki/G-code) for rep-rap flavor g-code

## Example

```javascript
var gc = require("interpret-gcode")
var fs = require("fs")


var data = fs.readFileSync("test.gcode")
var fileContent = data.toString()

history = gc(fileContent)
console.log(history)
```

## Install

```
npm install interpret-gcode
```

## API

### `require("interpret-gcode")(fileContents)`

Parses a string cotaining the contents of a gcode file, returns interpreted sequence of states

* fileContents - A string of gcode

**Returns** An array of states for the machine

### State properties

Each state stores the following properties:

* x - current nozzle position [x,y,z] in absolute coordinates
* xrel - current position [x,y,z] of relative coordinate system (based on any time G92 is called)
* e - current amount of material that has been pushed through the nozzle at this state (again in absolute coordinates)
* erel - current position of relative e coordinate system.
* f - feedrate in units/unit time.
* fp - filament end position wrt nozzle end.  Must be less than or equal to 0.  If less than zero, the filament is retracted, if zero, the filament is at the end of the nozzle.
* time - not yet implemented
* code - line of code executed for current state (for debugging)

## License

The MIT License (MIT)

Copyright (c) 2014 Brian McCarthy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

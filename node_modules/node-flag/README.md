**NODE-FLAG**
==============
*Access to Node.js Command Line Flags*
---------------------------------------------

***Require Node 4+***

**How To:**

*install the module:*
```bash
$ npm install node-flag
```

*import it:*
```javascript
const nodeFlags = require('node-flag')
``` 

*use it:*
```javascript
// check if flag is set or not
console.log(nodeFlags.isset(/**[FLAG_TITLE]**/)) //returns boolean value

// get all command line flags
console.log(nodeFlags.getAll())

// get single (or all) command line flag
console.log(nodeFlags.get(/**[FLAG_TITLE]**/)) 
// if you don't set the flag title; all flags will be retured.
```

*example:*
```bash
# in Terminal:

$ node app.js --host 127.0.0.1 --port 3000
# OR
$ node app.js -h 127.0.0.1 -p 3000

# NOTE:
# if you use single hyphen (-) as flag title prefix 
# you can only set 1 character length flag title like -h but 
# if you want to set more than 1 character length flag title 
# you have to set double hyphens (--) as flag title prefix like --host  
```
```javascript
// in your application:

'use strict'

const nodeFlags = require('node-flag')

//check if a specific flag is set or not
console.log(nodeFlags.isset('port')) //returns boolean value

// get all command line flags
console.log(nodeFlags.getAll())
/* result:
	{
		host: '127.0.0.1',
		port: '3000'
	}
	OR:
	{
		h: '127.0.0.1',
		p: '3000'
	}
*/

// get single command line flag
console.log(nodeFlags.get('port') // result: 3000
//OR
console.log(nodeFlags.get('p') // result: 3000
```

**Only Get Valid/Required Flags:**

*if you want to filter ```getAll()``` or ```get()``` results with your valid/required flags just use ```validFlags()``` method before of them.*
```javascript
nodeFlags.validFlags('host')
//OR:
nodeFlags.validFlags(['host', 'port', 'h', 'p'])
```

**Assigning Flag Titles:**
```bash
$ node app.js -h 127.0.0.1 -p 3000
```
```javascript
nodeFlags.assign({
	h: 'host',
	p: 'port'
})

console.log(nodeFlags.get('host')) 
// result: '127.0.0.1'
```

** **
***THIS IS JUST A SIMPLE WEEKEND PROJECT!***

***[arefmirhosseini.com](http://arefmirhosseini.com)***
'use strict'

const nodeFlags = require('./index')

//set valid flags
// nodeFlags.validFlags(['port'])

//assign
nodeFlags.assign({
    h: 'host',
    p: 'port'
})

//get all flags
console.log(nodeFlags.getAll())

//get single flag
console.log(nodeFlags.get('host'))

//check if a specific flag is set or not
console.log(nodeFlags.isset('host'))

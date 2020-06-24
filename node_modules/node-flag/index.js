/**
 * NODE-FLAG: Access to Node.js Command Line Flags
 * v1.0.5
 * npm: npmjs.org/arefm/node-flag
 * github: github.com/arefm/node-flag
 * author: Aref Mirhosseini <code@arefmirhosseini.com> (http://arefmirhosseini.com)
 */

'use strict'

const path = require('path'),
    cmdArgs = process.argv,
    validArgsPerfixesRegExp = new RegExp('^(\-\-.+|\-.{1})', 'g'),
    args = {},
    argKeys = [];

cmdArgs.forEach((arg, idx) => {
    if (path.parse(arg).dir) return
        //get argument title
    let isTitle = arg.match(validArgsPerfixesRegExp)
    if (isTitle) {
        let newArg = {
            arg: isTitle[0].replace(/^(\-)/g, '').replace(/^(\-)/g, ''),
            val: cmdArgs[idx + 1] && !cmdArgs[idx + 1].match(validArgsPerfixesRegExp) ? cmdArgs[idx + 1] : null
        }
        if (newArg.arg && argKeys.indexOf(newArg.arg) < 0) argKeys.push(newArg.arg); 
        if (newArg.val) args[newArg.arg] = newArg.val
    }
})

let validFlags = [];

module.exports = {
    validFlags: (args) => {
        let argsType = Object.prototype.toString.call(args).match(/\ [A-Z]{1}[a-z]+/g)[0].trim().toLowerCase()
        if (['array', 'string'].indexOf(argsType) > -1) {
            if (argsType === 'string') args = [args]
            validFlags = args
        }
    },
    isset: (arg) => {
        return (arg && argKeys.indexOf(arg) > -1);
    },
    getAll: () => {
        for (let arg in args) {
            if (validFlags.length && validFlags.indexOf(arg) < 0) {
                delete args[arg]
            }
        }
        return Object.keys(args).length ? args : null;
    },
    get: (arg) => {
        if (arg) {
            if (validFlags.length)
                return validFlags.indexOf(arg) > -1 ? (args[arg] || null) : null
            else
                return args[arg] || null
        } else {
            for (let arg in args) {
                if (validFlags.length && validFlags.indexOf(arg) < 0) {
                    delete args[arg]
                }
            }
            return Object.keys(args).length ? args : null;
        }
    },
    assign: (obj) => {
        let objType = Object.prototype.toString.call(obj).match(/\ [A-Z]{1}[a-z]+/g)[0].trim().toLowerCase()
        if (objType === 'object' && Object.keys(obj).length > 0) {
            for (let key in obj) {
                if (validFlags.length) {
                    if (validFlags.indexOf(key) > -1 || validFlags.indexOf(obj[key]) > -1) {
                        if (args[key]) {
                            args[obj[key]] = args[key];
                            delete args[key];
                        }
                    }
                } else {
                    if (args[key]) {
                        args[obj[key]] = args[key];
                        delete args[key];
                    }
                }
            }
        }
    }
}

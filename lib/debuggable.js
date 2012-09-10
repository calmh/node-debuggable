"use strict";

require('callsite');
var events = require('events');
var util = require('util');
var path = require('path');

function debuggable(obj) {
    var debug = new events.EventEmitter();

    obj.dlog = function dlog(message, metadata) {
        if (!message) {
            return;
        }

        var prefix = path.basename(__stack[1].getFileName()) + '#' + __stack[1].getLineNumber();
        
        var name = __stack[1].getMethodName() || __stack[1].getFunctionName();
        if (name) {
            prefix = prefix + '(' + name + ')';
        }
        prefix += ' ';

        message = prefix + message;
        if (metadata) {
            message = message + ' ' + JSON.stringify(metadata);
        }

        debug.emit('data', message);
    };

    obj.dlisten = function dlisten(fun) {
        debug.on('data', fun);
    };

    obj.dforward = function dforward(other) {
        if (other.dlisten) {
            other.dlisten(debug.emit.bind(debug, 'data'));
        }
    };
}

module.exports = exports = debuggable;


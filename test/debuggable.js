"use strict";

var should = require('should');

var debuggable = require('../lib/debuggable');

describe('The emitter', function () {
    it('should emit an event', function (done) {
        var obj = Object.create(null);
        debuggable(obj);

        obj.dlisten(function (data) {
            data.should.eql('debuggable.js#17 foo {"bar":"baz"}');
            done();
        });

        obj.dlog('foo', {bar: 'baz'}); // line 17
    });

    it('should ignore empty messages', function (done) {
        var obj = Object.create(null);
        debuggable(obj);

        obj.dlisten(function (data) {
            data.should.eql('debuggable.js#31 foo {"bar":"baz"}');
            done();
        });

        obj.dlog();
        obj.dlog('', {bar: 'baz'});
        obj.dlog('foo', {bar: 'baz'}); // line 31
    });

    it('should be pipeable', function (done) {
        var obj1 = Object.create(null);
        debuggable(obj1);

        var obj2 = Object.create(null);
        debuggable(obj2);

        obj1.dlisten(function (data) {
            data.should.eql('debuggable.js#48 foo {"bar":"baz"}');
            done();
        });

        obj1.dforward(obj2);

        obj2.dlog('foo', {bar: 'baz'}); // line 48
    });

    it('should be even if the target object doesn\'t support it', function (done) {
        var obj1 = Object.create(null);
        debuggable(obj1);

        var obj2 = Object.create(null);

        obj1.dforward(obj2);
        done();
    });
});

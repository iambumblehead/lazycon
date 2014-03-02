// Filename: lazycon.spec.js  
// Timestamp: 2014.02.03-22:54:50 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var lazycon = require('../lazycon');


describe("lazycon", function () {

  it("should pass a simple test", function () {  

    var constructor1 = lazycon().defProtoFn(function () {
      return {
        arg1 : '',
        property1 : '',
        method1 : function () {
          return this.property1;
        }
      };
    }).defConstructFn(function (me, arg1) {
      me.property1 = 'thisproperty1';
      me.arg1 = arg1;
      return me;
    });

    var constructor2 = lazycon(
      constructor1
    ).defProtoFn({
      arg2 : '',
      property2 : '',
      method2 : function () {
        return this.property2;
      }
    }).defConstructFn(function (me, arg1, arg2) {
      me.property2 = 'thisproperty2';
      me.arg2 = arg2;
      return me;
    });

    var constructedobj = constructor2.getNew('arg1', 'arg2');

    expect(
      constructedobj.arg1 === 'arg1',
      constructedobj.method1() === 'thisproperty1',
      constructedobj.method2() === 'thisproperty2'
    ).toBe( true );

  });


  it("should define constructor data sequentially", function (done) {  

    var constructor1 = lazycon().defProtoFn({

    }).defConstructFn(function (me, arg1) {
      me.property1 = '1';
      return me;
    });

    var constructor2 = lazycon(
      constructor1
    ).defProtoFn({

    }).defConstructFn(function (me, arg1) {
      me.property2 = '2';
      return me;
    });

    var constructor3 = lazycon(
      constructor2
    ).defProtoFn({

    }).defConstructFn(function (me, arg1) {
      me.property3 = '3';
//      expect(me.property2).toBe( '2' );
//      expect(me.property1).toBe( '1' );
      done();

      return me;
    });

    constructor3.getNew();


  });
});


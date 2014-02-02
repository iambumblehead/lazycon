lazycon
=======
**(c)[Bumblehead][0], 2014** [MIT-license](#license)  

### Overview:

Construct prototypes and constructors in a lazy style. Chain prototypes and constructors together.

There's a lot of jargon here around constructors and 'lazy', so a use-case example is going to be more helpful here.

A Crockford-style Super Constructor (if you don't construct objects this way you may not want this script):

  ```javascript
  var myproto = {
      prop1 : 'prop1',
      meth1 : function () {
          console.log(this.prop1);
      }
  };
  
  var myconstructor = function (opts) {
      var that = Object.create(myproto);
      that.prop1 = opts.prop1;
      return that;
  };
  
  var myobj = myconstructor({ prop1 : 'myprop1' });
  
  myobj.meth1(); // myprop1
  ```

When building something big I needed two things:

 1. Lazy definition (then caching) of prototype and constructor.
    
    `lazycon` lets you define prototypes and constructor functions dynamically. Expensive definitions are deferred until needed and the result is cached.
 
 2. The ability to chain prototypes and constructors
 
    `lazycon` lets you join multiple prototype and constructor definitions to return a new constructor. Why?:

    *augmented prototype objects*. You might have a collection of 'views' scripts. Each view inherits methods from one prototype for content, container and error rendering. Other views need prototype methods unique to their function -a view managing a form or one that manages a form control.

    A simple approach defines all view properties on one prototype or uses a deep inheritance chain to build more specific prototypes ([slower property lookup][1]).

    `lazycon` creates one prototype from multiple objects with one layer of inheritence. The cached result is passed to the constructor.

    *augmented constructor methods*. An augmented prototype object needs an augmented constructor to avoid repeated property definitions in each constructor.

    `lazycon` passes the constructed object through multiple constructors. Define a prototype and a constructor in one place, then create a new constructor and use corresponding parts from a predefined constructor.


[0]: http://www.bumblehead.com                            "bumblehead"
[1]: http://jsperf.com/long-prototype-chains/3       "prototype chain"

---------------------------------------------------------
#### <a id="get-started">GET STARTED:

 1. **Build a constructor**
 
    ```javascript
    // static
    var constructor1 = lazycon().defProtoFn({
        propertya : '',
        property1 : '',
        method1 : function () {
            return this.property1;
        }
    }).defConstructFn(function (me, arg1, arg2) {
        me.propertya = 'propa';
        me.property1 = 'thisproperty1';
        me.arg1 = arg1;
        return me;
    });    
    
    // or dynamic
    var constructor1 = lazycon().defProtoFn(function () {
        return {
            propertya : '',            
            property1 : '',
            method1 : function () {
                return this.property1;
            }
        };
    }).defConstructFn(function (me, arg1) {
        me.propertya = 'propa';
        me.property1 = 'thisproperty1';
        me.arg1 = arg1;
        return me;
    });    
    ```

 2. **Build an inheriting constructor**
 
    ```javascript
    var constructor2 = lazycon(
        constructor1
    ).defProtoFn({
        arg2 : '',
        property2 : '',
        method2 : function () {
            return this.property2;
        }
    }).defConstructFn(function (me, arg1, arg2) {
       me.propertya = 'propartyb';
       me.property2 = 'thisproperty2';
       me.arg2 = arg2;
       return me;
    });
    ```
    
 3. **Use the constructor**    

    ```javascript
    var constructedobj = constructor2.getNew('arg1', 'arg2');
    console.log(constructedobj.propertya); // propertyb
    console.log(constructedobj.arg1);      // arg1
    console.log(constructedobj.method1()); // thisproperty1
    console.log(constructedobj.method2()); // thisproperty2
    ```


Other things...

**The constructor function must return the first parameter**. 

The object is constructed in an obvious way -prototype properties are mapped to an object in a first-in sequential order. Constructors are applied to the result in a first-in sequential order.

A new constructor may inherit from multiple `lazycon` constructors and will use their cached prototype definitions.

```javascript
var newconstructor = lazycon(
    constructor1,
    constructor2,
    constructor3
);
```


---------------------------------------------------------
#### <a id="install"></a>Install:

`lazycon` may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install lazycon
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/lazycon.git
 ```

---------------------------------------------------------
#### <a id="test"></a>Test:

 to run tests, use `npm test` from a shell.

 ```bash
 $ npm test
 ```

---------------------------------------------------------
#### <a id="license">License:

 ![scrounge](http://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2014 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

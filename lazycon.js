// Filename: lazycon.js
// Timestamp: 2014.02.02-14:27:05 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)

var lazycon = (typeof module === 'object' ? module : {}).exports = (function (p, proto) {

  proto = {
    proto : null,
    
    // add references to other protochain-made objects
    inheritArr : [],

    // add definitions to the prototype
    protoFn : function (proto) {
      return proto;
    },

    // override this to add definitions to the cloned prototype
    constructFn : function (that, param1, param2) {
      return that;
    },
    
    defProtoFn : function (fn) {
      this.protoFn = fn; 
      return this;
    },
    defConstructFn : function (fn) {
      this.constructFn = fn;
      return this;
    },

    cpProps : function (srcObj, destObj) {
      for (var o in srcObj) {
        if (srcObj.hasOwnProperty(o)) {
          destObj[o] = srcObj[o];
        }
      }
      return destObj;
    },

    getProtoLocal : function () {
      var that = this;

      return typeof that.protoFn === 'function' ? 
          that.protoFn({}) : that.protoFn;
    },

    getProtoCached : function (t) {
      t = this;
      return t.proto || (t.proto = t.getProto());
    },

    // construct proto once only
    getProto : function (t, p) {
      var that = this,
          proto = that.getProtoLocal(),
          protoFin = {};

      if (that.inheritArr.length) {
        that.inheritArr.map(function (inheritObj) {
          protoFin = that.cpProps(inheritObj.getProtoCached(), protoFin);
        });
        protoFin = that.cpProps(proto, protoFin);
      } else {
        // no properties to copy, use proto directly
        protoFin = proto;
      }

      return protoFin;
    },

    getConstructed : function (objnew) {
      var that = this,
          args = arguments;

      that.inheritArr.map(function (i) {
        objnew = i.getConstructed.apply(i, args);
      });

      return that.constructFn.apply(that, args);
    },

    // needs to pass constructed obj...
    getNew : function () {
      var that = this,
          proto = that.getProto(),
          objnew = Object.create(proto),
          args = Array.prototype.slice.call(arguments);

      args.unshift(objnew);
      
      return that.getConstructed.apply(that, args);
    }
  };

  p = function (inheritArr) {
    var that = Object.create(proto);

    that.proto = null;
    that.protoFn = proto.protoFn;
    that.constructFn = proto.constructFn;

    that.inheritArr = Array.prototype.slice.call(arguments);

    return that;
  };

  p.proto = proto;

  return p;

}());

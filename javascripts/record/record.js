//represents model data in memory, necessary to separate "class" methods from "instance" methods
JazzRecord.Record = new Class({
  Implements: [Options, Events],
  options: {
    model: null,
    columns: {},
    data: {}
    // onCreate: $empty,
    // onUpdate: $empty,
    // onSave: $empty,
    // onDestroy: $empty,
  },
  initialize: function(options) {
    this.id = null;
    this.setOptions(options);
    this.errors = {};
    
    // only load originalData if record has been previously saved
    if(this.options.data.id) {
      this.id = this.options.data.id;
      this.originalData = {};
    }
    //copy over column data
    $each(this.options.columns, function(colType, colName) {
      this[colName] = null;
      this[colName] = this.options.data[colName];
      if(this.originalData)
        this.originalData[colName] = this.options.data[colName];        
      if(colType === "bool") {
        var boolVal = (this[colName] ? true : false);
        if(this.originalData)
          this.originalData[colName] = boolVal;
        this[colName] = boolVal;
      }
    }, this);      

    
    $each(this.options.model.options.recordMethods, function(method, name) {
      this[name] = method;
    }, this);
    
  },
  destroy: function() {
    if(!this.id)
      throw("Unsaved record cannot be destroyed");
    else {
      this.fireEvent("destroy");
      this.options.model.destroy(this.id);
      this.id = null;
    }
  },
  getData : function() {
    var data = {};      
    $each(this.options.columns, function(colType, colName) {
      data[colName] = this[colName];
    }, this);
    return data;
  },
  revert: function() {
    $each(this.options.columns, function(colType, colName) {
      this[colName] = this.originalData[colName];
    }, this);
  },
  reload: function() {
    if(!this.id)
      throw("Unsaved record cannot be reloaded");
    else {
      var results = this.options.model.find(this.id);
      $extend(this, results);
    }
  },
  // for loading as-yet unloaded association data
  load: function(association, depth) {
    if(!depth)
      depth = 0;
    if(this[association].unloaded) {
      this[association] = this[association].loader(depth);
      if($type(this[association]) === "array")
        this[association + "OriginalRecordIDs"] = this[association].map(function(rec) {
          return rec.id;
        });
    }
    return this[association];
  },
  updateAttribute: function(name, val) {
    this[name] = val;
    this.save();
  }
});
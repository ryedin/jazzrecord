//JazzRecord Version 0.7 build 1248430782
//Copyright (c) 2009 Nick Carter <thynctank@thynctank.com>
//
//Permission is hereby granted, free of charge, to any person
//obtaining a copy of this software and associated documentation
//files (the "Software"), to deal in the Software without
//restriction, including without limitation the rights to use,
//copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the
//Software is furnished to do so, subject to the following
//conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
//OTHER DEALINGS IN THE SOFTWARE.
var JazzRecord={each:function(E,C,F){switch(JazzRecord.getType(E)){case"array":for(var B=0,A=E.length;B<A;B++){C.call(F,E[B],B)}break;case"object":for(var D in E){if(E.hasOwnProperty(D)){C.call(F,E[D],D)}}break}},isDefined:function(A){return !(typeof A==="undefined"||A===null)},getType:function(A){if(typeof A==="undefined"||A===null||(typeof A==="number"&&isNaN(A))){return false}else{if(A.constructor===Array){return"array"}else{return typeof A}}},debug:false,puts:function(A){if(JazzRecord.debug===false){return }if(typeof Titanium!=="undefined"){JazzRecord.puts=function(B){Titanium.API.debug(B)}}else{if(typeof console!=="undefined"&&console.log){JazzRecord.puts=function(B){if(JazzRecord.debug===false){return }switch(JazzRecord.getType(B)){case"object":if(console.dir){console.dir(B);break}default:console.log(B)}}}else{if(typeof air!=="undefined"){if(air.Introspector&&air.Introspector.Console){JazzRecord.puts=function(B){if(JazzRecord.debug===false){return }switch(JazzRecord.getType(B)){case"string":air.Introspector.Console.log(B);break;case"object":air.Introspector.Console.dump(B);break}}}else{JazzRecord.puts=function(B){if(JazzRecord.debug===false){return }air.trace(B)}}}else{JazzRecord.puts=function(B){}}}}JazzRecord.puts(A)},merge:function(){var F={};for(var C=0,A=arguments.length;C<A;C++){var B=arguments[C];if(JazzRecord.getType(B)!=="object"){continue}for(var G in B){var E=B[G],D=F[G];if(D&&JazzRecord.getType(E)==="object"&&JazzRecord.getType(D)==="object"){F[G]=JazzRecord.merge(D,E)}else{F[G]=E}}}return F},shallowMerge:function(C,A){for(var B in A){C[B]=A[B]}return C},setOptions:function(A,C){if(!A){A={}}if(!this.options){this.options={}}mergedOptions=JazzRecord.merge(C,A);for(var B in C){this.options[B]=mergedOptions[B]}},replaceAndClean:function(B,A){for(opt in A){B=B.replace("{"+opt+"}",A[opt])}B=B.replace(/{\w+}/g,"");return B.replace(/\s+/g," ").replace(/^\s+|\s+$/g,"")},extend:function(C,A){if(!this.options){this.options={}}this.parent=new C(A);for(var D in this.parent){this[D]=this[D]||this.parent[D]}for(var B in this.parent.options){this.options[B]=this.options[B]||this.parent.options[B]}},indexOf:function(A,E){var C=-1;if(A.indexOf){C=A.indexOf(E)}else{for(var D=0,B=A.length;D<B;D++){if(A[D]===E){C=D;break}}}return C},arrayContainsVal:function(A,B){if(JazzRecord.indexOf(A,B)>-1){return true}else{return false}},removeFromArray:function(A,C){var B=JazzRecord.indexOf(A,C);A.splice(B,1)}};JazzRecord.Hash=function(A){this.data=A||{}};JazzRecord.Hash.toQueryString=function(B){var A=[];JazzRecord.each(this.data,function(E,D){if(B){D=B+"["+D+"]"}var C;switch(JazzRecord.getType(E)){case"object":C=JazzRecord.Hash.toQueryString(E,D);break;case"array":var F={};JazzRecord.each(E,function(G,H){F[H]=G});C=JazzRecord.Hash.toQueryString(F,D);break;default:C=D+"="+encodeURIComponent(E)}if(E){A.push(C)}});return A.join("&")};JazzRecord.Hash.prototype={has:function(A){if(this.data.hasOwnProperty(A)){return true}else{return false}},set:function(A,B){this.data[A]=B},get:function(A){return this.data[A]},getLength:function(){var B=0;for(var A in this.data){if(this.data.hasOwnProperty(A)){B++}}return B},each:function(A,B){JazzRecord.each(this.data,A,B)},toQueryString:JazzRecord.Hash.toQueryString,getValues:function(){var A=[];this.each(function(B){A.push(B)});return A},getKeys:function(){var A=[];this.each(function(C,B){A.push(B)});return A}};JazzRecord.models=new JazzRecord.Hash();JazzRecord.depth=1;JazzRecord.run=function(C,B,A){return JazzRecord.adapter.run(C,B,A)};JazzRecord.count=function(C,B,A){return JazzRecord.adapter.count(C,B,A)};JazzRecord.save=function(C,B,A){return JazzRecord.adapter.save(C,B,A)};JazzRecord.runTransaction=function(A,C){JazzRecord.run("BEGIN");try{A.apply(C||this)}catch(B){JazzRecord.run("ROLLBACK");throw (B)}JazzRecord.run("END")};JazzRecord.Adapter=function(){this.run=this.count=this.save=function(A){JazzRecord.puts(A)}};JazzRecord.AirAdapter=function(A){JazzRecord.setOptions.call(this,A,{dbFile:"jazz_record.db"});JazzRecord.extend.call(this,JazzRecord.Adapter);this.connection=new air.SQLConnection();this.dbFile=air.File.applicationDirectory.resolvePath(this.options.dbFile);this.connection.open(this.dbFile,air.SQLMode.CREATE);this.statement=new air.SQLStatement();this.statement.sqlConnection=this.connection};JazzRecord.AirAdapter.prototype={run:function(B){this.parent.run(B);this.statement.text=B;this.statement.execute();var A=this.statement.getResult();return A.data},count:function(A){this.parent.count(A);A=A.toUpperCase();return this.run(A)[0]["COUNT(*)"]},save:function(A){this.parent.save(A);this.statement.text=A;this.statement.execute();return this.statement.getResult().lastInsertRowID}};JazzRecord.GearsAdapter=function(A){JazzRecord.setOptions.call(this,A,{dbFile:"jazz_record.db"});JazzRecord.extend.call(this,JazzRecord.Adapter);this.db=google.gears.factory.create("beta.database");this.db.open(this.options.dbFile);this.result=null};JazzRecord.GearsAdapter.prototype={run:function(D){this.parent.run(D);this.result=this.db.execute(D);var C=[];if(D.indexOf("CREATE")>-1){return C}while(this.result.isValidRow()){var F={};for(var B=0,A=this.result.fieldCount();B<A;B++){var E=this.result.fieldName(B);F[E]=this.result.field(B)}C.push(F);this.result.next()}this.result.close();return C},count:function(B){this.parent.count(B);this.result=this.db.execute(B);var A=this.result.field(0);this.result.close();return A},save:function(A){this.parent.save(A);this.db.execute(A);return this.db.lastInsertRowId}};JazzRecord.TitaniumAdapter=function(A){JazzRecord.setOptions.call(this,A,{dbFile:"jazz_record.db"});JazzRecord.extend.call(this,JazzRecord.Adapter);this.db=Titanium.Database.open(this.options.dbFile);this.result=null};JazzRecord.TitaniumAdapter.prototype=JazzRecord.GearsAdapter.prototype;JazzRecord.HTML5Adapter=function(A){JazzRecord.setOptions.call(this,A,{dbFile:"jazz_record.db"});JazzRecord.extend.call(this,JazzRecord.Adapter,A);this.db=openDatabase(this.options.dbFile)};JazzRecord.HTML5Adapter.prototype={run:function(B,C,A){this.parent.run(B);this.db.transaction(function(D){D.executeSql(B,[],function(E,H){var I=[];for(var G=0,F=H.rows.length;G<F;G++){I.push(H.rows.item(G))}if(C){C(I)}},function(E,F){if(A){A(F.message)}else{JazzRecord.puts("There was an error: "+F.message)}})})},count:function(B,C,A){this.parent.count(B);this.db.transaction(function(D){D.executeSql(B,[],function(E,F){if(C){C(F.rows.item(0)["COUNT(*)"])}},function(E,F){if(A){A(F.message)}else{JazzRecord.puts("There was an error: "+F.message)}})})},save:function(B,C,A){this.parent.save(B);this.db.transaction(function(D){D.executeSql(B,[],function(E,F){if(C){C(F.insertId)}},function(E,F){if(A){A(F.message)}else{JazzRecord.puts("There was an error: "+F.message)}})})}};JazzRecord.Record=function(A){var B={model:null,columns:{},data:{},onCreate:function(){},onUpdate:function(){},onSave:function(){},onDestroy:function(){}};this.id=null;JazzRecord.setOptions.call(this,A,B);this.errors={};this.onCreate=this.options.onCreate;this.onUpdate=this.options.onUpdate;this.onSave=this.options.onSave;this.onDestroy=this.options.onDestroy;if(this.options.data.id){this.id=this.options.data.id;this.originalData={};this.isNew=function(){return false}}else{this.isNew=function(){return true}}JazzRecord.each(this.options.columns,function(D,C){this[C]=null;this[C]=this.options.data[C];if(this.originalData){this.originalData[C]=this.options.data[C]}if(D==="bool"){var E=(this[C]?true:false);if(this.originalData){this.originalData[C]=E}this[C]=E}},this);JazzRecord.each(this.options.model.options.recordMethods,function(D,C){this[C]=D},this)};JazzRecord.Record.prototype={destroy:function(){if(!this.id){throw ("Unsaved record cannot be destroyed")}else{this.options.model.destroy(this.id);JazzRecord.each(this.options.model.options.hasMany,function(B,A){this.load(A);JazzRecord.each(this[A],function(C){C.updateAttribute(this.options.model.options.foreignKey,null)},this);this[A+"OriginalRecordIDs"]=[]},this);JazzRecord.each(this.options.model.options.hasAndBelongsToMany,function(C,B){var A=[this.options.model.table,C].sort().join("_");sql="DELETE FROM "+A+" WHERE "+this.options.model.options.foreignKey+"="+this.id+";";JazzRecord.adapter.run(sql)},this);JazzRecord.each(this.options.model.options.hasOne,function(B,A){this.load(A);if(!this[A]){return }this[A].updateAttribute(this.options.model.options.foreignKey,null);this[A+"OriginalRecordID"]=null},this);this.onDestroy();this.id=null;this.originalData=null;this.isNew=function(){return true}}},getData:function(){var A={};JazzRecord.each(this.options.columns,function(C,B){A[B]=this[B]},this);return A},revert:function(){JazzRecord.each(this.options.columns,function(B,A){this[A]=this.originalData[A]},this);JazzRecord.each(this.options.model.options.belongsTo,function(D,C){var B=JazzRecord.models.get(D);var A=B.options.foreignKey;if(this[C]&&!this[C].unloaded&&this[C].id!==this[A]){this[C]=B.find({id:this[A],depth:0})}},this)},reload:function(){if(!this.id){throw ("Unsaved record cannot be reloaded")}else{var A=this.options.model.find(this.id);JazzRecord.shallowMerge(this,A)}},load:function(A,C){if(!C){C=0}if(this[A]&&this[A].unloaded){this[A]=this[A].loader(C);if(JazzRecord.getType(this[A])==="array"){var B=[];JazzRecord.each(this[A],function(D){B.push(D.id)});this[A+"OriginalRecordIDs"]=B}else{if(this[A]&&this[A].id){this[A+"OriginalRecordID"]=this[A].id}}}return this[A]},updateAttribute:function(A,B){this[A]=B;this.save()}};JazzRecord.Record.prototype.isChanged=function(){if(this.isNew()){return false}JazzRecord.each(this.options.model.options.belongsTo,function(F,E){var D=JazzRecord.models.get(F);var C=D.options.foreignKey;if(!this.originalData){return false}if(this[E]){if(this[E].unloaded){if(this[C]!==this.originalData[C]){return true}}else{if(this[E].isNew()){this[E].save()}if(this[E].id!==this.originalData[C]){this[C]=this[E].id;return true}if(this[C]!==this.originalData[C]){return true}}}else{if(this.originalData[C]){this[C]=null;return true}}},this);var B=new JazzRecord.Hash(this.getData());var A=new JazzRecord.Hash(this.originalData);if(this.id&&B.toQueryString()===A.toQueryString()){return false}else{return true}};JazzRecord.Record.prototype.save=function(){var A=this.options.model.options.foreignKey;if(!this.originalData){JazzRecord.each(this.options.model.options.belongsTo,function(F,E){var C=JazzRecord.models.get(F);var D=C.options.foreignKey;if(this[E]){if(this[E].unloaded){this.load(E)}}if(this[E]&&this[E].id){this[D]=this[E].id}},this)}JazzRecord.each(this.options.model.options.hasOne,function(F,E){if(this[E]){if(this[E].unloaded){this.load(E);if(!this[E]){return }}if(!JazzRecord.isDefined(this[E+"OriginalRecordID"])){this[E].updateAttribute(A,this.id)}else{if(this[E+"OriginalRecordID"]!==this[E].id){var D=JazzRecord.models.get(F);var C=D.first({id:this[E+"OriginalRecordID"],depth:0});C.updateAttribute(A,null)}}this[E].updateAttribute(A,this.id);this[E+"OriginalRecordID"]=this[E].id}else{if(this[E+"OriginalRecordID"]){var D=JazzRecord.models.get(F);var C=D.first({id:this[E+"OriginalRecordID"],depth:0});C.updateAttribute(A,null)}}},this);JazzRecord.each(this.options.model.options.hasMany,function(G,F){if(this[F]){if(this[F].length){var D=JazzRecord.models.get(G);var C=this[F+"OriginalRecordIDs"];JazzRecord.each(this[F],function(H,I){if(H){H[A]=this.id;H.save();if(JazzRecord.arrayContainsVal(C,H.id)){JazzRecord.removeFromArray(C,H.id)}}},this);JazzRecord.each(this[F],function(H,I){if(!JazzRecord.isDefined(H)){this[F].splice(I,1)}},this);JazzRecord.each(C,function(I){var H=D.find(I);if(H){H.updateAttribute(A,null)}});var E=[];JazzRecord.each(this[F],function(H){if(H){E.push(H.id)}});this[F+"OriginalRecordIDs"]=E}}else{this[F]=[];this[F+"OriginalRecordIDs"]=[]}},this);JazzRecord.each(this.options.model.options.hasAndBelongsToMany,function(I,H){if(this[H]){if(this[H].length){var C=[this.options.model.table,I].sort().join("_");var G=JazzRecord.models.get(I).options.foreignKey;var F="";var D=this[H+"OriginalRecordIDs"];JazzRecord.each(this[H],function(J){J.save();if(JazzRecord.arrayContainsVal(D,J.id)){JazzRecord.removeFromArray(D,J.id)}else{F="INSERT INTO "+C+" ("+A+", "+G+") VALUES("+this.id+", "+J.id+")";JazzRecord.adapter.run(F)}},this);JazzRecord.each(D,function(J){F="DELETE FROM "+C+" WHERE "+A+"="+this.id+" AND "+G+"="+J+";";JazzRecord.adapter.run(F)},this);var E=[];JazzRecord.each(this[H],function(J){E.push(J.id)});this[H+"OriginalRecordIDs"]=E}}else{this[H]=[];this[H+"OriginalRecordIDs"]=[]}},this);this.errors={};if(this.isNew()){if(this.isValid("create")){this.onCreate()}}else{if(this.isValid("update")&&this.isChanged()){this.onUpdate()}}if(this.isValid("save")){var B=this.getData();if(this.isChanged()){this.onSave();B.originalData=this.originalData?this.originalData:{id:this.id};this.options.model.save(B);this.reload()}else{if(this.isNew()){this.onSave();this.id=this.options.model.save(B)}}this.originalData={};JazzRecord.each(this.options.model.options.columns,function(D,C){this.originalData[C]=this[C]},this);this.isNew=function(){return false};return true}return false};JazzRecord.Model=function(A){var B={table:"",columns:{},foreignKey:"",order:"",hasOne:{},belongsTo:{},hasMany:{},hasAndBelongsToMany:{},events:{},modelMethods:{},recordMethods:{},validate:{atCreate:function(){},atUpdate:function(){},atSave:function(){}}};JazzRecord.setOptions.call(this,A,B);this.table=this.options.table;this.sql="";JazzRecord.each(this.options.modelMethods,function(D,C){this[C]=D},this);if(!JazzRecord.models.has(this.table)){JazzRecord.models.set(this.table,this)}};JazzRecord.Model.prototype={newRecord:function(C){if(!C){C={}}var D={};JazzRecord.each(this.options.columns,function(F,E){D[E]=C[E]||null});var B={model:this,columns:this.options.columns,data:D};JazzRecord.each(this.options.events,function(F,E){B[E]=F});var A=new JazzRecord.Record(B);A.isNew=function(){return true};return A},create:function(B){var A=this.newRecord(B);A.save();return A}};JazzRecord.AssociationLoader=function(A){this.loader=A;this.unloaded=true};JazzRecord.AssociationLoader.prototype={toString:function(){return"Not yet loaded"}};JazzRecord.columnNames=function(B){var A="(";JazzRecord.each(B,function(D,C){A+=C+", "});A=A.substr(0,A.length-2);return A+")"};JazzRecord.columnValues=function(C,B){var A=" VALUES(";JazzRecord.each(C,function(E,D){A+=JazzRecord.typeValue(C,D,B[D])+", "},this);A=A.substr(0,A.length-2);return A+")"};JazzRecord.typeValue=function(B,A,C){if(C===null){return"NULL"}else{switch(B[A]){case"string":case"text":if(JazzRecord.getType(C)==="string"){C=C.replace(/'/g,"''")}return"'"+C+"'";case"int":C=parseInt(C,10);return JazzRecord.getType(C)==="number"?C:0;case"number":case"float":C=parseFloat(C);return JazzRecord.getType(C)==="number"?C:0;case"bool":if(C){return 1}else{return 0}}}};JazzRecord.Record.prototype.validatesAtCreate=function(){this.options.model.options.validate.atCreate.apply(this)};JazzRecord.Record.prototype.validatesAtUpdate=function(){this.options.model.options.validate.atUpdate.apply(this)};JazzRecord.Record.prototype.validatesAtSave=function(){this.options.model.options.validate.atSave.apply(this)};JazzRecord.Record.prototype.isValid=function(A){switch(A){case"create":this.validatesAtCreate();break;case"update":this.validatesAtUpdate();break;case"save":this.validatesAtSave();break;default:this.errors={};if(this.id){this.validatesAtUpdate();this.validatesAtSave()}else{this.validatesAtCreate();this.validatesAtSave()}}var B=0;for(var C in this.errors){B++}if(B===0){return true}else{return false}};JazzRecord.Record.prototype.pushError=function(A,B){if(!this.errors[A]){this.errors[A]=[]}this.errors[A].push(B)};JazzRecord.Record.prototype.validatesAcceptanceOf=function(A,B){var C=this[A];if(C&&JazzRecord.isDefined(C)&&JazzRecord.getType(C)==="boolean"){return }B=JazzRecord.isDefined(B)?B:(A+" must be accepted");this.pushError(A,B)};JazzRecord.Record.prototype.validatesConfirmationOf=function(A,B){var C=this[A];var D=this[A+"_confirmation"];if(C!==D||!JazzRecord.isDefined(D)||D==""){B=JazzRecord.isDefined(B)?B:A+" doesn't match confirmation";this.pushError(A,B)}};JazzRecord.Record.prototype.validatesExclusionOf=function(A,C,B){if(this[A]&&JazzRecord.indexOf(C,this[A])>-1){B=JazzRecord.isDefined(B)?B:(A+" is reserved");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesInclusionOf=function(A,C,B){if(this[A]&&!(JazzRecord.indexOf(C,this[A])>-1)){B=JazzRecord.isDefined(B)?B:(A+" is not included in the list");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesFormatOf=function(A,C,B){val=this[A];if(val&&!val.match(C)){B=JazzRecord.isDefined(B)?B:(A+" does not match expected format: "+C.toString());this.pushError(A,B)}};JazzRecord.Record.prototype.validatesLengthOf=function(C,B,D){var A={minimum:0,maximum:Infinity,allowEmpty:true,tooShort:C+" is too short",tooLong:C+" is too long",wrongLength:C+" is not the correct length"};B=JazzRecord.shallowMerge(A,B);if(!JazzRecord.isDefined(this[C])||this[C]&&this[C].length&&this[C].length>=B.minimum&&this[C].length<=B.maximum){if(!JazzRecord.isDefined(B.is)||(B.is&&this[C].length===B.is)){return }}if(this[C].length<B.minimum){this.pushError(C,B.tooShort)}if(this[C].length>B.maximum){this.pushError(C,B.tooLong)}if(B.is&&this[C].length!==B.is){this.pushError(C,B.wrongLength)}};JazzRecord.Record.prototype.validatesNumericalityOf=function(A,B){var C=this[A];if(C&&JazzRecord.isDefined(C)&&JazzRecord.getType(C)!=="number"){B=JazzRecord.isDefined(B)?B:(A+" is not a number");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesPresenceOf=function(A,B){var C=this[A];if(!JazzRecord.isDefined(C)||C===""){B=JazzRecord.isDefined(B)?B:(A+" can't be empty, null or blank");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesUniquenessOf=function(A,B){var D=this[A];var C=this.options.model.findBy(A,D,0);if(C&&C.id!=this.id){B=JazzRecord.isDefined(B)?B:(A+" is not unique");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesAssociated=function(C,B){if(!JazzRecord.isDefined(this[C])||(this[C]&&this[C].unloaded)){return }var A=[];if(JazzRecord.getType(this[C])==="array"){A=this[C]}else{A=[this[C]]}JazzRecord.each(A,function(D){if(D&&!D.isValid()){B=JazzRecord.isDefined(B)?B:C+" is not valid";this.pushError(C,B);return }},this)};JazzRecord.Record.prototype.validatesIsString=function(A,B){var C=this[A];if(JazzRecord.getType(C)&&JazzRecord.getType(C)!=="string"){B=JazzRecord.isDefined(B)?B:(A+" is not a string");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesIsBool=function(A,B){var C=this[A];if(JazzRecord.getType(C)&&JazzRecord.getType(C)!=="boolean"){B=JazzRecord.isDefined(B)?B:(A+" is not a bool");this.pushError(A,B)}};JazzRecord.Record.prototype.validatesIsInt=function(A,B){var C=this[A];if(JazzRecord.getType(C)){if(JazzRecord.getType(C)!=="number"||parseInt(C,10)!==C){B=JazzRecord.isDefined(B)?B:(A+" is not an integer");this.pushError(A,B)}}};JazzRecord.Record.prototype.validatesIsFloat=function(A,B){var C=this[A];if(JazzRecord.getType(C)){if(JazzRecord.getType(C)!=="number"||parseFloat(C)!==C){B=JazzRecord.isDefined(B)?B:(A+" is not an float");this.pushError(A,B)}}};JazzRecord.Model.prototype.query=function(C){if(!JazzRecord.isDefined(C)){C={}}if(!JazzRecord.isDefined(C.depth)){C.depth=JazzRecord.depth}var E=C.depth-1;if(E<0){E=0}var A=this.sql;var D=JazzRecord.adapter.run(A);if(!D||D.length===0){if(this.sql.indexOf("LIMIT")>-1){return null}else{return[]}}var B=[];JazzRecord.each(D,function(H){var G={model:this,columns:this.options.columns,data:H};JazzRecord.each(this.options.events,function(J,I){G[I]=J});var F=new JazzRecord.Record(G);JazzRecord.each(this.options.hasOne,function(M,L){var K=JazzRecord.models.get(M);var I=this.options.foreignKey;var J=function(N){return K.findBy(I,H.id,N)};if(C.depth<1){F[L]=new JazzRecord.AssociationLoader(J)}else{F[L]=J(E);if(F[L]){F[L+"OriginalRecordID"]=F[L].id}}},this);JazzRecord.each(this.options.hasMany,function(N,M){var J=JazzRecord.models.get(N);var I=this.options.foreignKey;var L=function(O){return J.findAllBy(I,H.id,O)};if(C.depth<1){F[M]=new JazzRecord.AssociationLoader(L)}else{F[M]=L(E);var K=[];JazzRecord.each(F[M],function(O){K.push(O.id)});F[M+"OriginalRecordIDs"]=K}},this);JazzRecord.each(this.options.belongsTo,function(L,K){var J=JazzRecord.models.get(L);var I=J.options.foreignKey;if(F[I]){var M=function(N){return J.first({id:F[I],depth:N})};if(C.depth<1){F[K]=new JazzRecord.AssociationLoader(M)}else{F[K]=M(E)}}else{F[K]=null}});JazzRecord.each(this.options.hasAndBelongsToMany,function(P,O){var K=this;var I=[this.table,P].sort().toString().replace(",","_");var L=JazzRecord.models.get(P);var J=L.options.foreignKey;if(J){var N=function(T){var S="SELECT "+P+".* FROM "+I+" INNER JOIN "+P+" ON "+I+"."+J+"="+P+".id WHERE "+I+"."+K.options.foreignKey+"="+F.id;var Q=JazzRecord.adapter.run(S);var R=[];JazzRecord.each(Q,function(W){var U={model:L,columns:L.options.columns,data:W};JazzRecord.each(L.options.events,function(Y,X){U[X]=Y});var V=new JazzRecord.Record(U);R.push(V)});return R};if(C.depth<1){F[O]=new JazzRecord.AssociationLoader(N)}else{F[O]=N(E);var M=[];JazzRecord.each(F[O],function(Q){M.push(Q.id)});F[O+"OriginalRecordIDs"]=M}}},this);B.push(F)},this);if(A.indexOf("LIMIT 1")>-1){return B[0]}else{return B}};JazzRecord.save=function(D,E,B){this.sql="{saveMode} {table} {set} {data} {conditions}";var A={saveMode:"INSERT INTO",table:D,data:JazzRecord.columnNames(E)+JazzRecord.columnValues(E,B)};var C={};if(B.originalData){C.saveMode="UPDATE";C.set="SET";C.conditions="WHERE id="+B.originalData.id;C.data="";JazzRecord.each(E,function(G,F){C.data+=F+"="+JazzRecord.typeValue(E,F,B[F])+", "},this);C.data=C.data.slice(0,-2)}C=JazzRecord.shallowMerge(A,C);this.sql=JazzRecord.replaceAndClean(this.sql,C);return JazzRecord.adapter.save(this.sql)};JazzRecord.Model.prototype.save=function(A){return JazzRecord.save(this.table,this.options.columns,A)};JazzRecord.Model.prototype.destroy=function(B){var A="";if(JazzRecord.getType(B)==="number"){A="WHERE id="+B}else{if(JazzRecord.getType(B)==="array"){A="WHERE id IN ("+B+")"}}this.sql="DELETE FROM "+this.table+" "+A;this.query()};JazzRecord.Model.prototype.destroyAll=function(){this.sql="DELETE FROM "+this.table;this.query()};JazzRecord.Model.prototype.dropTable=function(){this.sql="DROP TABLE IF EXISTS "+this.table;this.query()};JazzRecord.Model.prototype.find=function(A){if(!JazzRecord.isDefined(A)){throw ("Missing ID or Options")}else{switch(JazzRecord.getType(A)){case"array":A={id:A};break;case"number":A={id:A,limit:1};break;case"object":break;default:throw ("Type Error. Model.find() expects Number, Array or Object")}}return this.select(A)};JazzRecord.Model.prototype.findBy=function(B,A,C){if(!this.options.columns[B]){throw ("Column "+B+" Does Not Exist in Table "+this.table)}else{return this.select({conditions:B+"="+JazzRecord.typeValue(this.options.columns,B,A),limit:1,depth:C})}};JazzRecord.Model.prototype.findAllBy=function(B,A,C){if(!this.options.columns[B]){throw ("Column "+B+" Does Not Exist in Table "+this.table)}else{return this.select({conditions:B+"="+JazzRecord.typeValue(this.options.columns,B,A),depth:C})}};JazzRecord.Model.prototype.all=function(A){return this.select(A)};JazzRecord.Model.prototype.first=function(A){A=JazzRecord.shallowMerge({limit:1},A);return this.select(A)};JazzRecord.Model.prototype.last=function(A){A=JazzRecord.shallowMerge({limit:1,order:"id"},A);A.order+=" DESC";return this.select(A)};JazzRecord.Model.prototype.count=function(A){this.sql="SELECT COUNT(*) FROM "+this.table;if(A){this.sql+=" WHERE "+A}return JazzRecord.adapter.count(this.sql)};JazzRecord.Model.prototype.select=function(B){if(!B){B={}}this.sql="SELECT {select} FROM "+this.table+" {conditions} {group} {order} {limit} {offset}";var A={select:"*"};B=JazzRecord.shallowMerge(A,B);if(B.select.indexOf("id")===-1&&B.select.indexOf("*")===-1){B.select="id, "+B.select}if(B.order||this.options.order){if(!B.order&&this.options.order){B.order=this.options.order}B.order="ORDER BY "+B.order}if(JazzRecord.getType(B.limit)=="number"){B.limit="LIMIT "+B.limit}if(JazzRecord.getType(B.offset)=="number"){B.offset="OFFSET "+B.offset}if(B.group){B.group="GROUP BY "+B.group}if(B.conditions){B.conditions="WHERE "+B.conditions;if(B.id){B.conditions+=" AND id="+B.id}}else{if(B.id){if(JazzRecord.getType(B.id)=="number"){B.conditions="WHERE id="+B.id;B.limit="LIMIT 1"}else{if(JazzRecord.getType(B.id)=="array"){B.conditions="WHERE id IN ("+B.id+")"}}}}this.sql=JazzRecord.replaceAndClean(this.sql,B);return this.query(B)};JazzRecord.schema=new JazzRecord.Model({table:"schema_definitions",columns:{id:"number",table_name:"text",column_names:"text",column_types:"text"}});JazzRecord.setupSchema=function(A){JazzRecord.createTable("schema_migrations",{version:"text"});if(JazzRecord.count("SELECT COUNT(*) FROM schema_migrations")===0){var B="INSERT INTO schema_migrations (version) VALUES(0)";JazzRecord.run(B)}if(A&&JazzRecord.count("SELECT COUNT(*) FROM schema_migrations")===1){var B="UPDATE schema_migrations set version = 0";JazzRecord.run(B)}JazzRecord.createTable("schema_definitions",{id:"number",table_name:"text",column_names:"text",column_types:"text"})};JazzRecord.writeSchema=function(A,G){if(A==="schema_definitions"||A==="schema_migrations"){return }var H="";var E=new JazzRecord.Hash(G);var F=E.getKeys().join();var C=E.getValues().join();var D=JazzRecord.schema.findBy("table_name",A);if(D){D.column_names=F;D.column_types=C;D.save()}else{JazzRecord.schema.create({table_name:A,column_names:F,column_types:C})}var B=JazzRecord.models.get(A);if(B){B.options.columns={};JazzRecord.each(G,function(J,I){B.options.columns[I]=J})}};JazzRecord.readSchema=function(B){if(B==="schema_definitions"||B==="schema_migrations"){return }var C=JazzRecord.schema.findBy("table_name",B);var A=C.column_names.split(",");var E=C.column_types.split(",");var D={};JazzRecord.each(A,function(F,G){D[F]=E[G]});return D};JazzRecord.currentSchemaVersion=function(){var A="SELECT version FROM schema_migrations LIMIT 1";return parseInt(JazzRecord.run(A)[0].version,10)};JazzRecord.updateSchemaVersion=function(A){var B="UPDATE schema_migrations SET version = "+A;JazzRecord.run(B)};JazzRecord.modifyColumn=function(B,A,C){if(!C){throw ("MIGRATION_EXCEPTION: Not a valid column modification")}var E=JazzRecord.readSchema(B);var D={};JazzRecord.each(E,function(G,F){switch(C.modification){case"remove":if(F!==A){D[F]=G}break;case"rename":if(F!==A){D[F]=G}else{D[C.newName]=G}break;case"change":if(F!==A){D[F]=G}else{D[F]=C.newType}break;default:throw ("MIGRATION_EXCEPTION: Not a valid column modification")}});JazzRecord.runTransaction(function(){var F=JazzRecord.run("SELECT * FROM "+B);JazzRecord.dropTable(B);JazzRecord.createTable(B,D);JazzRecord.each(F,function(G){switch(C.modification){case"remove":delete G[A];JazzRecord.save(B,D,G);break;case"rename":G[C.newName]=G[A];delete G[A];JazzRecord.save(B,D,G);break;case"change":JazzRecord.save(B,D,G);break;default:throw ("MIGRATION_EXCEPTION: Not a valid column modification")}})})};JazzRecord.createTable=function(A,B){if(!(JazzRecord.isDefined(A)&&JazzRecord.isDefined(B))){return }var C="CREATE TABLE IF NOT EXISTS "+A;if(B){C+="(";JazzRecord.each(B,function(E,D){if(D==="id"){C+="id INTEGER PRIMARY KEY AUTOINCREMENT, "}else{C+=(D+" "+E.toString().toUpperCase()+", ")}});C=C.substr(0,C.length-2);C+=")";JazzRecord.run(C)}JazzRecord.writeSchema(A,B)};JazzRecord.dropTable=function(A){var C="DROP TABLE "+A;JazzRecord.run(C);var B=JazzRecord.schema.findBy("table_name",A);B.destroy()};JazzRecord.renameTable=function(B,A){var D="ALTER TABLE "+B+" RENAME TO "+A;JazzRecord.run(D);var C=JazzRecord.schema.findBy("table_name",B);C.updateAttribute("table_name",A)};JazzRecord.addColumn=function(C,B,A){var E="ALTER TABLE "+C+" ADD COLUMN "+B+" "+A.toUpperCase();JazzRecord.run(E);var D=JazzRecord.readSchema(C);D[B]=A;JazzRecord.writeSchema(C,D)};JazzRecord.removeColumn=function(B,A){JazzRecord.modifyColumn(B,A,{modification:"remove"})};JazzRecord.renameColumn=function(B,A,D){var C={modification:"rename",newName:D};JazzRecord.modifyColumn(B,A,C)};JazzRecord.changeColumn=function(B,A,D){var C={modification:"change",newType:D};JazzRecord.modifyColumn(B,A,C)};JazzRecord.migrate=function(C){JazzRecord.setupSchema();if(JazzRecord.getType(C)==="object"){if(C.refresh){this.models.each(function(F){F.dropTable();JazzRecord.each(F.options.hasAndBelongsToMany,function(I){var G=[F.table,I].sort().toString().replace(",","_");var H="DROP TABLE IF EXISTS "+G;JazzRecord.run(H)})});JazzRecord.setupSchema(true)}}var E={};if(JazzRecord.migrations){E=JazzRecord.migrations}if(E[1]&&JazzRecord.getType(E[1])==="object"){var B=JazzRecord.currentSchemaVersion();var A=Infinity;if(JazzRecord.getType(C)==="object"&&JazzRecord.isDefined(C.number)){A=C.number}else{if(JazzRecord.getType(C)==="number"){A=C}}var D=B;do{if(D===A){JazzRecord.puts("Up to date");return }else{if(D<A){D+=1;if(JazzRecord.isDefined(E[D])){E[D].up()}else{break}}else{E[D].down();D-=1}}JazzRecord.updateSchemaVersion(D)}while(E[D])}else{JazzRecord.models.each(function(F){var G="CREATE TABLE IF NOT EXISTS "+F.table+"(id INTEGER PRIMARY KEY AUTOINCREMENT";JazzRecord.each(F.options.columns,function(I,H){if(H!=="id"){G+=(", "+H+" "+I.toUpperCase())}});G+=")";JazzRecord.run(G);JazzRecord.each(F.options.hasAndBelongsToMany,function(N,I){var H=[F.table,N].sort().toString().replace(",","_");var J=F.options.foreignKey;var K=JazzRecord.models.get(N).options.foreignKey;var L=[J,K].sort();var M="CREATE TABLE IF NOT EXISTS "+H+"("+L[0]+" INTEGER, "+L[1]+" INTEGER)";JazzRecord.run(M)});F.options.columns.id="int"})}if(C&&C.refresh&&JazzRecord.fixtures){JazzRecord.loadFixtures()}};JazzRecord.loadFixtures=function(){var A=JazzRecord.fixtures;JazzRecord.each(A.tables,function(C,B){JazzRecord.each(C,function(D){JazzRecord.models.get(B).create(D)})});if(!A.mappingTables){return }JazzRecord.each(A.mappingTables,function(C,B){JazzRecord.each(C,function(F){var D=new JazzRecord.Hash(F);var E="INSERT INTO "+B+" ("+D.getKeys().toString()+") VALUES("+D.getValues().toString()+")";JazzRecord.run(E)})})};
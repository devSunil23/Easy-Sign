const mongoose = require('mongoose');

// const templateSchema = mongoose.Schema;
// let Template = new templateSchema ({
// 	templateName : String,
// 	templateMessage : String,
// 	roles : Array,
// 	fileName : String,
// 	fileId : String,
// 	size:Number, 
// 	mimetype : String, 
// 	userId : String, 
// 	userName : String,
// 	createApiTemplate : Boolean,
// 	createdAt : { type : Date, default: Date.now }
// });

// module.exports = mongoose.model('Template', Template );


const templateSchema = new mongoose.Schema({
        templateName:{
			type:String,
			required:true
		},
		templateMessage:{
			type:String
		},
		roles:{
			type:Array
		},
		fileName:{
			type:String,
			required:true
		},
		fileId:{
			type:mongoose.Types.ObjectId,
			required:true
		},
		size:{
			type:Number,
			required:true
		},
		userId:{
			type:mongoose.Types.ObjectId,
			required:true
		},
		userName:{
			type:String,
			required:true
		},
		createApiTemplate:{
			type:Boolean,
			default:false
		},
		createdAt:{
			type:Date,
			default:Date.now
		},
		placeholders:{
			type:Array
		},
  		signingOrder:{
			type:Array
		},
  		viewers:{
			type:Array
		},
		signatures:{
			type:Array
		},
  		selectedAction:{
			type:String
		},

})

const Templates = mongoose.model('Templates',templateSchema)

module.exports = Templates
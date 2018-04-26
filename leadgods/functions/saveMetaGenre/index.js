const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});

exports.handle = (event, context, callback) => {
	//Código para obtener el valor del género si existe
	var objGenre = {
		M: "Male",
		F: "Famale"
	};
	var field = "count_ready";
	if(event.count_completed>0){
		field = "count_completed";
	}
	var paramsGetItem = {
	  TableName : 'log_meta_genre',
	  Key: {
	  	"key_genre": event.chr_genre,
	  	"chr_genre": objGenre[event.chr_genre]
	  }
	};
	docClient.get(paramsGetItem, function(err, objItemGenre) {
	  if (err){
	  	callback(err, null);
	  }else{
	  	if(Object.keys(objItemGenre).length == 0){
	  		//registramos el género porque no existe el registro
	  		var objNewItem = {
	  			Item: {
	  				key_genre: event.chr_genre,
	  				chr_genre: objGenre[event.chr_genre],
	  				count_ready: event.count_ready,
	  				count_completed: event.count_completed
	  			},
	  			TableName: 'log_meta_genre'
	  		};
	  		docClient.put(objNewItem, function(err, newItem){
	  			if(err){
	  				callback(err, null);
	  			}else{
	  				callback(null, newItem);
	  			}
	  		});
	  	}else{
	  		//obtenemos el Item para ser actualizado
	  		var loadCount = parseInt(objItemGenre.Item.count_ready);
	  		if(event.count_completed>0){
	  			loadCount = parseInt(objItemGenre.Item.count_completed);
	  		}
			var params = {
			  TableName: 'log_meta_genre',
			  Key: { 
			  	"key_genre": event.chr_genre,
			  	"chr_genre": objGenre[event.chr_genre] 
			  },
			  UpdateExpression: 'set #CR = :x + :cont',
			  ConditionExpression: '#CG = :cg',
			  ExpressionAttributeNames: {"#CR": field,"#CG": "chr_genre"},
			  ExpressionAttributeValues: {
			    ':x' : loadCount,
			    ':cont': 1,
			    ':cg': objGenre[event.chr_genre]
			  }
			};
			docClient.update(params, function(err, data2) {
			   if (err) callback(err, null);
			   else  callback(null, objGenre[event.chr_genre]);
			});	  		
	  	}
	  } 
	});
}
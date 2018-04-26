const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
exports.handle = (event, context, callback)=>{
	/*let scanningParameters = {
		TableName:'log_videos',
		limit:1000
	};

	docClient.scan(scanningParameters, function(err, data){
		if(err){
			callback(err, null);
		}else{
			callback(null, data);
		}
	});*/
	var params = {
		TableName:' log_videos',
		ExpressionAttributeValues: {
			"int_uniqueid": 1507438238057
		}
	};

	docClient.get(params, function(err, data){
		if(err){
			callback(err, null);
		}else{
			callback(null, data);
		}
	});
};
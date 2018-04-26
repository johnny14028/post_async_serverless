
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const lambda = new AWS.Lambda({region: 'us-east-1'});
exports.handle  = (event, context, callback) =>{    
	var params = {
		Item: {
			date: Date.now(),
	        userId:event.userId,
	        productoId:event.productoId,
	        classId:event.classId,
	        sessionId:event.sessionId,
	        nickname:event.nickname,
	        image:event.image,
	        partnerId:event.partnerId,
	        key:event.key,
	        channelName:event.channelName,
	        s3BaseUrl:event.s3BaseUrl,
	        date_timecreated:event.date_timecreated,
	        date_minutes_difference:event.date_minutes_difference,
	        position:event.position,
	        duration:event.duration,
	        chr_type:event.chr_type,
	        viewable:event.viewable,
	        width:event.width,
	        height:event.height,
	        newstate:event.newstate,
	        oldstate:event.oldstate,
	        playReason:event.playReason,
	        reason:event.reason,
	        pauseReason:event.pauseReason,
	        bufferPercent:event.bufferPercent,
	        chr_browser:event.browser,
	        chr_browser_version:event.chr_browser_version,
	        chr_os:event.chr_os,
	        chr_os_version:event.chr_os_version,
	        chr_current_resolution:event.chr_current_resolution,
	        date_timezone:event.date_timezone,
	        chr_language:event.chr_language,
	        int_uniqueid:event.int_uniqueid,
	        chr_ip_address:event.chr_ip_address,
	        chr_city:event.chr_city,
	        chr_region:event.chr_region,
	        chr_countrycode:event.chr_countrycode,
	        chr_countryname:event.chr_countryname,
	        chr_regionname:event.chr_regionname,
	        chr_regioncode:event.chr_regioncode,
	        chr_gender:event.chr_gender
		},
		TableName: 'log_videos'
	};
	docClient.put(params, function(err, data){
		if(err){
			callback(err, null);
		}else{
			  switch(event.chr_type){
			  	case 'ready':
				  var params = {
				    FunctionName: 'apex-videos-log_saveMetaGenre',
				    InvokeArgs: JSON.stringify({'chr_genre':event.chr_gender,'count_ready':'1','count_completed':'0'})
				  };
				  lambda.invokeAsync(params, function(err, data) {
				  	if(err){
				  		callback(err, null);
				  	}else{
				  		callback(null, data);
				  	}
				  });				  			  	
			  	break;
			  	case 'complete':
				  var params = {
				    FunctionName: 'apex-videos-log_saveMetaGenre',
				    InvokeArgs: JSON.stringify({'chr_genre':event.chr_gender,'count_ready':'0','count_completed':'1'})
				  };
				  lambda.invokeAsync(params, function(err, data) {
				  	if(err){
				  		callback(err, null);
				  	}else{
				  		callback(null, data);
				  	}
				  });
				  break;
			    default:
			    	callback(err, null);
			  	break
			  }
		}
	});
}
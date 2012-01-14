require.paths.unshift('./node_modules');
var ObjectId= require('mongodb/lib/mongodb/bson/bson').ObjectID;
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var http = require("http");
var https = require("https");
var url = require("url");
var path = require("path");
var fs = require("fs");
var querystring = require('querystring');

if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
  var mongo = {"hostname":"localhost","port":27017,"username":"",
    "password":"","name":"","db":"ergface"}
}

http.createServer(function (request, response) {
	switch(request.url) {
		case '/newScore':
		if (request.method == 'POST') {
			console.log("[200] " + request.method + " to " + request.url);
			var fullBody = '';
			
			request.on('data', function(chunk) {
			// append the current chunk of data to the fullBody variable
			fullBody += chunk.toString();
			});
			
			request.on('end', function() {
			
				var POST = querystring.parse(fullBody);
				var distance = POST["distance"];
				var split = POST["split"];
				var time =  POST["time"];
				var date = POST["scoreDate"];
				var accessToken = POST["accessToken"];
				var fbId = POST["fbId"];
				var id = recordScore(distance, time, split, date, fbId);  
				var data = "access_token=" + accessToken + "&piece=http://ergface.cloudfoundry.com/ergscore/" + id + "&method=POST";
				console.log("data = " + data);
				var client  = https.get({host : "graph.facebook.com", path: "/me/ergface:erg?" + data});
				client.on('response', function(response) {
					console.log("reaching end....");
				});
				response.writeHead(302, {"Location": "scoreEntered.html"});
				response.end();
			});
		}
		break;
		default:
		    var obj = url.parse(request.url);
			if (obj.pathname && obj.pathname.substring(0,9) == "/ergscore") {
			var fullBody = '';
			request.on('data', function(chunk) {
				fullBody += chunk.toString();
			});
			
			request.on('end', function() {
				var qs = obj.pathname.split("/");
				var id = qs[qs.length-1];
				printScore(response, id);
			    return;
		   });
			return;		
		}
	}
	var uri = url.parse(request.url).pathname  
	, filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) { 
	   response.writeHead(404, {"Content-Type": "text/plain"});
	   response.write("404 Not Found\n");
	   response.end();
	   return;
    }
	   
	if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  }); 	
	
 
}).listen(port, host);

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'ergface');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

var recordScore = function(distance, time, split, date){
  	var id = new Date().getTime();
	id = id + "";
	console.log("d = " + distance + ", " + time + ", " + split);
  /* Connect to the DB and auth */
     
	require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('ergface', function(err, coll){
      /* Simple object to insert: ip address and date */

      object_to_insert = { '_id': id, 
                           'distance' : distance,
	                       'time' : time,
	                       'split' : split,
	                       'date'  : date
            };
	   console.log(object_to_insert);
      /* Insert the object then print in response */
      /* Note the _id has been created */
      coll.insert( object_to_insert, {safe:true});
   });
  }); 
  return id;
}

var printScore = function(response, id){
  /* Connect to the DB and auth */
  var object_to_print = {};
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('ergface', function(err, coll){
      /*find with limit:10 & sort */
      coll.findOne({"_id" : id}, function(err, record){
	    var content = openGraphContent(record);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(content);
		response.end();
    });
  });
  });
}

var openGraphContent = function(record) {
    var html = [];
	var idx = 0;
	html[idx++] = '<html  xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">\n';
	html[idx++] = '<head>';
	html[idx++] = '<meta property="fb:app_id"      content="253922707983005">\n';
	html[idx++] = '<meta property="og:type"        content="ergface:piece">\n';
	html[idx++] = '<meta property="og:url"         content="http://ergface.cloudfoundry.com/ergscore/' + record._id + '">\n';
	html[idx++] = '<meta property="og:image"       content="http://ogp.me/logo.png">\n';
	var title = "New Ergscore";
	var description = "";
	if (record.distance) {
		title = record.distance + " meters";
	}
	
	if (record.time && record.split && record.date) {
		description = "Time: " + record.time + " Split: " + record.split + " on " + record.date;
	}
	else if (record.split && record.date) {
		description = "Split: " + record.split + " on " + record.date;
	}
	else if (record.time && record.date) {
		description = "Time: " + record.time + " on " + record.date;
	}
	html[idx++] =  '<meta property="og:title"       content="' + title + '">\n';
	html[idx++] =  '<meta property="og:description" content="' + description + '">\n'; 
	html[idx++] = "</head>\n";
	html[idx++] = "<body>some content</body></html>";
	
	return html.join(" ");	
}
'use strict';
var https = require("https");
var path = process.cwd();
var search = [];

module.exports = function (app, passport) {
	var urlToSearch = "https://www.googleapis.com/customsearch/v1?searchType=image&key=AIzaSyCy6weQvTrlalICCXMlOq3hLCz4Atl1OeA&cx=018429231957585796505:d02h80r2nam";
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.get(/\/(api\/imagesearch)+/, function(req, res){
		var number="";
		var searchRequset = req.path.replace("/api/imagesearch/", "");
		if (Object.keys(req.query).length !== 0){
			number = req.query.offset;
		}
		
		search.push({"title" : searchRequset});
		
		var start = 0;
		var result = "";
		
		if (number){
			var urlTo = urlToSearch + "&q=" + searchRequset + "&num=" + number;
		} else {
			urlTo = urlToSearch + "&q=" + searchRequset
		}
		
		https.get(urlTo, function(response){
			
			response.setEncoding("utf8");
			response.on("data", function(data){
				result += data;
			});
		
			response.on("end", function(){
				start = result.indexOf('\"items\":');
				result = result.slice(start, result.lastIndexOf("}")).replace(/"items": /, "");
				var json = JSON.parse(result);
				res.send(json);
			})
		});
	app.get(/\/(api\/latest)+/, function(req, res){
		res.send(search);
	})	
	});
};
//https://www.googleapis.com/customsearch/v1?searchType=image&key=AIzaSyCy6weQvTrlalICCXMlOq3hLCz4Atl1OeA&cx=018429231957585796505:d02h80r2nam&q=car&num=10
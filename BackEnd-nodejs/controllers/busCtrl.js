var path=require("path");
var busstop=require('../models/BusStop.js')
var http=require('https')
var request = require('request')
//var geolocation = require('geolocation')
const geolib = require('geolib');
var formidable =require("formidable");


const accountkey='ydztgTr0R7GPHnh82Bl89w=='

exports.getAllBusStops = function(req,res){ 
    console.log("this is funtion: getAllBusStops");
    var numOfRes=0;
    var busStopList=[];
    (function getdata(count){
        request({
            url: "http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip="+count*500,
            method: "GET",
            json: true,
            headers: {
                "Accept":"application/json",
                "AccountKey":accountkey,
                "Content-Type": "application/json;charset=UTF-8",
                "content-language": "en-US"
            }         
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {  
                numOfRes=body["value"].length;
                busStopList=busStopList.concat(body["value"])
                count++;
                if(numOfRes==500){
                    getdata(count);
                }
                else{
                    return res.json(busStopList);
                }
            }
        });
    })(0);
}

exports.getBusStopById = function(req,res){
    //console.log("this is funtion: getBusStopById");
    sid=req.params.sid;
    buslist=[];
    request({
        url: "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+sid,
        method: "GET",
        json: true,
        headers: {
            "Accept":"application/json",
            "AccountKey":accountkey,
            "Content-Type": "application/json;charset=UTF-8",
            "content-language": "en-US"
        }   
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {  
            // for(var i=0;i<body['Services'].length;i++){
            //     buslist.push(body['Services'][i]['ServiceNo']);
            // }
            // console.log(buslist)
            // res.json(buslist);
            res.json(body)

        }
    });
}

exports.getBusById = function(req,res){
    console.log("this is funtion: getBusById");
    sid=req.params.sid;
    bid=req.params.bid;
    request({
        url: "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+sid+"&ServiceNo="+bid,
        method: "GET",
        json: true,
        headers: {
            "Accept":"application/json",
            "AccountKey":accountkey,
            "Content-Type": "application/json;charset=UTF-8",
            "content-language": "en-US"
        } 
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {  
            console.log(body['Services'])
            res.json(body['Services'])
        }
    });
}








function getDistance(lat1,lon1,lat2,lon2){
    return geolib.getPreciseDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 },
        0.01
    );
} 


exports.getNearbyBusStops = function(req,res){
    //console.log(req.query);
    var numOfRes=0;
    var busStopList=[];
    var distancelist=[];
    var latitude=req.query.latitude;
    var longitude=req.query.longitude;

    if(!latitude || !longitude){
        return res.json("Cannot get coordinates,please enable GPS");
    }

    (function getdata(count){
        request({
            url: "http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip="+count*500,
            method: "GET",
            json: true,
            headers: {
                "Accept":"application/json",
                "AccountKey":accountkey,
                "Content-Type": "application/json;charset=UTF-8",
                "content-language": "en-US"
            }         
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {  
                numOfRes=body["value"].length;
                busStopList=busStopList.concat(body["value"])
                count++;
                if(numOfRes==500){
                    getdata(count);
                }
                else{
                    for(var i=0;i<busStopList.length;i++){
                        var lat2=busStopList[i]["Latitude"];
                        var lon2=busStopList[i]["Longitude"];
                        var dis = getDistance(latitude,longitude,lat2,lon2);
                        distancelist.push(parseFloat(dis))
                    }
                    bubble_Sort(distancelist,busStopList);
                    return res.json(busStopList.slice(0,30));
                }
            }
        });
    })(0);
}

function bubble_Sort(distanceArr,busStopArr){
    var len = distanceArr.length,
        i, j, stop;

    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (distanceArr[j] > distanceArr[j+1]){
                swap(distanceArr, j, j+1);
                swap(busStopArr, j, j+1);
            }
        }
    }
}

function swap(arrlist, first_Index, second_Index){
    var temp = arrlist[first_Index];
    arrlist[first_Index] = arrlist[second_Index];
    arrlist[second_Index] = temp;
}


exports.getFavouriteBusStops = function(req,res){ 
    //console.log("this is funtion: getFavouriteBus");
    var numOfRes=0;
    var busStopList=[];
    var favuoritebusStopList=[];
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var index=0;
        if(fields.busstopList.length<=0){
            res.json({"results":"Favourite list is empty"});
            return;
        }

        (function getdata(count){
            request({
                url: "http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip="+count*500,
                method: "GET",
                json: true,
                headers: {
                    "Accept":"application/json",
                    "AccountKey":accountkey,
                    "Content-Type": "application/json;charset=UTF-8",
                    "content-language": "en-US"
                }         
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {  
                    numOfRes=body["value"].length;
                    busStopList=busStopList.concat(body["value"])
                    count++;
                    if(numOfRes==500){
                        getdata(count);
                    }
                    else{
                        for(var i=0;i<busStopList.length;i++){
                            if(fields.busstopList.includes(busStopList[i]["BusStopCode"])){
                                favuoritebusStopList.push(busStopList[i]);
                                //console.log(busStopList[i]);
                            }
                        }
                        return res.json({"results":favuoritebusStopList});
                    }
                    
                }
            });
        })(0);
    });
}





exports.getFavouriteBus = function(req,res){
    console.log("this is funtion: getFavouriteBus");
    var data=[];
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var index=0;
        if(fields.busstopList.length<=0){
            res.json({"results":"Favourite list is empty"});
            return;
        }
        (function getFavourite(bid){
                request({
                    url: "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode="+bid,
                    method: "GET",
                    json: true,
                    headers: {
                        "Accept":"application/json",
                        "AccountKey":accountkey,
                        "Content-Type": "application/json;charset=UTF-8",
                        "content-language": "en-US"
                    }   
                }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        data.push(body);
                        index++;

                        if(index<fields.busstopList.length){
                            getFavourite(fields.busstopList[index]);
                        }else{
                            res.json({"results":data});
                        }
                    }
                });
            })(fields.busstopList[0]);
    });
}



exports.getAllBusServices = function(req,res){ 
    console.log("this is funtion: getAllBusServices");
    var numOfRes=0;
    var busServicesList=[];
    (function getdata(count){
        request({
            url: "http://datamall2.mytransport.sg/ltaodataservice/BusServices?$skip="+count*500,
            method: "GET",
            json: true,
            headers: {
                "Accept":"application/json",
                "AccountKey":accountkey,
                "Content-Type": "application/json;charset=UTF-8",
                "content-language": "en-US"
            }         
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {  
                numOfRes=body["value"].length;
                busServicesList=busServicesList.concat(body["value"])
                count++;
                if(numOfRes==500){
                    getdata(count);
                }
                else{
                    for(var i=0;i<busServicesList.length;i++){
                        if(busServicesList[i]["Direction"]==2){
                            busServicesList.splice(i,1);
                        }
                    }
                    return res.json(busServicesList);
                }
            }
        });
    })(0);
}



exports.getAllBusRoutes = function(req,res){ 
    console.log("this is funtion: getAllBusRoutes");
    var numOfRes=0;
    var busRoutesList=[];
    (function getdata(count){
        request({
            url: "http://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip="+count*500,
            method: "GET",
            json: true,
            headers: {
                "Accept":"application/json",
                "AccountKey":accountkey,
                "Content-Type": "application/json;charset=UTF-8",
                "content-language": "en-US"
            }         
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {  
                numOfRes=body["value"].length;
                busRoutesList=busRoutesList.concat(body["value"])
                count++;
                if(numOfRes==500){
                    getdata(count);
                }
                else{
       
                    return res.json(busRoutesList);
                }
            }
        });
    })(0);
}
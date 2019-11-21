const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

var busCtrl = require('./controllers/busCtrl.js')


app.use(cors());

//combined angular front-end built product
//app.use(express.static("www"))

app.get('/home',                    busCtrl.getNearbyBusStops);
app.get('/:sid(\\d+)',              busCtrl.getBusStopById);
app.get('/:sid(\\d+)/:bid(\\d+)',   busCtrl.getBusById);
app.get('/nearby',                  busCtrl.getNearbyBusStops);
app.post('/favourite',              busCtrl.getFavouriteBusStops);
app.get('/busservices',             busCtrl.getAllBusServices);
app.get('/busroutes',               busCtrl.getAllBusRoutes)
app.get('/busstops',                busCtrl.getAllBusStops);

app.use(function(req,res){
    res.send("404 page not found..");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
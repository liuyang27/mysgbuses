const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

var busCtrl = require('./controllers/busCtrl.js')


app.use(cors());

app.get('/',                        busCtrl.getAllBusStops);
app.get('/test',                    busCtrl.testDistance);
app.get('/:sid(\\d+)',              busCtrl.getBusStopById);
app.get('/:sid(\\d+)/:bid(\\d+)',   busCtrl.getBusById);
app.get('/nearby',                  busCtrl.getNearbyBusStops);


app.use(function(req,res){
    res.send("404 page not found..");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
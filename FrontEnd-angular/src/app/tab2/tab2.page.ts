import { Component,AfterViewInit, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;


declare const google: any;


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, AfterViewInit{
 

  constructor(private _http:HttpClient) {}

  private map;
  busstoplist:any;
  lat:any;
  lng:any;

  ngOnInit(): void {
    // this._http.get("http://localhost:3000/busstops").subscribe(
    //   data => {
    //     this.busstoplist=data;
    //     console.log(this.busstoplist)
    //   });
    //this.getCurrentPosition();
  
   
  }



  ngAfterViewInit() {
      const that = this;
      var markers = [];

      that.map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: 34.61392284366256, lng: 112.4535423212591},
        center: {lat: 1.2987764, lng: 103.7868639},
        zoom: 15,
        mapTypeId: 'roadmap'
      });
  
    // get current location by H5
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     const pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     const marker = new google.maps.Marker({
    //       position: pos,
    //       options:{
    //         icon:"assets/icon/maps-and-flags.png",
    //         //draggable: true
    //       }
    //     });
    //     marker.setMap(that.map);
    //     that.map.setCenter(pos);
    //   });
    // }


    const wait = Geolocation.watchPosition({}, (position, err) => {

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var marker = new google.maps.Marker({
          position: pos,
          options:{
            icon:"assets/icon/maps-and-flags.png",
            //draggable: true
          },
        });

        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
        markers.push(marker);
        markers[0].setMap(null);
 
        that.map.setCenter(pos);
        markers[0].setMap(that.map);
    })

  }


  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat=coordinates.coords["latitude"];
    this.lng=coordinates.coords["longitude"];
  }
}

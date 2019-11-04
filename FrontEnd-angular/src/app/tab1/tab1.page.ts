import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  constructor(private _http:HttpClient) {}

  bussStopList:any;
  busesList:any;
  busStopCode:any;

  ngOnInit(): void {
    this._http.get("http://localhost:3000").subscribe(
      data => this.bussStopList=data);
  }

  doRefresh(event) {
    console.log('Begin async operation');
 
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getBusInfo(BusStopCode){
    console.log("getting "+BusStopCode);
    this._http.get("http://localhost:3000/"+BusStopCode).subscribe(
      data => (this.busesList=data["Services"], this.busStopCode=data["BusStopCode"])
      //data => console.log(data)
      );
  }

  clear(){
    console.log("closed???");
    this.busesList=[];
  }

}


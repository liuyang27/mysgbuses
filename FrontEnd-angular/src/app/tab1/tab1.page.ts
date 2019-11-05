import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { FavouritemodalPage } from '../favouritemodal/favouritemodal.page';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  constructor(private _http:HttpClient,public modalController: ModalController,public storage:StorageService) {}

  bussStopList:any;
  busesList:any;
  busStopId:any;
  currentModal:any=null;
  favouriteList:any[]=[];
  busIdList:any[]=[];



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

    this._http.get("http://localhost:3000/"+BusStopCode).subscribe(
      data => {
        this.busesList=data["Services"];
        this.busStopId=data["BusStopCode"];
        //console.log(data);
        //console.log("ID: "+this.busStopId);

      });
  }

  getArrival(time){
    if(!time){
      return "NA"
    }
    var curr = new Date();
    var arrTime = new Date(time);
    var res=arrTime.getTime()-curr.getTime();
    if(res > 60000){
      return Math.floor(res/60000) + " min";
    }else{
      return "Arr";
    }
  }

  getLoadColor(load){
    if(!load){
      return "dark";
    }else if(load=="SEA"){
      return "success";
    }else if(load=="SDA"){
      return "warning";
    }else if(load=="LSD"){
      return "danger";
    }
  }


  createModal() {
    this.modalController.create({
      component: FavouritemodalPage,
            // componentProps: {
            //   'firstName': 'Douglas',
            //   'lastName': 'Adams',
            //   'middleInitial': 'N'}
    }).then(modal => {
      modal.present();
      this.currentModal = modal;
    });
  }

  addFav(busstopId,busId){
    //this.storage.set("favlist",this.favouriteList);
    if(!this.favListHaskeyword(this.favouriteList,busstopId)){
      this.busIdList.push(busId);
      this.favouriteList.push({
        busstopId:busstopId,
        busIdlist:this.busIdList
      });
      this.storage.set("favlist",this.favouriteList);
      alert("add new stop and bus: "+ this.favouriteList[0].toString());
    }else{
      var index=this.busListHasId(this.favouriteList,busstopId,busId);
      if(index>=0){
          alert("exist.....");
          alert("existing: "+ this.favouriteList.toString());
      }else{
          var templist = this.favouriteList[index].busIdlist;
          alert(templist.toString());
          templist.push(busId);
          alert(templist.toString());
          alert("add new bus: "+ this.favouriteList.toString());
      }
    }
  }

  favListHaskeyword(favlist,keyword){
    if(!keyword){
      return false;
    }
    for(var i=0;i<favlist.length;i++){
      if(favlist[i].busstopId==keyword){
        return true;
      }
    }
    return false;
  }

  busListHasId(favlist,busstopId,busId){
      for(var i=0;i<favlist.length;i++){
        if(favlist[i].busstopId==busstopId){
          for(var j=0;j<favlist[i].busIdlist.length;j++){
            if(favlist[i].busIdlist[j]==busId){
              return i;
            }
          }
        }
        return -1;
      }
  }



}

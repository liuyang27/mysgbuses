import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { FavouritemodalPage } from '../favouritemodal/favouritemodal.page';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  constructor(private _http:HttpClient,
              public modalController: ModalController,
              public storage:StorageService,
              public toastController: ToastController) {}

  bussStopList:any;
  busesList:any;
  busStopId:any;
  currentModal:any=null;
  favouriteList:any[]=[];
  latitude:any;
  longitude:any;
 


  ngOnInit(): void {
    this.favouriteList=this.storage.get("favlist");
    this.getNearBusstops();

  }

  async doRefresh(event) {
    //console.log('Begin async operation');
    await this.getCurrentPosition();
    event.target.complete();
    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
  }

  getBusInfo(BusStopCode){

    this._http.get("http://localhost:3000/"+BusStopCode).subscribe(
      data => {
        this.busesList=data["Services"];
        this.busStopId=data["BusStopCode"];
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
      componentProps: {
        'favlist': this.favouriteList,
      }
    }).then(modal => {
      modal.present();
      this.currentModal = modal;
    });
  }

  addFav(busstopId,busId){
    var checkIndex=this.favListHaskeyword(this.favouriteList,busstopId);
    if(checkIndex==-1){
      var favBusIdList=[];
      favBusIdList.push(busId);
      this.favouriteList.push({
        busstopId:busstopId,
        busIdlist:favBusIdList
      });
      this.storage.set("favlist",this.favouriteList);
      this.savedToast();
    }else{
      var index=this.checkBusIdExist(this.favouriteList[checkIndex].busIdlist,busId)
      if(index==-1){
        this.favouriteList[checkIndex].busIdlist.push(busId);
        this.storage.set("favlist",this.favouriteList);
        this.savedToast();
      }else{
        this.existToast();
      }
   
    }
  }

  favListHaskeyword(favlist,keyword){
    if(!favlist){
      this.favouriteList=[];
      return -1;
    }
    for(var i=0;i<favlist.length;i++){
      if(favlist[i].busstopId==keyword){
        return i;
      }
    }
    return -1;
  }

  checkBusIdExist(favBusIdList,busId){
    for(var i=0;i<favBusIdList.length;i++){
      if(favBusIdList[i]==busId){
        return i;
      }
    }
    return -1;
  }

  async existToast() {
    const toast = await this.toastController.create({
      message: 'Bus service already added.',
      duration: 2000
    });
    toast.present();
  }

  
  async savedToast() {
    const toast = await this.toastController.create({
      message: 'Bus service added sucessful.',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          icon: 'star',
          text: 'Favorite',
        }]
    });
    toast.present();
  }


  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude=coordinates.coords["latitude"];
    this.longitude=coordinates.coords["longitude"];
  }

  async getNearBusstops() {
    await this.getCurrentPosition();
    const params = new HttpParams().set("latitude", this.latitude).set("longitude", this.longitude);
    this._http.get("http://localhost:3000/home",{params:params}).subscribe(
      data => this.bussStopList=data);
  }
  
   


}

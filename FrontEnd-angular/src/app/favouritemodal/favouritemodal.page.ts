import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-favouritemodal',
  templateUrl: './favouritemodal.page.html',
  styleUrls: ['./favouritemodal.page.scss'],
})
export class FavouritemodalPage implements OnInit {
  @Input() favlist:any;
  // @Input() lastName: string;
  // @Input() middleInitial: string;
  //@Input() currentModal: any;

  constructor(public modalController: ModalController,
              private _http:HttpClient,
              public storage:StorageService,
              public toastController: ToastController,
              public loadingController: LoadingController) { }

  favouriteList:any[]=[];
  busStopId:any;
  bussStopList:any[]=[];
  busesList:any[]=[];

  ngOnInit() {
    //this.favouriteList=this.storage.get("favlist");
  
    this.favouriteList=this.favlist;
    var busstopList=[];
    if(this.favouriteList && this.favouriteList.length>0){
      this.presentLoadingWithOptions();
      this.favouriteList.forEach(element => { busstopList.push(element.busstopId) });
      this._http.post("http://localhost:3000/favourite",{"busstopList":busstopList}).subscribe(
        data => {
          this.bussStopList=data["results"];
        });
    }else{
      this.emptyToast();
    }
    
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: "circles",
      duration: 2000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  getBusInfo(BusStopCode){
    this._http.get("http://localhost:3000/"+BusStopCode).subscribe(
      data => {
        this.busesList=[];
        this.busStopId=data["BusStopCode"];
        for(var i=0;i<this.favouriteList.length;i++){
          if(this.favouriteList[i]["busstopId"]==this.busStopId){
            var templist=this.favouriteList[i]["busIdlist"];

            templist.forEach(element => {
              for(var j=0;j<data["Services"].length;j++){
                if(data["Services"][j]["ServiceNo"]==element){
                  this.busesList.push(data["Services"][j])
                }
              }
            });

          }
        }
        // console.log(this.busesList);
      });
  }

  dismissModal() {
      this.modalController.dismiss({
        'dismissed': true
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


  deleteFav(busstopId,busId){

    for(var i=0;i<this.favouriteList.length;i++){
      if(this.favouriteList[i]["busstopId"]==busstopId){
        for(var j=0;j<this.favouriteList[i]["busIdlist"].length;j++){
          if(this.favouriteList[i]["busIdlist"][j]==busId){
            this.favouriteList[i]["busIdlist"].splice(j,1);
            if(this.favouriteList[i]["busIdlist"].length<=0){
              this.favouriteList.splice(i,1);

              for(var n=0;n<this.bussStopList.length;n++){
                if(this.bussStopList[n]["BusStopCode"]==busstopId){
                  this.bussStopList.splice(n,1);
                }
              }

            }
            this.storage.set("favlist",this.favouriteList);
            break;
          }
        }

      }
    }
    for(var i=0;i<this.busesList.length;i++){
      if(this.busesList[i]["ServiceNo"]==busId){
        this.busesList.splice(i,1);
      }
    }
    this.deleteToast();
  }

  
  async deleteToast() {
    const toast = await this.toastController.create({
      message: 'Removed sucessful.',
      duration: 2000
    });
    toast.present();
  }

  async emptyToast() {
    const toast = await this.toastController.create({
      header:"Empty list",
      message: 'go back to add your favourite bus now~',
      duration: 2000,
      position:"middle",
      translucent:true,
  
    });
    toast.present();
  }

}

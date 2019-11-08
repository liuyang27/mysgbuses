import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-favouritemodal',
  templateUrl: './favouritemodal.page.html',
  styleUrls: ['./favouritemodal.page.scss'],
})
export class FavouritemodalPage implements OnInit {
  // @Input() firstName: string;
  // @Input() lastName: string;
  // @Input() middleInitial: string;
  //@Input() currentModal: any;

  constructor(public modalController: ModalController,
              private _http:HttpClient,
              public storage:StorageService) { }

  favouriteList:any[]=[];
  
  ngOnInit() {
    this.favouriteList=this.storage.get("favlist");
    var busstopList=[];
    if(this.favouriteList){

      this.favouriteList.forEach(element => { busstopList.push(element.busstopId) });

      this._http.post("http://localhost:3000/favourite",{"busstopList":busstopList}).subscribe(
        data => console.log(data));
    }
    
  }

  dismissModal() {
      this.modalController.dismiss({
        'dismissed': true
      });
    

  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModal() {
      this.modalController.dismiss({
        'dismissed': true
      });
    

  }

}

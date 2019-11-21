import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FavouritemodalPage } from './favouritemodal.page';
import {MatExpansionModule} from '@angular/material/expansion';

const routes: Routes = [
  {
    path: 'myFavourites',
    component: FavouritemodalPage
  }
];

@NgModule({
  imports: [
    MatExpansionModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FavouritemodalPage]
})
export class FavouritemodalPageModule {}

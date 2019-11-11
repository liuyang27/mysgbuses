import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  allbuses:any;
  searchdata:any;
  

  constructor(private _http:HttpClient) {}


  @ViewChild('searchbar',{static: false}) searchbar:any;
 

  ngOnInit(): void {
    this._http.get("http://localhost:3000/busservices").subscribe(
      data =>{
        this.allbuses=data;
      });
  }

  searchbus(){
    this.searchdata=document.querySelector('.searchbar-input');
    this.searchdata=this.searchdata.value.toLowerCase().trim()

    const items:any = Array.from(document.querySelector('ion-list').children);
    requestAnimationFrame(() => {
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(this.searchdata) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });

  }

  showBusRoutes(id){
    //console.log(id)
  }




}

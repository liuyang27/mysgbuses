import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key,value){
    localStorage.setItem(key,JSON.stringify(value));
  }
  get(key){
    //return "this is from service";
    return JSON.parse(localStorage.getItem(key));
  }
  remove(key){
    localStorage.removeItem(key);
  }
}

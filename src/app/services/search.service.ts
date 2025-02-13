import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  searchSubject: BehaviorSubject<string> = new BehaviorSubject('');
  
}

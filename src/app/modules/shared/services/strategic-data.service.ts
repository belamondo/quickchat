import { Injectable, OnInit } from '@angular/core';

/**
 * Rxjs
 */
import { Observable } from 'rxjs';
import { CrudService } from './firebase/crud.service';

@Injectable({
  providedIn: 'root'
})
export class StrategicDataService {
  private userData = JSON.parse(sessionStorage.getItem('userData'));

  public userCompanies$ = new Observable(observer => {
    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'], this.userData[0]['_id'], 'userCompanies'],
    }).then(res => {
      observer.next(res);
    });
  });

  constructor(
    private _crud: CrudService,
  ) { }
}

import { Injectable } from '@angular/core';

/**
 * Services
 */
import { CrudService } from './firebase/crud.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  public userData: any;

  constructor(
    private _crud: CrudService
  ) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  readUserCompanies = () => new Promise((resolve, reject) => {
    if(sessionStorage.getItem('userCompanies')) {
      //Before reading on firestore, read the sessionStorage

      //IF nothing found on sessionStorage, read firestore

      //IF something found on firestore AND sessionStorage length is lower than 401 PUSH results to sessionStorage

      //Response to reading
    } else {
      //Read firestore to check for response
      this._crud.read({
        collectionsAndDocs: [this.userData[0]['_data']['userType'],this.userData[0]['_id'],'userCompanies'],
      }).then(res => {
        let response = JSON.stringify(res);
        //IF something found on firestore PUSH results to sessionStorage
        if((res['length'] > 0) && (res['length'] < 401)) {
          sessionStorage.setItem('userCompanies', JSON.stringify(res));
        }

        resolve(response);
      })
    }
  })
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

/**
 * Services
 */
import { AuthenticationService } from './../services/firebase/authentication.service';
import { CrudService } from '../services/firebase/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CashFlowGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot, state:
      RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this._auth.setUser()
      .then(res => {
        if (!res || !res['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          })

          return false;
        }
        
        this._crud.read({
          collection: 'people',
          whereId: res['id']
        }).then(res => { 
          if (!res[0]) {
            this._router.navigate(['/main/profile_choice']);

            return false;
          }

          //Populate clients item on sessionStorage
          if(!sessionStorage.getItem('clients')) {
            this._crud.read({
              collection: 'clients',
              whereId: res['id']
            }).then(resClients => {
              sessionStorage.setItem('clients', JSON.stringify(resClients))
            })
          }
        })
      })

    return true;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/**
 * Services
 */
import { AuthenticationService } from './../services/firebase/authentication.service';
import { CrudService } from '../services/firebase/crud.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
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
            this._router.navigate(['/main/profile_choice'])
          }

          if(!sessionStorage.getItem('companiesDocuments')) {
            this._crud.read({
              collection: 'documents',
              where:[['type','==','companies']]
            }).then(res => {
              console.log(res)
              sessionStorage.setItem('companiesDocuments', JSON.stringify(res))
            })
          }

          if(!sessionStorage.getItem('peopleDocuments')) {
            this._crud.read({
              collection: 'documents',
              where:[['type','==','people']]
            }).then(res => {
              console.log(res)
              sessionStorage.setItem('peopleDocuments', JSON.stringify(res))
            })
          }

          if(!sessionStorage.getItem('contacts')) {
            this._crud.read({
              collection: 'contacts'
            }).then(res => {
              console.log(res)
              sessionStorage.setItem('contacts', JSON.stringify(res))
            })
          }
        })
      })

    return true;
  }
}

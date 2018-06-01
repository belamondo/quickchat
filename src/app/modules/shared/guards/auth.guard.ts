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
      .then(resUser => {
        let userAssigned = true,
            userType = "";

        //Check if loggedin before get in module
        if (!resUser || !resUser['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          })

          return false;
        }
        
        //Check if user loggedin is assigned and on what type of user
        //Case not assigned, sending to profile choice
        this._crud.read({
          collection: 'people',
          whereId: resUser['id']
        }).then(resPeople => { 
          if (!resPeople[0]) {
            this._crud.read({
              collection: 'companies',
              whereId: resUser['id']
            }).then(resCompanies => { 
              if(!resCompanies[0]) {
                this._crud.read({
                  collection: 'animals',
                  whereId: resUser['id']
                }).then(resAnimals => { 
                  if(!resAnimals[0]) {
                    this._crud.read({
                      collection: 'entities',
                      whereId: resUser['id']
                    }).then(resEntities => { 
                      if(!resEntities[0]) {    
                        this._router.navigate(['/main/profile_choice'])
                      } else {
                        if(!sessionStorage.getItem('userData')) {
                          resPeople[0]['_data']['userType'] = "entities";
                          sessionStorage.setItem('userData', JSON.stringify(resEntities))
                        }
                      }
                    })
                  } else {
                    if(!sessionStorage.getItem('userData')) {
                      resPeople[0]['_data']['userType'] = "animals";
                      sessionStorage.setItem('userData', JSON.stringify(resAnimals))
                    }
                  }
                })
              } else {
                if(!sessionStorage.getItem('userData')) {
                  resPeople[0]['_data']['userType'] = "companies";
                  sessionStorage.setItem('userData', JSON.stringify(resCompanies))
                }
              }
            })
          } else {
            if(!sessionStorage.getItem('userData')) {
              resPeople[0]['_data']['userType'] = "people";
              sessionStorage.setItem('userData', JSON.stringify(resPeople))
            }
          }
          
          if(!sessionStorage.getItem('companiesDocuments')) {
            this._crud.read({
              collection: 'documents',
              where:[['type','==','companies']]
            }).then(res => {
              let documents = res['filter'](el => el._data.name !== "CPF")

              sessionStorage.setItem('companiesDocuments', JSON.stringify(documents))
            })
          }

          if(!sessionStorage.getItem('peopleDocuments')) {
            this._crud.read({
              collection: 'documents',
              where:[['type','==','people']]
            }).then(res => {
              let documents = res['filter'](el => el._data.name !== "CPF")
              
              sessionStorage.setItem('peopleDocuments', JSON.stringify(documents))
            })
          }

          if(!sessionStorage.getItem('contacts')) {
            this._crud.read({
              collection: 'contacts'
            }).then(res => {
              sessionStorage.setItem('contacts', JSON.stringify(res))
            })
          }
        })
      })

    return true;
  }
}

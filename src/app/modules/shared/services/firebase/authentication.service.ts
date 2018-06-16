/**
 * @description Deals with authentication properties and methods based on firebase authentication service
 * 
 * @method login() - validates or not the authentication of user and its password
 *    @param {Object} params - required
 *    @param {string} params.loginMode - required - possible values: emailAndPassword
 *    @param {string} params.user - required - possible values: will depend on loginMode (a validate email so far, based on emailAndPassword loginMode)
 *    @param {string} params.password - required
 *    @param {string} params.navigateTo - required - e.g.: '/main'
 *        @returns default data from firebase authentication method (according to loginMode) plus code and message hard coded if login is successful
 * 
 * @method logout - destroys loggedin user session using firebase method
 *    @param {string} params.navigateTo - required - e.g.: '/login'
 *    @returns code and message according to succesful or failed logout
 * 
 * @method setUser - returns user data if there is one loggedin
 *    @returns user id and firebase object related to loggedin user if there is one, and false if there is no user loggedin
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './crud.service';

/**
 * Third party class
 */
import { initializeApp } from 'firebase';
import { StrategicDataService } from '../strategic-data.service';

const _authentication = initializeApp({
  apiKey: 'AIzaSyCYoHZwVNJfJ-e1R1ar9_sg0W2PLbRvXtI',
    authDomain: 'tem-example.firebaseapp.com',
    databaseURL: 'https://tem-example.firebaseio.com',
    projectId: 'tem-example',
    storageBucket: 'tem-example.appspot.com',
    messagingSenderId: '489891966787'
}, 'auth').auth();

@Injectable()
export class AuthenticationService {
  constructor(
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public _strategicData: StrategicDataService
  ) {}

  login = (params) => new Promise((res, rej) =>{
    // Set params errors: start
    if (!params) {
      res({
        code: 'l-error-01',
        message: 'Defina parâmetros mínimos'
      });
    } else {
      if (!params.user) {
        res({
          code: 'l-error-02',
          message: 'Parâmetro obrigatório: user'
        });
      }

      if (!params.password) {
        res({
          code: 'l-error-03',
          message: 'Parâmetro obrigatório: password'
        });
      }

      if (!params.loginMode) {
        res({
          code: 'l-error-04',
          message: 'Parâmetro obrigatório: loginMode'
        });
      }

      if (!params.navigateTo) {
        res({
          code: 'l-error-05',
          message: 'Parâmetro obrigatório: navigateTo'
        });
      }
    }
    // Set params errors: end

    if (params.loginMode === 'emailAndPassword') {
      _authentication.signInWithEmailAndPassword(params.user, params.password)
      .catch(fbErr => {
        if (fbErr) {
          this._snackbar.open(fbErr['message'], '', {
            duration: 4000
          });
        }
      })
      .then(fbRes => {
        if(fbRes && fbRes['user']['uid']) {
          fbRes['code'] = 'l-success-01';
          fbRes['message'] = 'Welcome';

          sessionStorage.clear();

          this._snackbar.open(fbRes['message'],'',{
            duration: 4000
          })

          sessionStorage.setItem('user', JSON.stringify(fbRes))
          // Check if user loggedin is assigned and on what type of user
          // Case not assigned, sending to profile choice
          this._crud.read({
            collectionsAndDocs: ['people', fbRes['user']['uid']]
          }).then(resPeople => {
            if (!resPeople[0]) {
              this._crud.read({
                collectionsAndDocs: ['companies', fbRes['user']['uid']]
              }).then(resCompanies => {
                if (!resCompanies[0]) {
                  this._crud.read({
                    collectionsAndDocs: ['animals', fbRes['user']['uid']]
                  }).then(resAnimals => {
                    if (!resAnimals[0]) {
                      this._crud.read({
                        collectionsAndDocs: ['entities', fbRes['user']['uid']]
                      }).then(resEntities => {
                        if (!resEntities[0]) {
                          this._router.navigate(['/main/profile_choice'])
                        } else {
                          if (!sessionStorage.getItem('userData')) {
                            resEntities[0]['userType'] = 'entities';
                            sessionStorage.setItem('userData', JSON.stringify(resEntities))
                          }

                          if (!sessionStorage.getItem('userCompanies')) {
                            this._crud.read({
                              collectionsAndDocs: ['entities', fbRes['user']['uid'],'userCompanies']
                            }).then(resUserCompanies => {
                              sessionStorage.setItem('userCompanies', JSON.stringify(resUserCompanies))
                            })
                          }
                
                          if (!sessionStorage.getItem('userPeople')) {
                            this._crud.read({
                              collectionsAndDocs: ['entities', fbRes['user']['uid'],'userPeople']
                            }).then(resUserPeople => {
                              sessionStorage.setItem('userPeople', JSON.stringify(resUserPeople))
                            })
                          }

                          this._router.navigate([params.navigateTo]);
                        }
                      })
                    } else {
                      if (!sessionStorage.getItem('userData')) {
                        resAnimals[0]['userType'] = "animals";
                        sessionStorage.setItem('userData', JSON.stringify(resAnimals))
                      }

                      if (!sessionStorage.getItem('userCompanies')) {
                        this._crud.read({
                          collectionsAndDocs: ['animals', fbRes['user']['uid'],'userCompanies']
                        }).then(resUserCompanies => {
                          sessionStorage.setItem('userCompanies', JSON.stringify(resUserCompanies))
                        })
                      }

                      if (!sessionStorage.getItem('userPeople')) {
                        this._crud.read({
                          collectionsAndDocs: ['animals', fbRes['user']['uid'],'userPeople']
                        }).then(resUserPeople => {
                          sessionStorage.setItem('userPeople', JSON.stringify(resUserPeople))
                        })
                      }

                      this._router.navigate([params.navigateTo]);
                    }
                  })
                } else {
                  if (!sessionStorage.getItem('userData')) {
                    resCompanies[0]['userType'] = "companies";
                    sessionStorage.setItem('userData', JSON.stringify(resCompanies))
                  }

                  if (!sessionStorage.getItem('userCompanies')) {
                    this._crud.read({
                      collectionsAndDocs: ['companies', fbRes['user']['uid'],'userCompanies']
                    }).then(resUserCompanies => {
                      sessionStorage.setItem('userCompanies', JSON.stringify(resUserCompanies))
                    })
                  }
        
                  if (!sessionStorage.getItem('userPeople')) {
                    this._crud.read({
                      collectionsAndDocs: ['companies', fbRes['user']['uid'],'userPeople']
                    }).then(resUserPeople => {
                      sessionStorage.setItem('userPeople', JSON.stringify(resUserPeople))
                    })
                  }

                  this._router.navigate([params.navigateTo]);
                }
              })
            } else {
              if (!sessionStorage.getItem('userData')) {
                resPeople[0]['userType'] = 'people';
                sessionStorage.setItem('userData', JSON.stringify(resPeople));
              }

              if (!sessionStorage.getItem('userCompanies')) {
                this._crud.read({
                  collectionsAndDocs: ['people', fbRes['user']['uid'],'userCompanies']
                }).then(resUserCompanies => {
                  sessionStorage.setItem('userCompanies', JSON.stringify(resUserCompanies))
                })
              }
    
              if (!sessionStorage.getItem('userPeople')) {
                this._crud.read({
                  collectionsAndDocs: ['people', fbRes['user']['uid'],'userPeople']
                }).then(resUserPeople => {
                  sessionStorage.setItem('userPeople', JSON.stringify(resUserPeople))
                })
              }

              this._router.navigate([params.navigateTo]);
            }
          })

          if (!sessionStorage.getItem('companiesDocuments')) {
            this._crud.read({
              collectionsAndDocs: ['documents'],
              where: [
                ['type', '==', 'companies']
              ]
            }).then(res => {
              let documents;
              documents = res['filter'](el => el.name !== 'CNPJ')

              sessionStorage.setItem('companiesDocuments', JSON.stringify(documents));
            })
          }

          if (!sessionStorage.getItem('peopleDocuments')) {
            this._crud.read({
              collectionsAndDocs: ['documents'],
              where: [
                ['type', '==', 'people']
              ]
            }).then(res => {
              let documents = res['filter'](el => el.name !== "CPF")

              sessionStorage.setItem('peopleDocuments', JSON.stringify(documents))
            })
          }

          if (!sessionStorage.getItem('contacts')) {
            this._crud.read({
              collectionsAndDocs: ['contacts'],
            }).then(res => {
              sessionStorage.setItem('contacts', JSON.stringify(res))
            })
          }

          res(fbRes);
        } else {
          res(fbRes);
          if(fbRes) {
            this._snackbar.open(fbRes['message'],'',{
              duration: 4000
            })
          }
        }
      })
    }
  })

  logout = (params) => new Promise((res, rej) => {  
    if(!params) {
      res({
        code: 'lg-error-01',
        message: 'Defina parâmetros mínimos'
      })
    } else {
      if(!params.navigateTo) {
        res({
          code: 'lg-error-02',
          message: 'Parâmetro obrigatório: navigateTo'
        })
      }

      sessionStorage.clear();

      _authentication.signOut();

      this._router.navigate([params.navigateTo]);
    }
  })

  setUser = () => new Promise((res, rej) => {
    _authentication.onAuthStateChanged(resAuth => {
      if(resAuth) {
        let user = {
          id: resAuth.uid,
          fbObject: resAuth
        }
    
        res(user);
      } else {
        res(false);
      }
    })
  })
}
import { Injectable } from '@angular/core';

/**
 * Third party class
 */
import { initializeApp } from 'firebase';

const _firestore = initializeApp({
  apiKey: "AIzaSyBGXN1FkZjubMRWJ-KuAaAnpCTXlHFl9zw",
  authDomain: "quickstart-belamondo.firebaseapp.com",
  databaseURL: "https://quickstart-belamondo.firebaseio.com",
  projectId: "quickstart-belamondo",
  storageBucket: "quickstart-belamondo.appspot.com",
  messagingSenderId: "506374782568"
}, 'database').firestore();

@Injectable()
export class CrudService {

  constructor() {
  }

  create = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'c-error-01',
        message: 'Minimum params required'
      })
    } else {
      if(!params.collectionsAndDocs) {
        resolve({
          code: 'c-error-02',
          message: 'Required param: collection'
        })
      }

      if(!params.objectToCreate) {
        resolve({
          code: 'c-error-03',
          message: 'Required param: objectToCreate'
        })
      }

      let key, obj, ref, res, objFiltered, stringToFilter, stringCreatingFilter, functionToFilter;

      stringToFilter = "_firestore";
      stringCreatingFilter = "";

      for(let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
        if((i == 0) || (i%2 == 0)) {
          stringCreatingFilter += ".collection('"+params.collectionsAndDocs[i]+"')";
        } else {
          stringCreatingFilter += ".doc('"+params.collectionsAndDocs[i]+"')";
        }
      }

      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringCreatingFilter += ".where('"+params.where[i][0]+"', '"+params.where[i][1]+"', '"+params.where[i][2]+"')";
        }
      }

      stringToFilter += stringCreatingFilter;
      functionToFilter = eval(stringToFilter);

      functionToFilter
      .add(params.objectToCreate)
      .catch(err => {
        return err;
      })
      .then(res => {
        resolve(res);
      })
    }
  })

  delete = (params) => new Promise((resolve, reject) => {

  })

  read = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'r-error-01',
        message: 'Minimum params required'
      })
    } else {
      let key, obj, ref, res, objFiltered, stringToFilter, stringCreatingFilter, functionToFilter;
    
      if(!params.collectionsAndDocs) {
        resolve({
          code: 'r-error-02',
          message: 'Required param: collectionsAndDocs'
        })
      }

      if(params.where && params.whereId) {
        resolve({
          code: 'u-error-03',
          message: 'Params conflict: where AND whereId'
        })
      }

      stringToFilter = "_firestore";
      stringCreatingFilter = "";

      for(let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
        if((i == 0) || (i%2 == 0)) {
          stringCreatingFilter += ".collection('"+params.collectionsAndDocs[i]+"')";
        } else {
          stringCreatingFilter += ".doc('"+params.collectionsAndDocs[i]+"')";
        }
      }

      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringCreatingFilter += ".where('"+params.where[i][0]+"', '"+params.where[i][1]+"', '"+params.where[i][2]+"')";
        }
      }

      stringToFilter += stringCreatingFilter;
      functionToFilter = eval(stringToFilter);

      functionToFilter
      .get()
      .then((querySnapshot) => {
        let result = [];
        
        if(querySnapshot.exists) { 
          if(querySnapshot.docs) { 
            querySnapshot.forEach((doc) => {
              result.push({
                _id: doc.id,
                _data: doc.data()
              })
            });
          } else { 
            result.push({
              _id: querySnapshot.id,
              _data: querySnapshot.data()
            })
          }
        }

        resolve(result);
      })
    }
  })

  update = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'u-error-01',
        message: 'Minimum params required'
      })
    } else {
      let key, obj, ref, res, objFiltered, stringToFilter, stringCreatingFilter, functionToFilter;
    
      if(!params.collectionsAndDocs) {
        resolve({
          code: 'u-error-02',
          message: 'Required param: collection'
        })
      }

      if(!params.objectToUpdate) {
        resolve({
          code: 'u-error-03',
          message: 'Required param: objectToUpdate'
        })
      }

      if(params.where && params.whereId) {
        resolve({
          code: 'u-error-03',
          message: 'Params conflict: where AND whereId'
        })
      }

      stringToFilter = "_firestore";
      stringCreatingFilter = "";

      for(let lim = params.collectionsAndDocs.length, i = 0; i < lim; i++) {
        if((i == 0) || (i%2 == 0)) {
          stringCreatingFilter += ".collection('"+params.collectionsAndDocs[i]+"')";
        } else {
          stringCreatingFilter += ".doc('"+params.collectionsAndDocs[i]+"')";
        }
      }
      
      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringCreatingFilter += ".where('"+params.where[i][0]+"', '"+params.where[i][1]+"', '"+params.where[i][2]+"')";
        }
      }

      stringToFilter += stringCreatingFilter;
      functionToFilter = eval(stringToFilter);

      functionToFilter
      .set(params.objectToUpdate)
      .then(res => {
        resolve({
          code: 'u-success-01',
          message: 'Update successful'
        })
      })
    }
  })
}

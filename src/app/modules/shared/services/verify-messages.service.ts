import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './firebase/crud.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyMessagesService {
  private messages: Observable<Object[]>;
  private verifier: any;

  constructor(private _crud: CrudService) { }

  getMessages = (room) => new Observable(observer => {
    this._crud.readMsg({
      collectionsAndDocs: ['chats', room.toLowerCase(), 'messages']
    }).subscribe(messages => {
      observer.next(messages);
    });
  })

  // getMessages(room): Observable<Object[]> {
  //   return this._crud.read({
  //       collectionsAndDocs: ['chats', room.toLowerCase(), 'messages']
  //     }).map(res => res.json())
  //     .catch(err => Observable.throw(err.message));
  // }
}

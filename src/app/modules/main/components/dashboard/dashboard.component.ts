import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chatContent: any;
  public chatForm: FormGroup;
  public chatSearchForm: FormGroup;
  public currentRoom: string;
  public rooms: any;
  public isStarted: boolean;
  public user: any;
  public userData: any;

  constructor(
    private _crud: CrudService
  ) { }

  ngOnInit() {
    this.chatForm = new FormGroup({
      message: new FormControl(null)
    });

    this.chatSearchForm = new FormGroup({
      room: new FormControl(null)
    });

    this.isStarted = true;
    this.rooms = [];
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  createRoomList = () => {
    this.isStarted = false;

    this._crud
    .read({
      collectionsAndDocs: ['chats', this.chatSearchForm.value.room.toLowerCase()]
    }).then(res => {
      if (!res[0] || res[0].length > 0) {
        this._crud
        .update({
          collectionsAndDocs: ['chats', this.chatSearchForm.value.room.toLowerCase()],
          objectToUpdate: {
            createdAt: new Date(),
            owner: this.user['user']['uid']
          }
        }).then(newRoom => {
          this.isStarted = true;
          this.rooms.push(this.chatSearchForm.get('room').value);
          this.chatSearchForm.reset();
        });
      } else {
        this.isStarted = true;
        this.rooms.push(this.chatSearchForm.get('room').value);
        this.chatSearchForm.reset();
      }
    });
  }

  openChatRoom = (room) => {
    this.currentRoom = room;

    this._crud.read({
      collectionsAndDocs: ['chats', room.toLowerCase(), 'messages']
    }).then(messages => {
      this.chatContent = messages;
    });
  }

  removeFromRoomArray = (index) => {
    this.rooms.splice(index, 1);
  }

  sendMessage = () => {
    let newMessageDoc;
    newMessageDoc = Date.now() + this.user['user']['uid'];
    console.log(this.currentRoom);
    this._crud
    .update({
      collectionsAndDocs: ['chats', this.currentRoom.toLowerCase(), 'messages', newMessageDoc],
      objectToUpdate: {
        message: this.chatForm.value.message,
        owner: this.user['user']['uid'],
        name: this.userData[0]['name'],
        timestamp: Date.now()
      }
    });
  }
}

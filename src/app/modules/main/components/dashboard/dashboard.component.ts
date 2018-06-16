import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Services
 */
import { CrudService } from '../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chatSearchForm: FormGroup;
  public rooms: any;
  public isStarted: boolean;
  public userData: any;

  constructor(
    private _crud: CrudService
  ) { }

  ngOnInit() {
    this.chatSearchForm = new FormGroup({
      room: new FormControl(null)
    });

    this.isStarted = true;
  }

  openChatRoom = () => {
    this.isStarted = false;

    this._crud
    .read({
      collectionsAndDocs: ['chats', this.chatSearchForm.value.room]
    }).then(res => {
      if (!res[0] || res[0].length > 0) {
        this._crud
        .update({
          collectionsAndDocs: ['chats', this.chatSearchForm.value.room]
        });
      } else {

      }
    });
  }
}

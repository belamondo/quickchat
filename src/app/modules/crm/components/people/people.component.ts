import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

/**
 * Components
 */
import { DialogPersonComponent } from '../../../shared/components/dialog-person/dialog-person.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  public isStarted: boolean;
  public userData: any;
  
  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    public _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    this.isStarted = false;

    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id'],'userPeople'],
    }).then(res => {
      this.isStarted = true;
      console.log(res)
    })
  }

  openPersonDialog = () => {
    let dialogRef = this._dialog.open(DialogPersonComponent, {
      width: '99%',
      height: '99%',
      data: {
        isCRM: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDatepickerIntl, MatSnackBar, MatDialog } from '@angular/material';

/**
 * Components
 */
import { DialogAddressComponent } from './../../../shared/components/dialog-address/dialog-address.component';
import { DialogContactComponent } from '../../../shared/components/dialog-contact/dialog-contact.component';
import { DialogDocumentComponent } from '../../../shared/components/dialog-document/dialog-document.component';

/**
 * Services
 */
import { AuthenticationService } from '../../../shared/services/firebase/authentication.service';
import { CrudService } from '../../../shared/services/firebase/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-choice',
  templateUrl: './profile-choice.component.html',
  styleUrls: ['./profile-choice.component.css']
})
export class ProfileChoiceComponent implements OnInit {
  public peopleForm: FormGroup;
  public profileChoiceForm: FormGroup;
  
  public mask: any;

  public autoCorrectedDatePipe: any;
  public addressesObject: any;
  public addresses: any;
  public clientType: string;
  public contactsObject: any;
  public contacts: any;
  public documentsObject: any;
  public documents: any;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _dialog: MatDialog,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) {
  }
  
  ngOnInit() {
    this.mask = {
      cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/ ],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/]
    };
    
    this.profileChoiceForm = new FormGroup({
      description: new FormControl(null)
    });
  
    this.peopleForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required)
    });
  }

  addAddress = () => {
    let dialogRef = this._dialog.open(DialogAddressComponent, {
      height: '500px',
      width: '800px',
      data: {
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)

        this.addressesObject.push(result);
      }
    });
  }

  deleteAddress = (i) => {
    this.addressesObject.splice(i, 1);
  }

  addContact = () => {
    let dialogRef = this._dialog.open(DialogContactComponent, {
      height: '250px',
      width: '800px',
      data: {
        contacts: this.contacts,
        mask: this.mask
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contacts.forEach(element => {
          if (element._data.mask === result.type) {
            result.type = element._data.name;
          }
        });

        this.contactsObject.push(result);
      }
    });
  }

  deleteContact = (i) => {
    this.contactsObject.splice(i, 1);
  }

  addDocument = () => {
    let dialogRef = this._dialog.open(DialogDocumentComponent, {
      height: '320px',
      width: '800px',
      data: {
        documents: this.documents,
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documents.forEach(element => {
          if (element._data.mask === result.type) {
            result.type = element._data.name;
          }
        });

        this.documentsObject.push(result);
      }
    });
  }

  deleteDocument = (i) => {
    this.documentsObject.splice(i, 1);
  }

  onBirthdayChange = (event) => {
    this.peopleForm.get('birthday').setValue(event.targetElement.value);
  }

  onPeopleFormSubmit = () => {
    this._auth.setUser()
      .then(res => {
        this._crud.read({
          collection: 'people',
          whereId: res['id']
        }).then(resPeople => {
          if (resPeople['length'] > 0) {
            this._router.navigate(['/main/dashboard'])

            this._snackbar.open('Você já escolheu seu tipo de perfil e não pode alterá-lo.', '', {
              duration: 4000
            })
  
            return false;
          } else {
            this._crud.update({
              collection: 'people',
              whereId: res['id'],
              objectToUpdate: this.peopleForm.value
            }).then(res => {
              this._router.navigate(['/main/dashboard'])

              this._snackbar.open('Perfil cadastrado. Bem vindo.', '', {
                duration: 4000
              })
    
              return true;
            })
          }
        })
      })
  }
}

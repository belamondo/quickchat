import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

/**
 * Components
 */
import {
  DialogAddressComponent
} from '../../../shared/components/dialog-address/dialog-address.component';
import {
  DialogContactComponent
} from '../../../shared/components/dialog-contact/dialog-contact.component';
import {
  DialogDocumentComponent
} from '../../../shared/components/dialog-document/dialog-document.component';

/**
 * Services
 */
import {
  CrudService
} from './../../../shared/services/firebase/crud.service';

/**
 * Third party
 */
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import {
  Observable
} from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';

/**
 * Validators
 */
import {
  ValidateCnpj
} from '../../../shared/validators/cnpj.validator';
import {
  ValidateCpf
} from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  //Common properties: start
  public personForm: FormGroup;
  public isStarted: boolean;
  public mask: any;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  //Common properties: end

  public autoCorrectedDatePipe: any;
  public addressesObject: any;
  public addresses: any;
  public clientType: string;
  public contactsObject: any;
  public contacts: any;
  public documentsObject: any;
  public documents: any;
  public relationships: any;
  public relationshipsObject: any;

  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.personForm = new FormGroup({
      cpf: new FormControl(null, [Validators.required, ValidateCpf]),
      name: new FormControl(null, Validators.required),
      birthday: new FormControl(null),
      gender: new FormControl(null, Validators.required),
    });

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];

    this.documentsObject = [];

    this.contactsObject = [];
    this.contacts = JSON.parse(sessionStorage.getItem('contacts'));

    this.isStarted = false;
    this.mask = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

    this.peopleRelatedFormInit();
  }

  peopleRelatedFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar pessoa";
        this.submitButton = "Atualizar";

        let userData = JSON.parse(sessionStorage.getItem('userData'));
        let param = this.paramToSearch.replace(':', '');

        this._crud
          .read({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated'],
          }).then(res => {
            this.personForm.patchValue(res['obj'][0]);

            this.isStarted = true;
          })

      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar pessoa";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
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

  checkPersonExistence = (cpf) => {
    if (!this.personForm.get('cpf').errors) {
      //Check existence of peopleRelated by cpf, first on sessionStorage, then, if there are at least 400 peopleRelated in the sesionStorage (populated on crm.guard || cash-flow.guard) and none of then are related to the cpf, look on firestore peopleRelated collection

      console.log(sessionStorage.getItem('peopleRelated'))
    }
  }

  onPersonFormSubmit = (formDirective: FormGroupDirective) => {
    let userData = JSON.parse(sessionStorage.getItem('userData'));

    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',this.paramToSearch.replace(':', '')],
          objectToUpdate: this.personForm.value
        });

      if (this.documentsObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',this.paramToSearch.replace(':', ''),'peopleRelatedDocuments',this.paramToSearch.replace(':', '')],
            objectToUpdate: JSON.stringify(this.documentsObject)
          });
      }

      if (this.contactsObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',this.paramToSearch.replace(':', ''),'peopleRelatedContacts',this.paramToSearch.replace(':', '')],
            objectToUpdate: JSON.stringify(this.contactsObject)
          });
      }

      if (this.addressesObject.length > 0) {
        this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',this.paramToSearch.replace(':', ''),'peopleRelatedAddresses',this.paramToSearch.replace(':', '')],
            objectToUpdate: {
              addressesToParse: JSON.stringify(this.addressesObject)
            }
          });
      }
    }

    if (this.submitToCreate) {
      formDirective.resetForm();

      this._crud
      .create({
        collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated'],
        objectToCreate: this.personForm.value
      }).then(res => { 
        if(this.documentsObject.length > 0) {
          this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',res['id'],'peopleRelatedDocuments',res['id']],
            objectToUpdate: {
              documentsToParse: JSON.stringify(this.documentsObject)
            }
          })
        };

        if(this.contactsObject.length > 0) {
          this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',res['id'],'peopleRelatedContacts',res['id']],
            objectToUpdate: {
              contactsToParse: JSON.stringify(this.contactsObject)
            }
          })
        };

        if(this.addressesObject.length > 0) {
          this._crud
          .update({
            collectionsAndDocs: [userData[0]['_data']['userType'],userData[0]['_id'],'peopleRelated',res['id'],'peopleRelatedAddresses',res['id']],
            objectToUpdate: {
              addressesToParse: JSON.stringify(this.addressesObject)
            }
          })
        };

        this.documentsObject = [];

        this.contactsObject = [];

        this.addressesObject =[];
      })
    }
  }
}

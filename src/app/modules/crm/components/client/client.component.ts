import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
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
import { ValidateCnpj } from '../../../shared/validators/cnpj.validator';
import { ValidateCpf } from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  //Common properties: start
  public personForm: FormGroup;
  public companyForm: FormGroup;
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

    this.companyForm = new FormGroup({
      cnpj: new FormControl(null, [Validators.required,ValidateCnpj]),
      business_name: new FormControl(null, Validators.required),
      company_name: new FormControl(null, Validators.required)
    });

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];

    this.documentsObject = [];

    this.contactsObject = [];
    this.contacts = JSON.parse(sessionStorage.getItem('contacts'));

    this.isStarted = false;
    this.mask = {
      cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/ ],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

    this.clientFormInit();
  }

  clientFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar cliente";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        if (this.clientType === 'person') {
          this._crud
            .read({
              collection: "clientsPeople",
              whereId: param
            }).then(res => {
              this.personForm.patchValue(res['obj'][0]);
  
              this.isStarted = true;
            })
        } else {
          this._crud
            .read({
              collection: "clientsCompanies",
              whereId: param
            }).then(res => {
              this.companyForm.patchValue(res['obj'][0]);
  
              this.isStarted = true;
            })
        }
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar cliente";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
  }

  clientTypeChoice = (event) => {
    this.clientType = event.value;

    if (this.clientType === 'person') {
      this.documents = JSON.parse(sessionStorage.getItem('peopleDocuments'));
    } else {
      this.documents = JSON.parse(sessionStorage.getItem('companiesDocuments'));
    }
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

  checkPersonExistence = (cpf) =>{
    if(!this.personForm.get('cpf').errors) {
      //Check existence of client by cpf, first on sessionStorage, then, if there are at least 400 clients in the sesionStorage (populated on crm.guard || cash-flow.guard) and none of then are related to the cpf, look on firestore clients collection

      console.log(sessionStorage.getItem('clients'))
    }
  }

  onCompanyFormSubmit = () => {
    console.log(this.companyForm.value)  
  }

  onPersonFormSubmit = () => {
    if(this.submitToUpdate) {
      this._crud
      .update({
        collection: 'clientsPeople',
        whereId: this.paramToSearch.replace(':', ''),
        objectToUpdate: this.personForm.value
      });

      if(this.documentsObject.length > 0) {
        this._crud
        .update({
          collection: 'clientsPeople/'+this.paramToSearch.replace(':', ''),
          whereId: this.paramToSearch.replace(':', ''),
          objectToUpdate: JSON.stringify(this.documentsObject)
        });
      }

      if(this.contactsObject.length > 0) {
        this._crud
        .update({
          collection: 'clientsPeopleContacts',
          whereId: this.paramToSearch.replace(':', ''),
          objectToUpdate: JSON.stringify(this.contactsObject)
        });
      }

      if(this.addressesObject.length > 0) {
        this._crud
        .update({
          collection: 'clientsPeopleAddresses',
          whereId: this.paramToSearch.id,
          objectToUpdate: {
            addressesToParse: JSON.stringify(this.addressesObject)
          }
        });
      }
    }

    if(this.submitToCreate) {
      this._crud
      .create({
        collection: 'clientsPeople',
        objectToCreate: this.personForm.value
      }).then(res => {
        console.log(this.contactsObject)
        if(this.documentsObject.length > 0) {
          this._crud
          .update({
            collection: 'clientsPeopleDocuments',
            whereId: res['id'],
            objectToUpdate: {
              documentsToParse: JSON.stringify(this.documentsObject)
            }
          }).then(res => {
            console.log(res)
          })
        };

        if(this.contactsObject.length > 0) {
          this._crud
          .update({
            collection: 'clientsPeopleContacts',
            whereId: res['id'],
            objectToUpdate: {
              contactsToParse: JSON.stringify(this.contactsObject)
            }
          })
        };

        if(this.addressesObject.length > 0) {
          this._crud
          .update({
            collection: 'clientsPeopleAddresses',
            whereId: res['id'],
            objectToUpdate: this.addressesObject
          })
        };
      })
    }
  }
}

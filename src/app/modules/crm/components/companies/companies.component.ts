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
import { DialogRelationshipComponent } from '../../../shared/components/dialog-relationship/dialog-relationship.component';

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
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  //Common properties: start
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
    this.companyForm = new FormGroup({
      //cnpj: new FormControl(null, [Validators.required,ValidateCnpj]),
      business_name: new FormControl(null, Validators.required),
      company_name: new FormControl(null, Validators.required)
    });

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.addressesObject = [];

    this.documentsObject = [];

    this.contactsObject = [];

    this.relationshipsObject = [];

    this.isStarted = false;
    this.mask = {
      cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/],
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
        this.title = "Atualizar empresa";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this._crud
          .read({
            collection: "",
            whereId: param
          }).then(res => {
            this.companyForm.patchValue(res['obj'][0]);

            this.isStarted = true;
          })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar empresa";
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

  addRelationship = () => {
    let dialogRef = this._dialog.open(DialogRelationshipComponent, {
      height: '320px',
      width: '800px',
      data: {
        relationships: this.relationships,
        mask: this.mask,
        autoCorrectedDatePipe: this.autoCorrectedDatePipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.relationships.forEach(element => {
          if (element._data.mask === result.type) {
            result.type = element._data.name;
          }
        });

        this.relationshipsObject.push(result);
      }
    });
  }

  deleteRelationship = (i) => {
    this.relationshipsObject.splice(i, 1);
  }

  onCompanyFormSubmit = () => {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userData[0]['_data']['userType']+'/'+userData[0]['_id'])
    // if(this.submitToUpdate) {
    // } 

    // if(this.submitToCreate) {
    //   this._crud
    //   .create({
    //     collection: 
    //   })
    // }
  }
}

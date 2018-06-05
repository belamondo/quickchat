import {
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

/**
 * Third party
 */
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-incoming-outcoming',
  templateUrl: './incoming-outcoming.component.html',
  styleUrls: ['./incoming-outcoming.component.css']
})
export class IncomingOutcomingComponent implements OnInit {

  //Common properties: start
  public incomingOutcomingForm: FormGroup;
  public isStarted: boolean;
  public mask: any;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  public types: any = [];
  public receivers: any = [];
  public userData: any;
  public outcomingsTypes: any;
  public inAndOut: any = { arrayOfOutcoming: [], arrayOfIncoming: [] };
  //Common properties: end

  /* Mock - start */
  public incomingsTypes: any = [
    { name: 'Impressão A4 PB' },
    { name: 'Plotagem' },
    { name: 'Caderno personalizado' },
  ]
  /* Mock - end */

  public autoCorrectedDatePipe: any;

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    /* Mock - start */
    this.receivers = [
      { name: 'Papelaria Joarez' },
      { name: 'IFAL' },
      { name: 'Cliente balcão' },
    ]
    /* Mock - end */

    this.incomingOutcomingForm = new FormGroup({
      modality: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      receiver: new FormControl(null),
      qtd: new FormControl(null),
      lostQtd: new FormControl(null),
      price: new FormControl(null, Validators.required),
      payment: new FormControl(null, Validators.required),
      paymentQtd: new FormControl(null),
      date: new FormControl(null, Validators.required),
    });

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

    this.mask = {
      cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/ ],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/]
    };

    this.incomingOutcomingFormInit();

    /* Get expenses types from database */
    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id'],'expensesTypes'],
    }).then(res => {
      this.outcomingsTypes = res;
    })

    /* Get incomings and outcomings of the actual month from database */
    this._crud.read({
      collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id'],'inAndOut','201806']  // TODO: pegar ano e mês atual
    }).then(res => {
      if(res[0] !== undefined){
        this.inAndOut = {
          arrayOfOutcoming: res[0]['arrayOfOutcoming'],
          arrayOfIncoming: res[0]['arrayOfIncoming']
        }
      }
    })

  }

  incomingOutcomingFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar lançamento";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar lançamento";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
  }

  onIncomingOutcomingFormSubmit = (formDirective: FormGroupDirective) => {
    
    /* Set the object to update in database */
    if(this.incomingOutcomingForm.controls['modality'].value === 'outcoming'){
      this.inAndOut['arrayOfOutcoming'].push(this.incomingOutcomingForm.value)
    } else {
      this.inAndOut['arrayOfIncoming'].push(this.incomingOutcomingForm.value)
    }

    if (this.submitToCreate) {
      this._crud
      .update({
        collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id'],'inAndOut', '201806'], // TODO: pegar ano e mês atual
        objectToUpdate: this.inAndOut
      }).then(res => { 
        formDirective.resetForm();
        
        this._snackbar.open('Cadastro feito com sucesso', '', {
          duration: 4000
        })
      })
    }
  }

  getListOfTypes = (value) => {
    if(value === 'outcoming'){
      this.types = this.outcomingsTypes
    } else if(value === 'incoming'){
      this.types = this.incomingsTypes
    }
  }

  addField = () => {
    let dialogRef = this.dialog.open(DialogFormIncomingOutcomingComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.incomingOutcomingForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.incomingOutcomingForm.removeControl(this.fields[index]);
    this.fields.splice(index, 1);
  }

}

/**
 * Dialog
 */
@Component({
  selector: 'dialog-form',
  templateUrl: './dialog-form.html',
})
export class DialogFormIncomingOutcomingComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormIncomingOutcomingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
import {
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatTableDataSource
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
  public incomingsAndOutcomings: any = [
    /* Mock - start */
    { date: '27/05/2018', modality: 'Despesa', type: 'Salário administração', price: 3000},
    { date: '27/05/2018', modality: 'Receita', type: 'Impressão A4 PB', price: 20},
    { date: '27/05/2018', modality: 'Despesa', type: 'Aluguel', price: 800},
    { date: '27/05/2018', modality: 'Receita', type: 'Plotagem', price: 50},
    { date: '27/05/2018', modality: 'Despesa', type: 'Energia', price: 150},
    { date: '27/05/2018', modality: 'Receita', type: 'Caderno personalizado', price: 40}
    /* Mock - end */
  ];
  //Common properties: end

  /* Table stuffs: start */
  public displayedColumns = ['date', 'modality', 'type', 'price'];
  public dataSource = new MatTableDataSource<IncomingOutcoming>(this.incomingsAndOutcomings);
  /* Table stuffs: end */

  /* Mock - start */
  public outcomings: any = [
    { name: 'Salário administração', type: 'expense' },
    { name: 'Aluguel', type: 'fixed-cost' },
    { name: 'Energia', type: 'variable-cost' },
  ]

  public incomings: any = [
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
      receiver: new FormControl(null, Validators.required),
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

  onIncomingOutcomingFormSubmit = () => { }

  getListOfTypes = (value) => {
    if(value === 'outcoming'){
      this.types = this.outcomings
    } else if(value === 'incoming'){
      this.types = this.incomings
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

/* Table stuffs: continuation */
export interface IncomingOutcoming {
  date: string;
  modality: string;
  type: string;
  price: number;
}
/* Table stuffs: end */
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

import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  //Common properties: start
  public expenseForm: FormGroup;
  public isStarted: boolean;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  public fields: any = [];
  public userData: any;
  //Common properties: end

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    this.expenseForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required)
    });

    this.expenseFormInit();

  }

  expenseFormInit = () => {
    this._route.params.subscribe(params => {
      if (params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Atualizar tipo de despesa";
        this.submitButton = "Atualizar";

        let param = this.paramToSearch.replace(':', '');

        this._crud.read({
          collectionsAndDocs: [this.userData[0]['_data']['userType'],this.userData[0]['_id'],'expensesTypes',param],
        }).then(res => {
          this.expenseForm.patchValue(res[0]['_data'])

          /* Check if has additionals fields */
          if(Object.keys(res[0]['_data']).length > 2){
            for (var key in res[0]['_data']) {
              /* Create form control if it is a additional field */
              if(key !== 'name' && key !== 'type'){
                this.expenseForm.addControl(key, new FormControl(res[0]['_data'][key]));
                this.fields.push(key);
              };
            }
          }

          this.isStarted = true;
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar tipo de despesa";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
  }

  onExpenseFormSubmit = (formDirective: FormGroupDirective) => {
    if (this.submitToUpdate) {
      this._crud
        .update({
          collectionsAndDocs: [this.userData[0]['_data']['userType'],this.userData[0]['_id'],'expensesTypes',this.paramToSearch.replace(':', '')],
          objectToUpdate: this.expenseForm.value
        }).then(res => {
          this._snackbar.open('Atualização feita com sucesso', '', {
            duration: 4000
          })
        })
    }

    if (this.submitToCreate) {
      this._crud
      .create({
        collectionsAndDocs: [this.userData[0]['_data']['userType'],this.userData[0]['_id'],'expensesTypes'],
        objectToCreate: this.expenseForm.value
      }).then(res => { 
        formDirective.resetForm();
        
        this._snackbar.open('Cadastro feito com sucesso', '', {
          duration: 4000
        })
      })
    }
  }

  addField = () => {
    let dialogRef = this.dialog.open(DialogFormExpenseComponent, {
      height: '250px',
      width: '600px',
      data: { title: 'Adicionar campo', field: 'Nome do campo', buttonDescription: 'Adicionar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.expenseForm.addControl(result, new FormControl(null));
        this.fields.push(result);
      }
    });
  }

  removeField = (index) => {
    this.expenseForm.removeControl(this.fields[index]);
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
export class DialogFormExpenseComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
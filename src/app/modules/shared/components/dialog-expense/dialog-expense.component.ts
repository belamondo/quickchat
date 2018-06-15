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
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-dialog-expense',
  templateUrl: './dialog-expense.component.html',
  styleUrls: ['./dialog-expense.component.css']
})
export class DialogExpenseComponent implements OnInit {

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
  public expenses:any = [{name: 'luz'}, {name: 'aluguel'}, {name: 'segurança'}];
  public paramsToTableData: any;
  //Common properties: end

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
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
          collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id'],'expensesTypes',param],
        }).then(res => {
          this.expenseForm.patchValue(res[0])

          /* Check if has additionals fields */
          if(Object.keys(res[0]).length > 2){
            for (var key in res[0]) {
              /* Create form control if it is a additional field */
              if(key !== 'name' && key !== 'type'){
                this.expenseForm.addControl(key, new FormControl(res[0][key]));
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

}

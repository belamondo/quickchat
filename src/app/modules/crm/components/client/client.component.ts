import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
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
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  //Common properties: start
  public clientForm: FormGroup;
  public isStarted: boolean;
  public mask: any;
  public paramToSearch: any;
  public submitButton: string;
  public submitToCreate: boolean;
  public submitToUpdate: boolean;
  public title: string;
  //Common properties: end

  public clientDocumentForm: FormGroup;

  public autoCorrectedDatePipe: any;
  public documents: any;
  public filteredOptions: Observable<string[]>;

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) {
  }
  
  ngOnInit() {
    this.clientForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
    });

    this.clientDocumentForm = new FormGroup({
      type: new FormControl(null)
    })

    this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
    this.documents = JSON.parse(sessionStorage.getItem('documents'));
    
    this.filteredOptions = this.clientDocumentForm.get('type').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => {
          return this.filter(value)
          // typeof value === 'string' ? value : value
        }),
        //map(name => name ? this.filter(name) : this.documents.slice())
      );

    this.isStarted = false;

    this.mask = {
      cpf: [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/,/\d/ ],
      date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      zip: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
      phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')',' ' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cnpj: [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/]
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

        this._crud
          .read({
            route: "clients",
            where: [{
              field: "id",
              value: param
            }]
          }).then(res => {
            this.clientForm.patchValue(res['obj'][0]);

            this.isStarted = true;
          })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Cadastrar cliente";
        this.submitButton = "Cadastrar";

        this.isStarted = true;
      }
    })
  }

  filter(name: string) { console.log(name)
    if(name) {      
      return this.documents.filter(option =>
        option._data.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
  }

  displayFn(user?): string | undefined {
    return user ? user.name : undefined;
  }

  onClientFormSubmit = () => {}
}

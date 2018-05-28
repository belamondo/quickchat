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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  //Common properties: start
  public mask: any;
  public operationalReportForm: FormGroup;
  public isStarted: boolean;
  //Common properties: end

  public autoCorrectedDatePipe: any;

  constructor(
    private _crud: CrudService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.operationalReportForm = new FormGroup({
      date: new FormControl(null),
      dailyInitialValue: new FormControl(null),
      dailySales: new FormControl(null),
      dailyCashSales: new FormControl(null),
      dailyFinancedSales: new FormControl(null),
      dailyExpenses: new FormControl(null),
      dailyAdmExpenses: new FormControl(null),
      dailyFixedCosts: new FormControl(null),
      dailyVariableCosts: new FormControl(null),
      dailyFinalValue: new FormControl(null),
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

    /* Mock: start */
    this.operationalReportForm.controls['dailySales'].setValue(10000);
    this.operationalReportForm.controls['dailyCashSales'].setValue(9000);
    this.operationalReportForm.controls['dailyFinancedSales'].setValue(1000);
    this.operationalReportForm.controls['dailyExpenses'].setValue(3000);
    this.operationalReportForm.controls['dailyAdmExpenses'].setValue(1000);
    this.operationalReportForm.controls['dailyFixedCosts'].setValue(1000);
    this.operationalReportForm.controls['dailyVariableCosts'].setValue(1000);
    /* Mock: end */

    this.isStarted = true;

  }

  calculateDailyFinalValue = (event) => {
    let initialValue = event.target.value;
    let finalValue = initialValue / 1 + this.operationalReportForm.controls['dailySales'].value / 1 - this.operationalReportForm.controls['dailyExpenses'].value / 1;
    this.operationalReportForm.controls['dailyFinalValue'].setValue(finalValue);
  }

}

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
  public reportForm: FormGroup;
  public isStarted: boolean;
  
  public operationalReport: boolean = true;
  
  public taticalReport: boolean = false;
  public incomingOutcomingReport: boolean = true;
  public incomings: any = [];
  public outcomings: any = [];
  public report: any = { groupsOfIncomings: [], groupsOfOutcomings: [] };
  
  public estrategicReport: boolean = false;
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

    this.reportForm = new FormGroup({
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
    this.reportForm.controls['dailySales'].setValue(10000);
    this.reportForm.controls['dailyCashSales'].setValue(9000);
    this.reportForm.controls['dailyFinancedSales'].setValue(1000);
    this.reportForm.controls['dailyExpenses'].setValue(3000);
    this.reportForm.controls['dailyAdmExpenses'].setValue(1000);
    this.reportForm.controls['dailyFixedCosts'].setValue(1000);
    this.reportForm.controls['dailyVariableCosts'].setValue(1000);

    this.incomings = ['Impressão A4 PB', 'Impressão A4 Colorida', 'Impressão A3 PB', 'Impressão A3 Colorida']
    this.outcomings = ['Energia', 'Internet', 'Aluguel', 'Resma A4', 'Resma A3']
    /* Mock: end */

    this.isStarted = true;

  }

  /* Show the report choosen by user */
  showReport = (report) => {
    this.operationalReport = false;
    this.taticalReport = false;
    this.estrategicReport = false;

    if(report === 'operational'){
      this.operationalReport = true;
    } else if(report === 'tatical'){
      this.taticalReport = true;
    } else {
      this.estrategicReport = true;
    }
  }

  /* Show the incoming/outcoming report choosen by user */
  showIncomingOutcomingReport = () => {
    this.incomingOutcomingReport = !this.incomingOutcomingReport;
  }

  /* Add a new group of incoming */
  addNewIncomingGroup = () => {
    let dialogRef = this.dialog.open(DialogFormReportComponent, {
      height: '250px',
      width: '600px',
      data: { 
        title: 'Adicionar grupo', 
        field: 'Nome do grupo', 
        buttonDescription: 'Adicionar', 
        isAGroup: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.report.groupsOfIncomings.push({ name: result, totalValue: 0, incomings: [] });
      }
    });
  }

  /* Add a new incoming in a group */
  addNewIncominginGroup = (index) => {
    let dialogRef = this.dialog.open(DialogFormReportComponent, {
      height: '250px',
      width: '600px',
      data: {
        title: 'Adicionar receita', 
        field: 'Nome da receita', 
        buttonDescription: 'Adicionar', 
        isAIncomingOrOutcoming: true,
        incomingsOrOutcomings: this.incomings
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.report.groupsOfIncomings[index]['incomings'].push(result);
      }
    });
  }

  /* Add a new group of outcoming */
  addNewOutcomingGroup = () => {
    let dialogRef = this.dialog.open(DialogFormReportComponent, {
      height: '250px',
      width: '600px',
      data: { 
        title: 'Adicionar grupo', 
        field: 'Nome do grupo', 
        buttonDescription: 'Adicionar', 
        isAGroup: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.report.groupsOfOutcomings.push({ name: result, totalValue: 0, outcomings: [] });
      }
    });
  }

  /* Add a new outcoming in a group */
  addNewOutcominginGroup = (index) => {
    let dialogRef = this.dialog.open(DialogFormReportComponent, {
      height: '250px',
      width: '600px',
      data: {
        title: 'Adicionar despesa', 
        field: 'Nome da despesa', 
        buttonDescription: 'Adicionar', 
        isAIncomingOrOutcoming: true,
        incomingsOrOutcomings: this.outcomings
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.report.groupsOfOutcomings[index]['outcomings'].push(result);
      }
    });
  }

  /* Calculate the final value based in the incomings and outcomings of the day */
  calculateDailyFinalValue = (event) => {
    let initialValue = event.target.value;
    let finalValue = initialValue / 1 + this.reportForm.controls['dailySales'].value / 1 - this.reportForm.controls['dailyExpenses'].value / 1;
    this.reportForm.controls['dailyFinalValue'].setValue(finalValue);
  }

}

/**
 * Dialog
 */
@Component({
  selector: 'dialog-form',
  templateUrl: './dialog-form.html',
})
export class DialogFormReportComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogFormReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

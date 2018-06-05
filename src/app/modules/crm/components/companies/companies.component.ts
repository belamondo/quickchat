import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MatSnackBar,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

/**
 * Components
 */
import { DialogCompanyComponent } from '../../../shared/components/dialog-company/dialog-company.component';

/**
 * Services
 */
import { CrudService } from './../../../shared/services/firebase/crud.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  public isStarted: boolean;
  public paramsToTableData: any;
  public userData: any;

  public userCompanies: any;
  
  constructor(
    private _crud: CrudService,
    private _dialog: MatDialog,
    public _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    this.isStarted = false;

    this._crud.read({
      collectionsAndDocs: [this.userData[0]['_data']['userType'],this.userData[0]['_id'],'userCompanies'],
    }).then(res => {
      this.userCompanies = res;

      this.isStarted = true;

      this.makeList();
    })

  }

  makeList = () => {
    this.paramsToTableData = {
      list: {
        dataSource: this.userCompanies,
        show: ['cnpj', 'business_name'],
        header: ['CNPJ', 'Nome']
      }
    }
  }

  openCompanyDialog = () => {
    let dialogRef = this._dialog.open(DialogCompanyComponent, {
      width: '99%',
      height: '99%',
      data: {
        isCRM: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    });
  }
}

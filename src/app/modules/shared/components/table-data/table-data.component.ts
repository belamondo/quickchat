import {
  DeleteConfirmComponent
} from './../delete-confirm/delete-confirm.component';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
  MatPaginator,
  MatTableDataSource,
} from '@angular/material';
import {
  Router
} from '@angular/router';


/**
 * Services
 */
import {
  CrudService
} from './../../services/firebase/crud.service';

@Component({
  selector: 'table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {
  @Input('params') params: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public currentPage: number;
  public dataSource: any;
  public dataTemp: any;
  public lastPage: number;
  public numberOfLines: any;
  public tableFooterForm: FormGroup;
  public tableSearchForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.tableFooterForm = new FormGroup({
      numberOfLines: new FormControl(null)
    });

    this.tableSearchForm = new FormGroup({
      search: new FormControl(null)
    });
    
    if(!this.params) {
      //error object
    }
    
    if(this.params.footer) {
      if(!this.params.footer.numberOfLines) this.params.footer.numberOfLines = ['1','5','10','20','50'];
    }
    
    if(!this.params.list) {
      //error object
    }
    
    if(!this.params.list.dataTotalLength) this.params.list.dataTotalLength = this.params.list.dataSource.length;
    
    if(!this.params.list.limit) this.params.list.limit = 5;
    

    if(!this.params.list.page) this.currentPage = 1;

    this.dataTemp = this.params.list.dataSource;

    this.lastPage = Math.ceil(this.params.list.dataTotalLength/this.params.list.limit);
    this.setLimitOverPage(this.currentPage);

  }

  setLimit = () => { console.log(90)
    this.params.list.limit = this.tableFooterForm.value.numberOfLines;

    this.setLimitOverPage(1);
  }

  setLimitOverPage = (page) => {
    this.dataSource = this.dataTemp.slice(this.params.list.limit*(page-1),(this.params.list.limit*page));

    this.lastPage = Math.ceil(this.dataTemp.length/this.params.list.limit);
    
    this.currentPage = page;
  }

  searchOverAll = () => {
    if(!this.tableSearchForm.value.search && this.tableSearchForm.value.search == "") {
      this.dataTemp = this.params.list.dataSource;
      this.lastPage = Math.ceil(this.params.list.dataTotalLength/this.params.list.limit);
      this.setLimitOverPage(1);
      return false;
    }

    this.dataTemp = this.params.list.dataSource.filter(object => {
      return Object.values(object).join().match(new RegExp(this.tableSearchForm.value.search, 'gi')) 
    })

    this.lastPage = Math.ceil(this.dataTemp.length/this.params.list.limit);

    this.setLimitOverPage(1);
  }
}
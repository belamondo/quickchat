/**
 * Deals with a list component.
 * @param {Object} params
 * @param {Object} params.toolbar
 * @param {string} params.toolbar.title - gives a title to toolbar 
 * @param {Object[]} params.toolbar.delete - ignites delete area on toolbar, list and its methods
 * @param {string} params.toolbar.delete[].route - route to access after deleting
 * @param {string} params.toolbar.delete[].param - field to use as param to deletion and ignite its methods
 * @param {boolean} params.toolbar.search - ignites search area on toolbar and its methods
 * @param {Object} params.list
 * @param {string} params.list.dataSource
 * @param {Array} params.list.show
 * @param {Array} params.list.header
 * @param {Array} params.list.order
 * @param {Object} params.list.edit
 * @param {string} params.list.edit.route
 * @param {string} params.list.edit.param
 * @param {Object[]} params.list.changeValue
 * @param {string} params.list.changeValue.field
 * @param {string} params.list.changeValue.fieldValue
 * @param {string} params.list.changeValue.newValue
 * @param {Object[]} params.list.changeValueReadingDB
 * @param {string} params.list.changeValueReadingDB.collection
 * @param {string} params.list.changeValueReadingDB.field
 * @param {Object} params.list.actionButton
 */
import {
  DeleteConfirmComponent
} from './../delete-confirm/delete-confirm.component';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
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
export class TableDataComponent implements OnInit, OnChanges {
  @Input('params') params: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  public dataSource: any;
  
  
  constructor() {
  }

  ngOnInit() {
  }
  
  ngOnChanges() {
    if(this.params) {
      let object = this.params.list.dataSource;
      console.log(object);
    
      if(!this.params.list.pageSize) this.params.list.pageSize = 5;
      
      if(!this.params.list.pageSizeOptions) this.params.list.pageSizeOptions = [5, 10, 25, 100];
      
      this.dataSource = new MatTableDataSource<any>(object);
      
      this.dataSource.paginator = this.paginator;
    }
  }
}
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  MediaMatcher, 
  BreakpointObserver, 
  Breakpoints
} from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../shared/services/firebase/authentication.service';
import { CrudService } from './../shared/services/firebase/crud.service';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class CrmComponent implements OnInit {
  public views: Object[];

  constructor() {
  }

  ngOnInit() {
    this.views = [{
      name: 'Painel inicial',
      icon: 'home',
      link: ['dashboard']
    }, {
      name: 'Cadastrar cliente',
      icon: 'person',
      link: ['client']
    }, {
      name: 'Cadastrar pessoa',
      icon: 'person',
      link: ['person']
    }, {
      name: 'Cadastrar empresa',
      icon: 'business',
      link: ['company']
    }];
  }
}

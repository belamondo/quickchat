import { Component, OnInit } from '@angular/core';

/**
 * Components
 */

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  public views: any;

  constructor() { }

  ngOnInit() {

    /* Options to show in side nav menu */
    this.views = [{
      name: 'Painel inicial',
      icon: 'home',
      link: ['dashboard']
    },{
      name: 'Cadastro de produto',
      icon: 'build',
      link: ['product']
    },{
      name: 'Cadastro de serviço',
      icon: 'shopping_cart',
      link: ['service']
    }]
  }

}

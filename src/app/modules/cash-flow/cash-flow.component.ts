import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent implements OnInit {

  public views: any;

  constructor() { }

  ngOnInit() {

    /* Options to show in side nav menu */
    this.views = [{
      name: 'Painel inicial',
      icon: 'home',
      link: ['dashboard']
    },{
      name: 'Cadastro de despesas',
      icon: 'assignment',
      link: ['expense']
    },{
      name: 'Lançamentos',
      icon: 'attach_money',
      link: ['incoming-outcoming']
    },{
      name: 'Relatórios',
      icon: 'assessment',
      link: ['report']
    }]

  }

}

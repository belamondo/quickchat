import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { CashFlowComponent } from './cash-flow.component';
import { DashboardComponent } from './../cash-flow/components/dashboard/dashboard.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomingOutcomingComponent } from './components/incoming-outcoming/incoming-outcoming.component';

const routes: Routes = [{
  path: '', component: CashFlowComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'expense',
    component: ExpenseComponent
  }, {
    path: 'incoming-outcoming',
    component: IncomingOutcomingComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }

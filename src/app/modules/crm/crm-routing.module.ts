import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { CompaniesComponent } from './components/companies/companies.component';
import { CrmComponent } from './crm.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PeopleComponent } from './components/people/people.component';

const routes: Routes = [{
  path: '', component: CrmComponent, children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'person',
    component: PeopleComponent
  }, {
    path: 'company',
    component: CompaniesComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }

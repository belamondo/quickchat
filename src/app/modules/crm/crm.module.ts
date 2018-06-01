import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CrmComponent } from './crm.component';

/**
 * Modules
 */
import { ClientComponent } from './components/client/client.component';
import { CrmRoutingModule } from './crm-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';
import { PeopleComponent } from './components/people/people.component';
import { CompaniesComponent } from './components/companies/companies.component';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ],
  declarations: [
    ClientComponent,
    CrmComponent,
    DashboardComponent,
    PeopleComponent,
    CompaniesComponent,
  ]
})
export class CrmModule { }

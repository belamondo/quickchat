import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CrmComponent } from './crm.component';

/**
 * Modules
 */
import { CrmRoutingModule } from './crm-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ],
  declarations: [
    CrmComponent,
    DashboardComponent
  ]
})
export class CrmModule { }

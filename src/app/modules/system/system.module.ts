import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent, DialogFormComponent } from './components/product/product.component';
import { ServiceComponent, DialogFormServiceComponent } from './components/service/service.component';
import { SystemComponent } from './system.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    DialogFormComponent,
    DialogFormServiceComponent,
    SystemComponent,
    ProductComponent,
    ServiceComponent
  ],
  entryComponents: [
    DialogFormComponent,
    DialogFormServiceComponent,
  ]
})
export class SystemModule { }

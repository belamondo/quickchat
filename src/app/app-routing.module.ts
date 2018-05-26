import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Components
 */
import { LoginComponent } from './components/login/login.component';

/**
 * Guards
 */
import { AuthGuard } from './modules/shared/guards/auth.guard';
import { CashFlowGuard } from './modules/shared/guards/cash-flow.guard';
import { CrmGuard } from './modules/shared/guards/crm.guard';
import { SystemGuard } from './modules/shared/guards/system.guard';

/**
 * Modules
 */

const routes: Routes = [{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'main',
  loadChildren: './modules/main/main.module#MainModule',
  canActivate: [AuthGuard]
}, {
  path: 'cash-flow',
  loadChildren: './modules/cash-flow/cash-flow.module#CashFlowModule',
  canActivate: [CashFlowGuard]
}, {
  path: 'crm',
  loadChildren: './modules/crm/crm.module#CrmModule',
  canActivate: [CrmGuard]
}, {
  path: 'system',
  loadChildren: './modules/system/system.module#SystemModule',
  canActivate: [SystemGuard]
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

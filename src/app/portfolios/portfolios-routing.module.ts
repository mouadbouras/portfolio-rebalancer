import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfoliosComponent } from './containers/portfolios.component';

const routes: Routes = [
  { path: '', component: PortfoliosComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PortfoliosRoutingModule {}

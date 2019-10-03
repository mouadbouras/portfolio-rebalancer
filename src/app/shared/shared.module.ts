import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import {
  ButtonsModule,
  InputsModule,
  CardsModule,
  InputUtilitiesModule,
  IconsModule
} from 'angular-bootstrap-md';
import { CustomersModalComponent } from './components/customers-modal/customers-modal.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { FormsModule } from '@angular/forms';
import { ProjectComponent } from './components/project/project.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { PortfolioListComponent } from './components/portfolio-list/portfolio-list.component';
import { PortfolioModalComponent } from './components/portfolio-modal/portfolio-modal.component';
import { SecuritiesListComponent } from './components/security-list/securities-list.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    ConfirmModalComponent,
    CustomersModalComponent,
    ProjectModalComponent,
    ProjectsListComponent,
    ProjectComponent,
    CustomersListComponent,
    PortfolioComponent,
    PortfolioListComponent,
    PortfolioModalComponent,
    SecuritiesListComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    InputsModule,
    InputUtilitiesModule,
    IconsModule,
    FormsModule,
    ButtonsModule,
    CardsModule
  ],
  exports: [ProjectsListComponent, PortfolioListComponent, ProjectComponent, CustomersListComponent],
  providers: [],
  entryComponents: [
    ConfirmModalComponent,
    CustomersModalComponent,
    ProjectModalComponent,
    PortfolioModalComponent
  ]
})
export class SharedModule {}

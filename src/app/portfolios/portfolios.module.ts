import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliosComponent } from './containers/portfolios.component';
import { ModalModule, ButtonsModule, InputsModule, WavesModule, IconsModule, CardsModule, ChartsModule } from 'angular-bootstrap-md';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PortfoliosRoutingModule } from './portfolios-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromPortfolios from './store/portfolios.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PortfoliosEffects } from './store/portfolios.effects';
import { ChartsDataModule } from '../charts/charts.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    SharedModule,
    ChartsModule,
    PortfoliosRoutingModule,
    HttpClientModule,
    FormsModule,
    ButtonsModule,
    InputsModule,
    WavesModule,
    IconsModule,
    CardsModule,
    ChartsDataModule,
    CommonModule,
    StoreModule.forFeature('portfolios', fromPortfolios.portfoliosReducer),
    EffectsModule.forFeature([PortfoliosEffects])
  ],
  declarations: [PortfoliosComponent],
  exports: [PortfoliosComponent],
})
export class PortfoliosModule { }

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { Portfolio } from 'src/app/portfolios/model/portfolio.model';
import { Security } from 'src/app/portfolios/model/security.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit, OnChanges {
  @Input() portfolio: Portfolio;
  @Input() editable = true;
  @Output() deleted = new EventEmitter<Portfolio>();
  @Output() edited = new EventEmitter<Portfolio>();
  @Output() deleteSecurity = new EventEmitter<any>();
  @Output() securitiesEdited = new EventEmitter<Portfolio>();
  @Output() portfolioRebalance = new EventEmitter<Portfolio>();

  overHunderPercentFlag = false;
  overHunderPercentValue: number;

  leftoverCash: number = 0;

  constructor() { }

  ngOnInit() {
    this.overHundredPercent();
    this.calculateLeftoverCash();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'portfolio') {
        this.overHundredPercent();
        this.calculateLeftoverCash();
      }
    }
  }

  onDelete() {
    this.deleted.emit(this.portfolio);
  }

  onEdit() {
    this.edited.emit(this.portfolio);
  }

  onSecuritiesEdit() {
    this.securitiesEdited.emit(this.portfolio);
  }

  onDeleteSecurity(security: Security) {
    const portfolio = this.portfolio;
    this.deleteSecurity.emit({portfolio , security});
  }

  onRebalance() {
    this.portfolioRebalance.emit(this.portfolio);
  }

  private overHundredPercent() {
    if (this.portfolio && this.portfolio.securities) {
      this.overHunderPercentValue = this.portfolio.securities.map(
        security => security.percentage as number
        ).reduce((a: number, b: number) => (a * 1) + (b * 1) , 0);
        console.log(this.portfolio.securities.map(
          security => security.percentage as number
          ));
        this.overHunderPercentFlag = this.overHunderPercentValue ? this.overHunderPercentValue > 100 : false;
    }
  }

  private calculateLeftoverCash() {
    if (this.portfolio && this.portfolio.securities) {
      var sum = this.portfolio.securities.map(
        security => security.count * security.usPrice as number
        ).reduce((a: number, b: number) => (a * 1) + (b * 1) , 0);

        this.leftoverCash = this.portfolio.investment - sum;
    }
  }
}

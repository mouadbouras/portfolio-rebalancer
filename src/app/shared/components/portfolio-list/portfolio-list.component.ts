import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Portfolio } from 'src/app/portfolios/model/portfolio.model';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  @Input() portfolios: Portfolio[];
  @Input() editable = true;
  @Output() portfolioDeleted = new EventEmitter<Portfolio>();
  @Output() portfolioEdited = new EventEmitter<Portfolio>();
  @Output() portfolioSecuritiesEdited = new EventEmitter<Portfolio>();
  @Output() portfolioRebalance = new EventEmitter<Portfolio>();
  @Output() portfolioDeleteSecurity = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  onPortfolioDelete(portfolio: Portfolio) {
    this.portfolioDeleted.emit(portfolio);
  }

  onPortfolioEdit(portfolio: Portfolio) {
    this.portfolioEdited.emit(portfolio);
  }

  onPortfolioSecuritiesEdit(portfolio: Portfolio) {
    this.portfolioSecuritiesEdited.emit(portfolio);
  }

  onPortfolioRebalance(portfolio: Portfolio) {
    this.portfolioRebalance.emit(portfolio);
  }

  onPortfolioDeleteSecurity(event: any) {
    this.portfolioDeleteSecurity.emit(event);
  }

  trackByFunction(index: any) {
    return index;
  }

}

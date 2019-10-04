import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Portfolio } from 'src/app/portfolios/model/portfolio.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit {
  @Input() portfolio: Portfolio;
  @Input() editable = true;
  @Output() deleted = new EventEmitter<Portfolio>();
  @Output() edited = new EventEmitter<Portfolio>();
  @Output() securitiesEdited = new EventEmitter<Portfolio>();

  constructor() { }

  ngOnInit() {  }

  // onAddSecurity(security: Security) {
  //   if (this.portfolio.securities) {
  //     this.portfolio.securities.push(security);
  //   }
  //   this.onSecuritiesEdit();
  // }

  onDelete() {
    this.deleted.emit(this.portfolio);
  }

  onEdit() {
    this.edited.emit(this.portfolio);
  }

  onSecuritiesEdit() {
    this.securitiesEdited.emit(this.portfolio);
  }
}

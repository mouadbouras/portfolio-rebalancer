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

  constructor() { }

  ngOnInit() {
    console.log('le');
    console.log(this.portfolio);
    console.log('le');

  }

  onDelete() {
    this.deleted.emit(this.portfolio);
  }

  onEdit() {
    this.edited.emit(this.portfolio);
  }

}

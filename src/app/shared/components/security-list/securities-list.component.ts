import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Security } from 'src/app/portfolios/model/security.model';

@Component({
  selector: 'app-securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss']
})
export class SecuritiesListComponent implements OnInit {
  @Input() securities: Security[];
  @Input() editable: boolean = false;
  @Output() deleteSecurity = new EventEmitter<Security>();
 
  constructor() { }

  ngOnInit() {  }

  onDelete(security: Security) {
    this.deleteSecurity.emit(security);
  }

}

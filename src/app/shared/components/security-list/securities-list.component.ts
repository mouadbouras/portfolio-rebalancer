import { Component, OnInit, Input } from '@angular/core';
import { Security } from 'src/app/portfolios/model/security.model';

@Component({
  selector: 'app-securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss']
})
export class SecuritiesListComponent implements OnInit {
  @Input() securities: Security[];

  constructor() { }

  ngOnInit() {  }

}

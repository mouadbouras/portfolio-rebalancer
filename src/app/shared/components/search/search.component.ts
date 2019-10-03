import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TradierSecurity } from '../../models/search-response.model';
import { TradierService } from '../../services/tradier.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchInput = '';
  public securities$: Observable<TradierSecurity[]>;

  constructor( private _tradierService: TradierService ) { }

  ngOnInit() {
  }

  public search() {
    console.log(this.searchInput);
    this.securities$ = this._tradierService.searchSymbol(this.searchInput);
  }

  public onKeydown(event: any) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

}

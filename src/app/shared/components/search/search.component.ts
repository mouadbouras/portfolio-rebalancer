import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
import { TradierSecurity } from '../../models/search-response.model';
import { TradierService } from '../../services/tradier.service';
import { Security } from '../../../portfolios/model/security.model'
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Output() securitySelected = new EventEmitter<Security>();

  public searchInput = '';
  public securities$: Observable<TradierSecurity[]>;
  public noResultsFound = false;

  private _subscription: SubscriptionLike;

  constructor( private _tradierService: TradierService ) { }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public search() {
    this.noResultsFound = false;
    if (this.searchInput.trim() !== '') {
      this.securities$ = this._tradierService.searchSymbol(this.searchInput)
      .pipe(
        tap(securities => {
          if (securities.length === 0) {
            this.noResultsFound = true;
          }
        })
      );
    }

  }

  public selectSecurity(security: TradierSecurity) {
    this.securities$ = new Observable<TradierSecurity[]>();
    this._subscription = this._tradierService.getQuoteForSymbol(security.symbol).pipe(
      tap(console.log),
      map((quote: TradierQuote) => {
        return {
          name: security.description,
          symbol: security.symbol,
          price: quote.last,
          currency: quote.exch,
          usPrice: quote.last,
        } as Security;
      }),
      tap(console.log),
      tap((security: Security) => {
        this.securitySelected.emit(security);
      }
      ),
    ).subscribe();
  }

  public onKeydown(event: any) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

}

import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
import { AlphaVantageSecurity } from '../../models/search-response.model';
import { Security } from '../../../portfolios/model/security.model';
import { map, tap } from 'rxjs/operators';
import { AlphavantageService } from '../../services/alphavantage.service';
import { AlphaVantageQuote } from '../../models/quote-response.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Output() securitySelected = new EventEmitter<Security>();

  public searchInput = '';
  public securities$: Observable<AlphaVantageSecurity[]>;
  public noResultsFound = false;

  private _subscription: SubscriptionLike;
  public isLoading: boolean = false;

  constructor(
    private _alphavantageService: AlphavantageService,
  ) { }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public search() {
    this.noResultsFound = false;
    if (this.searchInput.trim() !== '') {
      this.isLoading = true;
      this.securities$ = this._alphavantageService.searchSymbol(this.searchInput).pipe(
        tap(securities => {
          if (securities.length === 0) {
             this.noResultsFound = true;
          }
          this.isLoading = false;
        })
      );
    }
  }

  public selectSecurity(security: AlphaVantageSecurity): void {
    this._subscription = this._alphavantageService.getQuoteForSymbol(security.symbol).pipe(
      map((quote: AlphaVantageQuote) => {
        return {
          name: security.name,
          symbol: security.symbol,
          price: quote.price,
          currency: security.currency,
          usPrice: quote.price,
          percentage: 0,
          count: 0,
        } as unknown as Security;
      }),
      tap((security: Security) => {
        this.securities$ = new Observable<AlphaVantageSecurity[]>();
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

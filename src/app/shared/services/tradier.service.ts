import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TradierSearchResponse, TradierSecurity, TradierSecurities } from '../models/search-response.model';
import { map } from 'rxjs/operators';
import { TradierQuote, TradierQuoteResponse, TradierQuotes } from '../models/quote-response.model';

@Injectable({
  providedIn: 'root'
})
export class TradierService {
  private searchUrl = environment.tradier.searchUrl;
  private quoteUrl = environment.tradier.quoteUrl;
  private token =  environment.tradier.token;
  private headers = new HttpHeaders({ 'Authorization': this.token });

  constructor( private _http: HttpClient ) { }

  public searchSymbol(symbol: string): Observable<TradierSecurity[]> {
    const headers = this.headers;
    return this._http.get<TradierSearchResponse>(`${this.searchUrl}?q=${symbol}`, {headers})
    .pipe(
      map((tradierSearchResponse: TradierSearchResponse) => tradierSearchResponse ? tradierSearchResponse.securities : []),
      map((tradierSecurities: TradierSecurities) => tradierSecurities ? tradierSecurities.security : []),
      map((tradierSecurities: TradierSecurity[]) => tradierSecurities ? tradierSecurities : [] ),
      map((tradierSecurities: TradierSecurity[]) => Array.isArray(tradierSecurities) ? tradierSecurities : [tradierSecurities] ),
    );
  }

  public getQuoteForSymbol(symbol: string): Observable<TradierQuote | null> {
    const headers = this.headers;
    return this._http.get<TradierQuoteResponse>(`${this.quoteUrl}?symbols=${symbol}`, {headers})
    .pipe(
      map((tradierQuoteResponse: TradierQuoteResponse) => tradierQuoteResponse ? tradierQuoteResponse.quotes : null),
      map((tradierQuotes: TradierQuotes) => tradierQuotes ? tradierQuotes.quote : null),
      map((tradierQuote: TradierQuote[]) => Array.isArray(tradierQuote) ? tradierQuote : [tradierQuote] ),
      map((tradierQuote: TradierQuote[]) => (tradierQuote && tradierQuote.length) > 0 ? tradierQuote[0] : null ),
    );
  }
}

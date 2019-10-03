import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TradierSearchResponse, TradierSecurity } from '../models/search-response.model';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TradierService {
  private searchUrl = environment.tradier.searchUrl;
  //private quoteUrl = environment.tradier.quoteUrl;
  private token =  environment.tradier.token;
  private headers = new HttpHeaders({ 'Authorization': this.token });

  constructor( private _http: HttpClient ) { }

  public searchSymbol(symbol: string): Observable<TradierSecurity[]> {
    const headers = this.headers;
    return this._http.get<TradierSearchResponse>(`${this.searchUrl}?q=${symbol}`, {headers})
    .pipe(
      tap(console.log),
      map((tradierSearchResponse: TradierSearchResponse) => tradierSearchResponse.securities.security)
    );
  }
}

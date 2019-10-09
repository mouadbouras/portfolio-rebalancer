import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Portfolio } from '../model/portfolio.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  url = environment.firebase.databaseURL;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  get userId() {
    if (this.afAuth.auth.currentUser) {
      return this.afAuth.auth.currentUser.uid;
    }
  }

  add(portfolio: Portfolio, userId: string) {
    console.log(portfolio);
    const portfolios = this.db.list(`portfolios/${userId}`);
    return portfolios.push(portfolio);
  }

  addPortfolios(portfolios: Portfolio[]) {
    const userId = this.userId;
    portfolios.forEach( (portfolio: Portfolio) => {
      this.db.list(`portfolios/${userId}`).push(portfolio);
    });
  }

  get(userId: string) {
    return this.db.list(`portfolios/${userId}`).snapshotChanges();
  }

  update(portfolio: Portfolio, userId: string) {
    return of(this.db.object(`portfolios/${userId}/` + portfolio.key)
      .update({
        investment: portfolio.investment,
        name: portfolio.name,
        securities: portfolio.securities
      }));
  }

  delete(portfolio: Portfolio, userId: string) {
    return this.db.object(`portfolios/${userId}/` + portfolio.key).remove();
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AngularFireAuth } from '@angular/fire/auth';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Portfolio } from '../model/portfolio.model';
import { getPortfolios, getAllLoaded } from '../store/portfolios.selectors';
import { map, take } from 'rxjs/operators';
import * as fromPortfolios from './../store/portfolios.actions';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { PortfolioModalComponent } from '../../shared/components/portfolio-modal/portfolio-modal.component';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {
  portfolios$: Observable<Portfolio[] | null>;
  isLoading$: Observable<boolean>;
  modalRef: MDBModalRef;

  modalConfig = {
    class: 'modal-dialog-scrollable modal-lg'
  };

  constructor(private store: Store<AppState>, private modalService: MDBModalService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(getAllLoaded);
    this.portfolios$ = this.store.pipe(
      select(getPortfolios),
      map((portfolios: Portfolio[]) => {
        if (this.user && !portfolios) {
          this.store.dispatch(new fromPortfolios.PortfoliosQuery());
        }
        return portfolios;
      })
    );
  }

  get user() {
    return this.afAuth.auth.currentUser;
  }

  openAddPortfolioModal() {
    this.modalRef = this.modalService.show(PortfolioModalComponent, this.modalConfig);

    this.modalRef.content.heading = 'Add new portfolio';

    this.modalRef.content.portfolioData.pipe(
      take(1),
    ).subscribe( (portfolioData: Portfolio) => {
      this.store.dispatch(new fromPortfolios.PortfolioAdded({ portfolio: portfolioData }));
    });
  }

  openEditPortfolioModal(portfolio: Portfolio) {
    this.modalRef = this.modalService.show(PortfolioModalComponent, this.modalConfig);

    this.modalRef.content.heading = 'Edit portfolio';
    const portfolioCopy = {...portfolio };
    const securitiesCopy = portfolioCopy.securities;
    this.modalRef.content.portfolio = portfolioCopy;
    this.modalRef.content.securities = securitiesCopy;

    this.modalRef.content.portfolioData.pipe(take(1)).subscribe( (portfolioData: Portfolio) => {
      this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolioData }));
    });
  }

  openConfirmModal(portfolio: Portfolio) {
    this.modalRef = this.modalService.show(ConfirmModalComponent, this.modalConfig);

    this.modalRef.content.confirmation.pipe(take(1)).subscribe( (confirmation: boolean) => {
      if (confirmation) {
        this.store.dispatch(new fromPortfolios.PortfolioDeleted({ portfolio }));
      }
    });
  }

  onPortfolioDelete(portfolio: Portfolio) {
    this.openConfirmModal(portfolio);
  }

  onPortfolioEdit(portfolio: Portfolio) {
    this.openEditPortfolioModal(portfolio);
  }

  onPortfolioSecuritiesEdited(portfolio: Portfolio) {
    this.store.dispatch(new fromPortfolios.PortfolioEdited({ portfolio: portfolio }));
  }

  onPortfolioRebalance(portfolio: Portfolio) {
    console.log('rebalance');
    console.log(portfolio);
  }
}

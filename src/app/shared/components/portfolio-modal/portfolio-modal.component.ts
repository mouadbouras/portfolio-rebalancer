import { Component, OnInit, ViewChild } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Portfolio } from 'src/app/portfolios/model/portfolio.model';
import { Security } from 'src/app/portfolios/model/security.model';

@Component({
  selector: 'app-portfolio-modal',
  templateUrl: './portfolio-modal.component.html',
  styleUrls: ['./portfolio-modal.component.scss']
})
export class PortfolioModalComponent implements OnInit {
  @ViewChild('portfolioForm', { static: true }) portfolioForm: NgForm;

  heading: string;

  name: string;
  securities: Security[];
  investment: number;

  portfolioData: Subject<Portfolio> = new Subject();
  portfolio: Portfolio = {};

  constructor(public modalRef: MDBModalRef) {}

  ngOnInit() {
    if (!this.portfolio.securities) {
      this.portfolio.securities = [{}];
    }
    if (!this.securities) {
      this.securities = [];
    }
  }

  onSave() {
    if (this.portfolioForm.valid) {
      this.portfolio.securities = this.securities;
      this.portfolioData.next(this.portfolio);
      this.modalRef.hide();
    } else {
      const controls = this.portfolioForm.controls;
      Object.keys(controls).forEach( controlName => controls[controlName].markAsTouched());
    }
  }

  onDeleteSecurity(security: Security) {
    this.securities = this.securities.filter((v) => v !== security);
  }

  onAddSecurity(security: Security) {
      if (!this.securities) {
        this.securities = [];
      }

      this.securities.push(security);
  }
}

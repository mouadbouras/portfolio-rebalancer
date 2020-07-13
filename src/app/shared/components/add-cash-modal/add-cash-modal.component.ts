import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-cash-modal',
  templateUrl: './add-cash-modal.component.html',
  styleUrls: ['./add-cash-modal.component.scss']
})
export class AddCashModalComponent implements OnInit {

  @ViewChild('addCashForm', { static: true }) addCashForm: NgForm;

  heading: string;

  name: string;
  cash: number;

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

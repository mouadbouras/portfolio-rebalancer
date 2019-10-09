import { TestBed } from '@angular/core/testing';

import { AlphavantageService } from './alphavantage.service';

describe('AlphavantageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlphavantageService = TestBed.get(AlphavantageService);
    expect(service).toBeTruthy();
  });
});

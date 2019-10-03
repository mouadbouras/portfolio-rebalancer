import { TestBed } from '@angular/core/testing';

import { TradierService } from './tradier.service';

describe('TradierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TradierService = TestBed.get(TradierService);
    expect(service).toBeTruthy();
  });
});

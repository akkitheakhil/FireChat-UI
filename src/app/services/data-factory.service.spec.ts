import { TestBed } from '@angular/core/testing';

import { DataFactoryService } from './data-factory.service';

describe('DataFactoryService', () => {
  let service: DataFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

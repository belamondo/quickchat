import { TestBed, inject } from '@angular/core/testing';

import { StrategicDataService } from './strategic-data.service';

describe('StrategicDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StrategicDataService]
    });
  });

  it('should be created', inject([StrategicDataService], (service: StrategicDataService) => {
    expect(service).toBeTruthy();
  }));
});

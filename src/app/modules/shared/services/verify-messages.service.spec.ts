import { TestBed, inject } from '@angular/core/testing';

import { VerifyMessagesService } from './verify-messages.service';

describe('VerifyMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyMessagesService]
    });
  });

  it('should be created', inject([VerifyMessagesService], (service: VerifyMessagesService) => {
    expect(service).toBeTruthy();
  }));
});

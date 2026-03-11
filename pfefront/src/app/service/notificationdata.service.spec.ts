import { TestBed } from '@angular/core/testing';

import { NotificationdataService } from './notificationdata.service';

describe('NotificationdataService', () => {
  let service: NotificationdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

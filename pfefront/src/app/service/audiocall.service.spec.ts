import { TestBed } from '@angular/core/testing';

import { AudiocallService } from './audiocall.service';

describe('AudiocallService', () => {
  let service: AudiocallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudiocallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

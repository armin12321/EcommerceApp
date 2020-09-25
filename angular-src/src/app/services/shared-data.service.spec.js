import { TestBed } from '@angular/core/testing';
import { SharedDataService } from './shared-data.service';
describe('SharedDataService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SharedDataService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

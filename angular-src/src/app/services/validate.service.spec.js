import { TestBed } from '@angular/core/testing';
import { ValidateService } from './validate.service';
describe('ValidateService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidateService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

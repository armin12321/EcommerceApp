import { TestBed } from '@angular/core/testing';
import { ServerService } from './server.service';
describe('ServerService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ServerService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

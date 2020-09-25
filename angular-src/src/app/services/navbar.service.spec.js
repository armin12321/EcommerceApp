import { TestBed } from '@angular/core/testing';
import { NavbarService } from './navbar.service';
describe('NavbarService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NavbarService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

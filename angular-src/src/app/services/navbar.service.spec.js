"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var navbar_service_1 = require("./navbar.service");
describe('NavbarService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(navbar_service_1.NavbarService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});

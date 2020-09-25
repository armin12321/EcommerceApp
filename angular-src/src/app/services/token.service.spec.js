"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var token_service_1 = require("./token.service");
describe('TokenService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(token_service_1.TokenService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});

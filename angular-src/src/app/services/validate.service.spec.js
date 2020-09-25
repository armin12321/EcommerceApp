"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var validate_service_1 = require("./validate.service");
describe('ValidateService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(validate_service_1.ValidateService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});

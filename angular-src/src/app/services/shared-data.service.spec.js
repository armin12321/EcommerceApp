"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var shared_data_service_1 = require("./shared-data.service");
describe('SharedDataService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(shared_data_service_1.SharedDataService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});

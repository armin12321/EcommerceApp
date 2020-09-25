"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var server_service_1 = require("./server.service");
describe('ServerService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(server_service_1.ServerService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});

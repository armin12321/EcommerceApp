var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
describe('workspace-project App', () => {
    let page;
    beforeEach(() => {
        page = new AppPage();
    });
    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Frontend app is running!');
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Assert that there are no errors emitted from the browser
        const logs = yield browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        }));
    }));
});

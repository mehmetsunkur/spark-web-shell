import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Terminal e2e test', () => {

    let navBarPage: NavBarPage;
    let terminalDialogPage: TerminalDialogPage;
    let terminalComponentsPage: TerminalComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Terminals', () => {
        navBarPage.goToEntity('terminal');
        terminalComponentsPage = new TerminalComponentsPage();
        expect(terminalComponentsPage.getTitle())
            .toMatch(/sparkWebShellApp.terminal.home.title/);

    });

    it('should load create Terminal dialog', () => {
        terminalComponentsPage.clickOnCreateButton();
        terminalDialogPage = new TerminalDialogPage();
        expect(terminalDialogPage.getModalTitle())
            .toMatch(/sparkWebShellApp.terminal.home.createOrEditLabel/);
        terminalDialogPage.close();
    });

    it('should create and save Terminals', () => {
        terminalComponentsPage.clickOnCreateButton();
        terminalDialogPage.setTitleInput('title');
        expect(terminalDialogPage.getTitleInput()).toMatch('title');
        terminalDialogPage.save();
        expect(terminalDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class TerminalComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-terminal div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TerminalDialogPage {
    modalTitle = element(by.css('h4#myTerminalLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    titleInput = element(by.css('input#field_title'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTitleInput = function(title) {
        this.titleInput.sendKeys(title);
    };

    getTitleInput = function() {
        return this.titleInput.getAttribute('value');
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}

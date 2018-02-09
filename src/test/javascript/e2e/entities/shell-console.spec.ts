import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ShellConsole e2e test', () => {

    let navBarPage: NavBarPage;
    let shellConsoleDialogPage: ShellConsoleDialogPage;
    let shellConsoleComponentsPage: ShellConsoleComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ShellConsoles', () => {
        navBarPage.goToEntity('shell-console');
        shellConsoleComponentsPage = new ShellConsoleComponentsPage();
        expect(shellConsoleComponentsPage.getTitle())
            .toMatch(/sparkWebShellApp.shellConsole.home.title/);

    });

    it('should load create ShellConsole dialog', () => {
        shellConsoleComponentsPage.clickOnCreateButton();
        shellConsoleDialogPage = new ShellConsoleDialogPage();
        expect(shellConsoleDialogPage.getModalTitle())
            .toMatch(/sparkWebShellApp.shellConsole.home.createOrEditLabel/);
        shellConsoleDialogPage.close();
    });

    it('should create and save ShellConsoles', () => {
        shellConsoleComponentsPage.clickOnCreateButton();
        shellConsoleDialogPage.setCommandInput('command');
        expect(shellConsoleDialogPage.getCommandInput()).toMatch('command');
        shellConsoleDialogPage.save();
        expect(shellConsoleDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShellConsoleComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shell-console div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShellConsoleDialogPage {
    modalTitle = element(by.css('h4#myShellConsoleLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    commandInput = element(by.css('input#field_command'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCommandInput = function(command) {
        this.commandInput.sendKeys(command);
    };

    getCommandInput = function() {
        return this.commandInput.getAttribute('value');
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

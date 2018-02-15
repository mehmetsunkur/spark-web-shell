import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Shell e2e test', () => {

    let navBarPage: NavBarPage;
    let shellDialogPage: ShellDialogPage;
    let shellComponentsPage: ShellComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Shells', () => {
        navBarPage.goToEntity('shell');
        shellComponentsPage = new ShellComponentsPage();
        expect(shellComponentsPage.getTitle())
            .toMatch(/sparkWebShellApp.shell.home.title/);

    });

    it('should load create Shell dialog', () => {
        shellComponentsPage.clickOnCreateButton();
        shellDialogPage = new ShellDialogPage();
        expect(shellDialogPage.getModalTitle())
            .toMatch(/sparkWebShellApp.shell.home.createOrEditLabel/);
        shellDialogPage.close();
    });

    it('should create and save Shells', () => {
        shellComponentsPage.clickOnCreateButton();
        shellDialogPage.setTitleInput('title');
        expect(shellDialogPage.getTitleInput()).toMatch('title');
        shellDialogPage.save();
        expect(shellDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ShellComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-shell div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ShellDialogPage {
    modalTitle = element(by.css('h4#myShellLabel'));
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

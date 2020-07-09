import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxTabs } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-tabs', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    counterVisible: false,
    otherSchematics: ['text', 'card', 'form']
  };

  const schematicsFunction = luxTabs;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-tabs', collectionPath);
  });

  describe('schema.createTests', () => {
    it('Sollte .spec.ts generieren (true)', () => {
      testHelper.testSpecTrue(schematicsFunction, defaultOptions);
    });

    it('Sollte .spec.ts generieren (false)', () => {
      testHelper.testSpecFalse(schematicsFunction, defaultOptions);
    });
  });

  describe('schema.createStylesheet', () => {
    it('Sollte .scss generieren (true)', () => {
      testHelper.testScssTrue(schematicsFunction, defaultOptions);
    });

    it('Sollte .scss generieren (false)', () => {
      testHelper.testScssFalse(schematicsFunction, defaultOptions);
    });
  });

  describe('schema.importToNgModule', () => {
    it('Sollte den Import in das Module einfügen (true)', () => {
      testHelper.testImportTrue(schematicsFunction, defaultOptions);
    });

    it('Sollte den Import in das Module einfügen (false)', () => {
      testHelper.testImportFalse(schematicsFunction, defaultOptions);
    });
  });

  describe('schema.counterVisible', () => {
    it('Sollte kein Counter erstellen', async (done) => {
      const testOptions = { ...defaultOptions };

      callRule(luxTabs(testOptions), observableOf(testHelper.appTree), testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');

          expect(htmlContent.trim()).not.toContain(
            '<lux-tab luxTitle="Title #text" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );
          expect(htmlContent.trim()).not.toContain(
            '<lux-tab luxTitle="Title #card" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );
          expect(htmlContent.trim()).not.toContain(
            '<lux-tab luxTitle="Title #form" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein Counter erstellen', async (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.counterVisible = true;

      callRule(luxTabs(testOptions), observableOf(testHelper.appTree), testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');

          expect(htmlContent.trim()).toContain(
            '<lux-tab luxTitle="Title #text" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-tab luxTitle="Title #card" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-tab luxTitle="Title #form" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"'
          );

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.otherSchematics', () => {
    it('Sollte die Tabs mit einem Beispieltext, FormComponent und CardComponent erstellen', async (done) => {
      const testOptions = { ...defaultOptions };

      callRule(luxTabs(testOptions), observableOf(testHelper.appTree), testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');

          expect(htmlContent.trim()).toContain('<p>');
          expect(htmlContent.trim()).toContain(
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et'
          );
          expect(htmlContent.trim()).toContain(
            'dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'
          );
          expect(htmlContent.trim()).toContain('</p>');

          expect(htmlContent.trim()).toContain('<app-test-card></app-test-card>');
          expect(htmlContent.trim()).toContain('<app-test-form></app-test-form>');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein Tab mit Beispieltext erstellen', async (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.otherSchematics = ['text'];

      callRule(luxTabs(testOptions), observableOf(testHelper.appTree), testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');

          expect(htmlContent.trim()).not.toContain('<app-text-card></app-text-card>');
          expect(htmlContent.trim()).not.toContain('<app-test-form></app-test-form>');

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

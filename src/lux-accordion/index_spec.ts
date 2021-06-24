import { callRule } from '@angular-devkit/schematics';
import { TestHelper } from '../utility/test-helper';
import { luxAccordion } from './index';
import { of as observableOf } from 'rxjs';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-accordion', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    soloPanel: false
  };

  const schematicsFunction = luxAccordion;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-accordion', collectionPath);
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

  describe('schema.soloPanel', () => {
    it('Sollte ein Panel mit Accordion generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.soloPanel = false;
      callRule(schematicsFunction(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('<lux-accordion [luxMulti]="true">');
          expect(htmlContent.trim()).toContain('</lux-accordion>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein Panel ohne Accordion generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.soloPanel = true;
      callRule(schematicsFunction(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).not.toContain('<lux-accordion [luxMulti]="true">');
          expect(htmlContent.trim()).not.toContain('</lux-accordion>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

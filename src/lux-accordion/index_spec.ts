import { callRule } from '@angular-devkit/schematics';
import { TestHelper } from '../utility/test-helper';
import { luxAccordion } from './index';
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
    it('Sollte .spec.ts generieren (true)',  (done) => {
      testHelper.testSpecTrue(schematicsFunction, defaultOptions);
      done();
    });

    it('Sollte .spec.ts generieren (false)',  (done) => {
      testHelper.testSpecFalse(schematicsFunction, defaultOptions);
      done();
    });
  });

  describe('schema.createStylesheet', () => {
    it('Sollte .scss generieren (true)', (done) => {
      testHelper.testScssTrue(schematicsFunction, defaultOptions);
      done();
    });

    it('Sollte .scss generieren (false)', (done) => {
      testHelper.testScssFalse(schematicsFunction, defaultOptions);
      done();
    });
  });

  describe('schema.importToNgModule', () => {
    it('Sollte den Import in das Module einfügen (true)', (done) => {
      testHelper.testImportTrue(schematicsFunction, defaultOptions);
      done();
    });

    it('Sollte den Import in das Module einfügen (false)', (done) => {
      testHelper.testImportFalse(schematicsFunction, defaultOptions);
      done();
    });
  });

  describe('schema.soloPanel', () => {
    it('Sollte ein Panel mit Accordion generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.soloPanel = false;
      callRule(schematicsFunction(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('<lux-accordion [luxMulti]="true">');
          expect(htmlContent.trim()).toContain('</lux-accordion>');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein Panel ohne Accordion generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.soloPanel = true;
      callRule(schematicsFunction(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).not.toContain('<lux-accordion [luxMulti]="true">');
          expect(htmlContent.trim()).not.toContain('</lux-accordion>');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

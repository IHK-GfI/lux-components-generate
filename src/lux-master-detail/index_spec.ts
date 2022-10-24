import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxMasterDetail } from './index';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-master-detail', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    createWithFilter: false
  };

  const schematicsFunction = luxMasterDetail;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-master-detail', collectionPath);
  });

  describe('schema.createTests', () => {
    it('Sollte .spec.ts generieren (true)', (done) => {
      testHelper.testSpecTrue(schematicsFunction, defaultOptions);
      done();
    });

    it('Sollte .spec.ts generieren (false)', (done) => {
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

  describe('schema.createWithFilter', () => {
    it('Sollte kein zusätzlichen Filter im Master Header generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.createWithFilter = false;

      callRule(luxMasterDetail(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
          expect(tsContent.trim()).not.toContain('changeFilter($event) {');

          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('<h2>Master Header</h2>');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein zusätzlichen Filter im Master Header generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.createWithFilter = true;

      callRule(luxMasterDetail(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain(
            '<lux-select luxLabel="Ein Filter" [luxOptions]="options" [luxSelected]="options[0]"'
          );
          expect(htmlContent.trim()).toContain(
            'luxOptionLabelProp="label" (luxSelectedChange)="changeFilter($event)">'
          );
          expect(htmlContent.trim()).toContain('</lux-select>');

          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
          expect(tsContent.trim()).toContain('options = [');
          expect(tsContent.trim()).toContain("{value: null, label: 'Kein Filter'},");
          expect(tsContent.trim()).toContain("{value: 'A',  label: 'Filter A'},");
          expect(tsContent.trim()).toContain("{value: 'B',  label: 'Filter B'},");
          expect(tsContent.trim()).toContain("{value: 'C',  label: 'Filter C'},");
          expect(tsContent.trim()).toContain(']');

          expect(tsContent.trim()).toContain('changeFilter($event) {');
          expect(tsContent.trim()).toContain("console.log('Filter ausgewählt', $event);");
          expect(tsContent.trim()).toContain('}');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

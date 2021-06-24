import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxForm } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-formular', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    columnType: 'single',
    formControls: ['input', 'radio', 'checkbox', 'toogle']
  };

  const schematicsFunction = luxForm;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-form', collectionPath);
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

  describe('schema.shorthandSymbol', () => {
    it('Sollte "app" als Kürzel nutzen', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxForm(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain(`app-test`);
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eigenes Kürzel nutzen', () => {
      const testOptions = { ...defaultOptions };
      testOptions.shorthandSymbol = 'xyz';

      callRule(luxForm(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain(`xyz-test`);
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.columnType = "single"', () => {
    it('Sollte mit Beispielen generiert werden', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxForm(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain('this.form = this.fb.group({');
          expect(tsContent.trim()).toContain("input0: [''],");
          expect(tsContent.trim()).toContain("checkbox0: [''],");
          expect(tsContent.trim()).toContain("radio0: [''],");
          expect(tsContent.trim()).toContain("toogle0: [''],");
          expect(tsContent.trim()).toContain('});');

          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
          expect(htmlContent.trim()).toContain('luxTitle="Einspaltiges Formular"');
          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );
          expect(htmlContent.trim()).toContain('</form>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.columnType = "dual"', () => {
    it('Sollte mit Beispielen generiert werden', () => {
      const testOptions = { ...defaultOptions };
      testOptions.columnType = 'dual';

      callRule(luxForm(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain('this.form = this.fb.group({');
          expect(tsContent.trim()).toContain("input0: [''],");
          expect(tsContent.trim()).toContain("checkbox0: [''],");
          expect(tsContent.trim()).toContain("radio0: [''],");
          expect(tsContent.trim()).toContain("toogle0: [''],");

          expect(tsContent.trim()).toContain("input1: [''],");
          expect(tsContent.trim()).toContain("checkbox1: [''],");
          expect(tsContent.trim()).toContain("radio1: [''],");
          expect(tsContent.trim()).toContain("toogle1: [''],");
          expect(tsContent.trim()).toContain('});');

          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
          expect(htmlContent.trim()).toContain('luxTitle="Zweispaltiges Formular"');
          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );

          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input1" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox1" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle1" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio1" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );
          expect(htmlContent.trim()).toContain('</form>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.columnType = "three"', () => {
    it('Sollte mit Beispielen generiert werden', () => {
      const testOptions = { ...defaultOptions };
      testOptions.columnType = 'three';

      callRule(luxForm(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain('this.form = this.fb.group({');
          expect(tsContent.trim()).toContain("input0: [''],");
          expect(tsContent.trim()).toContain("checkbox0: [''],");
          expect(tsContent.trim()).toContain("radio0: [''],");
          expect(tsContent.trim()).toContain("toogle0: [''],");

          expect(tsContent.trim()).toContain("input1: [''],");
          expect(tsContent.trim()).toContain("checkbox1: [''],");
          expect(tsContent.trim()).toContain("radio1: [''],");
          expect(tsContent.trim()).toContain("toogle1: [''],");

          expect(tsContent.trim()).toContain("input2: [''],");
          expect(tsContent.trim()).toContain("checkbox2: [''],");
          expect(tsContent.trim()).toContain("radio2: [''],");
          expect(tsContent.trim()).toContain("toogle2: [''],");
          expect(tsContent.trim()).toContain('});');

          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
          expect(htmlContent.trim()).toContain('luxTitle="Dreispaltiges Formular"');
          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );

          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input1" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox1" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle1" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio1" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );

          expect(htmlContent.trim()).toContain(
            '<lux-input luxLabel="LuxInputComponent" luxControlBinding="input2" *luxLayoutRowItem></lux-input>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox2" *luxLayoutRowItem></lux-checkbox>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle2" *luxLayoutRowItem></lux-toggle>'
          );
          expect(htmlContent.trim()).toContain(
            '<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio2" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>'
          );
          expect(htmlContent.trim()).toContain('</form>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

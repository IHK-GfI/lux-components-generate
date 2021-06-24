import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxTable } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-table', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    numberOfColumns: 3,
    showPagination: false,
    showFilter: false,
    customCSSConfig: false,
    multiSelect: false,
    asyncData: false
  };

  const schematicsFunction = luxTable;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-table', collectionPath);
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

  describe('schema.showPagination', () => {
    it('Sollte keine Pagination generieren', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).not.toContain(
            '[luxShowPagination]="true" [luxPageSize]="5" [luxPageSizeOptions]="[5, 10, 20, 50, 100]"'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Pagination generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.showPagination = true;

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain(
            '[luxShowPagination]="true" [luxPageSize]="5" [luxPageSizeOptions]="[5, 10, 20, 50, 100]"'
          );
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.showFilter', () => {
    it('Sollte keinen Filter generieren', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).not.toContain('[luxShowFilter]="true"  luxFilterText="Filter hier eingeben"');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte keinen Filter generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.showFilter = true;

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain('[luxShowFilter]="true"  luxFilterText="Filter hier eingeben"');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.multiSelect', () => {
    it('Sollte keine Multiselect-Tabelle generieren', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).not.toContain('[luxMultiSelect]="true" (luxSelectedChange)="onSelectedChange($event)"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).not.toContain('onSelectedChange($event) {');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Multiselect-Tabelle generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.multiSelect = true;

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain('[luxMultiSelect]="true" (luxSelectedChange)="onSelectedChange($event)"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).toContain('onSelectedChange($event) {');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.customCSSConfig', () => {
    it('Sollte keine Custom-CSS-Klasse generieren', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).not.toContain('[luxClasses]="tableCSS"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).not.toContain("import { ICustomCSSConfig } from '@ihk-gfi/lux-components';");
          expect(tsContent).not.toContain('tableCSS: ICustomCSSConfig[] = [');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Custom-CSS-Klasse generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.customCSSConfig = true;

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain('[luxClasses]="tableCSS"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).toContain("import { ICustomCSSConfig } from '@ihk-gfi/lux-components';");
          expect(tsContent).toContain('tableCSS: ICustomCSSConfig[] = [');

          expect(testHelper.appTree.files).toContain('/projects/bar/src/app/test/test.component.scss');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.asyncData', () => {
    it('Sollte die Daten normal bereitstellen', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain('[luxData]="dataSource"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).not.toContain("import { TestHttpDao } from './test-http-dao';");
          expect(tsContent).not.toContain('httpDAO = null;');
          expect(tsContent).not.toContain('this.httpDAO = new TestHttpDao();');

          expect(testHelper.appTree.files).not.toContain('/projects/bar/src/app/test/test-http-dao.ts');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte die Daten serverseitig bereitstellen', () => {
      const testOptions = { ...defaultOptions };
      testOptions.asyncData = true;

      callRule(luxTable(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.html');
          expect(htmlContent).toContain('[luxHttpDAO]="httpDAO"');

          const tsContent = testHelper.appTree.readContent('/projects/bar/src/app/test/test.component.ts');
          expect(tsContent).toContain("import { TestHttpDao } from './test-http-dao';");
          expect(tsContent).toContain('httpDAO = null;');
          expect(tsContent).toContain('this.httpDAO = new TestHttpDao();');

          expect(testHelper.appTree.files).toContain('/projects/bar/src/app/test/test-http-dao.ts');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

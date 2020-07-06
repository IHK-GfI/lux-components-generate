import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxTable } from './index';
import { of as observableOf, EMPTY } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-table', () => {

    let appTree: UnitTestTree;
    let runner: SchematicTestRunner;
    let context: SchematicContext;

    const defaultOptions: any = {
        project: 'bar',
        // path: '/projects/bar',
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

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-table', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.importToNgModule', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Import in das NgModule erfolgen', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.showPagination', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine Pagination generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).not.toContain('[luxShowPagination]="true" [luxPageSize]="5" [luxPageSizeOptions]="[5, 10, 20, 50, 100]"');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eine Pagination generieren', (async (done) => {
            testOptions.showPagination = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxShowPagination]="true" [luxPageSize]="5" [luxPageSizeOptions]="[5, 10, 20, 50, 100]"');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.showFilter', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keinen Filter generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).not.toContain('[luxShowFilter]="true"  luxFilterText="Filter hier eingeben"');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte keinen Filter generieren', (async (done) => {
            testOptions.showFilter = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxShowFilter]="true"  luxFilterText="Filter hier eingeben"');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    })

    describe('schema.multiSelect', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine Multiselect-Tabelle generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).not.toContain('[luxMultiSelect]="true" (luxSelectedChange)="onSelectedChange($event)"');

                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('onSelectedChange($event) {');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eine Multiselect-Tabelle generieren', (async (done) => {
            testOptions.multiSelect = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxMultiSelect]="true" (luxSelectedChange)="onSelectedChange($event)"');

                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).toContain('onSelectedChange($event) {');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    })

    describe('schema.customCSSConfig', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine Custom-CSS-Klasse generieren', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).not.toContain('[luxClasses]="tableCSS"');
                
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('import { ICustomCSSConfig } from \'@ihk-gfi/lux-components\';')
                expect(tsContent).not.toContain('tableCSS: ICustomCSSConfig[] = [');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eine Custom-CSS-Klasse generieren', (async (done) => {
            testOptions.customCSSConfig = true;
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxClasses]="tableCSS"');
                
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).toContain('import { ICustomCSSConfig } from \'@ihk-gfi/lux-components\';')
                expect(tsContent).toContain('tableCSS: ICustomCSSConfig[] = [');

                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.scss');
            done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    })

    describe('schema.asyncData', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte die Daten normal bereitstellen', (async (done) => {
            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxData]="dataSource"');
                
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('import { TestHttpDao } from \'./test-http-dao\';');
                expect(tsContent).not.toContain('httpDAO = null;')
                expect(tsContent).not.toContain('this.httpDAO = new TestHttpDao();')

                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test-http-dao.ts');
                
                done();
            }, (reason) => expect(reason).toBeUndefined()); 
        }));

        it('Sollte die Daten serverseitig bereitstellen', (async (done) => {
            testOptions.asyncData = true;

            callRule(luxTable(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('[luxHttpDAO]="httpDAO"');
                
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).toContain('import { TestHttpDao } from \'./test-http-dao\';');
                expect(tsContent).toContain('httpDAO = null;')
                expect(tsContent).toContain('this.httpDAO = new TestHttpDao();')

                expect(appTree.files).toContain('/projects/bar/src/app/test/test-http-dao.ts');
                
                done();
            }, (reason) => expect(reason).toBeUndefined()); 
        }));

    });
});

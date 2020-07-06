import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxMasterDetail } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-master-detail', () => {

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
        createWithFilter: false
    };
    
    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-master-detail', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
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
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createWithFilter', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein zusätzlichen Filter im Master Header generieren', (async (done) => {
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent.trim()).not.toContain('changeFilter($event) {');    

                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');    
                expect(htmlContent.trim()).toContain('<h2>Master Header</h2>');
                          
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein zusätzlichen Filter im Master Header generieren', (async (done) => {
            testOptions.createWithFilter = true;
            callRule(luxMasterDetail(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent.trim()).toContain('<lux-select luxLabel="Ein Filter" [luxOptions]="options" [luxSelected]="options[0]"');
                expect(htmlContent.trim()).toContain('luxOptionLabelProp="label" (luxSelectedChange)="changeFilter($event)">');
                expect(htmlContent.trim()).toContain('</lux-select>');

               const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent.trim()).toContain('options = [');
                expect(tsContent.trim()).toContain('{value: null, label: \'Kein Filter\'},');   
                expect(tsContent.trim()).toContain('{value: \'A\',  label: \'Filter A\'},');   
                expect(tsContent.trim()).toContain('{value: \'B\',  label: \'Filter B\'},');   
                expect(tsContent.trim()).toContain('{value: \'C\',  label: \'Filter C\'},');
                expect(tsContent.trim()).toContain(']');
                
                expect(tsContent.trim()).toContain('changeFilter($event) {');
                expect(tsContent.trim()).toContain('console.log(\'Filter ausgewählt\', $event);'); 
                expect(tsContent.trim()).toContain('}'); 

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });
});

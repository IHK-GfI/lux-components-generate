import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxForm } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-formular', () => {

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
        columnType: 'single',
        formControls: ["input", "radio", "checkbox", "toogle"]
    };

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-form', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
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
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.shorthandSymbol', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte "app" als Kürzel nutzen', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');

                expect(tsContent.trim()).toContain('app-test');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eigenes Kürzel nutzen', (async (done) => {
            testOptions.shorthandSymbol = 'xyz';
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');

                expect(tsContent.trim()).toContain('xyz-test');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.columnType = "single"', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte mit Beispielen generiert werden', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');

                expect(tsContent.trim()).toContain('this.form = this.fb.group({');
                expect(tsContent.trim()).toContain('input0: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox0: [\'\'],');
                expect(tsContent.trim()).toContain('radio0: [\'\'],');
                expect(tsContent.trim()).toContain('toogle0: [\'\'],');
                expect(tsContent.trim()).toContain('});');


                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');

                expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
                expect(htmlContent.trim()).toContain('luxTitle="Einspaltiges Formular"');
                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');
                expect(htmlContent.trim()).toContain('</form>');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.columnType = "dual"', () => {
        const testOptions = { ...defaultOptions };
        testOptions.columnType = "dual";

        it('Sollte mit Beispielen generiert werden', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');


                expect(tsContent.trim()).toContain('this.form = this.fb.group({');
                expect(tsContent.trim()).toContain('input0: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox0: [\'\'],');
                expect(tsContent.trim()).toContain('radio0: [\'\'],');
                expect(tsContent.trim()).toContain('toogle0: [\'\'],');

                expect(tsContent.trim()).toContain('input1: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox1: [\'\'],');
                expect(tsContent.trim()).toContain('radio1: [\'\'],');
                expect(tsContent.trim()).toContain('toogle1: [\'\'],');
                expect(tsContent.trim()).toContain('});');


                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');

                expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
                expect(htmlContent.trim()).toContain('luxTitle="Zweispaltiges Formular"');
                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');

                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input1" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox1" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle1" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio1" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');
                expect(htmlContent.trim()).toContain('</form>');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

    });

    describe('schema.columnType = "three"', () => {
        const testOptions = { ...defaultOptions };
        testOptions.columnType = "three";

        it('Sollte mit Beispielen generiert werden', (async (done) => {
            callRule(luxForm(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');

                expect(tsContent.trim()).toContain('this.form = this.fb.group({');
                expect(tsContent.trim()).toContain('input0: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox0: [\'\'],');
                expect(tsContent.trim()).toContain('radio0: [\'\'],');
                expect(tsContent.trim()).toContain('toogle0: [\'\'],');

                expect(tsContent.trim()).toContain('input1: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox1: [\'\'],');
                expect(tsContent.trim()).toContain('radio1: [\'\'],');
                expect(tsContent.trim()).toContain('toogle1: [\'\'],');

                expect(tsContent.trim()).toContain('input2: [\'\'],');
                expect(tsContent.trim()).toContain('checkbox2: [\'\'],');
                expect(tsContent.trim()).toContain('radio2: [\'\'],');
                expect(tsContent.trim()).toContain('toogle2: [\'\'],');
                expect(tsContent.trim()).toContain('});');


                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                
                expect(htmlContent.trim()).toContain('<form [formGroup]="form">');
                expect(htmlContent.trim()).toContain('luxTitle="Dreispaltiges Formular"');
                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input0" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox0" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle0" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio0" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');

                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input1" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox1" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle1" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio1" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');

                expect(htmlContent.trim()).toContain('<lux-input luxLabel="LuxInputComponent" luxControlBinding="input2" *luxLayoutRowItem></lux-input>');
                expect(htmlContent.trim()).toContain('<lux-checkbox luxLabel="LuxCheckboxComponent" luxControlBinding="checkbox2" *luxLayoutRowItem></lux-checkbox>');
                expect(htmlContent.trim()).toContain('<lux-toggle luxLabel="LuxToogleComponent" luxControlBinding="toogle2" *luxLayoutRowItem></lux-toggle>');
                expect(htmlContent.trim()).toContain('<lux-radio luxLabel="LuxRadioComponent" luxControlBinding="radio2" [luxOrientationVertical]="false" [luxOptions]="radioOptions" *luxLayoutRowItem>');
                expect(htmlContent.trim()).toContain('</form>');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });
});

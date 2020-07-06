import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxTabs } from './index';
import { of as observableOf, EMPTY } from 'rxjs';
import { notDeepEqual } from 'assert';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-tabs', () => {

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
        counterVisible: false,
        otherSchematics: ["text", "card", "form"],
    };

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-tabs', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
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
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.counterVisible', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Counter erstellen', (async (done) => {
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                
                expect(htmlContent.trim()).not.toContain('<lux-tab luxTitle="Title #text" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');
                expect(htmlContent.trim()).not.toContain('<lux-tab luxTitle="Title #card" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');
                expect(htmlContent.trim()).not.toContain('<lux-tab luxTitle="Title #form" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Counter erstellen', (async (done) => {
            testOptions.counterVisible = true;
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                
                expect(htmlContent.trim()).toContain('<lux-tab luxTitle="Title #text" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');
                expect(htmlContent.trim()).toContain('<lux-tab luxTitle="Title #card" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');
                expect(htmlContent.trim()).toContain('<lux-tab luxTitle="Title #form" luxIconName="fas fa-toolbox" [luxCounter]="10" [luxCounterCap]="20"');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.otherSchematics', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte die Tabs mit einem Beispieltext, FormComponent und CardComponent erstellen', (async (done) => {
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');

                expect(htmlContent.trim()).toContain('<p>');
                expect(htmlContent.trim()).toContain('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et');
                expect(htmlContent.trim()).toContain('dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.');
                expect(htmlContent.trim()).toContain('</p>');

                expect(htmlContent.trim()).toContain('<app-test-card></app-test-card>');
                expect(htmlContent.trim()).toContain('<app-test-form></app-test-form>');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Tab mit Beispieltext erstellen', (async (done) => {
            testOptions.otherSchematics = ["text"];
            callRule(luxTabs(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                
                expect(htmlContent.trim()).not.toContain('<app-text-card></app-text-card>');
                expect(htmlContent.trim()).not.toContain('<app-test-form></app-test-form>');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });


});
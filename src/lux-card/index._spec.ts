import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxCard } from './index';
import { of as observableOf, EMPTY } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-card', () => {

    let appTree: UnitTestTree;
    let runner: SchematicTestRunner;
    let context: SchematicContext;

    const defaultOptions: any = {
        project: 'bar',
        //path: '/projects/bar',
        name: 'test', 
        createTests: false,
        createStylesheet: false, 
        importToNgModule: false,
        typeOfCard: 'simple',
        createCardActions: true,
    };

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-card', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
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
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.typeOfCard', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte eine simple Card generieren', (async (done) => {
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');

                expect(htmlContent).toContain('<lux-card-info>');
                expect(htmlContent).toContain('<span>LUX</span>');
                expect(htmlContent).toContain('</lux-card-info>');
                
                expect(htmlContent).not.toContain('<lux-card-content-expanded>');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eine Card mit erweiterten Inhalt generieren', (async (done) => {
            testOptions.typeOfCard = 'expended';
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');

                expect(htmlContent).toContain('<lux-card-content-expanded>');
                expect(htmlContent).toContain('Example text of the expanded content.');
                expect(htmlContent).toContain('</lux-card-content-expanded>');

                expect(htmlContent).not.toContain('<lux-card-info>');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createCardActions', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte eine Card mit einem Aktions-Bereich generieren', (async (done) => {
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).toContain('<lux-card-actions>');
                expect(htmlContent).toContain('<lux-button luxLabel="Button" [luxRaised]="true" luxColor="warn" (luxClicked)="onButtonClicked()"></lux-button>');
                expect(htmlContent).toContain('</lux-card-actions>');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte eine Card ohne einem Aktions-Bereich generieren', (async (done) => {
            testOptions.createCardActions = false;
            callRule(luxCard(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent).not.toContain('<lux-card-actions>');
                expect(htmlContent).not.toContain('<lux-button luxLabel="Button" [luxRaised]="true" luxColor="warn" (luxClicked)="onButtonClicked()"></lux-button>');
                expect(htmlContent).not.toContain('</lux-card-actions>');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

    });

});

import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { appOptions, workspaceOptions } from '../utility/test-helper';
import { luxStepper } from './index';
import { of as observableOf, EMPTY } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-stepper', () => {

    let appTree: UnitTestTree;
    let runner: SchematicTestRunner;
    let context: SchematicContext;
    
    const defaultOptions: any = {
        project: 'bar',
        // path: '/projects/bar',
        name: 'test',
        createTests: false,
        createStylesheet: false,
        createVerticalStepper: false,
        importToNgModule: false,
        numberOfSteps: 3,    
        navigationType: 'inside'
    };

    beforeEach(() => {
        runner = new SchematicTestRunner('schematics', collectionPath);

        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'workspace', workspaceOptions);
        appTree = runner.runExternalSchematic(
            '@schematics/angular', 'application', appOptions, appTree);

        const collection = runner.engine.createCollection(collectionPath);
        const schematic = runner.engine.createSchematic('lux-stepper', collection);
        context = runner.engine.createContext(schematic);
    });

    describe('schema.createTests', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte keine .spec generieren', (async (done) => {
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .spec generieren', (async (done) => {
            testOptions.createTests = true;
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                expect(appTree.files).toContain('/projects/bar/src/app/test/test.component.spec.ts');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createStylesheet', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte kein Stylesheet generieren', (async (done) => {
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent).not.toContain('styleUrls: [\'./test.component.scss\'],');
                expect(appTree.files).not.toContain('/projects/bar/src/app/test/test.component.scss');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die .scss generieren', (async (done) => {
            testOptions.createStylesheet = true;
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
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
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein Import in das NgModule erfolgen', (async (done) => {
            testOptions.importToNgModule = true;
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const moduleContent = appTree.readContent('/projects/bar/src/app/app.module.ts');
                expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
                expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.createVerticalStepper', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte ein horizontalen Stepper generieren', (async (done) => {
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent.trim()).not.toContain('[luxVerticalStepper]="true"');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte ein vertikalen Stepper generieren', (async (done) => {
            testOptions.createVerticalStepper = true;
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent.trim()).toContain('[luxVerticalStepper]="true"');
                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });

    describe('schema.navigationType', () => {
        const testOptions = { ...defaultOptions };

        it('Sollte die Navigation innerhalb des Steppers generieren', (async (done) => {
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                expect(htmlContent.trim()).toContain('[luxPreviousButtonConfig]="stepperPreviousButtonConfig"');
                expect(htmlContent.trim()).toContain('[luxNextButtonConfig]="stepperNextButtonConfig"');
                expect(htmlContent.trim()).toContain('[luxFinishButtonConfig]="stepperFinishButtonConfig"');

                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');
                expect(tsContent.trim()).toContain('import { ILuxStepperButtonConfig } from \'@ihk-gfi/lux-components\';');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));

        it('Sollte die Navigation außerhalb des Steppers generieren', (async (done) => {
            testOptions.navigationType = 'outside';
            callRule(luxStepper(testOptions), observableOf(appTree), context).subscribe(() => {
                const htmlContent = appTree.readContent('/projects/bar/src/app/test/test.component.html');
                
                expect(htmlContent.trim()).toContain('[luxShowNavigationButtons]="false"');
                expect(htmlContent.trim()).toContain('(luxStepChanged)="onStepChanged($event)"');

                const tsContent = appTree.readContent('/projects/bar/src/app/test/test.component.ts');

                expect(tsContent.trim()).toContain('import { LuxAppFooterButtonInfo, LuxAppFooterButtonService, LuxStepperHelperService } from \'@ihk-gfi/lux-components\';');
                expect(tsContent.trim()).toContain('import { StepperSelectionEvent } from \'@angular/cdk/stepper\';');

                expect(tsContent.trim()).toContain('btnPrev = LuxAppFooterButtonInfo.generateInfo({');
                expect(tsContent.trim()).toContain('btnNext = LuxAppFooterButtonInfo.generateInfo({');
                expect(tsContent.trim()).toContain('btnFin = LuxAppFooterButtonInfo.generateInfo({');

                expect(tsContent.trim()).toContain('constructor(private fb: FormBuilder, private buttonService: LuxAppFooterButtonService, private stepperService: LuxStepperHelperService) {');

                done();
            }, (reason) => expect(reason).toBeUndefined());
        }));
    });
});

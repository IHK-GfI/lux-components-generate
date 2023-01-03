import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxStepper } from './index';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-stepper', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    createVerticalStepper: false,
    importToNgModule: false,
    numberOfSteps: 3,
    navigationType: 'inside'
  };

  const schematicsFunction = luxStepper;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-stepper', collectionPath);
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

  describe('schema.createVerticalStepper', () => {
    it('Sollte ein horizontalen Stepper generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.createVerticalStepper = false;

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).not.toContain('[luxVerticalStepper]="true"');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein vertikalen Stepper generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.createVerticalStepper = true;

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('[luxVerticalStepper]="true"');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.navigationType', () => {
    it('Sollte die Navigation innerhalb des Steppers generieren', (done) => {
      const testOptions = { ...defaultOptions };

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('[luxPreviousButtonConfig]="stepperPreviousButtonConfig"');
          expect(htmlContent.trim()).toContain('[luxNextButtonConfig]="stepperNextButtonConfig"');
          expect(htmlContent.trim()).toContain('[luxFinishButtonConfig]="stepperFinishButtonConfig"');

          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
          expect(tsContent.trim()).toContain("import { ILuxStepperButtonConfig } from '@ihk-gfi/lux-components';");
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte die Navigation außerhalb des Steppers generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.navigationType = 'outside';

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent.trim()).toContain('[luxShowNavigationButtons]="false"');
          expect(htmlContent.trim()).toContain('(luxStepChanged)="onStepChanged($event)"');

          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);

          expect(tsContent.trim()).toContain(
            "import { LuxAppFooterButtonInfo, LuxAppFooterButtonService, LuxStepperHelperService } from '@ihk-gfi/lux-components';"
          );
          expect(tsContent.trim()).toContain("import { StepperSelectionEvent } from '@angular/cdk/stepper';");

          expect(tsContent.trim()).toContain('btnPrev = LuxAppFooterButtonInfo.generateInfo({');
          expect(tsContent.trim()).toContain('btnNext = LuxAppFooterButtonInfo.generateInfo({');
          expect(tsContent.trim()).toContain('btnFin = LuxAppFooterButtonInfo.generateInfo({');

          expect(tsContent.trim()).toContain(
            'constructor(private fb: FormBuilder, private buttonService: LuxAppFooterButtonService, private stepperService: LuxStepperHelperService) {'
          );
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

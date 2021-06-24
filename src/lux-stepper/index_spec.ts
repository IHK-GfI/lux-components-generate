import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxStepper } from './index';
import { of as observableOf } from 'rxjs';

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

  describe('schema.createVerticalStepper', () => {
    it('Sollte ein horizontalen Stepper generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.createVerticalStepper = false;

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).not.toContain('[luxVerticalStepper]="true"');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte ein vertikalen Stepper generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.createVerticalStepper = true;

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('[luxVerticalStepper]="true"');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.navigationType', () => {
    it('Sollte die Navigation innerhalb des Steppers generieren', () => {
      const testOptions = { ...defaultOptions };

      callRule(luxStepper(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent.trim()).toContain('[luxPreviousButtonConfig]="stepperPreviousButtonConfig"');
          expect(htmlContent.trim()).toContain('[luxNextButtonConfig]="stepperNextButtonConfig"');
          expect(htmlContent.trim()).toContain('[luxFinishButtonConfig]="stepperFinishButtonConfig"');

          const tsContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
          expect(tsContent.trim()).toContain("import { ILuxStepperButtonConfig } from '@ihk-gfi/lux-components';");
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte die Navigation außerhalb des Steppers generieren', () => {
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
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxCard } from './index';
import { of as observableOf } from 'rxjs';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-card', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    typeOfCard: 'simple',
    createCardActions: true
  };

  const schematicsFunction = luxCard;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-card', collectionPath);
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

  describe('schema.typeOfCard', () => {
    it('Sollte eine simple Card generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.typeOfCard = 'simple';

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent).toContain('<lux-card-info>');
          expect(htmlContent).toContain('<span>LUX</span>');
          expect(htmlContent).toContain('</lux-card-info>');

          expect(htmlContent).not.toContain('<lux-card-content-expanded>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Card mit erweiterten Inhalt generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.typeOfCard = 'expended';

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent).toContain('<lux-card-content-expanded>');
          expect(htmlContent).toContain('Example text of the expanded content.');
          expect(htmlContent).toContain('</lux-card-content-expanded>');

          expect(htmlContent).not.toContain('<lux-card-info>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.createCardActions', () => {
    it('Sollte eine Card mit einem Aktions-Bereich generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.createCardActions = true;

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent).toContain('<lux-card-actions>');
          expect(htmlContent).toContain(
            '<lux-button luxLabel="Button" [luxRaised]="true" luxColor="warn" (luxClicked)="onButtonClicked()"></lux-button>'
          );
          expect(htmlContent).toContain('</lux-card-actions>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Card ohne einem Aktions-Bereich generieren', () => {
      const testOptions = { ...defaultOptions };
      testOptions.createCardActions = false;

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);
          expect(htmlContent).not.toContain('<lux-card-actions>');
          expect(htmlContent).not.toContain(
            '<lux-button luxLabel="Button" [luxRaised]="true" luxColor="warn" (luxClicked)="onButtonClicked()"></lux-button>'
          );
          expect(htmlContent).not.toContain('</lux-card-actions>');
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

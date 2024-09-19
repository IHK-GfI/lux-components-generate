import { callRule } from '@angular-devkit/schematics';
import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxCard } from './index';

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

  describe('schema.typeOfCard', () => {
    it('Sollte eine simple Card generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.typeOfCard = 'simple';

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent).toContain('<lux-card-info>');
          expect(htmlContent).toContain('<span>LUX</span>');
          expect(htmlContent).toContain('</lux-card-info>');

          expect(htmlContent).not.toContain('<lux-card-content-expanded>');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Card mit erweiterten Inhalt generieren', (done) => {
      const testOptions = { ...defaultOptions };
      testOptions.typeOfCard = 'expended';

      callRule(luxCard(testOptions), testHelper.appTree, testHelper.context).subscribe(
        () => {
          const htmlContent = testHelper.appTree.readContent(`/projects/bar/src/app/test/test.component.html`);

          expect(htmlContent).toContain('<lux-card-content-expanded>');
          expect(htmlContent).toContain('Example text of the expanded content.');
          expect(htmlContent).toContain('</lux-card-content-expanded>');

          expect(htmlContent).not.toContain('<lux-card-info>');
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });

  describe('schema.createCardActions', () => {
    it('Sollte eine Card mit einem Aktions-Bereich generieren', (done) => {
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
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });

    it('Sollte eine Card ohne einem Aktions-Bereich generieren', (done) => {
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
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});

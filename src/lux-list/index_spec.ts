import * as path from 'path';
import { TestHelper } from '../utility/test-helper';
import { luxList } from './index';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lux-list', () => {
  const defaultOptions: any = {
    project: 'bar',
    name: 'test',
    createTests: false,
    createStylesheet: false,
    importToNgModule: false,
    emptyList: false
  };

  const namePrefix = 'List';
  const schematicsFunction = luxList;
  const testHelper = new TestHelper();

  beforeEach(async () => {
    await testHelper.init('lux-' + namePrefix.toLowerCase(), collectionPath);
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

});

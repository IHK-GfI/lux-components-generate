import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { of as observableOf } from 'rxjs';

/**
 * Standard-Optionen für das Test-Workspace.
 */
export const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0'
};

/**
 * Standard-Optionen für die Test-Applikation.
 */
export const appOptions: {
  routing: boolean;
  skipPackageJson: boolean;
  inlineTemplate: boolean;
  name: string;
  style: string;
  skipTests: boolean;
  inlineStyle: boolean;
} = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: 'scss',
  skipTests: false,
  skipPackageJson: false
};

export class TestHelper {
  appTree: UnitTestTree;
  runner: SchematicTestRunner;
  context: SchematicContext;

  async init(schematicName: string, collectionPath) {
    this.runner = new SchematicTestRunner('schematics', collectionPath);

    this.appTree = await this.runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    this.appTree = await this.runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, this.appTree)
      .toPromise();

    const collection = this.runner.engine.createCollection(collectionPath);
    const schematic = this.runner.engine.createSchematic(schematicName, collection);
    this.context = this.runner.engine.createContext(schematic);
  }

  testSpecTrue(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.createTests = true;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        expect(this.appTree.files).toContain(`/projects/bar/src/app/test/test.component.spec.ts`);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }

  testSpecFalse(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.createTests = false;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        expect(this.appTree.files).not.toContain(`/projects/bar/src/app/test/test.component.spec.ts`);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }

  testScssTrue(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.createStylesheet = true;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        const tsContent = this.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
        expect(tsContent).toContain(`styleUrls: [\'./test.component.scss\'],`);
        expect(this.appTree.files).toContain(`/projects/bar/src/app/test/test.component.scss`);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }

  testScssFalse(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.createStylesheet = false;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        const tsContent = this.appTree.readContent(`/projects/bar/src/app/test/test.component.ts`);
        expect(tsContent).not.toContain(`styleUrls: [\'./test.component.scss\'],`);
        expect(this.appTree.files).not.toContain(`/projects/bar/src/app/test/test.component.scss`);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }

  testImportTrue(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.importToNgModule = true;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        const moduleContent = this.appTree.readContent('/projects/bar/src/app/app.module.ts');
        expect(moduleContent).toMatch(/import.*Test.*from '.\/test\/test.component'/);
        expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }

  testImportFalse(schematicFunction: Function, defaultOptions) {
    const testOptions = { ...defaultOptions };
    testOptions.importToNgModule = false;

    callRule(schematicFunction(testOptions), observableOf(this.appTree), this.context).subscribe(
      () => {
        const moduleContent = this.appTree.readContent('/projects/bar/src/app/app.module.ts');
        expect(moduleContent).not.toMatch(/import.*Test.*from '.\/test\/test.component'/);
        expect(moduleContent).not.toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+TestComponent\r?\n/m);
      },
      (reason) => expect(reason).toBeUndefined()
    );
  }
}

import { DirEntry, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { join, Path, strings } from '@angular-devkit/core';
import { addDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

/**
 * Fügt die zu generierende Komponente dem zugehörigen NgModule hinzu.
 * @param options
 */
export function addDeclarationToNgModule(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!options.importToNgModule) {
      return tree;
    }

    const modulePath = findModule(tree, options);
    const source = readIntoSourceFile(tree, modulePath);

    const componentPath =
      `${options.path}/` + strings.dasherize(options.name) + '/' + strings.dasherize(options.name) + '.component';
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`${options.name}Component`);

    const declarationChanges = addDeclarationToModule(source, modulePath, classifiedName, relativePath);

    const declarationRecorder = tree.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(declarationRecorder);

    return tree;
  };
}

/**
 * Funktion zum Auffinden des "nächsten" Moduls zum Pfad einer erzeugten Datei.
 * @param tree
 * @param options
 */
function findModule(tree: Tree, options: any): Path {
  const MODULE_EXT = '.module.ts';
  const ROUTING_MODULE_EXT = '-routing.module.ts';

  let dir: DirEntry | null = tree.getDir('/' + options.path);

  while (dir) {
    const allMatches = dir.subfiles.filter((path) => path.endsWith(MODULE_EXT));
    const filteredMatches = allMatches.filter((path) => !path.endsWith(ROUTING_MODULE_EXT));

    if (filteredMatches.length == 1) {
      return join(dir.path, filteredMatches[0]);
    } else if (filteredMatches.length > 1) {
      throw new SchematicsException(
        'Es wurde mehr als ein Modul gefunden. Verwenden Sie die Option "importToNgModule", ' +
          'um den Import der Komponente in das nächstgelegene Modul zu überspringen.'
      );
    }

    dir = dir.parent;
  }

  throw new SchematicsException(
    'Kein Modul gefunden. Verwenden Sie die Option "importToNgModule" um den Import zu überspringen.'
  );
}

/**
 * Liest die Module-Datei ein.
 * @param tree
 * @param modulePath
 */
function readIntoSourceFile(tree: Tree, modulePath: string): ts.SourceFile {
  const text = tree.read(modulePath);

  if (text === null) {
    throw new SchematicsException(`Datei ${modulePath} existiert nicht.`);
  }

  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  schematic,
  SchematicContext,
  Source,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { setupOptions } from '../utility/setup';
import { cleanseFiles } from '../utility/files';
import { addDeclarationToNgModule } from '../utility/module';

export function luxTabs(options: any): Rule {
  return chain([
    createFile(options),
    callInternalSchematics(options),
    cleanseFiles(options),
    addDeclarationToNgModule(options)
  ]);
}

function createFile(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, options);

    if (!options.shorthandSymbol) {
      options.shorthandSymbol = 'app';
    }

    // Erzeugt neue Dateien aus den Templates in ./files, verzichtet je nach Optionen auf bestimmte Dateien.
    const templateSource: Source = apply(url('./files'), [
      options.createTests ? noop() : filter((path) => !path.endsWith('.spec.ts')),
      options.createStylesheet ? noop() : filter((path) => !path.endsWith('.scss')),
      template({
        ...strings,
        ...options
      }),
      move(options.path)
    ]);

    // Die Trees mergen
    return mergeWith(templateSource, MergeStrategy.Default);
  };
}

function callInternalSchematics(options: any): Rule {
  let rules: Rule[] = [];

  for (let entry of options.otherSchematics) {
    if (entry != 'text') {
      rules.push(
        schematic('lux-' + entry, {
          project: options.project,
          name: options.name + '-' + entry,
          shorthandSymbol: options.shorthandSymbol,
          importToNgModule: options.importToNgModule
        })
      );
    }
  }

  return chain(rules);
}

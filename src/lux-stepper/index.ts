import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { setupOptions } from '../utility/setup';
import { cleanseFiles } from '../utility/files';
import { addDeclarationToNgModule } from '../utility/module';

export function luxStepper(options: any): Rule {
  return chain([createFile(options), cleanseFiles(options), addDeclarationToNgModule(options)]);
}

function createFile(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, options);

    if (!/^[0-9]*$/.test(options.numberOfSteps)) {
      throw new SchematicsException('Die Eingabe für die Anzahl der Steps muss eine Zahl sein.');
    }

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

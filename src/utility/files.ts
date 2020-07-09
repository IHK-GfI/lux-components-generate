import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

/**
 * Bereinigt die .ts und .html Dateien von mehrfachen Line-Breaks.
 * @param options
 */
export function cleanseFiles(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const tsPath = options.path + '/' + dasherize(options.name) + '/' + dasherize(options.name + '.component.ts');
    const htmlPath = options.path + '/' + dasherize(options.name) + '/' + dasherize(options.name + '.component.html');

    tree.overwrite(tsPath, removeRedunantLineBreaks(tree.read(tsPath)));
    tree.overwrite(htmlPath, removeRedunantLineBreaks(tree.read(htmlPath)));
  };
}

/**
 * Entfernt aus dem übergebenen Buffer-Content Mehrfach-Linebreaks und ersetzt sie durch einen doppelten.
 * @param content
 */
function removeRedunantLineBreaks(content: Buffer | null): string {
  return (content || '').toString().replace(/\n\s*\n/g, '\n\n');
}

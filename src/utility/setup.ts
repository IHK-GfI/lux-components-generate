import { Tree } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { validateName, validateProjectName } from './validation';

/**
 * Prüft, ob die Property "path" gesetzt ist und
 * erstellt wenn nötig einen Standard-Pfad zum Projekt, wenn keiner bekannt ist.
 * @param tree
 * @param options
 */
export function setupOptions(tree: Tree, options: any): Tree {
  validateProjectName(options.project);
  validateName(options.name);

  const project = getProject(tree, options.project);

  if (options.path === undefined) {
    options.path = buildDefaultPath(project);
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  return tree;
}

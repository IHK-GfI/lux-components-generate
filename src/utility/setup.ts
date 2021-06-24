import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { findNodeAtLocation, parseTree, Node } from 'jsonc-parser';
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

  if (options.path === undefined) {
    const packageJsonAsNode = readJson(tree, '/angular.json');
    const sourceRootNode = findNodeAtLocation(packageJsonAsNode, ["projects", options.project, "sourceRoot"]);
    const prefixNode = findNodeAtLocation(packageJsonAsNode, ["projects", options.project, "prefix"]);
    options.path = sourceRootNode?.value + '/' + prefixNode?.value;
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  return tree;
}

function readJson(tree: Tree, filePath: string): Node {
  const buffer = tree.read(filePath);
  if (buffer === null) {
    throw new SchematicsException(`Konnte die Datei ${filePath} nicht lesen.`);
  }
  const content = buffer.toString();

  let result = parseTree(content) as Node;
  return result;
}

import { Style } from '@angular/cli/lib/config/schema';

import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

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
export const appOptions: ApplicationOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: <Style>'scss',
    skipTests: false,
    skipPackageJson: false
};
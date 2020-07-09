import { SchematicsException } from '@angular-devkit/schematics';

export function validateName(name: string): void {
  if (!name) {
    throw new SchematicsException('Es wurde kein Name für die Component eingetragen.');
  }
  if (/^\d/.test(name)) {
    throw new SchematicsException('Der Name für die Component darf nicht mit einer Zahl anfangen.');
  }
}

export function validateProjectName(projectName: string): void {
  if (!projectName) {
    throw new SchematicsException('Der Projektname muss gesetzt sein.');
  }
}

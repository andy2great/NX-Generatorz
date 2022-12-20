import { basename } from 'path';

export const domainProjectFiles = (projectName: string) => [
  '.prettierrc',
  'package.json',
  'tsconfig.base.json',
  '.eslintrc.json',
  `libs/${projectName}/domain/ng-package.json`,
  `libs/${projectName}/domain/package.json`,
  `libs/${projectName}/domain/tsconfig.json`,
  `libs/${projectName}/domain/tsconfig.lib.json`,
  `libs/${projectName}/domain/tsconfig.lib.prod.json`,
  `libs/${projectName}/domain/src/index.ts`,
  `libs/${projectName}/domain/src/lib/${projectName}-domain.module.ts`,
  `libs/${projectName}/domain/.eslintrc.json`,
  `libs/${projectName}/domain/src/lib/application/.gitkeep`,
  `libs/${projectName}/domain/src/lib/entities/.gitkeep`,
  `libs/${projectName}/domain/src/lib/infrastructure/.gitkeep`,
];

export const testFilesFor = (projectName: string) => [
  'jest.config.ts',
  'jest.preset.js',
  `libs/${projectName}/domain/tsconfig.spec.json`,
  `libs/${projectName}/domain/jest.config.ts`,
  `libs/${projectName}/domain/src/test-setup.ts`,
];

export const nxFiles = ['nx.json'];

export const changeIs = (changes: { path: string }, fileName: string) =>
  basename(changes.path.toLocaleLowerCase()) === fileName;

import { basename } from 'path';

/**
 * Returns a list of files that should be generated when running
 * @param projectName
 * @param projectPath
 * @returns
 */
export const domainProjectFiles = (
  projectName: string,
  projectPath: string
) => [
  '.prettierrc',
  'package.json',
  'tsconfig.base.json',
  '.eslintrc.json',
  `libs/${projectPath}/ng-package.json`,
  `libs/${projectPath}/package.json`,
  `libs/${projectPath}/tsconfig.json`,
  `libs/${projectPath}/tsconfig.lib.json`,
  `libs/${projectPath}/tsconfig.lib.prod.json`,
  `libs/${projectPath}/src/index.ts`,
  `libs/${projectPath}/src/lib/${projectName}.module.ts`,
  `libs/${projectPath}/.eslintrc.json`,
  `libs/${projectPath}/src/lib/application/.gitkeep`,
  `libs/${projectPath}/src/lib/entities/.gitkeep`,
  `libs/${projectPath}/src/lib/infrastructure/.gitkeep`,
];

export const domainTestFiles = (projectPath: string) => [
  'jest.config.ts',
  'jest.preset.js',
  `libs/${projectPath}/tsconfig.spec.json`,
  `libs/${projectPath}/jest.config.ts`,
  `libs/${projectPath}/src/test-setup.ts`,
];

export const nxFiles = ['nx.json'];

export const changeIs = (changes: { path: string }, fileName: string) =>
  basename(changes.path.toLocaleLowerCase()) === fileName;

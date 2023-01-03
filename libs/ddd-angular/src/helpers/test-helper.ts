import { basename } from 'path';
interface TreeOperation {
  path: string;
  type: string;
}

/**
 * Returns a list of files that should be generated when running most of the generators
 * @param projectName The name of the project we expect, taking the format of {domainName}-api-{projectName}
 * @param projectPath The path including, typically in the format of {domainName}/api-{projectName}
 * @returns A list of tree operations expected to be performed by NX, ex. `[{ path: 'package.json', type: 'CREATE' }]`
 */
export const generalProjectChanges = (
  projectName: string,
  projectPath: string
): TreeOperation[] => [
  { path: '.prettierrc', type: 'CREATE' },
  { path: 'package.json', type: 'CREATE' },
  { path: 'tsconfig.base.json', type: 'CREATE' },
  { path: '.eslintrc.json', type: 'CREATE' },
  { path: `libs/${projectPath}/ng-package.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/package.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/tsconfig.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/tsconfig.lib.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/tsconfig.lib.prod.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/src/index.ts`, type: 'CREATE' },
  {
    path: `libs/${projectPath}/src/lib/${projectName}.module.ts`,
    type: 'CREATE',
  },
  { path: `libs/${projectPath}/project.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/.eslintrc.json`, type: 'CREATE' },
];

export const domainProjectChanges = (projectPath: string) => [
  { path: `libs/${projectPath}/src/lib/application/.gitkeep`, type: 'CREATE' },
  { path: `libs/${projectPath}/src/lib/entities/.gitkeep`, type: 'CREATE' },
  {
    path: `libs/${projectPath}/src/lib/infrastructure/.gitkeep`,
    type: 'CREATE',
  },
];

export const generalTestingChanges = (projectPath: string) => [
  { path: 'jest.config.ts', type: 'CREATE' },
  { path: 'jest.preset.js', type: 'CREATE' },
  { path: `libs/${projectPath}/tsconfig.spec.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/jest.config.ts`, type: 'CREATE' },
  { path: `libs/${projectPath}/src/test-setup.ts`, type: 'CREATE' },
];

export const nxFiles = [{ path: 'nx.json', type: 'CREATE' }];

export const changeIs = (changes: { path: string }, fileName: string) =>
  basename(changes.path.toLocaleLowerCase()) === fileName;

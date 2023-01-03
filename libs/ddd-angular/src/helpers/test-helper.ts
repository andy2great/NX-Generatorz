import { basename } from 'path';
interface TreeOperation {
  path: string;
  type: string;
}

/**
 * Returns a list of base project files that should be generated when running most of the generators
 * @param projectName The name of the project we expect, taking the format of {domainName}-api-{projectName}
 * @param projectPath The path including the domain, typically in the format of {domainName}/api-{projectName}
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

/**
 * Returns a list of project files that should be generated when running the domain generator
 * @param projectPath The path including the domain, typically in the format of {domainName}/api-{projectName}
 * @returns A list of tree operations expected to be performed by NX, ex. `[{ path: `libs/${projectPath}/src/lib/application/.gitkeep`, type: 'CREATE' }]`
 */
export const domainProjectChanges = (projectPath: string): TreeOperation[] => [
  { path: `libs/${projectPath}/src/lib/application/.gitkeep`, type: 'CREATE' },
  { path: `libs/${projectPath}/src/lib/entities/.gitkeep`, type: 'CREATE' },
  {
    path: `libs/${projectPath}/src/lib/infrastructure/.gitkeep`,
    type: 'CREATE',
  },
];

/**
 * Returns a list of test files that should be generated when running most generators
 * @param projectPath The path including the domain, typically in the format of {domainName}/api-{projectName}
 * @returns A list of tree operations expected to be performed by NX, ex. `[{ path: 'jest.config.ts', type: 'CREATE' }]`
 */
export const generalTestingChanges = (projectPath: string): TreeOperation[] => [
  { path: 'jest.config.ts', type: 'CREATE' },
  { path: 'jest.preset.js', type: 'CREATE' },
  { path: `libs/${projectPath}/tsconfig.spec.json`, type: 'CREATE' },
  { path: `libs/${projectPath}/jest.config.ts`, type: 'CREATE' },
  { path: `libs/${projectPath}/src/test-setup.ts`, type: 'CREATE' },
];

/**
 * A file that is always generated if it does not exist.
 * All tests should start with an empty workspace, so this should always be created.
 */
export const nxFiles: TreeOperation[] = [{ path: 'nx.json', type: 'CREATE' }];

/**
 * Verifies that a change's file path ends with a certain filename
 * @param change A change performed to NX's tree object
 * @param fileName A file name that the change should end with
 * @returns true if path ends with the file's name, false otherwise
 */
export const changeIs = (change: { path: string }, fileName: string): boolean =>
  basename(change.path.toLocaleLowerCase()) === fileName;

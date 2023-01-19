import { VersionBumpExecutorSchema } from './schema';
import executor from './executor';
import { libraryGenerator } from '@nrwl/angular/generators';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ExecutorContext, Tree, readProjectConfiguration } from '@nrwl/devkit';
import * as fs from 'fs';

const options: VersionBumpExecutorSchema = {
  _: [],
};
const defaultOptions = { name: 'test' };

const setupCustomLib = async (
  tree: Tree,
  name = defaultOptions.name,
  publishable = true
): Promise<ExecutorContext> => {
  await libraryGenerator(tree, { name, publishable, importPath: publishable ? '@test-area/test' : undefined });

  const project =  readProjectConfiguration(tree, name);

  return {
    projectName: name,
    cwd: project.root,
    isVerbose: false,
    root: project.root,
    workspace: {
      version: 2,
      projects: {
        [name]: project,
      },
    }
  }
};

describe('VersionBump Executor', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  it('should throw an error if no version is specified', async () => {
    const executorContext = await setupCustomLib(appTree);
    
    await expect(executor({ ...options, _: [] }, executorContext)).rejects.toThrow();
  });

  it('should throw an error if no project name is found in context', async () => {
    const executorContext = await setupCustomLib(appTree);

    await expect(executor({ ...options, _: ['1.0.0'] }, { ...executorContext, projectName: '' })).rejects.toThrow();
  });

  it('should throw an error if an invalid version is specified', async () => {
    const executorContext = await setupCustomLib(appTree);

    await expect(executor({ ...options, _: ['abc'] }, executorContext)).rejects.toThrow();
  });

  it('should update the version in the package.json', async () => {
    const executorContext = await setupCustomLib(appTree);
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ version: '0.0.0'}));
    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockReturnValue(void 0);
    
    await executor({ ...options, _: ['1.0.0'] }, executorContext);

    expect(readFileSyncMock).toHaveBeenCalledWith(`libs/${defaultOptions.name}/package.json`, 'utf8');
    expect(writeFileSyncMock).toHaveBeenCalledWith(`libs/${defaultOptions.name}/package.json`, JSON.stringify({ version: '1.0.0' }, null, 2));
  });
});
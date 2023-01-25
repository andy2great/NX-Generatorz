import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { generalTestingChanges } from '../../helpers/test-helper';
import domainGenerator from '../domain/generator';
import renameGenerator from './generator';
import { libraryGenerator } from '@nrwl/angular/generators';

const defaultOptions = { domain: 'test-area', name: 'test' };

const setupWithDomain = async (tree: Tree, options = defaultOptions) => {
  const { domain } = options;

  await domainGenerator(tree, { name: domain });
};

const setupCustomLib = async (
  tree: Tree,
  name = defaultOptions.name,
  tag = ''
) => {
  await libraryGenerator(tree, { name, tags: tag });
};

describe('rename generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      'angular.json',
      JSON.stringify({
        version: 2,
        projects: {},
      })
    );
  });

  it('should fail if the project does not exist', async () => {
    await setupWithDomain(appTree);

    await expect(
      renameGenerator(appTree, { project: 'invalid name', rename: 'test' })
    ).rejects.toThrowError();
  });

  it('should fail if project to rename is not made with ddd-angular', async () => {
    await setupCustomLib(appTree, defaultOptions.name);

    await expect(
      renameGenerator(appTree, {
        project: defaultOptions.name,
        rename: 'another-name',
      })
    ).rejects.toThrowError();
  });

  it.each([
    'type:domain-logic',
    'type:api',
    'type:shell',
    'type:feature',
    'type:ui',
    'type:util',
  ])('should succeed if project type is %s', async (tag) => {
    await setupCustomLib(
      appTree,
      defaultOptions.name,
      `${tag},domain:${defaultOptions.domain}`
    );

    await expect(
      renameGenerator(appTree, {
        project: defaultOptions.name,
        rename: 'another-name',
      })
    ).resolves.not.toThrowError();
  });

  it('should succeed if the project exists', async () => {
    await setupWithDomain(appTree);

    await renameGenerator(appTree, {
      project: `${defaultOptions.domain}-domain`,
      rename: 'test',
    });
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`test/domain`).forEach((expectedFile) => {
      expect(changes).toContainEqual(expectedFile);
    });
  });
});

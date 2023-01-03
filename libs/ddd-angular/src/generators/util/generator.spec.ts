import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import {
  changeIs,
  generalProjectChanges,
  generalTestingChanges,
  nxFiles,
} from '../../helpers/test-helper';

const defaultOptions = { name: 'test' };

describe('util generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should generate a shared util', async () => {
    await setup(appTree);

    const config = readProjectConfiguration(
      appTree,
      `shared-util-${defaultOptions.name}`
    );

    expect(config).toBeDefined();
  });

  it("shouldn't contain any READMEs", async () => {
    await setup(appTree);

    const readme = appTree
      .listChanges()
      .find((change) => changeIs(change, 'readme.md'));

    expect(readme).toBeUndefined();
  });

  it('should contain base NX files', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    nxFiles.forEach((expectedFile) => {
      expect(changes).toContainEqual(expectedFile);
    });
  });

  it('should contain general project files', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalProjectChanges(
      `shared-util-${defaultOptions.name}`,
      `shared/util-${defaultOptions.name}`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain testing files', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`shared/util-${defaultOptions.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the util's project.json", async () => {
    await setup(appTree);

    const project = readProjectConfiguration(
      appTree,
      `shared-util-${defaultOptions.name}`
    );
    const expectedTags = ['domain:shared', 'type:util'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });
});

const setup = async (tree: Tree, options = defaultOptions) => {
  const { name } = options;
  await generator(tree, {
    name,
  });
};

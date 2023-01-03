import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import {
  changeIs,
  generalProjectChanges,
  nxFiles,
  generalTestingChanges,
  domainProjectChanges,
} from '../../helpers/test-helper';

import generator from './generator';

const defaultOptions = { name: 'test' };

describe('domain generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should generate a domain', async () => {
    await setup(appTree);

    const config = readProjectConfiguration(
      appTree,
      `${defaultOptions.name}-domain`
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
      `${defaultOptions.name}-domain`,
      `${defaultOptions.name}/domain`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain domain specific project files', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    domainProjectChanges(`${defaultOptions.name}/domain`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it('should contain files related to testing', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`${defaultOptions.name}/domain`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the domain's project.json", async () => {
    await setup(appTree);

    const project = readProjectConfiguration(
      appTree,
      `${defaultOptions.name}-domain`
    );
    const expectedTags = [`domain:${defaultOptions.name}`, 'type:domain-logic'];

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

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { changeIs, nxFiles } from '../../helpers/test-helper';

const defaultOptions = { domain: 'test-area', name: 'test' };

describe('domain generator', () => {
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
    await domainGenerator(appTree, { name: defaultOptions.domain });
  });

  it('should generate a shell inside a domain', async () => {
    await setup(appTree);

    const config = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-shell-${defaultOptions.name}`
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

  it('should generate shell specific files', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));
    const expectedChanges = [
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/tsconfig.lib.json`,
        type: 'CREATE',
      },
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/src/index.ts`,
        type: 'CREATE',
      },
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/src/lib/${defaultOptions.domain}-shell-${defaultOptions.name}.module.ts`,
        type: 'CREATE',
      },
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/project.json`,
        type: 'CREATE',
      },
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/tsconfig.json`,
        type: 'CREATE',
      },
      {
        path: `libs/${defaultOptions.domain}/shell-${defaultOptions.name}/.eslintrc.json`,
        type: 'CREATE',
      },
    ];

    expectedChanges.forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it("should generate the correct tags in the shell's project.json", async () => {
    await setup(appTree);

    const project = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-shell-${defaultOptions.name}`
    );
    const expectedTags = [
      `domain:${defaultOptions.domain}`,
      'type:shell',
    ];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });

  it('should throw an error if the project is not a domain', async () => {
    const creationCall = async () =>
      await setup(appTree, {
        domain: 'non-existent domain',
        name: 'new test',
      });

    await expect(creationCall).rejects.toThrow();
  });

  it('should add the new project to angular.json', async () => {
    await setup(appTree);

    const angularJson = readJson(appTree, 'angular.json');

    expect(angularJson.projects).toHaveProperty(
      `${defaultOptions.domain}-shell-${defaultOptions.name}`
    );
  });
});

const setup = async (tree: Tree, options = defaultOptions) => {
  const { name, domain } = options;
  await generator(tree, {
    name,
    domain: `${domain}-domain`,
  });
};

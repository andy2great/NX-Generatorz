import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import {
  changeIs,
  generalProjectChanges,
  generalTestingChanges,
  nxFiles,
} from '../../helpers/test-helper';
import { Feature } from '../../model';

const defaultOptions = { domain: 'testing-area', name: 'test' };

describe('feature generator', () => {
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

  it('should generate a feature', async () => {
    await setup(appTree);

    const config = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-feature-test`
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
      `${defaultOptions.domain}-feature-${defaultOptions.name}`,
      `${defaultOptions.domain}/feature-${defaultOptions.name}`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain files related to testing', async () => {
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(
      `${defaultOptions.domain}/feature-${defaultOptions.name}`
    ).forEach((expectedFile) => {
      expect(changes).toContainEqual(expectedFile);
    });
  });

  it('should generate a default facade, model, data-service, and component in the domain', async () => {
    const expectedChanges = [
      {
        path: `libs/${defaultOptions.domain}/domain/src/lib/application/${defaultOptions.name}.facade.ts`,
        type: 'CREATE',
      },
    ];
    await setup(appTree);

    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    expectedChanges.forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it("should generate the correct tags in the feature's project.json", async () => {
    await setup(appTree);

    const project = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-feature-${defaultOptions.name}`
    );
    const expectedTags = [`domain:${defaultOptions.domain}`, 'type:feature'];

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
      `${defaultOptions.domain}-feature-${defaultOptions.name}`
    );
  });

  describe('when renaming the project', () => {
    it('should update the project name in the angular.json', async () => {
      const feature = await setup(appTree);

      feature.rename('new name');
      const angularJson = readJson(appTree, 'angular.json');

      expect(angularJson.projects).toHaveProperty(
        `${defaultOptions.domain}-feature-new-name`
      );
    });

    it('should rename the project folder', async () => {
      const feature = await setup(appTree);

      feature.rename('new name');
      const changes = appTree.listChanges().map((change) => ({
        type: change.type,
        path: change.path,
      }));

      generalTestingChanges(
        `${defaultOptions.domain}/feature-new-name`
      ).forEach((expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      });
    });
  });
});

const setup = async (tree: Tree, options = defaultOptions) => {
  const { name, domain } = options;
  await generator(tree, {
    name,
    domain: `${domain}-domain`,
  });
  return new Feature(tree, `${domain}-feature-${name}`);
};

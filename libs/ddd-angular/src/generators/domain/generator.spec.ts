import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit';
import {
  changeIs,
  generalProjectChanges,
  nxFiles,
  generalTestingChanges,
  domainProjectChanges,
} from '../../helpers/test-helper';
import { Domain } from '../../model';

import generator from './generator';
import featureGenerator from '../feature/generator';
import shellGenerator from '../shell/generator';
import apiGenerator from '../api/generator';

const defaultOptions = { name: 'test', domain: 'test-area' };

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
  });

  it('should generate a domain', async () => {
    await setup(appTree);

    const config = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-domain`
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
      `${defaultOptions.domain}-domain`,
      `${defaultOptions.domain}/domain`
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

    domainProjectChanges(`${defaultOptions.domain}/domain`).forEach(
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

    generalTestingChanges(`${defaultOptions.domain}/domain`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the domain's project.json", async () => {
    await setup(appTree);

    const project = readProjectConfiguration(
      appTree,
      `${defaultOptions.domain}-domain`
    );
    const expectedTags = [
      `domain:${defaultOptions.domain}`,
      'type:domain-logic',
    ];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });

  it('should add the new project to angular.json', async () => {
    await setup(appTree);

    const angularJson = readJson(appTree, 'angular.json');

    expect(angularJson.projects).toHaveProperty(
      `${defaultOptions.domain}-domain`
    );
  });

  describe('when renaming the project', () => {
    it('should update the project name in the angular.json', async () => {
      const domain = await setup(appTree);

      domain.rename('new name');
      const angularJson = readJson(appTree, 'angular.json');

      expect(angularJson.projects).toHaveProperty(`new-name-domain`);
    });

    it('should rename the project folder', async () => {
      const domain = await setup(appTree);

      domain.rename('new name');
      const changes = appTree.listChanges().map((change) => ({
        type: change.type,
        path: change.path,
      }));

      generalTestingChanges(`new-name/domain`).forEach((expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      });
    });

    it.each([
      ['feature', featureGenerator],
      ['shell', shellGenerator],
      ['api', apiGenerator],
    ])('should update the folder for %s', async (type, affectedGenerator) => {
      const domain = await setup(appTree);
      await affectedGenerator(appTree, {
        name: defaultOptions.name,
        domain: `${defaultOptions.domain}-domain`,
      });

      domain.rename('new name');
      const changes = appTree.listChanges().map((change) => ({
        type: change.type,
        path: change.path,
      }));

      generalTestingChanges(`new-name/${type}-${defaultOptions.name}`).forEach(
        (expectedFile) => {
          expect(changes).toContainEqual(expectedFile);
        }
      );
    });
  });
});

const setup = async (tree: Tree, options = defaultOptions) => {
  const { domain } = options;
  await generator(tree, {
    name: domain,
  });
  return new Domain(tree, `${domain}-domain`);
};

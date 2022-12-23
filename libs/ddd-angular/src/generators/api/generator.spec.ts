import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddApiGeneratorSchema } from './schema';
import {
  changeIs,
  generalProjectChanges,
  generalTestingChanges,
  nxFiles,
} from '../../helpers/test-helper';

describe('api generator', () => {
  let appTree: Tree;
  const options: DddApiGeneratorSchema = {
    name: 'test',
    domain: 'testing-area',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: options.domain });
    await generator(appTree, {
      name: options.name,
      domain: `${options.domain}-domain`,
    });
  });

  it('should generate an api', async () => {
    const config = readProjectConfiguration(
      appTree,
      `${options.domain}-api-${options.name}`
    );

    expect(config).toBeDefined();
  });

  it("shouldn't contain any READMEs", () => {
    const readme = appTree
      .listChanges()
      .find((change) => changeIs(change, 'readme.md'));

    expect(readme).toBeUndefined();
  });

  it('should contain base NX files', () => {
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    nxFiles.forEach((expectedFile) => {
      expect(changes).toContainEqual(expectedFile);
    });
  });

  it('should contain general project files', () => {
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalProjectChanges(
      `${options.domain}-api-${options.name}`,
      `${options.domain}/api-${options.name}`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain files related to testing', () => {
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`${options.domain}/api-${options.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the api's project.json", () => {
    const project = readProjectConfiguration(
      appTree,
      `${options.domain}-api-${options.name}`
    );
    const expectedTags = [`domain:${options.domain}`, 'type:api'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });

  it('should throw an error if the project is not a domain');
});

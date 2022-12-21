import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, getProjects } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddApiGeneratorSchema } from './schema';
import {
  changeIs,
  generalProjectFiles,
  generalTestingFiles,
  nxFiles,
} from '../../helpers/test-helper';
import { projectGraphAdapter } from 'nx/src/project-graph/project-graph';

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
    const changes = appTree.listChanges().map((change) => change.path);

    nxFiles.forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it('should contain general project files', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    generalProjectFiles(
      `${options.domain}-api-${options.name}`,
      `${options.domain}/api-${options.name}`
    ).forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it('should contain files related to testing', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    generalTestingFiles(`${options.domain}/api-${options.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContain(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the api's project.json", () => {
    const projectJson = readProjectConfiguration(
      appTree,
      `${options.domain}-api-${options.name}`
    );

    expect(projectJson.tags).toStrictEqual([
      `domain:${options.domain}`,
      `domain:${options.domain}/api-${options.name}`,
      'type:api',
    ]);
  });
});

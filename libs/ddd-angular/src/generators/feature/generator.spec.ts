import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddFeatureGeneratorSchema } from './schema';
import {
  changeIs,
  generalProjectFiles,
  generalTestingFiles,
  nxFiles,
} from '../../helpers/test-helper';

describe('feature generator', () => {
  let appTree: Tree;
  const options: DddFeatureGeneratorSchema = {
    name: 'test',
    domain: 'testing-area',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: options.domain });
    await generator(appTree, {
      domain: `${options.domain}-domain`,
      name: options.name,
    });
  });

  it('should generate a feature', async () => {
    const config = readProjectConfiguration(
      appTree,
      'testing-area-feature-test'
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
      `${options.domain}-feature-${options.name}`,
      `${options.domain}/feature-${options.name}`
    ).forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it('should contain files related to testing', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    generalTestingFiles(`${options.domain}/feature-${options.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContain(expectedFile);
      }
    );
  });

  it('should generate a default facade, model, data-service, and component in the domain', () => {
    const changes = appTree.listChanges().map((change) => change.path);
    const expectedChanges = [
      `libs/${options.domain}/domain/src/lib/application/feature-${options.name}.facade.ts`,
      `libs/${options.domain}/domain/src/lib/entities/${options.name}.ts`,
      `libs/${options.domain}/domain/src/lib/infrastructure/${options.name}.data.service.ts`,
      `libs/${options.domain}/feature-${options.name}/src/lib/feature-${options.name}.component.html`,
      `libs/${options.domain}/feature-${options.name}/src/lib/feature-${options.name}.component.scss`,
      `libs/${options.domain}/feature-${options.name}/src/lib/feature-${options.name}.component.ts`,
    ];

    expectedChanges.forEach((expectedChange) => {
      expect(changes).toContain(expectedChange);
    });
  });

  it("should generate the correct tags in the feature's project.json", () => {
    const project = readProjectConfiguration(
      appTree,
      `${options.domain}-feature-${options.name}`
    );
    const expectedTags = [`domain:${options.domain}`, 'type:feature'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });
});

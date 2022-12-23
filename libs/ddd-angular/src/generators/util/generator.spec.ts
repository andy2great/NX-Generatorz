import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { DddUtilGeneratorSchema } from './schema';
import {
  changeIs,
  generalProjectChanges,
  generalTestingChanges,
  nxFiles,
} from '../../helpers/test-helper';

describe('util generator', () => {
  let appTree: Tree;
  const options: DddUtilGeneratorSchema = {
    name: 'test',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await generator(appTree, options);
  });

  it('should generate a shared util', async () => {
    const config = readProjectConfiguration(
      appTree,
      `shared-util-${options.name}`
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
      `shared-util-${options.name}`,
      `shared/util-${options.name}`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain testing files', () => {
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`shared/util-${options.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the util's project.json", () => {
    const project = readProjectConfiguration(
      appTree,
      `shared-util-${options.name}`
    );
    const expectedTags = ['domain:shared', 'type:util'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });
});

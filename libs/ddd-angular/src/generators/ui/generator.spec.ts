import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { DddUiGeneratorSchema } from './schema';
import {
  changeIs,
  generalProjectChanges,
  generalTestingChanges,
  nxFiles,
} from '../../helpers/test-helper';

describe('domain generator', () => {
  let appTree: Tree;
  const options: DddUiGeneratorSchema = {
    name: 'test',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await generator(appTree, options);
  });

  it('should generate a shared UI', async () => {
    const config = readProjectConfiguration(
      appTree,
      `shared-ui-${options.name}`
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
      `shared-ui-${options.name}`,
      `shared/ui-${options.name}`
    ).forEach((expectedChange) => {
      expect(changes).toContainEqual(expectedChange);
    });
  });

  it('should contain testing files', () => {
    const changes = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    generalTestingChanges(`shared/ui-${options.name}`).forEach(
      (expectedFile) => {
        expect(changes).toContainEqual(expectedFile);
      }
    );
  });

  it("should generate the correct tags in the UI's project.json", () => {
    const project = readProjectConfiguration(
      appTree,
      `shared-ui-${options.name}`
    );
    const expectedTags = ['domain:shared', 'type:ui'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });
});

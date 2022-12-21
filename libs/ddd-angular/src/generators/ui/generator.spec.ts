import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { DddUiGeneratorSchema } from './schema';
import {
  changeIs,
  domainProjectFiles,
  domainTestFiles,
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
    const config = readProjectConfiguration(appTree, 'shared-ui-test');
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

  it('should contain base NX files', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    domainProjectFiles(
      `shared-ui-${options.name}`,
      `shared/ui-${options.name}`
    ).forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });
});

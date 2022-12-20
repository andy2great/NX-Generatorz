import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { DddUiGeneratorSchema } from './schema';

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
      .find((change) => change.path.toLocaleLowerCase().endsWith('readme.md'));

    expect(readme).toBeUndefined();
  });
});

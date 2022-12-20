import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { DddUtilGeneratorSchema } from './schema';

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
    const config = readProjectConfiguration(appTree, 'shared-util-test');
    expect(config).toBeDefined();
  });

  it("shouldn't contain any READMEs", () => {
    const readme = appTree
      .listChanges()
      .find((change) => change.path.toLocaleLowerCase().endsWith('readme.md'));

    expect(readme).toBeUndefined();
  });
});

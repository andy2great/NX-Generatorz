import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddFeatureGeneratorSchema } from './schema';

describe('feature generator', () => {
  let appTree: Tree;
  const domainName = 'testing-area';
  const options: DddFeatureGeneratorSchema = {
    name: 'test',
    domain: `${domainName}-domain`,
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: domainName });
    await generator(appTree, options);
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
      .find((change) => change.path.toLocaleLowerCase().endsWith('readme.md'));

    expect(readme).toBeUndefined();
  });
});

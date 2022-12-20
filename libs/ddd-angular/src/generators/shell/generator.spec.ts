import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddShellGeneratorSchema } from './schema';
import { changeIs } from '../../helpers/test-helper';

describe('domain generator', () => {
  let appTree: Tree;
  const domainName = 'testing-area';
  const options: DddShellGeneratorSchema = {
    name: 'test',
    domain: `${domainName}-domain`,
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: domainName });
    await generator(appTree, options);
  });

  it('should generate a shell inside a domain', async () => {
    const config = readProjectConfiguration(appTree, 'testing-area-shell-test');
    expect(config).toBeDefined();
  });

  it("shouldn't contain any READMEs", () => {
    const readme = appTree
      .listChanges()
      .find((change) => changeIs(change, 'readme.md'));

    expect(readme).toBeUndefined();
  });
});

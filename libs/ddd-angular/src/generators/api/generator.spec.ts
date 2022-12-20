import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, getProjects } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddApiGeneratorSchema } from './schema';

describe('api generator', () => {
  let appTree: Tree;
  const domainName = 'testing-area';
  const options: DddApiGeneratorSchema = {
    name: 'test',
    domain: `${domainName}-domain`,
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: domainName });
    await generator(appTree, options);
  });

  it('should generate an api', async () => {
    console.log(getProjects(appTree));
    const config = readProjectConfiguration(appTree, 'testing-area-api-test');
    expect(config).toBeDefined();
  });

  it("shouldn't contain any READMEs", () => {
    const readme = appTree
      .listChanges()
      .find((change) => change.path.toLocaleLowerCase().endsWith('readme.md'));

    expect(readme).toBeUndefined();
  });
});

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import {
  changeIs,
  domainProjectFiles,
  nxFiles,
  testFilesFor,
} from '../../helpers/test-helper';

import generator from './generator';
import { DddDomainGeneratorSchema } from './schema';

describe('domain generator', () => {
  let appTree: Tree;
  const options: DddDomainGeneratorSchema = {
    name: 'test',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await generator(appTree, options);
  });

  it('should generate a domain', async () => {
    const config = readProjectConfiguration(appTree, `${options.name}-domain`);
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

  it('should contain domain project files', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    domainProjectFiles(options.name).forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it('should contain files related to testing', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    console.log(changes);

    testFilesFor(options.name).forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });
});

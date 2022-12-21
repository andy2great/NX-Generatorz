import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import domainGenerator from '../domain/generator';
import generator from './generator';
import { DddShellGeneratorSchema } from './schema';
import { changeIs, nxFiles } from '../../helpers/test-helper';

describe('domain generator', () => {
  let appTree: Tree;
  const options: DddShellGeneratorSchema = {
    name: 'test',
    domain: `testing-area`,
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, { name: options.domain });
    await generator(appTree, {
      domain: `${options.domain}-domain`,
      name: options.name,
    });
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

  it('should contain base NX files', () => {
    const changes = appTree.listChanges().map((change) => change.path);

    nxFiles.forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it('should generate shell specific files', () => {
    const changes = appTree.listChanges().map((change) => change.path);
    const expectedChanges = [
      `libs/${options.domain}/shell-${options.name}/tsconfig.lib.json`,
      `libs/${options.domain}/shell-${options.name}/src/index.ts`,
      `libs/${options.domain}/shell-${options.name}/src/lib/${options.domain}-shell-${options.name}.module.ts`,
      `libs/${options.domain}/shell-${options.name}/project.json`,
      `libs/${options.domain}/shell-${options.name}/tsconfig.json`,
      `libs/${options.domain}/shell-${options.name}/.eslintrc.json`,
    ];

    expectedChanges.forEach((expectedFile) => {
      expect(changes).toContain(expectedFile);
    });
  });

  it("should generate the correct tags in the shell's project.json", () => {
    const project = readProjectConfiguration(
      appTree,
      `${options.domain}-shell-${options.name}`
    );
    const expectedTags = [`domain:${options.domain}-domain`, 'type:shell'];

    expectedTags.forEach((tag) => {
      expect(project.tags).toContain(tag);
    });
  });
});

import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './generator';
import { StorybookGeneratorSchema } from './schema';
import domainGenerator from '../domain/generator';
import { DddDomainGeneratorSchema } from '../domain/schema';

const domainOptions: DddDomainGeneratorSchema = {
  name: 'test',
};

const defaultOptions: StorybookGeneratorSchema = {
  name: `${domainOptions.name}-domain`,
  uiFramework: '@storybook/angular',
};

describe('storybook generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await domainGenerator(appTree, domainOptions);
  });

  it('should generate global storybook config', async () => {
    await setup(appTree);
    const expectedChanges = [
      { type: 'CREATE', path: '.storybook/main.ts' },
      { type: 'CREATE', path: '.storybook/tsconfig.json' },
    ];

    const actualChanges = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    expectedChanges.forEach((expectedChange) => {
      expect(actualChanges).toContainEqual(expectedChange);
    });
  });

  it('should generate project specific storybook config', async () => {
    await setup(appTree);
    const expectedChanges = [
      { type: 'CREATE', path: 'libs/test/domain/.storybook/main.ts' },
      { type: 'CREATE', path: 'libs/test/domain/.storybook/preview.ts' },
      { type: 'CREATE', path: 'libs/test/domain/.storybook/tsconfig.json' },
    ];

    const actualChanges = appTree.listChanges().map((change) => ({
      type: change.type,
      path: change.path,
    }));

    expectedChanges.forEach((expectedChange) => {
      expect(actualChanges).toContainEqual(expectedChange);
    });
  });
});

const setup = async (tree: Tree, options = defaultOptions) => {
  await generator(tree, options);
};

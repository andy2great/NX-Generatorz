import { Tree } from '@nrwl/devkit';
import sbGenerator from '@nrwl/storybook/src/generators/configuration/configuration';
import { Linter } from '@nrwl/linter';
import { StorybookGeneratorSchema } from './schema';

export default async function (tree: Tree, options: StorybookGeneratorSchema) {
  await sbGenerator(tree, {
    ...options,
    configureCypress: false,
    linter: Linter.EsLint,
    js: false,
    tsConfiguration: true,
  });
}

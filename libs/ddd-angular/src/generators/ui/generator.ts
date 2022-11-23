import { Tree } from '@nrwl/devkit';
import { DddUiGeneratorSchema } from './schema';
import dddUiGenerator from '@angular-architects/ddd/src/generators/ui';

export default async function (tree: Tree, options: DddUiGeneratorSchema) {
  await dddUiGenerator(tree, {
    ...options,
    standalone: false,
    shared: true,
    type: 'buildable',
  });
}

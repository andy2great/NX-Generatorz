import { Tree } from '@nrwl/devkit';
import dddUiGenerator from '@angular-architects/ddd/src/generators/ui';
import { SharedUiGeneratorSchema } from './schema';
import { removeFiles } from '../../helpers';

export default async function (tree: Tree, options: SharedUiGeneratorSchema) {
  await dddUiGenerator(tree, {
    ...options,
    standalone: false,
    shared: true,
    type: 'buildable',
  });
  removeFiles(tree, `shared-ui-${options.name}`);
}
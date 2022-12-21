import { Tree } from '@nrwl/devkit';
import { DddUiGeneratorSchema } from './schema';
import dddUiGenerator from '@angular-architects/ddd/src/generators/ui';
import { removeFiles } from '../../helpers';

export default async function (tree: Tree, options: DddUiGeneratorSchema) {
  await dddUiGenerator(tree, {
    ...options,
    standalone: false,
    shared: true,
    type: 'buildable',
  });
  removeFiles(tree, `shared-ui-${options.name}`);
}

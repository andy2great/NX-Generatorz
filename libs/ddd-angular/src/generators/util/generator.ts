import { Tree } from '@nrwl/devkit';
import { DddUtilGeneratorSchema } from './schema';
import dddGenerator from '@angular-architects/ddd/src/generators/util';
import { removeFiles, sanitize } from '../../helpers';

export default async function (tree: Tree, options: DddUtilGeneratorSchema) {
  await dddGenerator(tree, {
    ...options,
    type: 'buildable',
    shared: true,
    standalone: false,
  });
  removeFiles(tree, `shared-util-${sanitize(options.name)}`);
}

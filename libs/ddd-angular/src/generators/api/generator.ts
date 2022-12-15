import { Tree } from '@nrwl/devkit';
import { DddApiGeneratorSchema } from './schema';
import dddGenerator from '@angular-architects/ddd/src/generators/api';
import { guardValidDomain, removeFiles } from '../../helpers';

export default async function (tree: Tree, options: DddApiGeneratorSchema) {
  guardValidDomain(tree, options.domain);
  await dddGenerator(tree, {
    ...options,
    type: 'buildable',
    standalone: false,
  });
  removeFiles(tree, `${options.domain}-api-${options.name}`);
}

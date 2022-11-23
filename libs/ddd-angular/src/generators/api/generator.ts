import { Tree } from '@nrwl/devkit';
import { DddApiGeneratorSchema } from './schema';
import dddGenerator from '@angular-architects/ddd/src/generators/api';

export default async function (tree: Tree, options: DddApiGeneratorSchema) {
  await dddGenerator(tree, {
    ...options,
    type: 'buildable',
    standalone: false,
  });
}

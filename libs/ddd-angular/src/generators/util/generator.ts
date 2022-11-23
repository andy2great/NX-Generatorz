import { Tree } from '@nrwl/devkit';
import { DddUtilGeneratorSchema } from './schema';
import dddGenerator from '@angular-architects/ddd/src/generators/util';

export default async function (tree: Tree, options: DddUtilGeneratorSchema) {
  await dddGenerator(tree, {
    ...options,
    type: 'buildable',
    shared: true,
    standalone: false,
  });
}

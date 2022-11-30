import { Tree } from '@nrwl/devkit';
import { DddFeatureGeneratorSchema } from './schema';
import dddFeatureGenerator from '@angular-architects/ddd/src/generators/feature';
import { guardValidDomain } from '../../helpers';

export default async function (tree: Tree, options: DddFeatureGeneratorSchema) {
  guardValidDomain(tree, options.domain);

  await dddFeatureGenerator(tree, {
    ...options,
    noApp: true,
    standalone: false,
    entity: options.name,
    type: 'buildable',
  });
}

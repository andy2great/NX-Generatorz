import { Tree } from '@nrwl/devkit';
import { DddDomainGeneratorSchema } from './schema';
import dddDomainGenerator from '@angular-architects/ddd/src/generators/domain';
import { removeFiles, sanitize } from '../../helpers';

export default async function (tree: Tree, options: DddDomainGeneratorSchema) {
  await dddDomainGenerator(tree, {
    ...options,
    standalone: false,
    type: 'buildable',
  });
  removeFiles(tree, `${sanitize(options.name)}-domain`);
}

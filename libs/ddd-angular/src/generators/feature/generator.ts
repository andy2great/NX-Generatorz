import { Tree } from '@nrwl/devkit';
import { DddFeatureGeneratorSchema } from './schema';
import dddFeatureGenerator from '@angular-architects/ddd/src/generators/feature';
import {
  domainNameFromProject,
  guardValidDomain,
  removeFiles,
} from '../../helpers';

export default async function (tree: Tree, options: DddFeatureGeneratorSchema) {
  guardValidDomain(tree, options.domain);
  const domainName = domainNameFromProject(tree, options.domain);

  await dddFeatureGenerator(tree, {
    name: `feature-${options.name}`,
    domain: domainName,
    noApp: true,
    standalone: false,
    entity: options.name,
    type: 'buildable',
  });
  removeFiles(tree, `${options.domain}-${options.name}`);
}

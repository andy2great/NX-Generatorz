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
    name: options.name,
    prefix: true,
    domain: domainName,
    noApp: true,
    standalone: false,
    type: 'buildable',
  });
  removeFiles(tree, `${domainName}-feature-${options.name}`);
}

import { Tree } from '@nrwl/devkit';
import { domainNameFromProject, guardValidDomain } from '../../helpers';
import dddUiGenerator from '@angular-architects/ddd/src/generators/ui';
import { DomainUiGeneratorSchema } from './schema';
import { removeFiles } from '../../helpers';

export default async function (tree: Tree, options: DomainUiGeneratorSchema) {
  guardValidDomain(tree, options.domain);
  const domainName = domainNameFromProject(tree, options.domain);

  await dddUiGenerator(tree, {
    ...options,
    domain: domainName,
    standalone: false,
    shared: false,
    type: 'buildable',
  });
  removeFiles(tree, `${domainName}-ui-${options.name}`);
}

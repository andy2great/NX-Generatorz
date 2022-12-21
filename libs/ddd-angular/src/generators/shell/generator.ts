import { Tree } from '@nrwl/devkit';
import { DddShellGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/generators';
import {
  domainNameFromProject,
  guardValidDomain,
  removeFiles,
  domainTagFormat
} from '../../helpers';

export default async function (tree: Tree, options: DddShellGeneratorSchema) {
  guardValidDomain(tree, options.domain);
  const domainName = domainNameFromProject(tree, options.domain);

  await libraryGenerator(tree, {
    ...options,
    name: `shell-${options.name}`,
    directory: domainName,
    unitTestRunner: 'none' as any,
    tags: `${domainTagFormat(domainName)},type:shell`,
  });
  removeFiles(tree, `${domainName}-shell-${options.name}`);
}

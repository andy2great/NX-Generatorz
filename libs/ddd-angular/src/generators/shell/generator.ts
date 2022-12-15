import { Tree } from '@nrwl/devkit';
import { DddShellGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/generators';
import { guardValidDomain, removeFiles } from '../../helpers';

export default async function (tree: Tree, options: DddShellGeneratorSchema) {
  guardValidDomain(tree, options.domain);
  await libraryGenerator(tree, {
    ...options,
    name: `shell-${options.name}`,
    directory: options.domain,
    unitTestRunner: 'none' as any,
    tags: `domain:${options.domain},type:shell`,
  });
  removeFiles(tree, `${options.domain}-shell-${options.name}`);
}

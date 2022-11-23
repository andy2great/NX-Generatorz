import { Tree } from '@nrwl/devkit';
import { DddShellGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/generators';

export default async function (tree: Tree, options: DddShellGeneratorSchema) {
  await libraryGenerator(tree, {
    ...options,
    name: `shell-${options.name}`,
    directory: options.domain,
    unitTestRunner: 'none' as any,
    tags: `domain:${options.domain},type:shell`,
  });
}

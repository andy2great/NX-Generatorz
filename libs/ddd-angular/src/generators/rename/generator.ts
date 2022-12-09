import { Tree, getWorkspaceLayout, readProjectConfiguration, ProjectConfiguration } from '@nrwl/devkit';
import { RenameGeneratorSchema } from './schema';
import { moveGenerator } from '@nrwl/workspace/generators';

interface DDDProjectConfiguration extends ProjectConfiguration {
  prefix: string;
}

export default async function (tree: Tree, options: RenameGeneratorSchema) {
  if (options.rename.includes('/')) throw new Error('Rename can not contain a /');

  const libsDir = getWorkspaceLayout(tree).libsDir;
  const project = readProjectConfiguration(tree, options.project) as DDDProjectConfiguration;

  const pathToProjectWithoutLib = project?.root.substring(libsDir.length + 1);
  const newPath = pathToProjectWithoutLib?.replace(project.prefix, options.rename);

  await moveGenerator(tree, {
    projectName: options.project,
    updateImportPath: true,
    destination: newPath,
  })
}

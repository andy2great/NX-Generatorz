import {
  Tree,
  readProjectConfiguration,
  visitNotIgnoredFiles,
} from '@nrwl/devkit';

export const findByFileName = (
  tree: Tree,
  path: string,
  fileName: string
): string[] => {
  const foundFiles: string[] = [];
  visitNotIgnoredFiles(tree, path, (path: string) => {
    if (path.toLocaleLowerCase().includes(fileName.toLocaleLowerCase())) {
      foundFiles.push(path);
    }
  });
  return foundFiles;
};

export const removeReadmes = (tree: Tree, projectName: string) => {
  const sourceRoot = readProjectConfiguration(tree, projectName).sourceRoot;
  if (!sourceRoot)
    throw new Error('SourceRoot could not be found inside of Project');
  const readmes = findByFileName(tree, sourceRoot, 'README.md');
  readmes.forEach((fileName) => tree.delete(fileName));
};

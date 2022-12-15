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
  const projectRoot = readProjectConfiguration(tree, projectName).root;
  if (!projectRoot)
    throw new Error("Project doesn't have a root");
  const readmes = findByFileName(tree, projectRoot, 'README.md');
  readmes.forEach((fileName) => tree.delete(fileName));
};

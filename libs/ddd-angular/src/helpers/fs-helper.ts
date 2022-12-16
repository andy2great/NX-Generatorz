import {
  Tree,
  readProjectConfiguration,
  visitNotIgnoredFiles,
  names,
} from '@nrwl/devkit';
import { onlyReadmes } from '../constants';

/**
 * Searches a root for any filepaths that contain any of the specified
 * file names and returns a list of those that match
 *
 * @param tree The virtual filesystem tree provided by NX
 * @param rootPath The root path to use for our search
 * @param fileNames The file names to check against
 * @returns A list of paths that contain any of the strings in the fileNames argument
 */
export const findByFileNames = (
  tree: Tree,
  rootPath: string,
  fileNames: string[]
): string[] => {
  const foundFiles: string[] = [];
  visitNotIgnoredFiles(tree, rootPath, (path: string) => {
    fileNames.forEach((fileName) => {
      if (path.toLocaleLowerCase().endsWith(fileName.toLocaleLowerCase())) {
        foundFiles.push(path);
      }
    });
  });
  return foundFiles;
};

/**
 * Remove the specified files from the specified project.
 * The file name search is case insensitive, but must contain the extension.
 *
 * @param tree The virtual filesystem tree provided by NX
 * @param projectName The name of the project you wish to remove files from
 * @param fileNames The case-insensitive file names that we would like to remove. Defaults to only removing README.md files
 */
export const removeFiles = (
  tree: Tree,
  projectName: string,
  fileNames: string[] = onlyReadmes
) => {
  projectName = sanitize(projectName);
  const projectRoot = readProjectConfiguration(tree, projectName).root;
  if (!projectRoot) throw new Error("Project doesn't have a root");
  const files = findByFileNames(tree, projectRoot, fileNames);
  files.forEach((fileName) => tree.delete(fileName));
};

/**
 * Converts the input into kebab-case, which is file name friendly
 *
 * @param input A string you'd like to convert
 * @returns A kebab-case string
 */
export const sanitize = (input: string) => names(input).fileName;

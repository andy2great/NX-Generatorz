import {
  ProjectConfiguration,
  Tree,
  names,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { readProjectConfiguration } from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace/generators';

export abstract class DDDObject {
  abstract readonly prefix: string;

  readonly projectConfig: ProjectConfiguration;

  constructor(public readonly tree: Tree, public readonly project: string) {
    this.projectConfig = readProjectConfiguration(this.tree, this.project);
  }

  async rename(name: string) {
    const { fileName: updatedName } = names(name);
    const { libsDir } = getWorkspaceLayout(this.tree);
    const { root, name: projectName } = this.projectConfig;
  
    if (!projectName) {
      throw new Error('Invalid project name');
    }
  
    const pathWithoutRoot = root.substring(0, root.lastIndexOf('/') + 1);
    const pathWithoutLibsDir = pathWithoutRoot.substring(libsDir.length + 1);
    const adjustedPath = `${pathWithoutLibsDir}${this.prefix}-${updatedName}`;
  
    await moveGenerator(this.tree, {
      projectName,
      updateImportPath: true,
      destination: adjustedPath,
    });
  }
}

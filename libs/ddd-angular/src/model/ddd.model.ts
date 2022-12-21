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
    const { root } = this.projectConfig;

    const projectName = this.projectConfig.name;
    if (!projectName) throw new Error('Invalid project name');

    const adjustedPath = root
      .substring(0, root.lastIndexOf('/') + 1)
      .substring(libsDir.length + 1);
      
    await moveGenerator(this.tree, {
      projectName,
      updateImportPath: true,
      destination: `${adjustedPath}${this.prefix}-${updatedName}`,
    });
  }
}

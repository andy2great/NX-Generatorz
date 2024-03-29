import {
  ProjectConfiguration,
  Tree,
  names,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { readProjectConfiguration } from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace/generators';
import * as path from 'path';

export abstract class DDDObject {
  abstract readonly prefix: string;

  projectConfig: ProjectConfiguration;

  constructor(public readonly tree: Tree, public project: string) {
    this.projectConfig = readProjectConfiguration(this.tree, project);
  }

  setupProjectConfig(project?: string) {
    if (!project) return;
  }

  async rename(name: string) {
    const { fileName: updatedName } = names(name);
    const { libsDir } = getWorkspaceLayout(this.tree);
    const { root, name: projectName } = this.projectConfig;

    if (!projectName) {
      throw new Error('Invalid project name');
    }

    const pathWithoutRoot = `${path.dirname(root)}/`;
    const pathWithoutLibsDir = pathWithoutRoot.substring(libsDir.length + 1);
    const adjustedPath = `${pathWithoutLibsDir}${this.prefix}-${updatedName}`;

    await moveGenerator(this.tree, {
      projectName,
      updateImportPath: true,
      destination: adjustedPath,
    });
  }
}

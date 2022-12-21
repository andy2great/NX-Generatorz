import {
  getWorkspaceLayout,
  names,
  getProjects,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { DDDObject } from './ddd.model';
import { moveGenerator } from '@nrwl/workspace/generators';
import {
  domainNameFromProject,
  domainTagFormat,
  domainTagFromProject,
} from '../helpers';

export class Domain extends DDDObject {
  prefix = 'domain';

  override async rename(name: string) {
    const { fileName: updatedName } = names(name);
    const { libsDir } = getWorkspaceLayout(this.tree);

    const projectName = this.projectConfig.name;
    const previousDomainName = domainNameFromProject(this.tree, this.project);

    if (!projectName) throw new Error('Invalid project name');
    const domainTag = domainTagFormat(previousDomainName);

    const projects = getProjects(this.tree);
    

    [...projects.keys()]
      .map((key) => readProjectConfiguration(this.tree, key))
      .filter(
        (project) => {
          if (!project.name) return false;
          try {
            return domainTagFromProject(this.tree, project.name) === domainTag;
          } catch {
            return false;
          }
        }
      )
      .forEach(async (project) => {
        if (!project.name) throw new Error('Invalid project name');

        const adjustedPath = project.root
          .replace(`/${previousDomainName}/`, `/${updatedName}/`)
          .substring(libsDir.length + 1);
          
        updateProjectConfiguration(this.tree, project.name, {
          ...project,
          tags: [
            ...(project.tags?.filter((tag) => tag !== domainTag) ?? []),
            domainTagFormat(updatedName),
          ],
        });

        await moveGenerator(this.tree, {
          projectName: project.name,
          updateImportPath: true,
          destination: adjustedPath,
        });
      });
  }
}

import { getWorkspaceLayout, names, getProjects, readProjectConfiguration, updateProjectConfiguration } from "@nrwl/devkit";
import { DDDObject } from "./ddd.model";
import { moveGenerator } from '@nrwl/workspace/generators';
import { domainNameFromProject } from "../helpers";

export class Domain extends DDDObject {
  prefix = 'domain';

  override async rename(name: string) {
    const { fileName: updatedName } = names(name);
    const { libsDir } = getWorkspaceLayout(this.tree);

    const projectName = this.projectConfig.name;
    const previousDomainName = domainNameFromProject(this.tree, this.project);

    if (!projectName) throw new Error('Invalid project name');
    const domainTag = `domain:${previousDomainName}`;
    
    const projects = getProjects(this.tree);

    const moveAllPromises = [...projects.keys()]
      .map((key) => readProjectConfiguration(this.tree, key))
      .filter((project) => project.tags?.includes(domainTag))
      .map((project) => {
        if (!project.name) throw new Error('Invalid project name');

        const adjustedPath = project.root
          .replace(`/${previousDomainName}/`, `/${updatedName}/`)
          .substring(libsDir.length + 1);

        updateProjectConfiguration(this.tree, project.name, {
          ...project,
          tags: [...(project.tags?.filter((tag) => tag !== domainTag) ?? []), `domain:${updatedName}`]
        });

        return moveGenerator(this.tree, {
          projectName: project.name,
          updateImportPath: true,
          destination: adjustedPath,
        });
      });
    
    await Promise.all(moveAllPromises);
  };
}
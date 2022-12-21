import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { DDDObject } from '../model/ddd.model';
import { Domain } from '../model/domain.model';
import { API } from '../model/api.model';
import { Shell } from '../model/shell.model';
import { Feature } from '../model/feature.model';
import { UI } from '../model/ui.model';
import { Util } from '../model/util.model';

export const guardValidDomain = (tree: Tree, domain: string) => {
  if (!domainExist(tree, domain)) throw new Error('Invalid domain');
  if (domain === 'shared') throw new Error('Shared cannot be a domain');
};

export const domainExist = (tree: Tree, domain: string) => {
  const tags = readProjectConfiguration(tree, domain).tags;
  return tags?.includes('type:domain-logic');
};

export const domainNameFromProject = (tree: Tree, projectName: string) => {
  const domainName = domainTagFromProject(tree, projectName).split(':')[1];
  if (!domainName) throw new Error('Invalid domain');
  return domainName;
}

export const domainTagFromProject = (tree: Tree, projectName: string) => {
  const domainTag = readProjectConfiguration(tree, projectName).tags?.find((tag) => tag.startsWith('domain:'));
  if (!domainTag) throw new Error('Invalid domain');
  return domainTag;
}

export const domainTagFormat = (domain: string) => `domain:${domain}`;

export const MakeDDDObject = (tree: Tree, projectName: string): DDDObject => {
  const project = readProjectConfiguration(tree, projectName);
  
  switch (project.tags?.find((tag) => tag.startsWith('type:'))) {
    case 'type:domain-logic':
      return new Domain(tree, projectName);
    case 'type:api':
      return new API(tree, projectName);
    case 'type:shell':
      return new Shell(tree, projectName);
    case 'type:feature':
      return new Feature(tree, projectName);
    case 'type:ui':
      return new UI(tree, projectName);
    case 'type:util':
      return new Util(tree, projectName);
  }
  
    throw new Error('Invalid project type');
}

import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { DDDObject } from '../model/ddd.model';
import { Domain } from '../model/domain.model';
import { API } from '../model/api.model';
import { Shell } from '../model/shell.model';
import { Feature } from '../model/feature.model';
import { UI } from '../model/ui.model';
import { Util } from '../model/util.model';

/**
 * It throws an error if the domain is invalid or shared
 * 
 * @param tree The virtual filesystem tree provided by NX
 * @param domain The domain name
 */
export const guardValidDomain = (tree: Tree, domain: string) => {
  if (!domainExist(tree, domain)) throw new Error('Invalid domain');
  if (domain === 'shared') throw new Error('Shared cannot be a domain');
};

/**
 * It checks if the project is a domain by checking if it has the tag 'type:domain-logic'
 * It throws an error if the domain is invalid
 * 
 * @param tree The virtual filesystem tree provided by NX
 * @param domain The domain name
 * @returns if the project is a domain
 */
export const domainExist = (tree: Tree, domain: string) => {
  const tags = readProjectConfiguration(tree, domain).tags;
  return tags?.includes('type:domain-logic');
};

/**
 * It finds the domain name from the tag 'domain:{domain-name}'
 * It throws an error if the domain is invalid
 * 
 * @param tree The virtual filesystem tree provided by NX
 * @param projectName The project name
 * @returns The domain name
 */
export const domainNameFromProject = (tree: Tree, projectName: string) => 
  domainTagFromProject(tree, projectName).split(':')[1];


/**
 * It finds the domain tag from the tag starting with 'domain:'
 * It throws an error if the domain is invalid
 * 
 * @param tree The virtual filesystem tree provided by NX
 * @param projectName The project name
 * @returns the domain tag containing the domain name
 */
export const domainTagFromProject = (tree: Tree, projectName: string) => {
  const domainTag = readProjectConfiguration(tree, projectName).tags?.find((tag) => tag.startsWith('domain:'));
  if (!domainTag) throw new Error('Invalid domain');
  return domainTag;
}

/**
 * It converts the domain name to a domain tag
 * 
 * @param domain The domain name
 * @returns the formatted domain tag like 'domain:{domain-name}'
 */
export const domainTagFormat = (domain: string) => `domain:${domain}`;

/**
 * It makes a DDDObject from a project name based on the project type found in the tags with the prefix 'type:'
 * The types can be of the following: 'type:domain-logic', 'type:api', 'type:shell', 'type:feature', 'type:ui', 'type:util'
 * It throws an error if the project type is invalid
 * 
 * @param tree The virtual filesystem tree provided by NX
 * @param projectName the project name
 * @returns the DDDObject
 */
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

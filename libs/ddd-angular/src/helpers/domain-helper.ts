import { Tree, readProjectConfiguration } from '@nrwl/devkit';

export const guardValidDomain = (tree: Tree, domain: string) => {
  if (!domainExist(tree, domain)) throw new Error('Invalid domain');
  if (domain === 'shared') throw new Error('Shared cannot be a domain');
};

export const domainExist = (tree: Tree, domain: string) => {
  const tags = readProjectConfiguration(tree, domain).tags;
  return tags?.includes('type:domain-logic');
};

export const domainNameFromProject = (tree: Tree, projectName: string) => {
  const domainName = readProjectConfiguration(tree, projectName)
    .tags?.find((tag) => tag.startsWith('domain:'))
    ?.split(':')[1];
  if (!domainName) throw new Error('Invalid domain');
  return domainName;
};

import { Tree, readProjectConfiguration } from '@nrwl/devkit';

export const guardValidDomain = (tree: Tree, domain: string) => {
  if (!domainExist(tree, domain)) throw new Error('Domain does not exist');
  if (domain === 'shared') throw new Error('Shared cannot be a domain');
}

export const domainExist = (tree: Tree, domain: string) => {
  const tags = readProjectConfiguration(tree, domain).tags;
  return tags?.includes('type:domain-logic');
}
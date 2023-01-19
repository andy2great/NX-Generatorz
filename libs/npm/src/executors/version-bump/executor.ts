import { versionIsValid } from '../../helper';
import { VersionBumpExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import * as fs from 'fs';

export default async function runExecutor(
  options: VersionBumpExecutorSchema,
  context: ExecutorContext
) {
  if (!options._ || options._.length === 0) throw new Error('No version specified');
  const version = options._[0];
  
  if (!versionIsValid(version)) throw new Error('Invalid version specified');
  if (!context.projectName) throw new Error('No project name found in context');

  const packageJsonPath = `${context.workspace.projects[context.projectName].root}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  return {
    success: true
  };
}


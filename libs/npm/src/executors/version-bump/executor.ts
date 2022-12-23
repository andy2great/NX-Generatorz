import { VersionBumpExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(
  options: VersionBumpExecutorSchema,
  context: ExecutorContext
) {
  if (!options._ || options._.length === 0) throw new Error('No version specified');
  if (!context.projectName) throw new Error('No project name found in context');

  const packageJsonPath = `${context.workspace.projects[context.projectName].root}/package.json`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonPath);
  packageJson.version = options._[0];

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  return {
    success: true
  };
}


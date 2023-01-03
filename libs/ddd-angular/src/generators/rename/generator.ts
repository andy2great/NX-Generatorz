import { Tree } from '@nrwl/devkit';
import { RenameGeneratorSchema } from './schema';
import { MakeDDDObject } from '../../helpers';

export default async function (tree: Tree, options: RenameGeneratorSchema) {
  await MakeDDDObject(tree, options.project).rename(options.rename);
}

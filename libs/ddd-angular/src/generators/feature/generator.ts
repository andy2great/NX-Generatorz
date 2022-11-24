import { Tree } from '@nrwl/devkit';
import { DddFeatureGeneratorSchema } from './schema';
import dddFeatureGenerator from '@angular-architects/ddd/src/generators/feature';
import { applicationGenerator } from '@nrwl/angular/generators';
import { removeGenerator } from '@nrwl/workspace';
import { guardValidDomain } from '../../helpers';

const APP_NAME = 'bobby-john-boratos';

export default async function (tree: Tree, options: DddFeatureGeneratorSchema) {
  guardValidDomain(tree, options.domain);

  await applicationGenerator(tree, {
    name: APP_NAME,
    unitTestRunner: 'none' as any,
    e2eTestRunner: 'none' as any,
  });
  await dddFeatureGenerator(tree, {
    ...options,
    app: APP_NAME,
    standalone: false,
    entity: options.name,
    type: 'buildable',
  });
  await removeGenerator(tree, {
    projectName: APP_NAME,
    forceRemove: false,
    skipFormat: false,
  });
}

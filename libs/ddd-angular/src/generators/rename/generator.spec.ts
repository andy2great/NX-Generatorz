import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import domainGenerator from "../domain/generator";
import apiGenerator from "../api/generator";
import shellGenerator from "../shell/generator";
import featureGenerator from "../feature/generator";
import uiGenerator from "../ui/generator";
import utilGenerator from "../util/generator";
import { API, Domain, Feature, Shell, UI, Util } from "../../model";
import { generalTestingChanges } from "../../helpers/test-helper";

const defaultOptions = { domain: 'test-area', name: 'test' };
const DDDObjects = {
  Domain: { dddClass: Domain, name: `${defaultOptions.domain}-domain` },
  API: { dddClass: API, name: `${defaultOptions.domain}-api-${defaultOptions.name}` },
  Feature: { dddClass: Feature, name: `${defaultOptions.domain}-feature-${defaultOptions.name}` },
  Shell: { dddClass: Shell, name: `${defaultOptions.domain}-shell-${defaultOptions.name}` },
  UI: { dddClass: UI, name: `shared-ui-${defaultOptions.name}` },
  Util: { dddClass: Util, name: `shared-util-${defaultOptions.name}` }, 
};

// eslint-disable-next-line @typescript-eslint/ban-types
const setup = async (tree: Tree, dddObject: Function, options = defaultOptions) => {
  const { name, domain } = options;

  await domainGenerator(tree, { name: domain });
  switch (dddObject.name) {
    case 'API':
      await apiGenerator(tree, { name, domain: `${domain}-domain` });
      break;
    case 'Feature':
      await featureGenerator(tree, { name, domain: `${domain}-domain` });
      break;
    case 'Shell':
      await shellGenerator(tree, { name, domain: `${domain}-domain` });
      break;
    case 'UI':
      await uiGenerator(tree, { name });
      break;
    case 'Util':
      await utilGenerator(tree, { name });
      break;
  }
};

describe('rename generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      'angular.json',
      JSON.stringify({
        version: 2,
        projects: {},
      })
    );
  });

  describe.each(Object.values(DDDObjects))('when renaming the project', (definition) => {
    it('should update the project name in the angular.json', async () => {
      await setup(appTree, definition.dddClass);
      const newName = 'new-name';
      const DDDObject = await new definition.dddClass(appTree, definition.name);

      await DDDObject.rename(newName);
      const angularJson = readJson(appTree, 'angular.json');

      expect(angularJson.projects).toHaveProperty(
        DDDObject.project
      );
    });

    xit('should move rename the project folder', async () => {
      await setup(appTree, definition.dddClass);
      const newName = 'new-name';
      const DDDObject = await new definition.dddClass(appTree, definition.name);

      await DDDObject.rename(newName);
      const newChanges = appTree.listChanges().map((change) => ({
        type: change.type,
        path: change.path,
      }));
      
      generalTestingChanges(
        `${defaultOptions.domain}/${DDDObject.prefix}-${newName}`
      ).forEach((expectedChange) => {
        expect(newChanges).toContainEqual(expectedChange);
      });
    });

    // TODO(AP: 2021-05-17): Introduce when the linting rules are updated #30
    xit('should update linting rules', async () => {
      await setup(appTree, definition.dddClass);
      const newName = 'new-name';
      const DDDObject = await new definition.dddClass(appTree, definition.name);

      await DDDObject.rename(newName);
      const lintingRules = readJson(appTree, '.eslintrc.json');

      expect(lintingRules.overrides).toContainEqual({
        files: [`libs/${defaultOptions.domain}/api-${newName}/**/*.ts`],
        rules: {
          '@nrwl/nx/enforce-module-boundaries': [
            'error',
            {
              allow: [],
              depConstraints: [
                {
                  sourceTag: `domain:${defaultOptions.domain}`,
                  onlyDependOnLibsWithTags: [`domain:${defaultOptions.domain}`],
                },
                {
                  sourceTag: `type:api`,
                  onlyDependOnLibsWithTags: [`type:api`],
                },
              ],
            },
          ],
        },
      });
    });
  });
});
export interface StorybookGeneratorSchema {
  name: string;
  uiFramework:
    | '@storybook/angular'
    | '@storybook/react'
    | '@storybook/react-native';
}

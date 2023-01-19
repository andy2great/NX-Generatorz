export const versionIsValid = (version: string): boolean => {
  const versionRegex = /^(\d+\.){2}\d+$/;
  return versionRegex.test(version);
}
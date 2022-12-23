import { VersionBumpExecutorSchema } from './schema';
import executor from './executor';

const options: VersionBumpExecutorSchema = {};

describe('VersionBump Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
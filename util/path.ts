import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const rootDir = path.dirname(require.main?.filename || '');

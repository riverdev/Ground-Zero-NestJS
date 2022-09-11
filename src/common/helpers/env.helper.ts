// This file is : env.helper.ts

import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const fallback: string = resolve(`${dest}/shared.env`);
  const fallbackEnvFilename = '.env.dev';

  //We set the value NODE_ENV in the package.json script the value must
  // be the filename prefix of the file from whom you want to get the env values from.
  const filenamePrefix: string | undefined = process.env.NODE_ENV;

  const filename: string = filenamePrefix
    ? `${filenamePrefix}.env`
    : fallbackEnvFilename;

  let filePath: string = resolve(`${dest}/${filename}`);
  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}

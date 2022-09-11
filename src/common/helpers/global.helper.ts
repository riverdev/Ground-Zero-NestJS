import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';

const logger = new Logger(); //Logger(AppController.name);

/**
 * * createEmptyFiledb(:string, :string): Promise<String>
 * Creates a new file with contents [] (empty array).
 * @param {string} path
 * @param {string} fileName
 *
 * @returns {boolean}
 */
//done Create a new helper functions that creates a new empty filedb (empty array)
//todo Then use this function here (for case when the file is not found) and also
//todo in the DeleteAll function which will be smaller because it calls this new function.
export const createEmptyFiledb = async (
  path: string,
  fileName: string,
): Promise<boolean> => {
  //console.log( 'isFileOrDirectoryExists returned value = ', isFileOrDirectoryExists(path,fileName));

  logger.debug(`>> Flow >> Starting >> [global.helper-createEmptyFiledb] `);

  const noUsers: Object[] = [];
  //fileName = 'myTry-1.txt';
  try {
    await createFile(path, fileName, jsonPrettify(noUsers));
    // console.log(
    //   `[createEmptyFiledb] An empty array file was created in ${path}/${fileName}`,
    // );
    logger.verbose(
      `>> FYI >> [global.helper-createEmptyFiledb] An empty array file was created in ${path}/${fileName}`,
    );

    return true;
  } catch {
    //When the createFile fails we return type undefined and log the event.
    // console.warn(
    //   `[createEmptyFiledb] Warning - Failed creating the empty array file.`,
    // );
    logger.warn(
      `>> CATCH EVENT >> [global.helper-createEmptyFiledb] Failed creating the empty array file.`,
    );

    return false;
  }
};

/**
 * * isFileOrDirectoryExists(:string, :string):boolean
 * Check if a file exists at a given path.
 * @param {string} path
 * @param {string} fileName
 * @returns {boolean}
 */
export const isFileOrDirectoryExists = (
  path: string,
  fileName: string,
): boolean => {
  //console.log('====== Starting [isFileOrDirectoryExists] [global-helpers]');
  logger.debug(
    `>> Flow >> Starting >> [global.helper-isFileOrDirectoryExists] `,
  );
  //console.log(`INPUT VALUES: File "${fileName}" path "${path}"`);
  logger.verbose(
    `>> FYI >> [global.helper-isFileOrDirectoryExists] INPUT VALUES: File "${fileName}" path "${path}"`,
  );

  const pathAndFilename: string = `${path}/${fileName}`;

  if (!fs.existsSync(path)) {
    // console.log(`Path "${path}" doesnt exist.`);
    logger.warn(
      `>> WARNINIG >> [global.helper-isFileOrDirectoryExists] Path "${path}" doesnt exist.`,
    );

    return false;
  }

  if (!fs.existsSync(pathAndFilename)) {
    //console.log(`File name "${fileName}" doesnt exist in path "${path}"`);
    logger.warn(
      `>> WARNINIG >> [global.helper-isFileOrDirectoryExists] File name "${fileName}" doesnt exist in path "${path}"`,
    );

    createEmptyFiledb(path, fileName);
    //console.log(`Created missing file "${fileName}" in path "${path}"`);
    logger.warn(
      `>> WARNINIG >> [global.helper-isFileOrDirectoryExists] Created missing file "${fileName}" in path "${path}"`,
    );
  } //todo add else here so that the 2 messages wont appear (no file-cretaed new then everything is ok message)

  //console.log(`Everything OK, the file "${fileName}" exists in path "${path}"`);
  logger.verbose(
    `>> FYI >> [global.helper-isFileOrDirectoryExists] Everything OK, the file "${fileName}" exists in path "${path}"`,
  );

  return true;
}; //end isFileOrDirectoryExists

/**
 * * getTextFile(:string, :string): Promise<String>
 * Gets file data as string from a given path via a promise interface.
 * @param {string} path
 * @param {string} fileName
 *
 * @returns {undefined}
 */
export const getTextFile = async (
  path: string,
  fileName: string,
): Promise<string> => {
  //console.log('====== Starting [getTextFile] [global-helpers]');
  logger.debug(`>> Flow >> Starting >> [global.helper-getTextFile] `);
  //console.log(`[global.helper-getTextFile] INPUT VALUES: File "${fileName}" path "${path}"`);
  logger.verbose(
    `>> FYI >> [global.helper-getTextFile] INPUT VALUES: File "${fileName}" path "${path}"`,
  );

  if (!isFileOrDirectoryExists(path, fileName)) return undefined;

  const readFile = promisify(fs.readFile);

  const pathAndFilename = `${path}/${fileName}`;
  const fileContent: Promise<string> = readFile(pathAndFilename, 'utf8');

  if (!(await fileContent).length) {
    //console.log('***** CASE OF AN EMPTY FILE ');
    logger.warn(
      `>> WARNINIG >> [global.helper-getTextFile] CASE OF AN EMPTY FILE.`,
    );

    return undefined;
  }

  return fileContent;
};

/**
 * * createFile(:strig, :string, :any): Promise<void>
 * Writes a file at a given path via a promise interface.
 * @param {string} path
 * @param {string} fileName
 * @param {string} data
 *
 * @return {Promise<void>}
 */
export const createFile = async (
  path: string,
  fileName: string,
  data: string,
): Promise<void> => {
  //const pathAndFilename = `${path}/${fileName}`;
  //console.log(`[createFile] pathAndFilename = ${pathAndFilename}`);
  logger.debug(`>> Flow >> Starting >> [global.helper-createFile] `);

  const writeFile = promisify(fs.writeFile);

  //console.log(`[createFile] Successfully wrote to file.`))
  await writeFile(`${path}/${fileName}`, data, 'utf8')
    .then(() =>
      logger.verbose(
        `>> FYI >> [global.helper-createFile] Successfully wrote to file. `,
      ),
    )
    .catch(console.error);

  return;
};

/**
 * * jsonPrettify(:any):string
 * This function converts a JSON object to pretified string
 * representation of the object (can also be an array of objects).
 * @param {any} inputObject
 *
 * @return {string}
 */
export const jsonPrettify = (inputObject): string => {
  //logger.debug(`>> Flow >> Starting >> [global.helper-jsonPrettify] `,);

  const result = JSON.stringify(inputObject, null, 2);
  // Without these "null,2" settings the object will all be in 1 line.
  return result;
};

/* eslint-disable
  global-require,
  no-param-reassign,
  prefer-destructuring,
  import/no-dynamic-require,
*/

import { getOptions } from 'loader-utils';
import validateOptions from '@webpack-contrib/schema-utils';
import mime from 'mime';

import schema from './options.json';

// Loader Mode
export const raw = true;
/* eslint complexity:[2,10] */
export default function loader(src) {
  // Loader Options
  const options = getOptions(this) || {};

  validateOptions({ name: 'URL Loader', schema, target: options });

  const file = this.resourcePath;
  // Set limit for resource inlining (file size)
  let limit = options.limit;
  let limitSize = options.limitSize;

  if (limit) {
    limitSize = parseInt(limitSize, 10);
  }
  // Get MIME type
  const mimetype = options.mimetype || mime.getType(file);

  const hasInline = ~this.resourceQuery.indexOf('__inline');
  // No limit or within the specified limit
  if ((limit && src.length < limitSize) || hasInline) {
    if (typeof src === 'string') {
      src = Buffer.from(src);
    }

    return `module.exports = ${JSON.stringify(
      `data:${mimetype || ''};base64,${src.toString('base64')}`
    )}`;
  }

  const fallback = require(options.fallback ? options.fallback : 'file-loader');


  return fallback.call(this, src);
}

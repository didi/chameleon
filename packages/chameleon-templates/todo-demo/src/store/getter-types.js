import {checkDuplicate} from './utils';
import * as index from './index/getter-types';

let list = [index];
checkDuplicate(list);

export default {
  ...index
}

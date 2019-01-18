import {checkDuplicate} from './utils';
import * as index from './index/mutation-types';

let list = [index];
checkDuplicate(list);

export default {
  ...index
}

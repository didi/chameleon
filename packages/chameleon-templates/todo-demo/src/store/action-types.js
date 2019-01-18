
import {checkDuplicate} from './utils';
import * as index from './index/action-types';

let list = [index];
checkDuplicate(list);

export default {
  ...index
}

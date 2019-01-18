import { toast } from 'antd';

function a() {
  return toast;
}

function b(toast) {
  return toast;
}

function c() {
  var toast = 'toast';
  return toast;
}

function d() {
  var toast = 'toast';
  return function () {
    return toast;
  };
}

class Method implements OnlyInterfaceInterface {
  getMsg(msg) {
    return 'web:' + msg;
  }
}

export default new Method();

class Method implements ExtendInterfaceInterface {
  getMsg(msg) {
    return 'web:' + msg;
  }
}

export default new Method();

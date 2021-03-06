import log from '../logger';

let commands = {}, helpers = {}, extensions = {};

commands.implicitWait = function (ms) {
  this.implicitWaitMs = parseInt(ms, 10);
  log.debug(`Set implicit wait to ${ms}ms`);
};


Object.assign(extensions, commands, helpers);
export { commands, helpers};
export default extensions;

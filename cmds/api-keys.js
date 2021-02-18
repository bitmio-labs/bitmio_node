exports.command = 'api-keys <command>'
exports.desc = 'Manage API keys'
exports.builder = function (yargs) {
  return yargs.commandDir('api-keys')
}
exports.handler = function (argv) {}
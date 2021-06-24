var EscrowDapp = artifacts.require("EscrowDapp");

module.exports = function (deployer) {
  deployer.deploy(EscrowDapp);
};
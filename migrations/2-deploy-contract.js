var EscrowDapp = artifacts.require("EscrowDapp");

module.exports = function (deployer) {
  deployer.deploy(EscrowDapp, "0x52Aa1d50B6e94E113FC8cDc9e3fec178D5102409");
};
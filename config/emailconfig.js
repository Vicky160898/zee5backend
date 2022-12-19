require("dotenv").config();

module.exports = {
  user: process.env.user,
  clientid: process.env.clientid,
  clientsecret: process.env.clientsecret,
  refreshtoken: process.env.refreshtoken,
};

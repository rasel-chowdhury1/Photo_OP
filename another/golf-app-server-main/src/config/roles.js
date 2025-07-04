const allRoles = {
  user: ["common", "user"],
  supperUser: ["common", "supperUser"],
  basicUser: ["common", "basicUser"],
  admin: ["common", "admin"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};



const aclRules = require('./acl-rules.json');

module.exports = function (route, req) {
  let userRole = req.session.user ? req.session.user.userRole : 'visitor';
  let method = req.method.toLowerCase();
  method = method === 'patch' ? 'put' : method;
  //console.log(`role: ${userRole},route: ${route},method: ${method}`) 
  let allowed = aclRules?.[userRole]?.[route]?.[method];
  return !!allowed;
}
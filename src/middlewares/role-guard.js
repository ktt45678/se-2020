exports.regular = (req, res, next) => {
  // Someone may have missed calling auth guard first
  if (!req.currentUser) {
    return res.status(401).send({ error: 'Unauthorized user' });
  }
  // New users can not access
  if (req.currentUser.role.startsWith('new')) {
    return res.status(403).send({ error: 'Forbidden' });
  }
  next();
};

exports.admin = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).send({ error: 'Unauthorized user' });
  }
  if (req.currentUser.role !== 'admin') {
    return res.status(403).send({ error: 'Forbidden' });
  }
  next();
};
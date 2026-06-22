export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Super Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Requires Super Admin privileges'
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Super Admin' || req.user.role === 'Admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Requires Admin or Super Admin privileges'
    });
  }
};

export const staffOnly = (req, res, next) => {
  if (req.user && ['Super Admin', 'Admin', 'Staff'].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Requires administrative authentication'
    });
  }
};

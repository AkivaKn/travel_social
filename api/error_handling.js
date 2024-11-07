exports.customErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };

exports.methodNotAllowed = (req, res, next) => {
    next({status:405,msg:'Method not allowed'})
  }
export default (fs) => (req, res, next) => {
  fs(req, res, next).catch(next);
};

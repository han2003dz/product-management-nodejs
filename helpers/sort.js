module.exports = (req) => {
  let sort = {};
  // nếu người dùng yêu cầu gửi lên trên url có sortKey và sortValue
  if (req.query.sortKey && req.query.sortValue) {
    // thêm 1 key vào object dạng string
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  return sort;
};

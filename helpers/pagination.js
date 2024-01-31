module.exports = (objectPagination, query, totalRecord) => {
  objectPagination.currentPage = parseInt(query.page) || 1; // Sử dụng optional chaining và nullish coalescing để xử lý query.page không được định nghĩa
  objectPagination.currentPage = Math.max(1, objectPagination.currentPage); // Đảm bảo trang hiện tại không âm
  const totalPages = Math.ceil(totalRecord / objectPagination.limitItem);
  objectPagination.totalPages = totalPages;
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;
  objectPagination.skip = Math.min(objectPagination.skip, totalRecord); // Đảm bảo skip không vượt quá tổng số bản ghi
  return objectPagination;
};

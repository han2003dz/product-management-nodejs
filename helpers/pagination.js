module.exports = (objectPagination, query, totalRecord) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;
  const totalPages = Math.ceil(totalRecord / objectPagination.limitItem);
  objectPagination.totalPages = totalPages;
  return objectPagination;
};

// buttonFilterStatus
const buttonFilterStatus = document.querySelectorAll("[button-status]");
if (buttonFilterStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonFilterStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
// end buttonFilterStatus

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// end form search

// Pagination
const linkPagination = document.querySelectorAll("[link-pagination");
if (linkPagination) {
  let url = new URL(window.location.href);
  linkPagination.forEach((link) => {
    link.addEventListener("click", () => {
      const page = link.getAttribute("link-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// end pagination

// Change Status
const linkChangeStatus = document.querySelectorAll("[link-change-status]");
if (linkChangeStatus.length > 0) {
  // lấy form, lấy data-path
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  linkChangeStatus.forEach((item) => {
    item.addEventListener("click", () => {
      const statusCurrent = item.getAttribute("data-status");

      const id = item.getAttribute("data-id");

      let statusChanges = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChanges}/${id}?_method=PATCH`;

      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
// End Change Status

// start show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const buttonClose = document.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // sự kiện click mất
  buttonClose.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// end show-alert

// deleteRecord
const btnDelete = document.querySelectorAll("[button-delete]");
if (btnDelete.length > 0) {
  const formDeleteRecord = document.querySelector("#form-delete-record");
  const dataPath = formDeleteRecord.getAttribute("data-path");
  btnDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không ?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${dataPath}/${id}?_method=DELETE`;
        formDeleteRecord.action = action;
        formDeleteRecord.submit();
      }
    });
  });
}
// deleteRecord

// upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
  console.log(uploadImagePreview.src);
}
// end upload image

// checkbox-multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const checkAll = checkboxMulti.querySelector("input[name='checkAll']");
  const checkItem = checkboxMulti.querySelectorAll("input[name='check-item']");
  checkAll.addEventListener("click", () => {
    if (checkAll.checked) {
      checkItem.forEach((item) => {
        item.checked = true;
      });
    } else {
      checkItem.forEach((item) => {
        item.checked = false;
      });
    }
  });
  checkItem.forEach((item) => {
    item.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='check-item']:checked"
      ).length;
      if (countChecked == checkItem.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}

// Button sort desc/asc
const sort = document.querySelector("[sort]");
if (sort) {
  const url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  sortSelect.addEventListener("change", (e) => {
    // lấy ra value của ô option
    const value = e.target.value;
    // lúc này value đang ở string cần chuyển sang mảng
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });
  // vì mỗi lần chuyển trạng thái web sẽ load lại và set lại về mặc định
  // cần thêm thuộc tính selected=true cho option hiện tại
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  // nếu web đã trả về url có sortKey và sortValue thì:
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(
      `option[value='${stringSort}']`
    );
    optionSelected.selected = true;
  }

  // nút xóa sắp xếp
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });
}
// End Button sort

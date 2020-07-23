document.addEventListener("DOMContentLoaded", () => {
  const customer = document.querySelector("#customer");
  const freelancer = document.querySelector("#freelancer");
  const blockCustomer = document.querySelector("#block-customer");
  const blockFreelancer = document.querySelector("#block-freelancer");
  const blockChoice = document.querySelector("#block-choice");
  const btnExit = document.querySelector("#btn-exit");
  const formCustomer = document.querySelector("#form-customer");
  const ordersTable = document.querySelector("#orders");
  const modalOrder = document.querySelector("#order_read");
  const modalOrderActive = document.querySelector("#order_active");
  const headTable = document.querySelector("#headTable");

  const orders = JSON.parse(localStorage.getItem("freeOrders")) || [];

  const toStorage = () => {
    localStorage.setItem("freeOrders", JSON.stringify(orders));
  }

  const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ?
    2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

  const calcDeadline = (date) => {
    const deadline = new Date(date);
    const toDay = Date.now();
    const remaining = (deadline - toDay) / 1000 / 60 / 60;

    if (remaining / 24 > 2) {
      return declOfNum(Math.floor(remaining / 24), ["день", "дня", "дней"]);
    }
    return declOfNum(Math.floor(remaining), ["час", "часа", "часов"]);
  }


  const renderOrders = () => {
    ordersTable.textContent = "";
    orders.forEach((order, i) => {
      ordersTable.innerHTML += `
    <tr class="order ${order.active ? "taken" : ""}" data-number-order="${i}">
      <td>${i + 1}</td>
      <td>${order.title}</td>
      <td class="${order.currency}"></td>
      <td>${calcDeadline(order.deadline)}</td>
  </tr>`;
    });
  };

  handlerModal = (e) => {
    const target = e.target;
    const modal = target.closest(".order-modal");
    const order = orders[modal.id];

    const baseActon = () => {
      modal.style.display = "none";
      toStorage();
      renderOrders();
    }

    if (target.closest(".close") || target === modal) {
      modal.style.display = "none";
    }

    if (target.classList.contains("get-order")) {
      order.active = true;
      baseActon();
    }

    if (target.id === "capitulation") {
      order.active = false;
      baseActon();
    }

    if (target.id === "ready") {
      orders.splice(orders.indexOf(order), 1);
      baseActon();
    }
  }

  const openModal = (numberOrder) => {
    const order = orders[numberOrder];

    const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;

    const modal = active ? modalOrderActive : modalOrder;

    const modalTitleBlock = modal.querySelector(".modal-title");
    const firstNameBlock = modal.querySelector(".firstName");
    const emailBlock = modal.querySelector(".email");
    const descriptionBlock = modal.querySelector(".description");
    const deadlineBlock = modal.querySelector(".deadline");
    const currencyBlock = modal.querySelector(".currency_img");
    const countBlock = modal.querySelector(".count");
    const phoneBlock = modal.querySelector(".phone");

    modal.id = numberOrder;
    modalTitleBlock.textContent = title;
    firstNameBlock.textContent = firstName;
    emailBlock.textContent = email;
    emailBlock.href = "mailto:" + email;
    descriptionBlock.textContent = description;
    deadlineBlock.textContent = calcDeadline(deadline);
    currencyBlock.className = "currency_img";
    currencyBlock.classList.add(currency);
    countBlock.textContent = amount;
    phoneBlock ? phoneBlock.href = "tel: " + phone : "";

    modal.style.display = "flex";

    modal.addEventListener("click", handlerModal);
  }

  const sortOrder  = (arr, property) => {
    arr.sort((a, b) => {
      a[property] > b[property] ? 1 : -1;
    })
  }

  headTable.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("head_sort")) {
      if (target.id === "taskSort") {
        sortOrder(orders, "title");
      }
      if (target.id === "currencySort") {
        sortOrder(orders, "currency");
      }
      if (target.id === "deadlineSort") {
        sortOrder(orders, "deadline");
      }
      toStorage();
      renderOrders();
    }
  });

  ordersTable.addEventListener("click", (e) => {
    const target = e.target;
    const targetOrder = target.closest(".order");
    if (targetOrder) {
      openModal(targetOrder.dataset.numberOrder);
    }
  })

  customer.addEventListener("click", () => {
    blockChoice.style.display = "none";
    const toDay = new Date().toISOString().substring(0, 10);
    document.getElementById("deadline").min = toDay;
    blockCustomer.style.display = "block";
    btnExit.style.display = "block";
  });

  freelancer.addEventListener("click", () => {
    blockChoice.style.display = "none";
    renderOrders();
    blockFreelancer.style.display = "block";
    btnExit.style.display = "block";
  });

  btnExit.addEventListener("click", () => {
    btnExit.style.display = "none";
    blockCustomer.style.display = "none";
    blockFreelancer.style.display = "none";
    blockChoice.style.display = "block";
  })

  formCustomer.addEventListener("submit", (e) => {
    e.preventDefault();
    const objElem = {};

    const elemArr = [...formCustomer.elements].filter((elem) => {
      return (elem.tagName === "INPUT" && elem.type !== "radio") ||
        (elem.type === "radio" && elem.checked) ||
        (elem.tagName === "TEXTAREA")
    });

    elemArr.forEach((elem) => {
      objElem[elem.name] = elem.value;

    });

    formCustomer.reset();

    orders.push(objElem);
    toStorage();

  });


})








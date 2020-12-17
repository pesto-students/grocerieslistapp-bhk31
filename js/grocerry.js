var h = window.innerHeight;

document.querySelector("body").setAttribute("style", "height:" + h);

const LIMIT = 5;
let user = {
  canAddItem: true,
  items: [],
};

addItemToItems = addListItem();

getSelectedElement("login").onclick = function () {
  user.userName = getInputElementFromForm("login-form", "user-name");

  if (user.userName) {
    users = JSON.parse(localStorage.getItem("users"));

    if (users && users[user.userName]) {
      user = users[user.userName];
      let strHtml = "";

      if (user.limit !== 5) {
        user.items.forEach((element) => {
          strHtml = strHtml + createListItem(element);
        });
      }

      document
        .getElementById("listContainer")
        .insertAdjacentHTML("beforeend", strHtml);
    }

    getSelectedElement("loggedIn").classList.remove("hide");
    getSelectedElement("loginContainer").classList.add("hide");
    getSelectedElement("heading").innerHTML =
      "Welcome " + user.userName + " to your grocery list";

    if (false === user.canAddItem) {
      warningAndDisableButton();
    }

    getSelectedElement("limit").innerHTML = LIMIT - user.items.length;
  } else {
    getSelectedElement("required-field-user").classList.remove("hide");
  }
};

function createListItem(element) {
  return (
    '<div class="list-item"><div class="item-name">' +
    element +
    '</div><div class="button-container"><button id="delete-' +
    element +
    '"onclick="deleteItem(\'' +
    element +
    '\')">Delete</button><button id="edit-' +
    element +
    '" onclick="editItem(\'' +
    element +
    "')\">Edit</button></div></div>"
  );
}

getSelectedElement("save").onclick = function () {
  if (true === user.canAddItem) {
    addItemToItems();
  }

  save();
};

function addListItem() {
  return function addToArray() {
    let formData = new FormData(getSelectedElement("grocerry-form"));
    let item = formData.get("item");

    if (item) {
      addHtmlClass("required-field", "hide");

      if (false === compareListItems(item)) {
        addHtmlClass("existing-item", "hide");

        let strHtml = createListItem(item);

        document
          .getElementById("listContainer")
          .insertAdjacentHTML("beforeend", strHtml);

        user.items.push(item);

        user.limit = LIMIT - user.items.length;
        getSelectedElement("limit").innerHTML = user.limit;

        if (5 === user.items.length) {
          user.canAddItem = false;
          warningAndDisableButton();
        }
        console.log(user);
      } else {
        getSelectedElement("existing-item").classList.remove("hide");
      }
    } else {
      getSelectedElement("required-field").classList.remove("hide");
    }
  };
}

function compareListItems(item) {
  return user.items.includes(item);
}

function warningAndDisableButton() {
  getSelectedElement("warning-message").classList.remove("hide");
}

function save() {
  let users = {};

  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }

  let key = user.userName;
  users[key] = user;

  console.log(JSON.stringify(users));
  localStorage.setItem("users", JSON.stringify(users));
  users = JSON.parse(localStorage.getItem("users"));
  keys = Object.keys(users);
  let usersCount = keys.length;

  if (4 === usersCount) {
    deleteAndUpdateUsers(users, keys, usersCount);
  }
}

function deleteAndUpdateUsers(users, keys, count) {
  delete users[keys[0]];
  localStorage.setItem("users", JSON.stringify(users));
}

function deleteItem(element) {
  user.items = user.items.filter(function (item) {
    return item !== element;
  });

  if (5 > user.items.length) {
    user.canAddItem = true;
    user.limit = LIMIT - user.items.length;
    addHtmlClass("warning-message", "hide");
  }

  getSelectedElement("delete-" + element).parentNode.parentNode.remove();
  getSelectedElement("limit").innerHTML = user.limit;

  save();
}

function getSelectedElement(element) {
  return document.getElementById(element);
}

function getInputElementFromForm(form, input) {
  let formData = new FormData(getSelectedElement(form));
  return formData.get(input);
}

function addHtmlClass(element, className) {
  getSelectedElement(element).classList.add(className);
}

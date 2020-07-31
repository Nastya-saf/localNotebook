var db;
var categoryColor = ["red", "yellow", "white", "blue", "green"];

function indexedDBOk() {
  return "indexedDB" in window;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    if (!indexedDBOk) {
      console.log("Error: indexedDBOk : - )");
      return;
    }

    var openRequest = indexedDB.open("idarticle_Notebook", 1);

    openRequest.onupgradeneeded = function (e) {
      var thisDB = e.target.result;

      if (!thisDB.objectStoreNames.contains("records")) {
        var objectStore = thisDB.createObjectStore("records", {
          autoIncrement: true,
        });
      }
    };

    openRequest.onsuccess = function (e) {
      console.log("running onsuccess");

      db = e.target.result;
      var html = "";
      html +=
        '<a href="#zatemnenie"><button id="addButton">Add Data</button></a>';

      html += '<div id="status2"></div>';
      document.getElementById("Notebook").innerHTML = html;
      getRecordAll();
      document
        .getElementById("addButton")
        .addEventListener("click", add, false);
    };

    openRequest.onerror = function (e) {
      //Ошибка
    };
  },
  false
);
readLogo();

function readLogo() {
  var html = "";
  html +=
    '<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg"><g>';
  //Н
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M30 80 L 30 60" />';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M30 75 Q 30.6 70, 35 70 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M35 70 L 45 70 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M45 70 Q 49 70.4, 50 68 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M50 80 L 50 60 " />';
  //С
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M72 83 L 68 83 " />';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M70 83 L 70 87 " />';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M70 87 Q 56 97, 44 85 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M44 85 Q 35 70, 44 55 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M70 55 Q 56 43, 44 55 "/>';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M72 59 L 68 59 " />';
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M70 58 L 70 55 " />';
  //края
  html +=
    '<path stroke="crimson" stroke-width="2" fill="none" d="M20 88 L 20 50 L 50 41 L 82 50 L 82 88 L 50 99 L 20 88" />';
  html +=
    '<circle r="3" cx="50" cy="40.5" fill="white" stroke="crimson" stroke-width="2" />';
  html +=
    '<circle r="3" cx="19.2" cy="88.8" fill="white" stroke="crimson" stroke-width="2" />';
  html +=
    '<circle r="3" cx="82.8" cy="88.8" fill="white" stroke="crimson" stroke-width="2" />';
  html +=
    '<circle r="3" cx="19.2" cy="49.4" fill="white" stroke="crimson" stroke-width="2" />';
  html +=
    '<circle r="3" cx="82.8" cy="49.4" fill="white" stroke="crimson" stroke-width="2" />';
  html +=
    '<circle r="3" cx="50" cy="100" fill="white" stroke="crimson" stroke-width="2" />';
  html += "</g></svg>";

  document.querySelector("#logo").innerHTML = html;
}

function add() {
  document.querySelector("#zatemnenie").style.display = "block";
  document.querySelector("#element").style.display = "block";
  var s = '<div class="add white">';
  s += '<input class="right" onclick="exit()" type="button" value="X">';

  s += '<select id="category">';
  for (i = 0; i < categoryColor.length; i++) {
    s +=
      '<option class="' +
      categoryColor[i] +
      '" value="' +
      categoryColor[i] +
      '">' +
      categoryColor[i] +
      "</option>";
  }
  s += "</select><br>";
  s +=
    '<input type="text" id="title" placeholder="title"><br><textarea id="text" rows="10" cols="35" placeholder="text"></textarea>';
  s += '<br><input onclick="addRecord()" type="button" value="save">';

  s += "</div>";
  var div = (document.querySelector("#element").innerHTML = s);
}
function exit() {
  document.querySelector("#element").innerHTML = "";
  document.querySelector("#element").style.display = "none";
  document.querySelector("#zatemnenie").style.display = "none";
}

function addRecord(e) {
  var category = document.querySelector("#category").value;
  var title = document.querySelector("#title").value;
  var text = document.querySelector("#text").value;
  if (title == "") {
    //пустой
    if (text == "") {
      alert("Нет записи");
      return;
    }
    var lenght = text.indexOf(" ");
    if (lenght == -1) {
      lenght = 10;
    }
    title = text.slice(0, lenght);
  }

  var transaction = db.transaction(["records"], "readwrite");
  var store = transaction.objectStore("records");

  var record = {
    category: category, //категория записи
    title: title, //заглавие записи
    text: text, //текст записи
    created: new Date(),
  };

  var request = store.add(record);

  request.onerror = function (e) {
    console.log("Error", e.target.error.name);
  };

  request.onsuccess = function (e) {
    console.log("Woot! Did it");
  };
  document.querySelector("#element").style.display = "none";
  document.querySelector("#zatemnenie").style.display = "none";
  var div = (document.querySelector("#element").innerHTML = "");
  getRecordAll();
}
var i = 0;
function getRecordAll(e) {
  var s = "";

  db
    .transaction(["records"], "readonly")
    .objectStore("records")
    .openCursor().onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      s +=
        '<div class="' +
        cursor.value.category +
        ' record"><h2 wrap="hard">' +
        cursor.value.title +
        "</h2>" +
        cursor.value.text;
      s +=
        '<br><a href="#zatemnenie"><input id="editRecord' +
        i +
        '" onclick="edit(' +
        cursor.key +
        ')" type="button" value="editRecord"></a>';
      s +=
        '<input id="deleteRecord' +
        i +
        '" onclick="deleteRecord(' +
        cursor.key +
        ')" type="button" value="deleteRecord">';
      s += "</div>";
      i++;
      cursor.continue();
    }
    document.querySelector("#status2").innerHTML = s;
  };
}
function deleteRecord(k) {
  var key = Number(k);
  console.log("key= " + key);
  let record = db.transaction("records", "readwrite").objectStore("records");

  record.delete(key);
  getRecordAll();
}

function edit(k) {
  document.querySelector("#zatemnenie").style.display = "block";
  document.querySelector("#element").style.display = "block";
  var key = Number(k);
  console.log("edit key= " + key);
  var transaction = db.transaction(["records"], "readonly");
  var store = transaction.objectStore("records");
  console.log("k=" + key);
  var request = store.get(key);
  var s = "";
  request.onsuccess = function (event) {
    var resul = request.result;
    s += '<div class="edit ' + resul.category + '">';
    s += '<input class="right" onclick="exit()" type="button" value="X">';
    s += '<br><select id="category">';
    for (i = 0; i < categoryColor.length; i++) {
      s += '<option class="' + categoryColor[i] + '"';
      if (categoryColor[i] == resul.category) {
        s += 'selected="selected"';
      }
      s += 'value="' + categoryColor[i] + '">' + categoryColor[i] + "</option>";
    }
    s += "</select><br>";

    s +=
      '<input type="text" id="title" placeholder="title" value="' +
      resul.title +
      '"><br><textarea id="text" rows="10" cols="35" placeholder="text">' +
      resul.text +
      "</textarea>";
    s +=
      '<br><input onclick="editRecord(' +
      key +
      ')" type="button" value="save">';
    s += "</div>";
    document.querySelector("#element").innerHTML = s;
  };
}

function editRecord(k) {
  var category = document.querySelector("#category").value;
  var title = document.querySelector("#title").value;
  var text = document.querySelector("#text").value;
  var key = Number(k);

  if (title == "") {
    //пустой
    if (text == "") {
      alert("Нет записи");
      return;
    }
    var lenght = text.indexOf(" ");
    if (lenght == -1) {
      lenght = 10;
    }
    title = text.slice(0, lenght);
  }

  var record = {
    category: category, //категория записи
    title: title, //заглавие записи
    text: text, //текст записи
    created: new Date(),
  };
  let r = db.transaction("records", "readwrite").objectStore("records");
  var request = r.put(record, key);
  document.querySelector("#element").innerHTML = "";
  document.querySelector("#element").style.display = "none";
  document.querySelector("#zatemnenie").style.display = "none";
  getRecordAll();
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  onSnapshot,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa_KDquAv0WMjzBC9u_vFbw1qoIUWSbIk",
  authDomain: "bari-shopping.firebaseapp.com",
  projectId: "bari-shopping",
  storageBucket: "bari-shopping.appspot.com",
  messagingSenderId: "1062447626800",
  appId: "1:1062447626800:web:bf31e6a33d46b9784ecbf5",
  measurementId: "G-X84770BH81",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addData = document.getElementById("addData");
const deleteAll = document.getElementById("deleteAll");
const todoInput = document.getElementById("todoInput");
const blogList = document.getElementById("blogList");

const addDataInFirestore = async () => {
  const inputVal = todoInput.value.trim(); // Trim leading and trailing whitespaces

  // Check if the todo is not blank
  if (inputVal !== "") {
    const id = new Date().getTime();
    const payload = {
      id,
      todo: inputVal,
      timestamp: id,
    };

    // Assuming db and setDoc are defined appropriately
    await setDoc(doc(db, "blog", `${id}`), payload);

    // Clear the input after adding data to Firestore
    todoInput.value = "";
  } else {
    // Handle the case where the todo is blank, e.g., show an error message
    // console.error("Cannot add a blank todo.");
    alert("can not add a blank  todo");
    // You may also display an error message to the user or take other appropriate actions.
  }
};

const updateDataInFirestore = async (id, newValue) => {
  await updateDoc(doc(db, "blog", id), { todo: newValue });
};

const deleteDataInFirestore = async (id) => {
  await deleteDoc(doc(db, "blog", id));
};

const deleteAllDataInFirestore = async () => {
  const confirmDeleteAll = confirm(
    "Are you sure you want to delete all todos?"
  );
  if (confirmDeleteAll) {
    const q = query(collection(db, "blog"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
};

const renderList = (data) => {
  return data
    .map(
      (todoObj) => `
        <li>
          ${todoObj.todo}
          <button class="editBtn" data-id="${todoObj.id}">Edit</button>
          <button class="deleteBtn" data-id="${todoObj.id}">Delete</button>
        </li>
      `
    )
    .join("");
};

const getDataInRealTime = async () => {
  let item = "";
  const q = query(collection(db, "blog"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    item = renderList(todos);
    blogList.innerHTML = item;

    // Add event listeners after rendering the list
    addEventListeners();
  });
};

function addEventListeners() {
  const editButtons = document.querySelectorAll(".editBtn");
  const deleteButtons = document.querySelectorAll(".deleteBtn");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const currentTodo = prompt("Edit the todo:", "");
      if (currentTodo !== null) {
        updateDataInFirestore(id, currentTodo);
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const confirmDelete = confirm(
        "Are you sure you want to delete this todo?"
      );
      if (confirmDelete) {
        deleteDataInFirestore(id);
      }
    });
  });
}

getDataInRealTime();

addData.addEventListener("click", addDataInFirestore);
deleteAll.addEventListener("click", deleteAllDataInFirestore);

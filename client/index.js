const todosContainer = document.querySelector(".todos");
const submit = document.querySelector("button");

const getTodos = async () => {
  const todos = await fetch("https://todoapi-j5ib.onrender.com/todos").then((response) => response.json());

  todosContainer.innerHTML = "";
  todos.map((todo) => {
    const todoDiv = document.createElement("div");
    const todoCheck = document.createElement("input");
    const todoLabel = document.createElement("label");
    todoLabel.innerText = todo.name;
    todoLabel.setAttribute("for", todo.name);
    todoCheck.setAttribute("id", todo.name);
    todoCheck.setAttribute("name", todo.name);
    todoCheck.setAttribute("type", "checkbox");
    todoCheck.setAttribute("value", todo.name);
    todoCheck.addEventListener("click", () => {
      todoCheck.setAttribute("disabled", "true");
      todoLabel.classList.toggle("strikethrough");

      setTimeout(() => {
        fetch(`https://todoapi-j5ib.onrender.com/todos/${todo.id}`, {
          method: "DELETE",
        }).then((response) => response.json());
        todoDiv.classList.add("hidden");
      }, 3000);
    });

    const edit = document.createElement("i");
    edit.classList.add("fa-solid");
    edit.classList.add("fa-pen-to-square");
    edit.addEventListener("click", () => {
      todoCheck.classList.add("hidden");
      todoLabel.classList.add("hidden");
      edit.classList.add("hidden");

      const newInput = document.createElement("input");
      newInput.setAttribute("type", "text");
      newInput.setAttribute("value", todo.name);

      const submit = document.createElement("i");
      submit.classList.add("fa-solid");
      submit.classList.add("fa-check");
      submit.addEventListener("click", async () => {
        await setTodo(newInput.value, `/todos/${todo.id}`, "PATCH");
        getTodos();
      });

      const cancel = document.createElement("i");
      cancel.classList.add("fa-solid");
      cancel.classList.add("fa-xmark");
      cancel.addEventListener("click", () => {
        todoCheck.classList.remove("hidden");
        todoLabel.classList.remove("hidden");
        edit.classList.remove("hidden");

        todoDiv.remove(newInput);
        todoDiv.remove(submit);
        todoDiv.remove(cancel);
      });

      todoDiv.append(cancel);
      todoDiv.append(submit);
      todoDiv.append(newInput);
    });

    todoDiv.append(edit);
    todoDiv.append(todoCheck);
    todoDiv.append(todoLabel);
    todosContainer.append(todoDiv);
  });
};

getTodos();

const setTodo = async (value, path, method) => {
  await fetch(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: value }),
  });
};

submit.addEventListener("click", async (event) => {
  event.preventDefault();
  await setTodo(event.target.form[0].value, "/todos", "POST");
  await getTodos();
});

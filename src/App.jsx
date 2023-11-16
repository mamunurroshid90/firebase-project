import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
} from "firebase/database";

function App() {
  const db = getDatabase();

  let [text, setText] = useState("");
  let [todo, setTodo] = useState([]);

  useEffect(() => {
    const todoRef = ref(db, "alltodo");
    onValue(todoRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        // console.log(item.val());
        arr.push({ ...item.val(), id: item.key });
      });
      setTodo(arr);
    });
  }, []);

  console.log(todo);

  let handleText = (e) => {
    setText(e.target.value);
  };

  let handleSubmit = () => {
    set(push(ref(db, "alltodo")), {
      todoText: text,
    });
  };

  let handleDelete = (id) => {
    remove(ref(db, "alltodo/" + id)).then(() => {
      console.log("delete done");
    });
  };

  let handleEdit = (id) => {
    console.log(id);
  };

  return (
    <>
      <div>
        <input
          onChange={handleText}
          type="text"
          placeholder="Enter your text"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <ul>
          {todo.length > 0 ? (
            todo.map((item, index) => (
              <li key={index}>
                {item.todoText}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
                <button onClick={() => handleEdit(item.id)}>Edit</button>
              </li>
            ))
          ) : (
            <h1>Loading...</h1>
          )}
        </ul>
      </div>
    </>
  );
}

export default App;

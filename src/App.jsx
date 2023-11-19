import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";

function App() {
  const db = getDatabase();

  let [text, setText] = useState("");
  let [todo, setTodo] = useState([]);
  let [toggleBtn, setToggleBtn] = useState(false);
  let [allInfo, setAllInfo] = useState();

  useEffect(() => {
    const todoRef = ref(db, "alltodo");
    onValue(todoRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTodo(arr);
    });
  }, []);

  let handleText = (e) => {
    setText(e.target.value);
  };

  let handleSubmit = () => {
    set(push(ref(db, "alltodo")), {
      todoText: text,
    });
    setText("");
  };

  let handleDelete = (id) => {
    remove(ref(db, "alltodo/" + id)).then(() => {});
  };

  let handleUpdate = () => {
    update(ref(db, "alltodo/" + allInfo.id), {
      ...allInfo,
      todoText: text,
    }).then(() => {
      console.log("update done");
      setText("");
      setToggleBtn(false);
    });
  };

  let handleEdit = (item) => {
    setToggleBtn(true);
    setAllInfo(item);
    setText(item.todoText);
  };

  return (
    <>
      <section className="container">
        <div>
          <input
            onChange={handleText}
            type="text"
            placeholder="Enter your text"
            value={text}
          />
          {toggleBtn ? (
            <button onClick={handleUpdate}>Update</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
        <div>
          <ul>
            {todo.length > 0 ? (
              todo.map((item, index) => (
                <li key={index}>
                  {item.todoText}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                </li>
              ))
            ) : todo.length == 0 ? (
              <h1>No Data found</h1>
            ) : (
              <h1>Loading...</h1>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}

export default App;

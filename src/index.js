import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./styles.css";

window.id = 0;
class App extends React.Component {
  constructor(props) {
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    };
    this.apiUrl = "//57b1924b46b57d1100a3c3f8.mockapi.io/api/todos";
  }
  // Lifecycle method
  componentDidMount() {
    // Make HTTP reques with Axios
    axios.get(this.apiUrl).then(res => {
      // Set state with result
      this.setState({ data: res.data });
    });
  }
  // Add todo handler
  addTodo(val) {
    // Assemble data
    const todo = { text: val };
    // Update data
    axios.post(this.apiUrl, todo).then(res => {
      this.state.data.push(res.data);
      this.setState({ data: this.state.data });
    });
  }
  // Handle remove
  handleRemove(id) {
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter(todo => {
      if (todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl + "/" + id).then(res => {
      this.setState({ data: remainder });
    });
  }

  render() {
    // Render JSX
    return (
      <div>
        <Title todoCount={this.state.data.length} />
        <TodoForm addTodo={this.addTodo.bind(this)} />
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}

const Title = ({ todoCount }) => {
  return (
    <div>
      <div>
        <h1>to-do ({todoCount})</h1>
      </div>
    </div>
  );
};

const TodoForm = ({ addTodo }) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTodo(input.value);
        input.value = "";
      }}
    >
      <input
        className="form-control col-md-12"
        ref={node => {
          input = node;
        }}
      />

      <br />
    </form>
  );
};

const Todo = ({ todo, remove }) => {
  // Each Todo
  return (
    <a
      href="#"
      className="list-group-item"
      onClick={() => {
        remove(todo.id);
      }}
    >
      {todo.text}
    </a>
  );
};

const TodoList = ({ todos, remove }) => {
  // Map through the todos
  const todoNode = todos.map(todo => {
    return (
      <ul>
        <li key={todo.id}>
          <Todo todo={todo} remove={remove} />
        </li>
      </ul>
    );
  });
  return (
    <div className="list-group" style={{ marginTop: "30px" }}>
      {todoNode}
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

const todoItems = [
  // {id: 1,    name: "zone 1",    points: [[12.3, 12.0], [16.3, 12.0], [16.3, 8.0], [11.4, 8.7]],},
  // {id: 2,    name: "zone 2",    points: [[5.3, 12.0], [8.3, 12.0], [8.3, 8.0], [4.4, 4.7]],  },
  // [[1.0, 2.0], [1.0, 1.0], [2.0, 2.0], [2.0, 1.0]]
];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: todoItems,
      modal: false,
      activeItem: {
        name: "",
        points: [['',''],['',''],['',''],['','']],
      },
      formatedPoints: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
      // on no proxy -> axios.get("http://localhost:8000/api/todos/")
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    console.log(item.points)
    // item.points = JSON.parse(item.points)
    
    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    // alert("delete" + JSON.stringify(item));
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => {this.refreshList(); this.setState({ formatedPoints: []});});
  };

  createItem = () => {
    this.setState({ modal: !this.state.modal });
  };

  loadItem = (item) => {
    let formatedPoints = item.points.map( function(value){
      let nvalue = value.map(el => { return el * 1}); // for small numbers  * 10 
      return nvalue
    })

    this.setState({ activeItem: item, formatedPoints: formatedPoints});
  };

  renderItems = () => {
    const newItems = this.state.todoList

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className="todo-name mr-2 completed-todo"
          title={item.points}
        >
          {item.name}
        </span>
        <span>
        <button
            className="btn btn-secondary mr-2"
            onClick={() => this.loadItem(item)}
          >
            Load
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Polygon app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add Polygon
                </button>
              </div>
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="polygon-cust">
              <svg height="210" width="500">
                <polygon className="polymy" points={this.state.formatedPoints}/>
              </svg> 
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;

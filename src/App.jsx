import './App.css'
import { useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
    const initialTodos = [
    {id: 1, title: "review resources", isCompleted: false},
    {id: 2, title: "take notes", isCompleted: false},
    {id: 3, title: "code out app", isCompleted: false},
];

    const [todoList, setTodoList] = useState(initialTodos);

    const addTodo = (title) => {
        const newTodo = {
            title: title,
            id: Date.now(),
            isCompleted: false
        };
        setTodoList([...todoList, newTodo]);
    };

    const completeTodo = (id) => {
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === id) {
                return { ...todo, isCompleted: true };
            }
            return todo;
        });
        setTodoList(updatedTodos);
    };

    const updateTodo = (editedTodo) => {
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === editedTodo.id) {
                return { ...editedTodo };
            } else {
                return todo;
            }
        });
        setTodoList(updatedTodos);
    };

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> 
      <TodoList todos={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} /> 
    </div>
  );
}

export default App
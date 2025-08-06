import './App.css'
import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
    const initialTodos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
];

    const [todoList, setTodoList] = useState(initialTodos);

    const addTodo = (title) => {
        const newTodo = {
            title: title,
            id: Date.now()
        };
        setTodoList([...todoList, newTodo]);
    };

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> 
      <TodoList todos={todoList} /> 
    </div>
  );
}

export default App
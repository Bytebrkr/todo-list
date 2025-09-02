import React, { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
  
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");
  
  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle === ""}>Add Todo</button>
    </form>
  );
}

export default TodoForm;
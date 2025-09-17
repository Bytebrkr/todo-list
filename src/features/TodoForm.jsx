import React, { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");
  
  const handleAddTodo = (event) => {
    event.preventDefault();
    
    // Create a todo object instead of just passing the title
    const newTodo = {
      title: workingTodoTitle,
      isCompleted: false
    };
    
    onAddTodo(newTodo);
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
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
import React, { useState, useEffect } from "react";
import TextInputWithLabel from '../../shared/TextInputWithLabel';

export default function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);


  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  const handleSave = () => {
    const updatedTodo = {
      ...todo,
      title: workingTitle
    };
    onUpdateTodo(updatedTodo);
    setIsEditing(false);
  };

  return (
    <li>
      <form>
        {isEditing ? (
          <>
            <TextInputWithLabel 
              value={workingTitle} 
              onChange={handleEdit}
            />
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}
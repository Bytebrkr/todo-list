import React, { useState, useEffect } from "react";
import styles from './TodoListItem.module.css';
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
    <li className={styles.todoItem}>
      <form className={styles.todoForm}>
        {isEditing ? (
          <div className={styles.editingControls}>
            <TextInputWithLabel 
              value={workingTitle} 
              onChange={handleEdit}
            />
            <button 
              type="button" 
              onClick={handleSave}
              className={styles.saveButton}
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                className={styles.checkbox}
              />
            </label>
            <span 
              onClick={() => setIsEditing(true)}
              className={`${styles.todoTitle} ${todo.isCompleted ? styles.completedTitle : ''}`}
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}
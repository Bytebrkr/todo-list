import React from 'react';
import styles from './TodoList.module.css';
import TodoListItem from "./TodoListItem";

function TodoList({ todos, onCompleteTodo, onUpdateTodo }) {
  return (
    <>
      {todos.length === 0 ? (
        <p className={styles.emptyMessage}>Add todo above to get started</p>
      ) : (
        <ul className={styles.todoList}>
          {todos.map(todo => (
            <TodoListItem 
              key={todo.id} 
              todo={todo} 
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
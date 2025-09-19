import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


const StyledForm = styled.form`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

const StyledFormSection = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  &:not(:last-child) {
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
`;

const StyledLabel = styled.label`
  font-weight: 500;
  margin-right: 8px;
  color: #333;
  min-width: 100px;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s ease;
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
  
  
  const [localQueryString, setLocalQueryString] = useState(queryString);
  
  const preventRefresh = (event) => {
    event.preventDefault();
  };


  useEffect(() => {

    const debounce = setTimeout(() => {

      setQueryString(localQueryString);
    }, 500); // Give it a delay of 500ms

 
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]); 

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledFormSection>
        <StyledLabel htmlFor="searchTodos">Search todos:</StyledLabel>
        <StyledInput 
          id="searchTodos"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledButton 
          type="button"
          onClick={() => setLocalQueryString("")}
        >
          Clear
        </StyledButton>
      </StyledFormSection>
      
      <StyledFormSection>
        <StyledLabel htmlFor="sortField">Sort by</StyledLabel>
        <StyledSelect 
          id="sortField" 
          name="sortField"
          value={sortField}
          onChange={(event) => setSortField(event.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <StyledLabel htmlFor="sortDirection">Direction</StyledLabel>
        <StyledSelect 
          id="sortDirection" 
          name="sortDirection"
          value={sortDirection}
          onChange={(event) => setSortDirection(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledFormSection>
    </StyledForm>
  );
}

export default TodosViewForm;
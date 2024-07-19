// MultiSelectDropdown.js
import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  return (
    <Form.Group controlId="multiSelectDropdown">
      {/* <Form.Label>Add Members</Form.Label> */}
      <Select
        isMulti
        isSearchable
        options={options}
        value={selectedValues}
        onChange={onChange}
        placeholder="Select options..."
        hideSelectedOptions={false}
      />
    </Form.Group>
  );
};

export default MultiSelectDropdown;

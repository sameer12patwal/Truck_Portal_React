import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

const MultiSelectDropdownForTrip = ({ options, selectedValues, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedOptions(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectChange = (e) => {
    const selectedOption = options.find(option => option.value === e.target.value);
    if (selectedOption) {
      const newSelectedOption = { ...selectedOption, id: `${selectedOption.value}-${Date.now()}` }; // Add a unique id to each selection
      const updatedSelectedOptions = [...selectedOptions, newSelectedOption];
      setSelectedOptions(updatedSelectedOptions);
      onChange(updatedSelectedOptions);
    }
    // setDropdownVisible(false); // Hide dropdown after selection
  };

  const handleRemoveOption = (id) => {
    const updatedSelectedOptions = selectedOptions.filter(option => option.id !== id);
    setSelectedOptions(updatedSelectedOptions);
    onChange(updatedSelectedOptions);
  };

  const toggleDropdownVisibility = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Form.Group controlId="MultiSelectDropdownForTrip">
      <div className='inputFieldforTrips' onClick={toggleDropdownVisibility}>
        {selectedOptions.map((option) => (
          <span className='spanOptions' key={option.id} style={{ margin: '0 5px' }}>
            {option.label}
            <button type="button" className="btn btn-link btn-sm crossbtnfortrip" onClick={() => handleRemoveOption(option.id)}>x</button>
          </span>
        ))}
      </div>
      {dropdownVisible && (
        <div style={{ position: 'relative', top:'8px' }} ref={dropdownRef}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control searchmutlit"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  style={{ width: '100%' }}
                />
                {searchTerm && (
                  <button type="button" className='btnSearchCancel' onClick={clearSearch}>x</button>
                )}
              </div>
          <Form.Control as="select" multiple onChange={(e) => handleSelectChange(e)} value="" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 1 }}>
            {filteredOptions.map((option) => (
              <option className='optiondropdowntrip' key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Form.Control>
        </div>
      )}
    </Form.Group>
  );
};

export default MultiSelectDropdownForTrip;

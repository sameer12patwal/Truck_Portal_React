import React, { useState, useEffect, useRef } from 'react';

const FilterDropdown = ({ applyFilter, closeDropdown, filterDropdownPosition, activeFilters, handleApplyFilter, columnData }) => {
  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    const handleMouseDown = (event) => handleClickOutside(event);

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleClickOutside]);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div ref={dropdownRef} className="filter-dropdown mygroup" style={{ position: 'absolute', top: filterDropdownPosition.top, left: filterDropdownPosition.left, zIndex: 999}}>
        <input type="text" className='TextSearchFilter' placeholder="Search..." value={searchQuery} onChange={handleSearchChange} />
      <ul className='groupFilter'>
      {columnData
        .filter((filterValue) => {
            const stringValue = String(filterValue);
            return typeof stringValue === 'string' && stringValue.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map((filterValue) => (
            <li key={filterValue} className={`groupFilter ${activeFilters.includes(filterValue) ? 'active' : ''}`}>
            <input
                type="checkbox"
                id={`filterCheckbox_${filterValue}`}
                value={filterValue}
                checked={activeFilters.includes(filterValue)}
                onChange={() => handleApplyFilter(filterValue)}
            />
            <label className='mylablefordropdown' htmlFor={`filterCheckbox_${filterValue}`}>{String(filterValue)}</label>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterDropdown;

/*
  Author: Joseph Sikowitz
  November 2026

  User dashboard
*/

import PropTypes from "prop-types";

export default function PetSearch({ petSearch, setPetSearch }) {
  return (
    <input
      type="search"
      placeholder="Search pets by name..."
      value={petSearch}
      onChange={(event) => setPetSearch(event.target.value)}
      aria-label="Search services"
    />
  );
}

PetSearch.propTypes = {
  petSearch: PropTypes.string.isRequired,
  setPetSearch: PropTypes.func.isRequired,
};

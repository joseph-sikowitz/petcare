/*
  Author: Joseph Sikowitz
  November 2026

  User dashboard
*/

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

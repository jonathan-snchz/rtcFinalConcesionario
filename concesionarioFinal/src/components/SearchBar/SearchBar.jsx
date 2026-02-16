import Button from '../Buttons/Button';
import './SearchBar.css';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = "Search...",
  className = ''
}) => {
  return (
    <div className={`searchBar ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="searchInput"
      />
      {searchTerm && (
        <Button 
          variant="secondary"
          onClick={onClearSearch}
          size="small"
          className="clearSearch"
        >
          Limpiar
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
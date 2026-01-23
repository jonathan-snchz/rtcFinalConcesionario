import Button from '../Buttons/Button';
import './SortControls.css';

const SortControls = ({
  sortOptions = [],
  onSort,
  getSortIndicator,
  className = ''
}) => {
  if (sortOptions.length === 0) return null;

  return (
    <div className={`sortControls ${className}`}>
      <span className="sortLabel">Sort by:</span>
      {sortOptions.map((option) => (
        <Button
          key={option.key}
          variant="ghost"
          size="small"
          onClick={() => onSort(option.key)}
          className="sortButton"
        >
          {option.label}{getSortIndicator && getSortIndicator(option.key)}
        </Button>
      ))}
    </div>
  );
};

export default SortControls;
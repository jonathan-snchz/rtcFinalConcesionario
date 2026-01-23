import { Link } from 'react-router-dom';
import { formatText, formatCurrency } from '../../utils/data';
import './Cars.css';

const CarCard = ({ car }) => {
  return (
    <Link to={`/cars/${car.vin}`} className="carCard">
      <div className="carImage">
        {car.img ? (
          <img src={car.img} alt={`${car.brand} ${car.model}`} />
        ) : (
          <div className="carImagePlaceholder">
            {formatText(car.brand).charAt(0)}{car.model?.charAt(0) || ''}
          </div>
        )}
        <span className={`availabilityBadge availability-${car.availability}`}>
          {formatText(car.availability)}
        </span>
      </div>
      
      <div className="carInfo">
        <h3>{formatText(car.brand)} {car.model}</h3>
        <p className="carYear">{car.year}</p>
        <p className="carKm">{car.km.toLocaleString()} km</p>
        <p className="carPrice">{formatCurrency(car.price)}</p>
        <p className="carColor">Color: {car.color}</p>
      </div>
    </Link>
  );
};

export default CarCard;
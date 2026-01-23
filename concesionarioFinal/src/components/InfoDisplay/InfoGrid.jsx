import './InfoDisplay.css';

const InfoGrid = ({ children, columns = 2 }) => {
  return (
    <div className={`infoGrid grid-cols-${columns}`}>
      {children}
    </div>
  );
};

export default InfoGrid;
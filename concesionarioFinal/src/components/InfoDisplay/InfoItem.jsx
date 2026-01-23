import './InfoDisplay.css';

const InfoItem = ({ label, value, children }) => {
  return (
    <div className="infoItem">
      <span className="infoLabel">{label}:</span>
      <span className="infoValue">{children || value || 'N/A'}</span>
    </div>
  );
};

export default InfoItem;
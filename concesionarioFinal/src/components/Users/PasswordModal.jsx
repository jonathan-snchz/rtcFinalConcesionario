import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import './Users.css';

const PasswordModal = ({ 
  onSave, 
  onCancel, 
  loading = false,
  error = null 
}) => {
  const [serverError, setServerError] = useState(error);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await onSave(data.oldPassword, data.newPassword);
      reset();
    } catch (err) {
      setServerError(err.message || 'Error changing password');
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h3>Change Password</h3>
          <button onClick={handleCancel} className="closeButton">×</button>
        </div>
        
        {serverError && (
          <Alert type="error" message={serverError} />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="passwordForm">
          <div className="formGroup">
            <label>Current Password *</label>
            <input
              type="password"
              {...register('oldPassword', {
                required: 'Current password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters'
                }
              })}
              disabled={loading}
              className={`formInput ${errors.oldPassword ? 'error' : ''}`}
              placeholder="Enter current password"
            />
            {errors.oldPassword && (
              <span className="errorMessage">{errors.oldPassword.message}</span>
            )}
          </div>
          
          <div className="formGroup">
            <label>New Password *</label>
            <input
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters'
                }
              })}
              disabled={loading}
              className={`formInput ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <span className="errorMessage">{errors.newPassword.message}</span>
            )}
          </div>
          
          <div className="formGroup">
            <label>Confirm New Password *</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === getValues('newPassword') || 'Passwords do not match'
              })}
              disabled={loading}
              className={`formInput ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <span className="errorMessage">{errors.confirmPassword.message}</span>
            )}
          </div>
          
          <div className="modalActions">
            <Button 
              type="submit"
              variant="success"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
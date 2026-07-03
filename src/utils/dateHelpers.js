/**
 * Calculate days remaining until expiry
 * @param {string} expiryDate - Date in YYYY-MM-DD format
 * @returns {number} Days remaining (negative if expired)
 */
export const calculateDaysRemaining = (expiryDate) => {
  if (!expiryDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Parse YYYY-MM-DD manually to construct date in local time zone
  const [year, month, day] = expiryDate.split('-').map(Number);
  const expiry = new Date(year, month - 1, day);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  // Use Math.round to account for daylight saving time adjustments
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return daysRemaining;
};

/**
 * Get status of a product based on expiry date
 * @param {string} expiryDate - Date in YYYY-MM-DD format
 * @returns {object} Status object with label and color
 */
export const getProductStatus = (expiryDate) => {
  const daysRemaining = calculateDaysRemaining(expiryDate);
  
  if (daysRemaining < 0) {
    return {
      label: 'Expired',
      color: '#ff6b6b',
      backgroundColor: '#ffe0e0',
      daysRemaining,
    };
  }
  
  if (daysRemaining === 0) {
    return {
      label: 'Expires Today',
      color: '#ff8c42',
      backgroundColor: '#ffe8cc',
      daysRemaining,
    };
  }
  
  if (daysRemaining <= 3) {
    return {
      label: 'Expiring Soon',
      color: '#ffa94d',
      backgroundColor: '#fff3cd',
      daysRemaining,
    };
  }
  
  if (daysRemaining <= 7) {
    return {
      label: 'Expiring Soon',
      color: '#ffd43b',
      backgroundColor: '#fffacd',
      daysRemaining,
    };
  }
  
  return {
    label: 'Good',
    color: '#51cf66',
    backgroundColor: '#e7f5e9',
    daysRemaining,
  };
};

/**
 * Format days remaining as human-readable string
 * @param {number} daysRemaining - Days remaining
 * @returns {string} Formatted string
 */
export const formatDaysRemaining = (daysRemaining) => {
  if (daysRemaining < 0) {
    const daysPassed = Math.abs(daysRemaining);
    return `Expired ${daysPassed} day${daysPassed !== 1 ? 's' : ''} ago`;
  }
  
  if (daysRemaining === 0) {
    return 'Expires today';
  }
  
  if (daysRemaining === 1) {
    return 'Expires tomorrow';
  }
  
  return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(String(phone).trim());
};

export const isValidUsername = (username) => {
  if (!username) return false;
  // Alphanumeric with underscores/dots/dashes, min 3 chars
  return /^[a-zA-Z0-9_.-]{3,30}$/.test(String(username).trim());
};

export const validateUserForm = (formData, isEdit = false) => {
  const errors = {};

  if (!formData.full_name || !formData.full_name.trim()) {
    errors.full_name = 'Full name is required';
  }

  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (!isValidUsername(formData.username)) {
    errors.username = 'Username must be 3-30 characters (letters, numbers, _, -, .)';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!isEdit || formData.password) {
    if (!isEdit && (!formData.password || formData.password.length < 8)) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password && formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

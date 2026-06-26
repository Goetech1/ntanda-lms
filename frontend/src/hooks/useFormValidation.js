import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for field-level form validation.
 * 
 * Rules format:
 * {
 *   fieldName: {
 *     required: 'Error message' | true,
 *     minLength: { value: 3, message: 'Min 3 chars' },
 *     maxLength: { value: 255, message: 'Max 255 chars' },
 *     pattern: { value: /regex/, message: 'Invalid format' },
 *     email: 'Must be a valid email' | true,
 *     match: { field: 'otherField', message: 'Fields must match' },
 *     custom: (value, allValues) => 'error message' | null,
 *   }
 * }
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrorsState] = useState({});
  const valuesRef = useRef(initialValues);

  // Keep ref in sync for closures
  valuesRef.current = values;

  const validateSingleField = useCallback((name, value, allValues) => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    const val = value ?? '';

    // Required
    if (fieldRules.required) {
      if (!val.toString().trim()) {
        return typeof fieldRules.required === 'string' 
          ? fieldRules.required 
          : `This field is required`;
      }
    }

    // Skip other validations if empty and not required
    if (!val.toString().trim()) return null;

    // Min length
    if (fieldRules.minLength) {
      const min = typeof fieldRules.minLength === 'object' ? fieldRules.minLength.value : fieldRules.minLength;
      const msg = typeof fieldRules.minLength === 'object' ? fieldRules.minLength.message : `Must be at least ${min} characters`;
      if (val.length < min) return msg;
    }

    // Max length
    if (fieldRules.maxLength) {
      const max = typeof fieldRules.maxLength === 'object' ? fieldRules.maxLength.value : fieldRules.maxLength;
      const msg = typeof fieldRules.maxLength === 'object' ? fieldRules.maxLength.message : `Must be at most ${max} characters`;
      if (val.length > max) return msg;
    }

    // Email
    if (fieldRules.email) {
      const msg = typeof fieldRules.email === 'string' ? fieldRules.email : 'Please enter a valid email address';
      if (!EMAIL_REGEX.test(val)) return msg;
    }

    // Pattern
    if (fieldRules.pattern) {
      if (!fieldRules.pattern.value.test(val)) {
        return fieldRules.pattern.message || 'Invalid format';
      }
    }

    // Match (e.g., confirm password)
    if (fieldRules.match) {
      const otherValue = allValues[fieldRules.match.field] || '';
      if (val !== otherValue) {
        return fieldRules.match.message || 'Fields do not match';
      }
    }

    // Custom validator
    if (fieldRules.custom) {
      return fieldRules.custom(val, allValues);
    }

    return null;
  }, [rules]);

  const validateField = useCallback((name) => {
    const error = validateSingleField(name, valuesRef.current[name], valuesRef.current);
    setErrors(prev => {
      if (error === prev[name]) return prev;
      const next = { ...prev };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
    return error;
  }, [validateSingleField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    const allTouched = {};
    const allValues = valuesRef.current;

    for (const name of Object.keys(rules)) {
      allTouched[name] = true;
      const error = validateSingleField(name, allValues[name], allValues);
      if (error) {
        newErrors[name] = error;
      }
    }

    setTouched(allTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules, validateSingleField]);

  const setValue = useCallback((name, value) => {
    setValues(prev => {
      const next = { ...prev, [name]: value };
      valuesRef.current = next;
      return next;
    });

    // Clear server error on user edit
    setServerErrorsState(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

    // Validate on change only if already touched
    setTouched(prev => {
      if (prev[name]) {
        // Defer validation to next tick so valuesRef is updated
        setTimeout(() => validateField(name), 0);
      }
      return prev;
    });
  }, [validateField]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => {
      if (prev[name]) return prev;
      return { ...prev, [name]: true };
    });
    validateField(name);
  }, [validateField]);

  const setServerErrors = useCallback((errorsObj) => {
    // Laravel returns { field: ['Error 1', 'Error 2'] }
    const mapped = {};
    for (const [key, messages] of Object.entries(errorsObj)) {
      mapped[key] = Array.isArray(messages) ? messages[0] : messages;
    }
    setServerErrorsState(mapped);
  }, []);

  const getFieldError = useCallback((name) => {
    if (serverErrors[name]) return serverErrors[name];
    if (touched[name] && errors[name]) return errors[name];
    return null;
  }, [errors, touched, serverErrors]);

  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (e) => {
      const val = e?.target ? e.target.value : e;
      setValue(name, val);
    },
    onBlur: () => setFieldTouched(name),
    'aria-invalid': !!getFieldError(name),
    'aria-describedby': getFieldError(name) ? `${name}-error` : undefined,
  }), [values, setValue, setFieldTouched, getFieldError]);

  const reset = useCallback((newValues) => {
    const resetValues = newValues || initialValues;
    setValues(resetValues);
    valuesRef.current = resetValues;
    setErrors({});
    setTouched({});
    setServerErrorsState({});
  }, [initialValues]);

  const hasErrors = Object.keys(errors).length > 0 || Object.keys(serverErrors).length > 0;

  return {
    values,
    errors,
    touched,
    serverErrors,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    setServerErrors,
    getFieldError,
    getFieldProps,
    reset,
    hasErrors,
    setValues,
  };
}

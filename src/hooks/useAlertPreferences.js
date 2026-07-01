import { useState, useEffect } from 'react';
import { fetchCurrentUser, updateUserAlertPreferences } from '../api/users';

export const useAlertPreferences = () => {
  const [preferences, setPreferences] = useState({});

  const loadPreferences = async () => {
    try {
      const res = await fetchCurrentUser();
      setPreferences(res.data.alertPreferences || {});
    } catch (err) {
      console.log('❌ Load alert preferences error:', err.message);
    }
  };

  const updatePreference = async (type, enabled) => {
    const newPrefs = { ...preferences, [type]: enabled };
    setPreferences(newPrefs);
    try {
      await updateUserAlertPreferences(newPrefs);
    } catch (err) {
      console.log('❌ Update alert preference error:', err.message);
      // rollback?
    }
  };

  useEffect(() => { loadPreferences(); }, []);

  return { preferences, updatePreference, reload: loadPreferences };
};
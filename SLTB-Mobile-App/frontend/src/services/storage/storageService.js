/**
 * Storage Service
 * ─────────────────────────────────────────────────────────────────
 * Abstraction over AsyncStorage and expo-secure-store.
 * Includes Web fallback to ensure smooth web preview support.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@constants';

const isWeb = Platform.OS === 'web';

// ─────────────────────────────────────────────────────────────────
// SECURE STORE — Encrypted token storage
// ─────────────────────────────────────────────────────────────────

const setToken = async (token) => {
  if (isWeb) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
  }
};

const getToken = async () => {
  if (isWeb) {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } else {
    return SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  }
};

const removeToken = async () => {
  if (isWeb) {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  }
};

const setRefreshToken = async (token) => {
  if (isWeb) {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } else {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
};

const getRefreshToken = async () => {
  if (isWeb) {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } else {
    return SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

const removeRefreshToken = async () => {
  if (isWeb) {
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

// ─────────────────────────────────────────────────────────────────
// ASYNC STORAGE — Non-sensitive data
// ─────────────────────────────────────────────────────────────────

const setUser = async (user) => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

const getUser = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

const removeUser = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

const setPreference = async (key, value) => {
  const existing = await getPreferences();
  const updated = { ...existing, [key]: value };
  await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
};

const getPreferences = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {};
};

const getPreference = async (key, defaultValue = null) => {
  const prefs = await getPreferences();
  return prefs[key] ?? defaultValue;
};

// ─────────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────────

const clearAuth = async () => {
  await Promise.all([
    removeToken(),
    removeRefreshToken(),
    removeUser(),
  ]);
};

const clearAll = async () => {
  await Promise.all([
    clearAuth(),
    AsyncStorage.removeItem(STORAGE_KEYS.PREFERENCES),
    AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDED),
  ]);
};

const storageService = {
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUser,
  getUser,
  removeUser,
  setPreference,
  getPreference,
  getPreferences,
  clearAuth,
  clearAll,
};

export default storageService;

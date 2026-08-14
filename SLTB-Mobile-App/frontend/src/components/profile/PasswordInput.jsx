/**
 * PasswordInput Component
 * ─────────────────────────────────────────────────────────────────
 * Password field with left lock icon, eye visibility toggle, and error states.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const toggleSecure = () => {
    setIsSecure((prev) => !prev);
  };

  const getBorderColor = () => {
    if (error) return Colors.inputBorderError;
    if (isFocused) return Colors.inputBorderFocus;
    return '#E2E8F0';
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.labelText}>
          {label} <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
      ) : null}

      <View style={[styles.inputBox, { borderColor: getBorderColor() }]}>
        <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.leftIcon} />

        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={toggleSecure}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md + 2,
  },
  labelText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#334155',
    marginBottom: Spacing.xs + 2,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: Typography.fontSize.base,
    color: '#0F172A',
    fontWeight: Typography.fontWeight.medium,
  },
  eyeButton: {
    paddingLeft: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.fontSize.xs + 1,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default PasswordInput;

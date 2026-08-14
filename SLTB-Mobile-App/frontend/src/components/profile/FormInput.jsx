/**
 * FormInput Component
 * ─────────────────────────────────────────────────────────────────
 * Custom input field for profile forms matching design system:
 *   - Left icon (Orange)
 *   - Label & TextInput
 *   - Readonly mode support with right lock icon & muted background
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@theme';

const FormInput = ({
  label,
  leftIconName = 'person-outline',
  value,
  onChangeText,
  readonly = false,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {/* Left Orange Icon */}
        <View style={styles.leftIconWrapper}>
          <Ionicons name={leftIconName} size={20} color={Colors.orangePrimary} />
        </View>

        {/* Label */}
        <Text style={styles.labelText}>{label}</Text>

        {/* Input Box Container */}
        <View style={[styles.inputBox, readonly && styles.readonlyInputBox]}>
          <TextInput
            style={[styles.textInput, readonly && styles.readonlyTextInput]}
            value={value}
            onChangeText={onChangeText}
            editable={!readonly}
            keyboardType={keyboardType}
          />
          {readonly ? (
            <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.lockIcon} />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconWrapper: {
    marginRight: Spacing.sm,
    width: 24,
  },
  labelText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#334155',
    width: 105,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  readonlyInputBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: Typography.fontSize.sm + 1,
    color: '#0F172A',
    fontWeight: Typography.fontWeight.medium,
  },
  readonlyTextInput: {
    color: '#64748B',
  },
  lockIcon: {
    marginLeft: Spacing.xs,
  },
});

export default FormInput;

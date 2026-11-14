import React from 'react';
import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export function SearchField({ value, onChange, label }) {
  return <TextInput accessibilityLabel={label} placeholder={label} value={value}
    onChangeText={onChange} autoCorrect={false} clearButtonMode="while-editing"
    placeholderTextColor={COLORS.onyxOlive} style={styles.search} />;
}

export function FilterRow({ options, value, onChange }) {
  return <View style={styles.row}>{options.map(option => (
    <Pressable key={option} accessibilityRole="button" accessibilityState={{selected: value === option}}
      onPress={() => onChange(option)} style={[styles.chip, option === value && styles.active]}>
      <Text style={option === value ? styles.light : styles.dark}>{option}</Text>
    </Pressable>
  ))}</View>;
}

const styles = StyleSheet.create({
  search: { marginVertical: 8, marginHorizontal: 12, borderWidth: 1, borderColor: COLORS.lichenSage,
    color: COLORS.carbon, backgroundColor: COLORS.pureWhite, padding: 12, borderRadius: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 8 },
  chip: { justifyContent: 'center', minHeight: 44, paddingHorizontal: 12, borderRadius: 12, backgroundColor: COLORS.mistGreen },
  active: { backgroundColor: COLORS.forestDepths },
  light: { color: COLORS.pureWhite }, dark: { color: COLORS.forestDepths },
});

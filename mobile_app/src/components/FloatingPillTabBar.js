// Signature pressed-seed floating pill bottom navigation bar with geometric tab icons.

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from './TabIcon';
import { COLORS, ELEVATION, RADIUS, SPACING } from '../constants/theme';

export const FloatingPillTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, SPACING.s12) }]}
    >
      <View style={[styles.pillBar, ELEVATION.floatingNav]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                isFocused && styles.tabItemActive,
                pressed && !isFocused && styles.tabItemPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <TabIcon name={route.name} active={isFocused} />
              <Text
                numberOfLines={1}
                style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelIdle]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING.s16,
    backgroundColor: 'transparent',
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.onyxOliveGlass,
    borderRadius: RADIUS.nav,
    borderWidth: 1,
    borderColor: COLORS.lichenSage,
    padding: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: RADIUS.nav,
  },
  tabItemActive: {
    backgroundColor: COLORS.electricSprout,
  },
  tabItemPressed: {
    opacity: 0.75,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: COLORS.carbon,
    fontWeight: '600',
  },
  tabLabelIdle: {
    color: COLORS.paleFern,
  },
});

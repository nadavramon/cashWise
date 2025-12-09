import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, View, useWindowDimensions, TouchableOpacity, Text } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
// Stacks
import OverviewStack from './OverviewStack';
import TransactionsStack from './TransactionsStack';
import ToolsStack from './ToolsStack';
import BudgetScreen from '../screens/main/BudgetScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import { useProfile } from '../context/ProfileContext';
import { t } from '../config/i18n';

export type RootTabParamList = {
  Overview: undefined;
  Budget: undefined;
  Tools: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const { width } = useWindowDimensions();
  const MARGIN_H = 80;
  const totalWidth = width - (MARGIN_H * 2);
  const tabWidth = totalWidth / state.routes.length;

  const translateX = useSharedValue(0);
  const indicatorScale = useSharedValue(1);

  useEffect(() => {
    // Use withTiming instead of withSpring to eliminate overshoot
    translateX.value = withTiming(state.index * tabWidth, {
      duration: 300,
    });

    // Subtle pulse effect when switching tabs
    indicatorScale.value = withTiming(1.05, { duration: 150 }, () => {
      indicatorScale.value = withTiming(1, { duration: 150 });
    });
  }, [state.index, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: indicatorScale.value }
      ],
    };
  });

  return (
    <View style={[styles.tabBar, { width: totalWidth }]}>
      {/* Tab Bar Background */}
      {Platform.OS === 'ios' && isLiquidGlassAvailable() ? (
        <GlassView style={[StyleSheet.absoluteFill, { borderRadius: 24, overflow: 'hidden' }]} glassEffectStyle="clear" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { borderRadius: 24, backgroundColor: 'rgba(15,23,42,0.9)' }]} />
      )}

      {/* Sliding Glass Indicator */}
      {Platform.OS === 'ios' && isLiquidGlassAvailable() && (
        <Animated.View
          style={[
            styles.slidingIndicator,
            { width: tabWidth },
            animatedIndicatorStyle,
          ]}
        >
          <GlassView style={StyleSheet.absoluteFill} glassEffectStyle="regular" />
        </Animated.View>
      )}

      {/* Tab Buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

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
            <TabButton
              key={route.key}
              onPress={onPress}
              isFocused={isFocused}
              options={options}
              label={label}
              tabWidth={tabWidth}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabButton = ({ onPress, isFocused, options, label, tabWidth }: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.2 : 1, { duration: 300 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Extract the icon renderer from options
  const IconRenderer = options.tabBarIcon;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabButton, { width: tabWidth }]}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        {IconRenderer && <IconRenderer focused={isFocused} color={isFocused ? '#ffffffff' : '#ffffffff'} />}
      </Animated.View>
      <Text style={[styles.tabLabel, { color: isFocused ? '#ffffffff' : '#ffffffff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomTabs: React.FC = () => {
  const { profile } = useProfile();
  const language = profile?.language || 'en';

  return (
    <Tab.Navigator
      initialRouteName="Overview"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="space-dashboard" size={24} color={color} />
          ),
          tabBarLabel: t('navOverview', language),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pie-chart" size={24} color={color} />
          ),
          tabBarLabel: t('navBudget', language),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="construction" size={24} color={color} />
          ),
          tabBarLabel: t('navTools', language),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 80,
    right: 80,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  slidingIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 32,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

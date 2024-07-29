// Converted from https://github.com/i6mi6/react-native-parallax-scroll-view to TS compatible version. //

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';
import { restaurant } from '@/assets/data/restaurant';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const details = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack} style={styles.roundBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundBtn}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundBtn}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <>
      <ParallaxScrollView
        backgroundColor="#fff"
        parallaxHeaderHeight={250}
        style={{ flex: 1 }}
        renderBackground={() => (
          <Image
            source={restaurant.img}
            style={{ width: '100%', height: 300 }}
          />
        )}
        contentBackgroundColor={Colors.lightGrey}
        stickyHeaderHeight={100}
        renderStickyHeader={() => (
          <View key={'sticky-header'} style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{restaurant.name}</Text>
          </View>
        )}
      >
        <View style={styles.detailsContainer}>
          <Text>Details</Text>
        </View>
      </ParallaxScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: '#fff',
    marginLeft: 70,
    height: 100,
    justifyContent: 'flex-end',
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default details;

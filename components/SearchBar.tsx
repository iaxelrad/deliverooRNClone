import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const SearchBar = () => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <Ionicons
          style={styles.searchIcon}
          name="search-outline"
          size={20}
          color={Colors.medium}
        />
        <TextInput
          style={styles.input}
          placeholder="Restaurants, groceries, dishes"
        />
      </View>
      <Link href={'/(modal)/filter'} asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="options" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    height: 60,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});

export default SearchBar;

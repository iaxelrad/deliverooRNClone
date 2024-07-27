import categories from '@/assets/data/filter.json';
import ItemBox from '@/components/ItemBox';
import Colors from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Category {
  name: string;
  count: number;
  checked?: boolean;
}

const Filter = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<Category[]>(categories);
  const [selected, setSelected] = useState<Category[]>([]);
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const hasSelected = selected.length > 0;
    const selectedItems = items.filter(item => item.checked);
    const newSelected = selectedItems.length > 0;

    if (hasSelected !== newSelected) {
      flexWidth.value = withTiming(newSelected ? 150 : 0);
      scale.value = withTiming(newSelected ? 1 : 0);
    }

    setSelected(selectedItems);
  }, [items]);

  const handleClearAll = () => {
    const updatedItems = items.map(item => {
      item.checked = false;

      return item;
    });

    setItems(updatedItems);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      opacity: flexWidth.value > 0 ? 1 : 0,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderItem: ListRenderItem<Category> = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.itemText}>
        {item.name} {item.count}
      </Text>
      <BouncyCheckbox
        fillColor={Colors.primary}
        unfillColor="#fff"
        disableBuiltInState
        iconStyle={{
          borderColor: Colors.primary,
          borderRadius: 4,
          borderWidth: 2,
        }}
        innerIconStyle={{
          borderColor: Colors.primary,
          borderRadius: 4,
          borderWidth: 2,
        }}
        onPress={() => {
          const isChecked = items[index].checked;

          const updatedItems = items.map(item => {
            if (item.name === items[index].name) {
              item.checked = !isChecked;
            }

            return item;
          });

          setItems(updatedItems);
        }}
        isChecked={items[index].checked}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        ListHeaderComponent={<ItemBox />}
      />
      <View style={{ height: 78 }} />
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <Animated.View style={[animatedStyle, styles.outlineButton]}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear all
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.fullButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.lightGrey,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -10 },
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flex: 1,
    height: 56,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 56,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Filter;

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import useBasketStore from '@/store/basketStore';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Link } from 'expo-router';
import SwipeableRow from '@/components/SwipeableRow';

const Basket = () => {
  const { bottom } = useSafeAreaInsets();
  const { products, total, clearCart, reduceProduct } = useBasketStore();
  const [order, setOrder] = useState(false);

  const FEES = {
    service: 2.99,
    delivery: 5.99,
  };

  const startCheckout = () => {
    setOrder(true);
    clearCart();
  };

  return (
    <>
      {order ? (
        <>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            fallSpeed={2500}
            fadeOut={true}
            autoStart={true}
          />
          <View style={{ marginTop: '50%', padding: 20, alignItems: 'center' }}>
            <Text
              style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
            >
              Thank you for your order!
            </Text>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.orderBtn}>
                <Text style={styles.footerText}>New order</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </>
      ) : (
        <>
          <FlatList
            data={products}
            ListHeaderComponent={<Text style={styles.section}>Items</Text>}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
            renderItem={({ item }) => (
              <SwipeableRow onDelete={() => reduceProduct(item)}>
                <View style={styles.row}>
                  <Text style={{ color: Colors.primary, fontSize: 18 }}>
                    {item.quantity}x
                  </Text>
                  <Text style={{ flex: 1, fontSize: 18 }}>{item.name}</Text>
                  <Text style={{ fontSize: 18 }}>
                    ${item.price * item.quantity}
                  </Text>
                </View>
              </SwipeableRow>
            )}
            ListFooterComponent={
              <View>
                <View style={{ height: 1, backgroundColor: Colors.grey }} />
                <View style={styles.totalRow}>
                  <Text style={styles.total}>Subtotal</Text>
                  <Text style={{ fontSize: 18 }}>${total.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.total}>Service</Text>
                  <Text style={{ fontSize: 18 }}>${FEES.service}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.total}>Delivery</Text>
                  <Text style={{ fontSize: 18 }}>${FEES.delivery}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.total}>Order Total</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    ${(total + FEES.service + FEES.delivery).toFixed(2)}
                  </Text>
                </View>
              </View>
            }
          />
          <View style={[styles.footer, { paddingBottom: bottom }]}>
            <TouchableOpacity style={styles.fullButton} onPress={startCheckout}>
              <Text style={styles.footerText}>Order now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    gap: 20,
    alignItems: 'center',
  },
  section: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    paddingHorizontal: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
  },
  total: {
    fontSize: 18,
    color: Colors.medium,
  },
  footer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -10 },
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: 250,
    height: 50,
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default Basket;

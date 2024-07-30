import { Ionicons } from '@expo/vector-icons';
import React, { Component, PropsWithChildren, useRef } from 'react';
import { Animated, StyleSheet, I18nManager, View } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';

interface SwipeableRowProps {
  onDelete: () => void;
}

const SwipeableRow: React.FC<React.PropsWithChildren<SwipeableRowProps>> = ({
  onDelete,
  children,
}) => {
  const swipeableRow = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <RectButton style={styles.rightAction} onPress={close}>
        <Ionicons
          name="trash-outline"
          size={24}
          color="#fff"
          style={{ marginRight: 10 }}
        />
      </RectButton>
    );
  };

  const close = () => {
    swipeableRow.current?.close();
    onDelete();
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      leftThreshold={80}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default SwipeableRow;

// export default class SwipeableRow extends Component<
//   PropsWithChildren<unknown & { onDelete: () => void }>
// > {
//   private renderRightActions = (
//     _progress: Animated.AnimatedInterpolation<number>
//   ) => {
//     return (
//       <RectButton style={styles.rightAction} onPress={this.close}>
//         {/* Change it to some icons */}
//         <Ionicons
//           name="trash-outline"
//           size={24}
//           color="#fff"
//           style={{ marginRight: 10 }}
//         />
//       </RectButton>
//     );
//   };

//   private swipeableRow?: Swipeable;

//   private updateRef = (ref: Swipeable) => {
//     this.swipeableRow = ref;
//   };
//   private close = () => {
//     this.swipeableRow?.close();
//     this.props.onDelete();
//   };
//   render() {
//     const { children } = this.props;
//     return (
//       <Swipeable
//         ref={this.updateRef}
//         friction={2}
//         leftThreshold={80}
//         enableTrackpadTwoFingerGesture
//         rightThreshold={40}
//         renderRightActions={this.renderRightActions}
//       >
//         {children}
//       </Swipeable>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   rightAction: {
//     alignItems: 'center',
//     flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
//     backgroundColor: '#dd2c00',
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
// });

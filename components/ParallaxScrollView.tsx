import React, {
  useState,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  ScrollViewProps,
  LayoutChangeEvent,
} from 'react-native';

const window = Dimensions.get('window');

const pivotPoint = (a: number, b: number) => a - b;

const renderEmpty = () => <View />;

const noRender = () => <View style={{ display: 'none' }} />;

const interpolate = (
  value: Animated.Value,
  opts: Animated.InterpolationConfigType
) => {
  const x = value.interpolate(opts);
  (x as any).toJSON = () => (x as any).__getValue();
  return x;
};

interface ParallaxScrollViewProps {
  backgroundColor?: string;
  backgroundScrollSpeed?: number;
  fadeOutForeground?: boolean;
  fadeOutBackground?: boolean;
  contentBackgroundColor?: string;
  onChangeHeaderVisibility?: (visible: boolean) => void;
  parallaxHeaderHeight: number;
  renderBackground?: () => ReactNode;
  renderContentBackground?: () => ReactNode;
  renderFixedHeader?: () => ReactNode;
  renderForeground?: () => ReactNode;
  renderScrollComponent?: (props: any) => ReactNode;
  renderStickyHeader?: () => ReactNode;
  stickyHeaderHeight?: number;
  contentContainerStyle?: any;
  outputScaleValue?: number;
  parallaxHeaderContainerStyle?: any;
  parallaxHeaderStyle?: any;
  backgroundImageStyle?: any;
  stickyHeaderStyle?: any;
  style?: any;
  scrollEvent?: (e: any) => void;
  onScroll?: (e: any) => void;
  children?: ReactNode;
}

const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  backgroundColor = '#000',
  backgroundScrollSpeed = 5,
  children,
  contentBackgroundColor = '#fff',
  fadeOutForeground = true,
  fadeOutBackground = true,
  parallaxHeaderHeight,
  renderBackground = renderEmpty,
  renderContentBackground = noRender,
  renderFixedHeader,
  renderForeground,
  renderScrollComponent = props => <Animated.ScrollView {...props} />,
  renderStickyHeader,
  stickyHeaderHeight = 0,
  style,
  contentContainerStyle,
  outputScaleValue = 5,
  onChangeHeaderVisibility = () => {},
  scrollEvent,
  ...scrollViewProps
}) => {
  const [viewHeight, setViewHeight] = useState(window.height);
  const [viewWidth, setViewWidth] = useState(window.width);
  const scrollY = useRef(new Animated.Value(0)).current;
  const footerComponent = useRef<{ setNativeProps: (props: any) => void }>({
    setNativeProps: () => {},
  });
  const footerHeight = useRef(0);
  const scrollViewRef = useRef<typeof Animated.ScrollView>(null);

  const animatedEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewWidth || height !== viewHeight) {
      setViewWidth(width);
      setViewHeight(height);
    }
  };

  const renderBackgroundComponent = () => {
    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight);
    return (
      <Animated.View
        style={[
          styles.backgroundImage,
          {
            backgroundColor,
            height: parallaxHeaderHeight,
            width: viewWidth,
            opacity: fadeOutBackground
              ? interpolate(scrollY, {
                  inputRange: [0, p * 0.5, p * 0.75, p],
                  outputRange: [1, 0.3, 0.1, 0],
                  extrapolate: 'clamp',
                })
              : 1,
            transform: [
              {
                translateY: interpolate(scrollY, {
                  inputRange: [0, p],
                  outputRange: [0, -(p / backgroundScrollSpeed)],
                  extrapolate: 'extend',
                }),
              },
              {
                scale: interpolate(scrollY, {
                  inputRange: [-viewHeight, 0],
                  outputRange: [outputScaleValue * 1.5, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View>{renderBackground()}</View>
      </Animated.View>
    );
  };

  const renderForegroundComponent = () => {
    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight);
    return (
      <View style={[styles.parallaxHeaderContainer]}>
        <Animated.View
          style={[
            styles.parallaxHeader,
            {
              height: parallaxHeaderHeight,
              opacity: fadeOutForeground
                ? interpolate(scrollY, {
                    inputRange: [0, p * 0.5, p * 0.75, p],
                    outputRange: [1, 0.3, 0.1, 0],
                    extrapolate: 'clamp',
                  })
                : 1,
            },
          ]}
        >
          <View style={{ height: parallaxHeaderHeight }}>
            {renderForeground && renderForeground()}
          </View>
        </Animated.View>
      </View>
    );
  };

  const wrapChildren = () => {
    const containerStyles = [{ backgroundColor: contentBackgroundColor }];
    if (contentContainerStyle) containerStyles.push(contentContainerStyle);

    let containerHeight = viewHeight;

    React.Children.forEach(children, item => {
      if (item && React.isValidElement(item)) {
        containerHeight = 0;
      }
    });

    return (
      <View
        style={[containerStyles, { minHeight: containerHeight }]}
        onLayout={e => {
          const height = e.nativeEvent.layout.height;
          const footerHeightValue = Math.max(
            0,
            viewHeight - height - stickyHeaderHeight
          );
          if (footerHeight.current !== footerHeightValue) {
            footerComponent.current.setNativeProps({
              style: { height: footerHeightValue },
            });
            footerHeight.current = footerHeightValue;
          }
        }}
      >
        {renderContentBackground()}
        {children}
      </View>
    );
  };

  const renderFooterSpacer = () => (
    <View
      ref={ref => {
        if (ref) {
          footerComponent.current = ref;
        }
      }}
      style={{ backgroundColor: contentBackgroundColor }}
    />
  );

  const maybeRenderStickyHeader = () => {
    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight);
    if (renderStickyHeader || renderFixedHeader) {
      return (
        <View
          style={[
            styles.stickyHeader,
            {
              width: viewWidth,
              ...(stickyHeaderHeight ? { height: stickyHeaderHeight } : {}),
            },
          ]}
        >
          {renderStickyHeader ? (
            <Animated.View
              style={{
                backgroundColor,
                height: stickyHeaderHeight,
                opacity: interpolate(scrollY, {
                  inputRange: [0, p],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: interpolate(scrollY, {
                        inputRange: [0, p],
                        outputRange: [stickyHeaderHeight, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                }}
              >
                {renderStickyHeader()}
              </Animated.View>
            </Animated.View>
          ) : null}
          {renderFixedHeader && renderFixedHeader()}
        </View>
      );
    }
    return null;
  };

  const onScroll = (e: any) => {
    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight);
    if (e.nativeEvent.contentOffset.y >= p) {
      onChangeHeaderVisibility(false);
    } else {
      onChangeHeaderVisibility(true);
    }
    scrollEvent && scrollEvent(e);
  };

  const scrollElement = renderScrollComponent({
    ...scrollViewProps,
    ref: scrollViewRef,
    style: [styles.scrollView],
    scrollEventThrottle: 1,
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true, listener: onScroll }
    ),
  });

  return (
    <View style={[style, styles.container]} onLayout={onLayout}>
      {renderBackgroundComponent()}
      {React.cloneElement(
        scrollElement as React.ReactElement<any>,
        {},
        renderForegroundComponent(),
        wrapChildren(),
        renderFooterSpacer()
      )}
      {maybeRenderStickyHeader()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  parallaxHeaderContainer: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  parallaxHeader: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    top: 0,
  },
  stickyHeader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
});

export default ParallaxScrollView;

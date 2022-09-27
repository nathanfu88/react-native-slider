import React, { PureComponent } from 'react';

import {
  Animated,
  Image,
  StyleSheet,
  PanResponder,
  View,
  Easing,
  I18nManager,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import { ImagePropTypes, TextPropTypes, ViewPropTypes } from 'deprecated-react-native-prop-types';

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;
const GRADUATION_HEIGHT = 10;
const GRADUATION_WIDTH = 3;
const MIN_GRADUATION_MARGIN = 6;

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100,
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0,
  },
  // decay : { // This has a serious bug
  //   velocity     : 1,
  //   deceleration : 0.997
  // }
};

export default class Slider extends PureComponent {
  static propTypes = {
    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    value: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * The color used for the thumb.
     */
    thumbTintColor: PropTypes.string,

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: PropTypes.func,

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: ViewPropTypes.style,

    /**
     * The style applied to the track.
     */
    trackStyle: ViewPropTypes.style,

    /**
     * The style applied to the track on the left of the slider.
     */
    minTrackStyle: ViewPropTypes.style,

    /**
     * Horizontal offsetting applied to the track without affecting the thumb.
     */
    trackOffset: PropTypes.number,

    /**
     * Component to use for the thumb
     */
    thumbComponent: PropTypes.object,

    /**
     * The style applied to the thumb.
     */
    thumbStyle: ViewPropTypes.style,

    /**
     * Sets an image for the thumb.
     */
    thumbImage: ImagePropTypes.source,

    /**
     * Sets a text for the thumb
     */
    thumbText: PropTypes.string,

    /**
     * Sets a style for the thumb text
     */
    thumbTextStyle: TextPropTypes.style,

    /**
     * Graduation value of the slider to display a reguliar vertical tick.
     * The value should be between 0 and (maximumValue - minimumValue).
     * Default value is 0
     */
    graduations: PropTypes.number,

    /**
     * The style applied to the graduation.
     */
    graduationStyle: ViewPropTypes.style,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     */
    debugTouchArea: PropTypes.bool,

    /**
     * Set to true to animate values with default 'timing' animation type
     */
    animateTransitions: PropTypes.bool,

    /**
     * Custom Animation type. 'spring' or 'timing'.
     */
    animationType: PropTypes.oneOf(['spring', 'timing']),

    /**
     * Used to configure the animation parameters.  These are the same parameters in the Animated library.
     */
    animationConfig: PropTypes.object,

    /**
     * Callback for when a slider animation completes
     */
    onAnimationComplete: PropTypes.func,
  };

  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    minimumTrackTintColor: '#3f3f3f',
    maximumTrackTintColor: '#b3b3b3',
    thumbTintColor: '#343434',
    thumbTouchSize: { width: 40, height: 40 },
    debugTouchArea: false,
    animationType: 'timing',
    trackOffset: 0,
    thumbTextStyle: {},
    graduations: 0,
    graduationSize: { width: GRADUATION_WIDTH, GRADUATION_HEIGHT: GRADUATION_HEIGHT },
  };

  constructor(props) {
    super(props);

    this.state = {
      containerSize: { width: 0, height: 0 },
      trackSize: { width: 0, height: 0 },
      thumbSize: { width: 0, height: 0 },
      graduationSize: { width: props.graduationStyle.width, height: props.graduationStyle.height },
      allMeasured: false,
      value: new Animated.Value(props.value),
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentDidUpdate({value}) {
    if (this.props.value !== value) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(this.props.value);
      } else {
        this._setCurrentValue(this.props.value);
      }
    }
  }

  render() {
    const {
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      thumbTintColor,
      thumbImage,
      styles,
      style,
      trackStyle,
      trackOffset,
      minTrackStyle,
      thumbComponent,
      thumbStyle,
      debugTouchArea,
      onValueChange,
      thumbTouchSize,
      animationType,
      animateTransitions,
      graduations,
      graduationStyle,
      ...other
    } = this.props;
    const {
      value,
      containerSize,
      thumbSize,
      graduationSize,
      allMeasured,
    } = this.state;
    const mainStyles = styles || defaultStyles;
    const thumbWidthHalf = thumbSize.width / 2;
    const thumbLeftMinOutput = MIN_GRADUATION_MARGIN;
    const thumbLeftMaxOutput = containerSize.width - thumbSize.width - MIN_GRADUATION_MARGIN;
    const thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: I18nManager.isRTL
        ? [-thumbLeftMinOutput, -thumbLeftMaxOutput]
        : [thumbLeftMinOutput, thumbLeftMaxOutput],
      // extrapolate: 'clamp',
    });
    
    const minimumTrackWidth = (minimumValue === maximumValue && this.props.value === minimumValue) ?
      containerSize.width - thumbWidthHalf :
      value.interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [0, containerSize.width - thumbSize.width],
        // extrapolate: 'clamp',
      });
    const valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    let minTrackWidth = (this.props.value === minimumValue) ?
      minimumTrackWidth :
      Animated.add(minimumTrackWidth, thumbWidthHalf - trackOffset);
    // Special use case for HDx to align track to graduations, but only if there is no thumb
    if (thumbStyle.backgroundColor === "transparent" && thumbStyle.width === 0) {
      // this.props.value should already be mapped to a graduation
      const gradOffset = this._getGraduationOffset(this.props.value);
      // Convert offset to width
      minTrackWidth = gradOffset - trackOffset + graduationSize.width + MIN_GRADUATION_MARGIN;
    }

    const minimumTrackStyle = {
      position: 'absolute',
      left: trackOffset,
      width: minTrackWidth,
      backgroundColor: minimumTrackTintColor,
      ...valueVisibleStyle,
    }
    const maximumTrackStyle = trackOffset ? { marginHorizontal: trackOffset } : {}

    const touchOverflowStyle = this._getTouchOverflowStyle();

    return (
      <View
        {...other}
        style={[mainStyles.container, style]}
        onLayout={this._measureContainer}
      >
        <View
          style={[
            { backgroundColor: maximumTrackTintColor },
            mainStyles.track,
            trackStyle,
            maximumTrackStyle,
          ]}
          renderToHardwareTextureAndroid
          onLayout={this._measureTrack}
        />
        <Animated.View
          renderToHardwareTextureAndroid
          style={[mainStyles.track, trackStyle, minimumTrackStyle, minTrackStyle]}
        />
        {this._renderGraduations(mainStyles, valueVisibleStyle)}
        <Animated.View
          onLayout={this._measureThumb}
          renderToHardwareTextureAndroid
          style={[
            { backgroundColor: thumbTintColor, justifyContent: 'center' },
            mainStyles.thumb,
            thumbStyle,
            {
              transform: [{ translateX: thumbLeft }, { translateY: 0 }],
              ...valueVisibleStyle,
            },
          ]}
        >
          {thumbComponent}
          {!thumbComponent && this._renderThumbImage()}
          {!thumbComponent && this._renderThumbText()}
        </Animated.View>
        <View
          renderToHardwareTextureAndroid
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {...this._panResponder.panHandlers}
        >
          {debugTouchArea === true &&
            this._renderDebugThumbTouchRect(minimumTrackWidth)}
        </View>
      </View>
    );
  }

  _getPropsForComponentUpdate(props) {
    const {
      value,
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      graduationStyle,
      ...otherProps
    } = props;

    return otherProps;
  }

  _handleStartShouldSetPanResponder = (
    e: Object /* gestureState: Object */,
  ): boolean => {
    // Should we become active when the user presses down on the thumb?
    return !this.props.disabled;
  }

  _handleMoveShouldSetPanResponder(/* e: Object, gestureState: Object */): boolean {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  }

  _handlePanResponderGrant = (/* e: Object, gestureState: Object */) => {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent('onSlidingStart');
  };

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onValueChange');
  };

  _handlePanResponderRequestEnd(e: Object, gestureState: Object) {
    // Should we allow another component to take over this pan?
    return false;
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onSlidingComplete');
  };

  _measureContainer = (x: Object) => {
    this._handleMeasure('containerSize', x);
  };

  _measureTrack = (x: Object) => {
    this._handleMeasure('trackSize', x);
  };

  _measureThumb = (x: Object) => {
    this._handleMeasure('thumbSize', x);
  };

  _handleMeasure = (name: string, x: Object) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };

    const storeName = `_${name}`;
    const currentSize = this[storeName];
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      });
    }
  };

  _getGraduationOffset = (index: number) => {
    const { graduations, trackOffset } = this.props;
    const { graduationSize, trackSize } = this.state;

    const drawableWidth = trackSize.width - MIN_GRADUATION_MARGIN * 2 -
      ((graduationSize.width / 2) * 2);
    const gradSeparation = Math.round(drawableWidth / (graduations - 1));

    if (graduations === 1) {
      return trackOffset + trackSize.width - MIN_GRADUATION_MARGIN - graduationSize.width;
    }
    if (index === 0) {
      return trackOffset + MIN_GRADUATION_MARGIN;
    }
    if (index === graduations - 1) {
      return trackOffset + trackSize.width - MIN_GRADUATION_MARGIN - graduationSize.width;
    }
    return (
      trackOffset + MIN_GRADUATION_MARGIN + index * gradSeparation
    );
  };

  _getRatio = (value: number) =>
    (value - this.props.minimumValue) /
    (this.props.maximumValue - this.props.minimumValue);

  _getThumbLeft = (value: number) => {
    const nonRtlRatio = this._getRatio(value);
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    );
  };

  _getValue = (gestureState: Object) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbLeft = this._previousLeft + gestureState.dx;

    const nonRtlRatio = thumbLeft / length;
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (this.props.step) {
      return Math.max(
        this.props.minimumValue,
        Math.min(
          this.props.maximumValue,
          this.props.minimumValue +
            Math.round(
              ratio *
                (this.props.maximumValue - this.props.minimumValue) /
                this.props.step,
            ) *
              this.props.step,
        ),
      );
    }
    return Math.max(
      this.props.minimumValue,
      Math.min(
        this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) +
          this.props.minimumValue,
      ),
    );
  };

  _getCurrentValue = () => this.state.value.__getValue();

  _setCurrentValue = (value: number) => {
    this.state.value.setValue(value);
  };

  _setCurrentValueAnimated = (value: number) => {
    const animationType = this.props.animationType;
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {
        toValue: value,
      },
    );

    Animated[animationType](this.state.value, animationConfig).start(this.props.onAnimationComplete);
  };

  _fireChangeEvent = event => {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  };

  _getTouchOverflowSize = () => {
    const state = this.state;
    const props = this.props;

    const size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(
        0,
        props.thumbTouchSize.width - state.thumbSize.width,
      );
      size.height = Math.max(
        0,
        props.thumbTouchSize.height - state.containerSize.height,
      );
    }

    return size;
  };

  _getTouchOverflowStyle = () => {
    const { width, height } = this._getTouchOverflowSize();

    const touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  _renderDebugThumbTouchRect = () => {
    return (
      <View
        style={[defaultStyles.debugThumbTouchArea]}
        pointerEvents="none"
      />
    );
  };

  _renderThumbText = () => {
    const { thumbText, thumbTextStyle } = this.props;

    if (!thumbText) return;
    return (
      <Text style={[defaultStyles.thumbText, thumbTextStyle]}>{thumbText}</Text>
    );
  };

  _renderThumbImage = () => {
    const { thumbImage } = this.props;

    if (!thumbImage) return;

    return <Image source={thumbImage} />;
  };

  _renderGraduations = (mainStyles, valueVisibleStyle) => {
    const { graduations, maximumTrackTintColor, graduationStyle } = this.props;
    const { trackSize, graduationSize } = this.state;

    if (graduations < 1) return;

    return (
      [...Array(graduations)].map((x, i) =>
        <Animated.View
          key={i}
          style={[
            {
              backgroundColor: maximumTrackTintColor,
              marginTop: -(trackSize.height + graduationSize.height) / 2
            },
            mainStyles.graduation, graduationStyle,
            { left: this._getGraduationOffset(i), ...valueVisibleStyle }
          ]}
        />
      )
    )
  }
}

var defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    opacity: 0.5,
  },
  thumbText: {
    color: 'white',
    fontSize: 10,
  },
  graduation: {
    position: 'absolute',
    height: GRADUATION_HEIGHT,
    width: GRADUATION_WIDTH,
  },
});

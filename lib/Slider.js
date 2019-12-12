Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/Slider.js';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);

var _reactNative=require('react-native');











var _propTypes=require('prop-types');var _propTypes2=_interopRequireDefault(_propTypes);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var TRACK_SIZE=4;
var THUMB_SIZE=20;
var GRADUATION_HEIGHT=10;
var GRADUATION_WIDTH=3;
var MIN_GRADUATION_MARGIN=6;

function Rect(x,y,width,height){
this.x=x;
this.y=y;
this.width=width;
this.height=height;
}

Rect.prototype.containsPoint=function(x,y){
return(
x>=this.x&&
y>=this.y&&
x<=this.x+this.width&&
y<=this.y+this.height);

};

var DEFAULT_ANIMATION_CONFIGS={
spring:{
friction:7,
tension:100},

timing:{
duration:150,
easing:_reactNative.Easing.inOut(_reactNative.Easing.ease),
delay:0}};var







Slider=function(_PureComponent){_inherits(Slider,_PureComponent);












































































































































































function Slider(props){_classCallCheck(this,Slider);var _this=_possibleConstructorReturn(this,(Slider.__proto__||Object.getPrototypeOf(Slider)).call(this,
props));_initialiseProps.call(_this);

_this.state={
containerSize:{width:0,height:0},
trackSize:{width:0,height:0},
thumbSize:{width:0,height:0},
graduationSize:{width:0,height:0},
allMeasured:false,
value:new _reactNative.Animated.Value(props.value)};


_this._panResponder=_reactNative.PanResponder.create({
onStartShouldSetPanResponder:_this._handleStartShouldSetPanResponder,
onMoveShouldSetPanResponder:_this._handleMoveShouldSetPanResponder,
onPanResponderGrant:_this._handlePanResponderGrant,
onPanResponderMove:_this._handlePanResponderMove,
onPanResponderRelease:_this._handlePanResponderEnd,
onPanResponderTerminationRequest:_this._handlePanResponderRequestEnd,
onPanResponderTerminate:_this._handlePanResponderEnd});return _this;

}_createClass(Slider,[{key:'componentDidUpdate',value:function componentDidUpdate(_ref)

{var value=_ref.value;
if(this.props.value!==value){
if(this.props.animateTransitions){
this._setCurrentValueAnimated(this.props.value);
}else{
this._setCurrentValue(this.props.value);
}
}
}},{key:'render',value:function render()

{var _props=





















this.props,minimumValue=_props.minimumValue,maximumValue=_props.maximumValue,minimumTrackTintColor=_props.minimumTrackTintColor,maximumTrackTintColor=_props.maximumTrackTintColor,thumbTintColor=_props.thumbTintColor,thumbImage=_props.thumbImage,styles=_props.styles,style=_props.style,trackStyle=_props.trackStyle,minTrackStyle=_props.minTrackStyle,thumbComponent=_props.thumbComponent,thumbStyle=_props.thumbStyle,debugTouchArea=_props.debugTouchArea,onValueChange=_props.onValueChange,thumbTouchSize=_props.thumbTouchSize,animationType=_props.animationType,animateTransitions=_props.animateTransitions,graduations=_props.graduations,graduationStyle=_props.graduationStyle,other=_objectWithoutProperties(_props,['minimumValue','maximumValue','minimumTrackTintColor','maximumTrackTintColor','thumbTintColor','thumbImage','styles','style','trackStyle','minTrackStyle','thumbComponent','thumbStyle','debugTouchArea','onValueChange','thumbTouchSize','animationType','animateTransitions','graduations','graduationStyle']);var _state=





this.state,value=_state.value,containerSize=_state.containerSize,thumbSize=_state.thumbSize,allMeasured=_state.allMeasured;
var mainStyles=styles||defaultStyles;
var thumbWidthHalf=thumbSize.width/2;
var thumbLeft=value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:_reactNative.I18nManager.isRTL?
[0,-(containerSize.width-thumbWidthHalf)]:
[-thumbWidthHalf,containerSize.width-thumbWidthHalf]});


var minimumTrackWidth=value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:[0,containerSize.width-thumbWidthHalf]});


var valueVisibleStyle={};
if(!allMeasured){
valueVisibleStyle.opacity=0;
}

var minimumTrackStyle=_extends({
position:'absolute',
width:_reactNative.Animated.add(minimumTrackWidth,thumbSize.width/2),
backgroundColor:minimumTrackTintColor},
valueVisibleStyle);


var touchOverflowStyle=this._getTouchOverflowStyle();

return(
_react2.default.createElement(_reactNative.View,_extends({},
other,{
style:[mainStyles.container,style],
onLayout:this._measureContainer,__source:{fileName:_jsxFileName,lineNumber:319}}),

_react2.default.createElement(_reactNative.View,{
style:[
{backgroundColor:maximumTrackTintColor},
mainStyles.track,
trackStyle],

renderToHardwareTextureAndroid:true,
onLayout:this._measureTrack,__source:{fileName:_jsxFileName,lineNumber:324}}),

_react2.default.createElement(_reactNative.Animated.View,{
renderToHardwareTextureAndroid:true,
style:[mainStyles.track,trackStyle,minimumTrackStyle,minTrackStyle],__source:{fileName:_jsxFileName,lineNumber:333}}),

this._renderGraduations(mainStyles,valueVisibleStyle),
_react2.default.createElement(_reactNative.Animated.View,{
onLayout:this._measureThumb,
renderToHardwareTextureAndroid:true,
style:[
{backgroundColor:thumbTintColor,justifyContent:'center'},
mainStyles.thumb,
thumbStyle,_extends({

transform:[{translateX:thumbLeft},{translateY:0}]},
valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:338}},



thumbComponent,
!thumbComponent&&this._renderThumbImage(),
!thumbComponent&&this._renderThumbText()),

_react2.default.createElement(_reactNative.View,_extends({
renderToHardwareTextureAndroid:true,
style:[defaultStyles.touchArea,touchOverflowStyle]},
this._panResponder.panHandlers,{__source:{fileName:_jsxFileName,lineNumber:355}}),

debugTouchArea===true&&
this._renderDebugThumbTouchRect(minimumTrackWidth))));



}},{key:'_getPropsForComponentUpdate',value:function _getPropsForComponentUpdate(

props){var

value=








props.value,onValueChange=props.onValueChange,onSlidingStart=props.onSlidingStart,onSlidingComplete=props.onSlidingComplete,style=props.style,trackStyle=props.trackStyle,thumbStyle=props.thumbStyle,graduationStyle=props.graduationStyle,otherProps=_objectWithoutProperties(props,['value','onValueChange','onSlidingStart','onSlidingComplete','style','trackStyle','thumbStyle','graduationStyle']);

return otherProps;
}},{key:'_handleMoveShouldSetPanResponder',value:function _handleMoveShouldSetPanResponder()







{

return false;
}},{key:'_handlePanResponderRequestEnd',value:function _handlePanResponderRequestEnd(















e,gestureState){

return false;
}}]);return Slider;}(_react.PureComponent);Slider.propTypes={value:_propTypes2.default.number,disabled:_propTypes2.default.bool,minimumValue:_propTypes2.default.number,maximumValue:_propTypes2.default.number,step:_propTypes2.default.number,minimumTrackTintColor:_propTypes2.default.string,maximumTrackTintColor:_propTypes2.default.string,thumbTintColor:_propTypes2.default.string,thumbTouchSize:_propTypes2.default.shape({width:_propTypes2.default.number,height:_propTypes2.default.number}),onValueChange:_propTypes2.default.func,onSlidingStart:_propTypes2.default.func,onSlidingComplete:_propTypes2.default.func,style:_reactNative.ViewPropTypes.style,trackStyle:_reactNative.ViewPropTypes.style,minTrackStyle:_reactNative.ViewPropTypes.style,thumbComponent:_propTypes2.default.object,thumbStyle:_reactNative.ViewPropTypes.style,thumbImage:_reactNative.Image.propTypes.source,thumbText:_propTypes2.default.string,thumbTextStyle:_reactNative.Text.propTypes.style,graduations:_propTypes2.default.number,graduationStyle:_reactNative.ViewPropTypes.style,debugTouchArea:_propTypes2.default.bool,animateTransitions:_propTypes2.default.bool,animationType:_propTypes2.default.oneOf(['spring','timing']),animationConfig:_propTypes2.default.object,onAnimationComplete:_propTypes2.default.func};Slider.defaultProps={value:0,minimumValue:0,maximumValue:1,step:0,minimumTrackTintColor:'#3f3f3f',maximumTrackTintColor:'#b3b3b3',thumbTintColor:'#343434',thumbTouchSize:{width:40,height:40},debugTouchArea:false,animationType:'timing',thumbTextStyle:{},graduations:0};var _initialiseProps=function _initialiseProps(){var _this2=this;this._handleStartShouldSetPanResponder=function(e){return _this2._thumbHitTest(e);};this._handlePanResponderGrant=function(){_this2._previousLeft=_this2._getThumbLeft(_this2._getCurrentValue());_this2._fireChangeEvent('onSlidingStart');};this._handlePanResponderMove=function(e,gestureState){if(_this2.props.disabled){return;}_this2._setCurrentValue(_this2._getValue(gestureState));_this2._fireChangeEvent('onValueChange');};this.

_handlePanResponderEnd=function(e,gestureState){
if(_this2.props.disabled){
return;
}

_this2._setCurrentValue(_this2._getValue(gestureState));
_this2._fireChangeEvent('onSlidingComplete');
};this.

_measureContainer=function(x){
_this2._handleMeasure('containerSize',x);
};this.

_measureTrack=function(x){
_this2._handleMeasure('trackSize',x);
};this.

_measureThumb=function(x){
_this2._handleMeasure('thumbSize',x);
};this.

_measureGraduations=function(x){
_this2._handleMeasure('graduationSize',x);
};this.

_handleMeasure=function(name,x){var _x$nativeEvent$layout=
x.nativeEvent.layout,width=_x$nativeEvent$layout.width,height=_x$nativeEvent$layout.height;
var size={width:width,height:height};

var storeName='_'+name;
var currentSize=_this2[storeName];
if(
currentSize&&
width===currentSize.width&&
height===currentSize.height)
{
return;
}
_this2[storeName]=size;

if(_this2._containerSize&&_this2._trackSize&&_this2._thumbSize){
_this2.setState({
containerSize:_this2._containerSize,
trackSize:_this2._trackSize,
thumbSize:_this2._thumbSize,
graduationSize:_this2._graduationSize,
allMeasured:true});

}
};this.

_getGraduationOffset=function(index){var
graduations=_this2.props.graduations;var _state2=
_this2.state,graduationSize=_state2.graduationSize,trackSize=_state2.trackSize;

var drawableWidth=trackSize.width-MIN_GRADUATION_MARGIN*2-
graduationSize.width/2*2;
var gradSeparation=Math.round(drawableWidth/(graduations-1));

if(index===0){
return MIN_GRADUATION_MARGIN;
}
if(index===graduations-1){
return trackSize.width-MIN_GRADUATION_MARGIN-graduationSize.width;
}
return(
MIN_GRADUATION_MARGIN+index*gradSeparation);

};this.

_getRatio=function(value){return(
(value-_this2.props.minimumValue)/(
_this2.props.maximumValue-_this2.props.minimumValue));};this.

_getThumbLeft=function(value){
var nonRtlRatio=_this2._getRatio(value);
var ratio=_reactNative.I18nManager.isRTL?1-nonRtlRatio:nonRtlRatio;
return(
ratio*(_this2.state.containerSize.width-_this2.state.thumbSize.width));

};this.

_getValue=function(gestureState){
var length=_this2.state.containerSize.width-_this2.state.thumbSize.width;
var thumbLeft=_this2._previousLeft+gestureState.dx;

var nonRtlRatio=thumbLeft/length;
var ratio=_reactNative.I18nManager.isRTL?1-nonRtlRatio:nonRtlRatio;

if(_this2.props.step){
return Math.max(
_this2.props.minimumValue,
Math.min(
_this2.props.maximumValue,
_this2.props.minimumValue+
Math.round(
ratio*(
_this2.props.maximumValue-_this2.props.minimumValue)/
_this2.props.step)*

_this2.props.step));


}
return Math.max(
_this2.props.minimumValue,
Math.min(
_this2.props.maximumValue,
ratio*(_this2.props.maximumValue-_this2.props.minimumValue)+
_this2.props.minimumValue));


};this.

_getCurrentValue=function(){return _this2.state.value.__getValue();};this.

_setCurrentValue=function(value){
_this2.state.value.setValue(value);
};this.

_setCurrentValueAnimated=function(value){
var animationType=_this2.props.animationType;
var animationConfig=_extends(
{},
DEFAULT_ANIMATION_CONFIGS[animationType],
_this2.props.animationConfig,
{
toValue:value});



_reactNative.Animated[animationType](_this2.state.value,animationConfig).start(_this2.props.onAnimationComplete);
};this.

_fireChangeEvent=function(event){
if(_this2.props[event]){
_this2.props[event](_this2._getCurrentValue());
}
};this.

_getTouchOverflowSize=function(){
var state=_this2.state;
var props=_this2.props;

var size={};
if(state.allMeasured===true){
size.width=Math.max(
0,
props.thumbTouchSize.width-state.thumbSize.width);

size.height=Math.max(
0,
props.thumbTouchSize.height-state.containerSize.height);

}

return size;
};this.

_getTouchOverflowStyle=function(){var _getTouchOverflowSize=
_this2._getTouchOverflowSize(),width=_getTouchOverflowSize.width,height=_getTouchOverflowSize.height;

var touchOverflowStyle={};
if(width!==undefined&&height!==undefined){
var verticalMargin=-height/2;
touchOverflowStyle.marginTop=verticalMargin;
touchOverflowStyle.marginBottom=verticalMargin;

var horizontalMargin=-width/2;
touchOverflowStyle.marginLeft=horizontalMargin;
touchOverflowStyle.marginRight=horizontalMargin;
}

if(_this2.props.debugTouchArea===true){
touchOverflowStyle.backgroundColor='orange';
touchOverflowStyle.opacity=0.5;
}

return touchOverflowStyle;
};this.

_thumbHitTest=function(e){
var nativeEvent=e.nativeEvent;
var thumbTouchRect=_this2._getThumbTouchRect();

return thumbTouchRect.containsPoint(
nativeEvent.locationX,
nativeEvent.locationY);

};this.

_getThumbTouchRect=function(){
var state=_this2.state;
var props=_this2.props;
var touchOverflowSize=_this2._getTouchOverflowSize();

return new Rect(
touchOverflowSize.width/2+
_this2._getThumbLeft(_this2._getCurrentValue())+
(state.thumbSize.width-props.thumbTouchSize.width)/2,
touchOverflowSize.height/2+
(state.containerSize.height-props.thumbTouchSize.height)/2,
props.thumbTouchSize.width,
props.thumbTouchSize.height);

};this.

_renderDebugThumbTouchRect=function(thumbLeft){
var thumbTouchRect=_this2._getThumbTouchRect();
var positionStyle={
left:thumbLeft,
top:thumbTouchRect.y,
width:thumbTouchRect.width,
height:thumbTouchRect.height};


return(
_react2.default.createElement(_reactNative.Animated.View,{
style:[defaultStyles.debugThumbTouchArea,positionStyle],
pointerEvents:'none',__source:{fileName:_jsxFileName,lineNumber:630}}));


};this.

_renderThumbText=function(){var _props2=
_this2.props,thumbText=_props2.thumbText,thumbTextStyle=_props2.thumbTextStyle;

if(!thumbText)return;
return(
_react2.default.createElement(_reactNative.Text,{style:[defaultStyles.thumbText,thumbTextStyle],__source:{fileName:_jsxFileName,lineNumber:642}},thumbText));

};this.

_renderThumbImage=function(){var
thumbImage=_this2.props.thumbImage;

if(!thumbImage)return;

return _react2.default.createElement(_reactNative.Image,{source:thumbImage,__source:{fileName:_jsxFileName,lineNumber:651}});
};this.

_renderGraduations=function(mainStyles,valueVisibleStyle){var _props3=
_this2.props,graduations=_props3.graduations,maximumTrackTintColor=_props3.maximumTrackTintColor,graduationStyle=_props3.graduationStyle;var _state3=
_this2.state,trackSize=_state3.trackSize,graduationSize=_state3.graduationSize;

if(graduations<=1)return;

return(
[].concat(_toConsumableArray(Array(graduations))).map(function(x,i){return(
_react2.default.createElement(_reactNative.Animated.View,{
key:i,
onLayout:_this2._measureGraduations,
style:[
{
backgroundColor:maximumTrackTintColor,
marginTop:-(trackSize.height+graduationSize.height)/2},

mainStyles.graduation,graduationStyle,_extends({
left:_this2._getGraduationOffset(i)},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:662}}));}));




};};exports.default=Slider;


var defaultStyles=_reactNative.StyleSheet.create({
container:{
height:40,
justifyContent:'center'},

track:{
height:TRACK_SIZE,
borderRadius:TRACK_SIZE/2},

thumb:{
position:'absolute',
width:THUMB_SIZE,
height:THUMB_SIZE,
borderRadius:THUMB_SIZE/2},

touchArea:{
position:'absolute',
backgroundColor:'transparent',
top:0,
left:0,
right:0,
bottom:0},

debugThumbTouchArea:{
position:'absolute',
backgroundColor:'green',
opacity:0.5},

thumbText:{
color:'white',
fontSize:10},

graduation:{
position:'absolute',
height:GRADUATION_HEIGHT,
width:GRADUATION_WIDTH}});
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _dragula = __webpack_require__(/*! dragula */ 1);
	
	var _dragula2 = _interopRequireDefault(_dragula);
	
	__webpack_require__(/*! css/dragula.css */ 13);
	
	var _mainMenu = __webpack_require__(/*! ./dashboard/mainMenu */ 17);
	
	var _mainMenu2 = _interopRequireDefault(_mainMenu);
	
	var _favourMenu = __webpack_require__(/*! ./dashboard/favourMenu */ 40);
	
	var _favourMenu2 = _interopRequireDefault(_favourMenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//拖拽控件初始化
	var tabframe = $('#commonTab').bootstrapDynamicTabs();
	
	//常用菜单
	var myFavourMenu = new _favourMenu2.default();
	var mainMenu = new _mainMenu2.default(tabframe, myFavourMenu);
	mainMenu.initMenu();

/***/ }),
/* 1 */
/*!*************************************!*\
  !*** ./~/.3.7.2@dragula/dragula.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var emitter = __webpack_require__(/*! contra/emitter */ 2);
	var crossvent = __webpack_require__(/*! crossvent */ 9);
	var classes = __webpack_require__(/*! ./classes */ 12);
	var doc = document;
	var documentElement = doc.documentElement;
	
	function dragula (initialContainers, options) {
	  var len = arguments.length;
	  if (len === 1 && Array.isArray(initialContainers) === false) {
	    options = initialContainers;
	    initialContainers = [];
	  }
	  var _mirror; // mirror image
	  var _source; // source container
	  var _item; // item being dragged
	  var _offsetX; // reference x
	  var _offsetY; // reference y
	  var _moveX; // reference move x
	  var _moveY; // reference move y
	  var _initialSibling; // reference sibling when grabbed
	  var _currentSibling; // reference sibling now
	  var _copy; // item used for copying
	  var _renderTimer; // timer for setTimeout renderMirrorImage
	  var _lastDropTarget = null; // last container item was over
	  var _grabbed; // holds mousedown context until first mousemove
	
	  var o = options || {};
	  if (o.moves === void 0) { o.moves = always; }
	  if (o.accepts === void 0) { o.accepts = always; }
	  if (o.invalid === void 0) { o.invalid = invalidTarget; }
	  if (o.containers === void 0) { o.containers = initialContainers || []; }
	  if (o.isContainer === void 0) { o.isContainer = never; }
	  if (o.copy === void 0) { o.copy = false; }
	  if (o.copySortSource === void 0) { o.copySortSource = false; }
	  if (o.revertOnSpill === void 0) { o.revertOnSpill = false; }
	  if (o.removeOnSpill === void 0) { o.removeOnSpill = false; }
	  if (o.direction === void 0) { o.direction = 'vertical'; }
	  if (o.ignoreInputTextSelection === void 0) { o.ignoreInputTextSelection = true; }
	  if (o.mirrorContainer === void 0) { o.mirrorContainer = doc.body; }
	
	  var drake = emitter({
	    containers: o.containers,
	    start: manualStart,
	    end: end,
	    cancel: cancel,
	    remove: remove,
	    destroy: destroy,
	    canMove: canMove,
	    dragging: false
	  });
	
	  if (o.removeOnSpill === true) {
	    drake.on('over', spillOver).on('out', spillOut);
	  }
	
	  events();
	
	  return drake;
	
	  function isContainer (el) {
	    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
	  }
	
	  function events (remove) {
	    var op = remove ? 'remove' : 'add';
	    touchy(documentElement, op, 'mousedown', grab);
	    touchy(documentElement, op, 'mouseup', release);
	  }
	
	  function eventualMovements (remove) {
	    var op = remove ? 'remove' : 'add';
	    touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
	  }
	
	  function movements (remove) {
	    var op = remove ? 'remove' : 'add';
	    crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
	    crossvent[op](documentElement, 'click', preventGrabbed);
	  }
	
	  function destroy () {
	    events(true);
	    release({});
	  }
	
	  function preventGrabbed (e) {
	    if (_grabbed) {
	      e.preventDefault();
	    }
	  }
	
	  function grab (e) {
	    _moveX = e.clientX;
	    _moveY = e.clientY;
	
	    var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
	    if (ignore) {
	      return; // we only care about honest-to-god left clicks and touch events
	    }
	    var item = e.target;
	    var context = canStart(item);
	    if (!context) {
	      return;
	    }
	    _grabbed = context;
	    eventualMovements();
	    if (e.type === 'mousedown') {
	      if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
	        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
	      } else {
	        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
	      }
	    }
	  }
	
	  function startBecauseMouseMoved (e) {
	    if (!_grabbed) {
	      return;
	    }
	    if (whichMouseButton(e) === 0) {
	      release({});
	      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
	    }
	    // truthy check fixes #239, equality fixes #207
	    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
	      return;
	    }
	    if (o.ignoreInputTextSelection) {
	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
	      if (isInput(elementBehindCursor)) {
	        return;
	      }
	    }
	
	    var grabbed = _grabbed; // call to end() unsets _grabbed
	    eventualMovements(true);
	    movements();
	    end();
	    start(grabbed);
	
	    var offset = getOffset(_item);
	    _offsetX = getCoord('pageX', e) - offset.left;
	    _offsetY = getCoord('pageY', e) - offset.top;
	
	    classes.add(_copy || _item, 'gu-transit');
	    renderMirrorImage();
	    drag(e);
	  }
	
	  function canStart (item) {
	    if (drake.dragging && _mirror) {
	      return;
	    }
	    if (isContainer(item)) {
	      return; // don't drag container itself
	    }
	    var handle = item;
	    while (getParent(item) && isContainer(getParent(item)) === false) {
	      if (o.invalid(item, handle)) {
	        return;
	      }
	      item = getParent(item); // drag target should be a top element
	      if (!item) {
	        return;
	      }
	    }
	    var source = getParent(item);
	    if (!source) {
	      return;
	    }
	    if (o.invalid(item, handle)) {
	      return;
	    }
	
	    var movable = o.moves(item, source, handle, nextEl(item));
	    if (!movable) {
	      return;
	    }
	
	    return {
	      item: item,
	      source: source
	    };
	  }
	
	  function canMove (item) {
	    return !!canStart(item);
	  }
	
	  function manualStart (item) {
	    var context = canStart(item);
	    if (context) {
	      start(context);
	    }
	  }
	
	  function start (context) {
	    if (isCopy(context.item, context.source)) {
	      _copy = context.item.cloneNode(true);
	      drake.emit('cloned', _copy, context.item, 'copy');
	    }
	
	    _source = context.source;
	    _item = context.item;
	    _initialSibling = _currentSibling = nextEl(context.item);
	
	    drake.dragging = true;
	    drake.emit('drag', _item, _source);
	  }
	
	  function invalidTarget () {
	    return false;
	  }
	
	  function end () {
	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    drop(item, getParent(item));
	  }
	
	  function ungrab () {
	    _grabbed = false;
	    eventualMovements(true);
	    movements(true);
	  }
	
	  function release (e) {
	    ungrab();
	
	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    var clientX = getCoord('clientX', e);
	    var clientY = getCoord('clientY', e);
	    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	    if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
	      drop(item, dropTarget);
	    } else if (o.removeOnSpill) {
	      remove();
	    } else {
	      cancel();
	    }
	  }
	
	  function drop (item, target) {
	    var parent = getParent(item);
	    if (_copy && o.copySortSource && target === _source) {
	      parent.removeChild(_item);
	    }
	    if (isInitialPlacement(target)) {
	      drake.emit('cancel', item, _source, _source);
	    } else {
	      drake.emit('drop', item, target, _source, _currentSibling);
	    }
	    cleanup();
	  }
	
	  function remove () {
	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    var parent = getParent(item);
	    if (parent) {
	      parent.removeChild(item);
	    }
	    drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
	    cleanup();
	  }
	
	  function cancel (revert) {
	    if (!drake.dragging) {
	      return;
	    }
	    var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
	    var item = _copy || _item;
	    var parent = getParent(item);
	    var initial = isInitialPlacement(parent);
	    if (initial === false && reverts) {
	      if (_copy) {
	        if (parent) {
	          parent.removeChild(_copy);
	        }
	      } else {
	        _source.insertBefore(item, _initialSibling);
	      }
	    }
	    if (initial || reverts) {
	      drake.emit('cancel', item, _source, _source);
	    } else {
	      drake.emit('drop', item, parent, _source, _currentSibling);
	    }
	    cleanup();
	  }
	
	  function cleanup () {
	    var item = _copy || _item;
	    ungrab();
	    removeMirrorImage();
	    if (item) {
	      classes.rm(item, 'gu-transit');
	    }
	    if (_renderTimer) {
	      clearTimeout(_renderTimer);
	    }
	    drake.dragging = false;
	    if (_lastDropTarget) {
	      drake.emit('out', item, _lastDropTarget, _source);
	    }
	    drake.emit('dragend', item);
	    _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
	  }
	
	  function isInitialPlacement (target, s) {
	    var sibling;
	    if (s !== void 0) {
	      sibling = s;
	    } else if (_mirror) {
	      sibling = _currentSibling;
	    } else {
	      sibling = nextEl(_copy || _item);
	    }
	    return target === _source && sibling === _initialSibling;
	  }
	
	  function findDropTarget (elementBehindCursor, clientX, clientY) {
	    var target = elementBehindCursor;
	    while (target && !accepted()) {
	      target = getParent(target);
	    }
	    return target;
	
	    function accepted () {
	      var droppable = isContainer(target);
	      if (droppable === false) {
	        return false;
	      }
	
	      var immediate = getImmediateChild(target, elementBehindCursor);
	      var reference = getReference(target, immediate, clientX, clientY);
	      var initial = isInitialPlacement(target, reference);
	      if (initial) {
	        return true; // should always be able to drop it right back where it was
	      }
	      return o.accepts(_item, target, _source, reference);
	    }
	  }
	
	  function drag (e) {
	    if (!_mirror) {
	      return;
	    }
	    e.preventDefault();
	
	    var clientX = getCoord('clientX', e);
	    var clientY = getCoord('clientY', e);
	    var x = clientX - _offsetX;
	    var y = clientY - _offsetY;
	
	    _mirror.style.left = x + 'px';
	    _mirror.style.top = y + 'px';
	
	    var item = _copy || _item;
	    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	    var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
	    if (changed || dropTarget === null) {
	      out();
	      _lastDropTarget = dropTarget;
	      over();
	    }
	    var parent = getParent(item);
	    if (dropTarget === _source && _copy && !o.copySortSource) {
	      if (parent) {
	        parent.removeChild(item);
	      }
	      return;
	    }
	    var reference;
	    var immediate = getImmediateChild(dropTarget, elementBehindCursor);
	    if (immediate !== null) {
	      reference = getReference(dropTarget, immediate, clientX, clientY);
	    } else if (o.revertOnSpill === true && !_copy) {
	      reference = _initialSibling;
	      dropTarget = _source;
	    } else {
	      if (_copy && parent) {
	        parent.removeChild(item);
	      }
	      return;
	    }
	    if (
	      (reference === null && changed) ||
	      reference !== item &&
	      reference !== nextEl(item)
	    ) {
	      _currentSibling = reference;
	      dropTarget.insertBefore(item, reference);
	      drake.emit('shadow', item, dropTarget, _source);
	    }
	    function moved (type) { drake.emit(type, item, _lastDropTarget, _source); }
	    function over () { if (changed) { moved('over'); } }
	    function out () { if (_lastDropTarget) { moved('out'); } }
	  }
	
	  function spillOver (el) {
	    classes.rm(el, 'gu-hide');
	  }
	
	  function spillOut (el) {
	    if (drake.dragging) { classes.add(el, 'gu-hide'); }
	  }
	
	  function renderMirrorImage () {
	    if (_mirror) {
	      return;
	    }
	    var rect = _item.getBoundingClientRect();
	    _mirror = _item.cloneNode(true);
	    _mirror.style.width = getRectWidth(rect) + 'px';
	    _mirror.style.height = getRectHeight(rect) + 'px';
	    classes.rm(_mirror, 'gu-transit');
	    classes.add(_mirror, 'gu-mirror');
	    o.mirrorContainer.appendChild(_mirror);
	    touchy(documentElement, 'add', 'mousemove', drag);
	    classes.add(o.mirrorContainer, 'gu-unselectable');
	    drake.emit('cloned', _mirror, _item, 'mirror');
	  }
	
	  function removeMirrorImage () {
	    if (_mirror) {
	      classes.rm(o.mirrorContainer, 'gu-unselectable');
	      touchy(documentElement, 'remove', 'mousemove', drag);
	      getParent(_mirror).removeChild(_mirror);
	      _mirror = null;
	    }
	  }
	
	  function getImmediateChild (dropTarget, target) {
	    var immediate = target;
	    while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
	      immediate = getParent(immediate);
	    }
	    if (immediate === documentElement) {
	      return null;
	    }
	    return immediate;
	  }
	
	  function getReference (dropTarget, target, x, y) {
	    var horizontal = o.direction === 'horizontal';
	    var reference = target !== dropTarget ? inside() : outside();
	    return reference;
	
	    function outside () { // slower, but able to figure out any position
	      var len = dropTarget.children.length;
	      var i;
	      var el;
	      var rect;
	      for (i = 0; i < len; i++) {
	        el = dropTarget.children[i];
	        rect = el.getBoundingClientRect();
	        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
	        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
	      }
	      return null;
	    }
	
	    function inside () { // faster, but only available if dropped inside a child element
	      var rect = target.getBoundingClientRect();
	      if (horizontal) {
	        return resolve(x > rect.left + getRectWidth(rect) / 2);
	      }
	      return resolve(y > rect.top + getRectHeight(rect) / 2);
	    }
	
	    function resolve (after) {
	      return after ? nextEl(target) : target;
	    }
	  }
	
	  function isCopy (item, container) {
	    return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
	  }
	}
	
	function touchy (el, op, type, fn) {
	  var touch = {
	    mouseup: 'touchend',
	    mousedown: 'touchstart',
	    mousemove: 'touchmove'
	  };
	  var pointers = {
	    mouseup: 'pointerup',
	    mousedown: 'pointerdown',
	    mousemove: 'pointermove'
	  };
	  var microsoft = {
	    mouseup: 'MSPointerUp',
	    mousedown: 'MSPointerDown',
	    mousemove: 'MSPointerMove'
	  };
	  if (global.navigator.pointerEnabled) {
	    crossvent[op](el, pointers[type], fn);
	  } else if (global.navigator.msPointerEnabled) {
	    crossvent[op](el, microsoft[type], fn);
	  } else {
	    crossvent[op](el, touch[type], fn);
	    crossvent[op](el, type, fn);
	  }
	}
	
	function whichMouseButton (e) {
	  if (e.touches !== void 0) { return e.touches.length; }
	  if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
	  if (e.buttons !== void 0) { return e.buttons; }
	  var button = e.button;
	  if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
	    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
	  }
	}
	
	function getOffset (el) {
	  var rect = el.getBoundingClientRect();
	  return {
	    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
	    top: rect.top + getScroll('scrollTop', 'pageYOffset')
	  };
	}
	
	function getScroll (scrollProp, offsetProp) {
	  if (typeof global[offsetProp] !== 'undefined') {
	    return global[offsetProp];
	  }
	  if (documentElement.clientHeight) {
	    return documentElement[scrollProp];
	  }
	  return doc.body[scrollProp];
	}
	
	function getElementBehindPoint (point, x, y) {
	  var p = point || {};
	  var state = p.className;
	  var el;
	  p.className += ' gu-hide';
	  el = doc.elementFromPoint(x, y);
	  p.className = state;
	  return el;
	}
	
	function never () { return false; }
	function always () { return true; }
	function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
	function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
	function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
	function isInput (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
	function isEditable (el) {
	  if (!el) { return false; } // no parents were editable
	  if (el.contentEditable === 'false') { return false; } // stop the lookup
	  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
	  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
	}
	
	function nextEl (el) {
	  return el.nextElementSibling || manually();
	  function manually () {
	    var sibling = el;
	    do {
	      sibling = sibling.nextSibling;
	    } while (sibling && sibling.nodeType !== 1);
	    return sibling;
	  }
	}
	
	function getEventHost (e) {
	  // on touchend event, we have to use `e.changedTouches`
	  // see http://stackoverflow.com/questions/7192563/touchend-event-properties
	  // see https://github.com/bevacqua/dragula/issues/34
	  if (e.targetTouches && e.targetTouches.length) {
	    return e.targetTouches[0];
	  }
	  if (e.changedTouches && e.changedTouches.length) {
	    return e.changedTouches[0];
	  }
	  return e;
	}
	
	function getCoord (coord, e) {
	  var host = getEventHost(e);
	  var missMap = {
	    pageX: 'clientX', // IE8
	    pageY: 'clientY' // IE8
	  };
	  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
	    coord = missMap[coord];
	  }
	  return host[coord];
	}
	
	module.exports = dragula;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 2 */
/*!************************************!*\
  !*** ./~/.1.9.4@contra/emitter.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var atoa = __webpack_require__(/*! atoa */ 3);
	var debounce = __webpack_require__(/*! ./debounce */ 4);
	
	module.exports = function emitter (thing, options) {
	  var opts = options || {};
	  var evt = {};
	  if (thing === undefined) { thing = {}; }
	  thing.on = function (type, fn) {
	    if (!evt[type]) {
	      evt[type] = [fn];
	    } else {
	      evt[type].push(fn);
	    }
	    return thing;
	  };
	  thing.once = function (type, fn) {
	    fn._once = true; // thing.off(fn) still works!
	    thing.on(type, fn);
	    return thing;
	  };
	  thing.off = function (type, fn) {
	    var c = arguments.length;
	    if (c === 1) {
	      delete evt[type];
	    } else if (c === 0) {
	      evt = {};
	    } else {
	      var et = evt[type];
	      if (!et) { return thing; }
	      et.splice(et.indexOf(fn), 1);
	    }
	    return thing;
	  };
	  thing.emit = function () {
	    var args = atoa(arguments);
	    return thing.emitterSnapshot(args.shift()).apply(this, args);
	  };
	  thing.emitterSnapshot = function (type) {
	    var et = (evt[type] || []).slice(0);
	    return function () {
	      var args = atoa(arguments);
	      var ctx = this || thing;
	      if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
	      et.forEach(function emitter (listen) {
	        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
	        if (listen._once) { thing.off(type, listen); }
	      });
	      return thing;
	    };
	  };
	  return thing;
	};


/***/ }),
/* 3 */
/*!*******************************!*\
  !*** ./~/.1.0.0@atoa/atoa.js ***!
  \*******************************/
/***/ (function(module, exports) {

	module.exports = function atoa (a, n) { return Array.prototype.slice.call(a, n); }


/***/ }),
/* 4 */
/*!*************************************!*\
  !*** ./~/.1.9.4@contra/debounce.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var ticky = __webpack_require__(/*! ticky */ 5);
	
	module.exports = function debounce (fn, args, ctx) {
	  if (!fn) { return; }
	  ticky(function run () {
	    fn.apply(ctx || null, args || []);
	  });
	};


/***/ }),
/* 5 */
/*!*****************************************!*\
  !*** ./~/.1.0.1@ticky/ticky-browser.js ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {var si = typeof setImmediate === 'function', tick;
	if (si) {
	  tick = function (fn) { setImmediate(fn); };
	} else {
	  tick = function (fn) { setTimeout(fn, 0); };
	}
	
	module.exports = tick;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../.2.0.2@timers-browserify/main.js */ 6).setImmediate))

/***/ }),
/* 6 */
/*!********************************************!*\
  !*** ./~/.2.0.2@timers-browserify/main.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// setimmediate attaches itself to the global object
	__webpack_require__(/*! setimmediate */ 7);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }),
/* 7 */
/*!***********************************************!*\
  !*** ./~/.1.0.5@setimmediate/setImmediate.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";
	
	    if (global.setImmediate) {
	        return;
	    }
	
	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;
	
	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }
	
	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }
	
	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }
	
	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }
	
	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }
	
	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }
	
	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	
	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };
	
	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }
	
	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }
	
	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };
	
	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }
	
	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }
	
	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }
	
	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
	
	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }
	
	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(/*! ./../.0.11.10@process/browser.js */ 8)))

/***/ }),
/* 8 */
/*!***************************************!*\
  !*** ./~/.0.11.10@process/browser.js ***!
  \***************************************/
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 9 */
/*!*********************************************!*\
  !*** ./~/.1.5.4@crossvent/src/crossvent.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var customEvent = __webpack_require__(/*! custom-event */ 10);
	var eventmap = __webpack_require__(/*! ./eventmap */ 11);
	var doc = global.document;
	var addEvent = addEventEasy;
	var removeEvent = removeEventEasy;
	var hardCache = [];
	
	if (!global.addEventListener) {
	  addEvent = addEventHard;
	  removeEvent = removeEventHard;
	}
	
	module.exports = {
	  add: addEvent,
	  remove: removeEvent,
	  fabricate: fabricateEvent
	};
	
	function addEventEasy (el, type, fn, capturing) {
	  return el.addEventListener(type, fn, capturing);
	}
	
	function addEventHard (el, type, fn) {
	  return el.attachEvent('on' + type, wrap(el, type, fn));
	}
	
	function removeEventEasy (el, type, fn, capturing) {
	  return el.removeEventListener(type, fn, capturing);
	}
	
	function removeEventHard (el, type, fn) {
	  var listener = unwrap(el, type, fn);
	  if (listener) {
	    return el.detachEvent('on' + type, listener);
	  }
	}
	
	function fabricateEvent (el, type, model) {
	  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
	  if (el.dispatchEvent) {
	    el.dispatchEvent(e);
	  } else {
	    el.fireEvent('on' + type, e);
	  }
	  function makeClassicEvent () {
	    var e;
	    if (doc.createEvent) {
	      e = doc.createEvent('Event');
	      e.initEvent(type, true, true);
	    } else if (doc.createEventObject) {
	      e = doc.createEventObject();
	    }
	    return e;
	  }
	  function makeCustomEvent () {
	    return new customEvent(type, { detail: model });
	  }
	}
	
	function wrapperFactory (el, type, fn) {
	  return function wrapper (originalEvent) {
	    var e = originalEvent || global.event;
	    e.target = e.target || e.srcElement;
	    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
	    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
	    e.which = e.which || e.keyCode;
	    fn.call(el, e);
	  };
	}
	
	function wrap (el, type, fn) {
	  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
	  hardCache.push({
	    wrapper: wrapper,
	    element: el,
	    type: type,
	    fn: fn
	  });
	  return wrapper;
	}
	
	function unwrap (el, type, fn) {
	  var i = find(el, type, fn);
	  if (i) {
	    var wrapper = hardCache[i].wrapper;
	    hardCache.splice(i, 1); // free up a tad of memory
	    return wrapper;
	  }
	}
	
	function find (el, type, fn) {
	  var i, item;
	  for (i = 0; i < hardCache.length; i++) {
	    item = hardCache[i];
	    if (item.element === el && item.type === type && item.fn === fn) {
	      return i;
	    }
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 10 */
/*!****************************************!*\
  !*** ./~/.1.0.0@custom-event/index.js ***!
  \****************************************/
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var NativeCustomEvent = global.CustomEvent;
	
	function useNative () {
	  try {
	    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
	    return  'cat' === p.type && 'bar' === p.detail.foo;
	  } catch (e) {
	  }
	  return false;
	}
	
	/**
	 * Cross-browser `CustomEvent` constructor.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
	 *
	 * @public
	 */
	
	module.exports = useNative() ? NativeCustomEvent :
	
	// IE >= 9
	'function' === typeof document.createEvent ? function CustomEvent (type, params) {
	  var e = document.createEvent('CustomEvent');
	  if (params) {
	    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
	  } else {
	    e.initCustomEvent(type, false, false, void 0);
	  }
	  return e;
	} :
	
	// IE <= 8
	function CustomEvent (type, params) {
	  var e = document.createEventObject();
	  e.type = type;
	  if (params) {
	    e.bubbles = Boolean(params.bubbles);
	    e.cancelable = Boolean(params.cancelable);
	    e.detail = params.detail;
	  } else {
	    e.bubbles = false;
	    e.cancelable = false;
	    e.detail = void 0;
	  }
	  return e;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 11 */
/*!********************************************!*\
  !*** ./~/.1.5.4@crossvent/src/eventmap.js ***!
  \********************************************/
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var eventmap = [];
	var eventname = '';
	var ron = /^on/;
	
	for (eventname in global) {
	  if (ron.test(eventname)) {
	    eventmap.push(eventname.slice(2));
	  }
	}
	
	module.exports = eventmap;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 12 */
/*!*************************************!*\
  !*** ./~/.3.7.2@dragula/classes.js ***!
  \*************************************/
/***/ (function(module, exports) {

	'use strict';
	
	var cache = {};
	var start = '(?:^|\\s)';
	var end = '(?:\\s|$)';
	
	function lookupClass (className) {
	  var cached = cache[className];
	  if (cached) {
	    cached.lastIndex = 0;
	  } else {
	    cache[className] = cached = new RegExp(start + className + end, 'g');
	  }
	  return cached;
	}
	
	function addClass (el, className) {
	  var current = el.className;
	  if (!current.length) {
	    el.className = className;
	  } else if (!lookupClass(className).test(current)) {
	    el.className += ' ' + className;
	  }
	}
	
	function rmClass (el, className) {
	  el.className = el.className.replace(lookupClass(className), ' ').trim();
	}
	
	module.exports = {
	  add: addClass,
	  rm: rmClass
	};


/***/ }),
/* 13 */
/*!*************************!*\
  !*** ./css/dragula.css ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !../~/.0.23.1@css-loader!./dragula.css */ 14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ../~/.0.13.2@style-loader/addStyles.js */ 16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/.0.23.1@css-loader/index.js!./dragula.css", function() {
				var newContent = require("!!../node_modules/.0.23.1@css-loader/index.js!./dragula.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 14 */
/*!************************************************!*\
  !*** ./~/.0.23.1@css-loader!./css/dragula.css ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ../~/.0.23.1@css-loader/lib/css-base.js */ 15)();
	// imports
	
	
	// module
	exports.push([module.id, ".gu-mirror {\n  position: fixed !important;\n  margin: 0 !important;\n  z-index: 9999 !important;\n  opacity: 0.8;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";\n  filter: alpha(opacity=80);\n}\n.gu-hide {\n  display: none !important;\n}\n.gu-unselectable {\n  -webkit-user-select: none !important;\n  -moz-user-select: none !important;\n  -ms-user-select: none !important;\n  user-select: none !important;\n}\n.gu-transit {\n  opacity: 0.5;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";\n  filter: alpha(opacity=20);\n}\n", ""]);
	
	// exports


/***/ }),
/* 15 */
/*!**********************************************!*\
  !*** ./~/.0.23.1@css-loader/lib/css-base.js ***!
  \**********************************************/
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 16 */
/*!*********************************************!*\
  !*** ./~/.0.13.2@style-loader/addStyles.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 17 */
/*!**********************************!*\
  !*** ./js/dashboard/mainMenu.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _underscore = __webpack_require__(/*! underscore */ 18);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _vue = __webpack_require__(/*! vue */ 19);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _mainMenu = __webpack_require__(/*! vueModel/mainMenu.vue */ 20);
	
	var _mainMenu2 = _interopRequireDefault(_mainMenu);
	
	var _modal = __webpack_require__(/*! vueModel/modal.vue */ 23);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	var _dashboard = __webpack_require__(/*! ./dashboard */ 33);
	
	var _dashboard2 = _interopRequireDefault(_dashboard);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MainMenu = function () {
	  function MainMenu(tabsFrame, favourMenu) {
	    _classCallCheck(this, MainMenu);
	
	    _underscore2.default.extend(this, { tabsFrame: tabsFrame, favourMenu: favourMenu });
	  }
	
	  _createClass(MainMenu, [{
	    key: 'initMenu',
	    value: function initMenu() {
	      var me = this;
	      new _vue2.default({
	        el: '#mainMenu',
	        components: {
	          mainMenu: _mainMenu2.default
	        },
	        ready: function ready() {
	          var that = this;
	          that.$set('classflag', true);
	          // 模拟AJAX
	
	          that.getNewMenu(that);
	        },
	
	        events: {
	          onMenuClick: function onMenuClick(groupMenu) {
	
	            //setup1: 根据groupId拿到对应的menuTab, 目前只支持一个tab
	            var tabDomId = 'groupId-' + groupMenu.GROUP_ID + '-tabs-t1';
	            me.tabsFrame.addTab({
	              title: groupMenu.GROUP_NAME,
	              html: '<div id="' + tabDomId + '"><items-box :left-links="pleftLinks", :right-links="prightLinks", :tab-id="ptabId"></items-box></div>',
	              closable: true,
	              id: '"' + tabDomId + '"'
	            });
	            this.initNewTab(tabDomId, "t1", groupMenu.GROUP_ID);
	
	            // kjdpAjax.post({
	            //         req: {
	            //           service: 'Y3000001',
	            //           LBM:'bexSelectOPP_MENU_TAB',
	            //           GROUP_ID:groupMenu.GROUP_ID
	            //         }
	            // }).then((data) => {
	
	            // //setup2: 根据拿到的menuTab list,初始化每一个tab
	
	
	            // const tabDomId = `groupId-${groupMenu.GROUP_ID}-tabs-${data[0][0].TAB_ID}`;
	            // me.tabsFrame.addTab({
	            //     title: groupMenu.GROUP_NAME,
	            //     html: `<div id="${tabDomId}"><items-box :left-links="pleftLinks", :right-links="prightLinks", :tab-id="ptabId"></items-box></div>`,
	            //     closable: true
	            //   });
	            //   this.initNewTab(tabDomId, data[0][0].TAB_ID,groupMenu.GROUP_ID);
	
	            // });
	
	          },
	          setNewMenu: function setNewMenu(newMenu, scope) {
	            var _this = this;
	
	            //添加菜单后，新建的tab不能点击添加弹出模态框
	            console.log(scope);
	            var that = this;
	            if (newMenu == '') {
	              alert('请输入菜单名称!');
	              setTimeout(function () {
	                _this.$el.querySelector('.addMenuSty').focus();
	              }, 500);
	              return;
	            }
	            //kjdpAjax.post({
	            //  req: {
	            //    service: 'Y3000001',
	            //    LBM:'bexInsertOPP_GROUP_MENU',
	            //    PARENT_ID:'0',
	            //    ICON_CLS:'',
	            //    GROUP_NAME:newMenu
	            //  }
	            //}).then((data) => {
	            //  if(data){
	            //  scope.$set('addflag',true);
	            //  that.getNewMenu(that);
	            //  }
	            //});
	          }
	        },
	        methods: {
	          initNewTab: function initNewTab(tabDomId, dbTabId, groupId) {
	            var dashboard = new _dashboard2.default(tabDomId).initPage(tabDomId, dbTabId, groupId);
	            dashboard.$on('onLinkClick', function (linkInfo) {
	              // save the favours data
	              console.log(me.favourMenu.inst.$data.pfavourlist[0].menuName);
	            });
	          },
	          getNewMenu: function getNewMenu(scope) {
	
	            var data = {
	              "leftMenu": [{ "GROUP_ID": "g1", "GROUP_NAME": "标签页一", "ICON_CLS": "icon_01" }, { "GROUP_ID": "g2", "GROUP_NAME": "标签页二", "ICON_CLS": "icon_02" }, { "GROUP_ID": "g3", "GROUP_NAME": "标签页三", "ICON_CLS": "icon_01" }, { "GROUP_ID": "g4", "GROUP_NAME": "标签页四", "ICON_CLS": "icon_02" }] };
	
	            var menusData = [];
	            $.each(data.leftMenu, function (index, item) {
	              menusData.push({ GROUP_NAME: item.GROUP_NAME, GROUP_ID: item.GROUP_ID, ICON_CLS: item.ICON_CLS });
	            });
	
	            scope.$set('pmenus', menusData);
	
	            // kjdpAjax.post({
	            //         req: {
	            //           service: 'Y3000001',
	            //           LBM:'bexSelectOPP_GROUP_MENU',
	            //           PARENT_ID:'0'
	            //         }
	            // }).then((data) => {
	            //       const menusData=[];
	            //       $.each(data[0],(index,item)=>{
	            //         menusData.push({GROUP_NAME:item.GROUP_NAME,GROUP_ID:item.GROUP_ID,ICON_CLS:item.ICON_CLS});
	            //       })
	
	            //       scope.$set('pmenus', menusData);
	
	            //  });
	          }
	        },
	        data: function data() {
	          return {
	            pboardId: { GROUP_ID: '', GROUP_NAME: '' }
	          };
	        },
	        init: function init() {
	          me.favourMenu.initMenu();
	        }
	      });
	    }
	  }, {
	    key: 'vueStrap',
	    value: function vueStrap() {
	      // :TODO
	    }
	  }]);
	
	  return MainMenu;
	}();
	
	exports.default = MainMenu;

/***/ }),
/* 18 */
/*!*******************************************!*\
  !*** ./~/.1.8.3@underscore/underscore.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }),
/* 19 */
/*!******************************************!*\
  !*** ./~/.1.0.17@vue/dist/vue.common.js ***!
  \******************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/*!
	 * Vue.js v1.0.17
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	'use strict';
	
	function set(obj, key, val) {
	  if (hasOwn(obj, key)) {
	    obj[key] = val;
	    return;
	  }
	  if (obj._isVue) {
	    set(obj._data, key, val);
	    return;
	  }
	  var ob = obj.__ob__;
	  if (!ob) {
	    obj[key] = val;
	    return;
	  }
	  ob.convert(key, val);
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._proxy(key);
	      vm._digest();
	    }
	  }
	  return val;
	}
	
	/**
	 * Delete a property and trigger change if necessary.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 */
	
	function del(obj, key) {
	  if (!hasOwn(obj, key)) {
	    return;
	  }
	  delete obj[key];
	  var ob = obj.__ob__;
	  if (!ob) {
	    return;
	  }
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._unproxy(key);
	      vm._digest();
	    }
	  }
	}
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	 * Check whether the object has the property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Boolean}
	 */
	
	function hasOwn(obj, key) {
	  return hasOwnProperty.call(obj, key);
	}
	
	/**
	 * Check if an expression is a literal value.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
	
	function isLiteral(exp) {
	  return literalValueRE.test(exp);
	}
	
	/**
	 * Check if a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */
	
	function isReserved(str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F;
	}
	
	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */
	
	function _toString(value) {
	  return value == null ? '' : value.toString();
	}
	
	/**
	 * Check and convert possible numeric strings to numbers
	 * before setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */
	
	function toNumber(value) {
	  if (typeof value !== 'string') {
	    return value;
	  } else {
	    var parsed = Number(value);
	    return isNaN(parsed) ? value : parsed;
	  }
	}
	
	/**
	 * Convert string boolean literals into real booleans.
	 *
	 * @param {*} value
	 * @return {*|Boolean}
	 */
	
	function toBoolean(value) {
	  return value === 'true' ? true : value === 'false' ? false : value;
	}
	
	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */
	
	function stripQuotes(str) {
	  var a = str.charCodeAt(0);
	  var b = str.charCodeAt(str.length - 1);
	  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}
	
	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var camelizeRE = /-(\w)/g;
	
	function camelize(str) {
	  return str.replace(camelizeRE, toUpper);
	}
	
	function toUpper(_, c) {
	  return c ? c.toUpperCase() : '';
	}
	
	/**
	 * Hyphenate a camelCase string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var hyphenateRE = /([a-z\d])([A-Z])/g;
	
	function hyphenate(str) {
	  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}
	
	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var classifyRE = /(?:^|[-_\/])(\w)/g;
	
	function classify(str) {
	  return str.replace(classifyRE, toUpper);
	}
	
	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */
	
	function bind(fn, ctx) {
	  return function (a) {
	    var l = arguments.length;
	    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
	  };
	}
	
	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */
	
	function toArray(list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret;
	}
	
	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */
	
	function extend(to, from) {
	  var keys = Object.keys(from);
	  var i = keys.length;
	  while (i--) {
	    to[keys[i]] = from[keys[i]];
	  }
	  return to;
	}
	
	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	function isObject(obj) {
	  return obj !== null && typeof obj === 'object';
	}
	
	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	
	function isPlainObject(obj) {
	  return toString.call(obj) === OBJECT_STRING;
	}
	
	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * Define a non-enumerable property
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */
	
	function def(obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}
	
	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */
	
	function _debounce(func, wait) {
	  var timeout, args, context, timestamp, result;
	  var later = function later() {
	    var last = Date.now() - timestamp;
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    }
	  };
	  return function () {
	    context = this;
	    args = arguments;
	    timestamp = Date.now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	    return result;
	  };
	}
	
	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */
	
	function indexOf(arr, obj) {
	  var i = arr.length;
	  while (i--) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	}
	
	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */
	
	function cancellable(fn) {
	  var cb = function cb() {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments);
	    }
	  };
	  cb.cancel = function () {
	    cb.cancelled = true;
	  };
	  return cb;
	}
	
	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 *
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 */
	
	function looseEqual(a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
	  /* eslint-enable eqeqeq */
	}
	
	var hasProto = ('__proto__' in {});
	
	// Browser environment sniffing
	var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
	
	// detect devtools
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
	
	// UA sniffing for working around browser-specific quirks
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isAndroid = UA && UA.indexOf('android') > 0;
	
	var transitionProp = undefined;
	var transitionEndEvent = undefined;
	var animationProp = undefined;
	var animationEndEvent = undefined;
	
	// Transition property/event sniffing
	if (inBrowser && !isIE9) {
	  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
	  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
	  transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	  transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
	  animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
	  animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
	}
	
	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */
	
	var nextTick = (function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	  function nextTickHandler() {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks = [];
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }
	
	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined') {
	    var counter = 1;
	    var observer = new MutationObserver(nextTickHandler);
	    var textNode = document.createTextNode(counter);
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function () {
	      counter = (counter + 1) % 2;
	      textNode.data = counter;
	    };
	  } else {
	    // webpack attempts to inject a shim for setImmediate
	    // if it is used as a global, so we have to work around that to
	    // avoid bundling unnecessary code.
	    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
	    timerFunc = context.setImmediate || setTimeout;
	  }
	  return function (cb, ctx) {
	    var func = ctx ? function () {
	      cb.call(ctx);
	    } : cb;
	    callbacks.push(func);
	    if (pending) return;
	    pending = true;
	    timerFunc(nextTickHandler, 0);
	  };
	})();
	
	function Cache(limit) {
	  this.size = 0;
	  this.limit = limit;
	  this.head = this.tail = undefined;
	  this._keymap = Object.create(null);
	}
	
	var p = Cache.prototype;
	
	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */
	
	p.put = function (key, value) {
	  var removed;
	  if (this.size === this.limit) {
	    removed = this.shift();
	  }
	
	  var entry = this.get(key, true);
	  if (!entry) {
	    entry = {
	      key: key
	    };
	    this._keymap[key] = entry;
	    if (this.tail) {
	      this.tail.newer = entry;
	      entry.older = this.tail;
	    } else {
	      this.head = entry;
	    }
	    this.tail = entry;
	    this.size++;
	  }
	  entry.value = value;
	
	  return removed;
	};
	
	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */
	
	p.shift = function () {
	  var entry = this.head;
	  if (entry) {
	    this.head = this.head.newer;
	    this.head.older = undefined;
	    entry.newer = entry.older = undefined;
	    this._keymap[entry.key] = undefined;
	    this.size--;
	  }
	  return entry;
	};
	
	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */
	
	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key];
	  if (entry === undefined) return;
	  if (entry === this.tail) {
	    return returnEntry ? entry : entry.value;
	  }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer;
	    }
	    entry.newer.older = entry.older; // C <-- E.
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer; // C. --> E
	  }
	  entry.newer = undefined; // D --x
	  entry.older = this.tail; // D. --> E
	  if (this.tail) {
	    this.tail.newer = entry; // E. <-- D
	  }
	  this.tail = entry;
	  return returnEntry ? entry : entry.value;
	};
	
	var cache$1 = new Cache(1000);
	var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
	var reservedArgRE = /^in$|^-?\d+/;
	
	/**
	 * Parser state
	 */
	
	var str;
	var dir;
	var c;
	var prev;
	var i;
	var l;
	var lastFilterIndex;
	var inSingle;
	var inDouble;
	var curly;
	var square;
	var paren;
	/**
	 * Push a filter to the current directive object
	 */
	
	function pushFilter() {
	  var exp = str.slice(lastFilterIndex, i).trim();
	  var filter;
	  if (exp) {
	    filter = {};
	    var tokens = exp.match(filterTokenRE);
	    filter.name = tokens[0];
	    if (tokens.length > 1) {
	      filter.args = tokens.slice(1).map(processFilterArg);
	    }
	  }
	  if (filter) {
	    (dir.filters = dir.filters || []).push(filter);
	  }
	  lastFilterIndex = i + 1;
	}
	
	/**
	 * Check if an argument is dynamic and strip quotes.
	 *
	 * @param {String} arg
	 * @return {Object}
	 */
	
	function processFilterArg(arg) {
	  if (reservedArgRE.test(arg)) {
	    return {
	      value: toNumber(arg),
	      dynamic: false
	    };
	  } else {
	    var stripped = stripQuotes(arg);
	    var dynamic = stripped === arg;
	    return {
	      value: dynamic ? arg : stripped,
	      dynamic: dynamic
	    };
	  }
	}
	
	/**
	 * Parse a directive value and extract the expression
	 * and its filters into a descriptor.
	 *
	 * Example:
	 *
	 * "a + 1 | uppercase" will yield:
	 * {
	 *   expression: 'a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
	 *
	 * @param {String} str
	 * @return {Object}
	 */
	
	function parseDirective(s) {
	  var hit = cache$1.get(s);
	  if (hit) {
	    return hit;
	  }
	
	  // reset parser state
	  str = s;
	  inSingle = inDouble = false;
	  curly = square = paren = 0;
	  lastFilterIndex = 0;
	  dir = {};
	
	  for (i = 0, l = str.length; i < l; i++) {
	    prev = c;
	    c = str.charCodeAt(i);
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
	    } else if (c === 0x7C && // pipe
	    str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
	      if (dir.expression == null) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1;
	        dir.expression = str.slice(0, i).trim();
	      } else {
	        // already has filter
	        pushFilter();
	      }
	    } else {
	      switch (c) {
	        case 0x22:
	          inDouble = true;break; // "
	        case 0x27:
	          inSingle = true;break; // '
	        case 0x28:
	          paren++;break; // (
	        case 0x29:
	          paren--;break; // )
	        case 0x5B:
	          square++;break; // [
	        case 0x5D:
	          square--;break; // ]
	        case 0x7B:
	          curly++;break; // {
	        case 0x7D:
	          curly--;break; // }
	      }
	    }
	  }
	
	  if (dir.expression == null) {
	    dir.expression = str.slice(0, i).trim();
	  } else if (lastFilterIndex !== 0) {
	    pushFilter();
	  }
	
	  cache$1.put(s, dir);
	  return dir;
	}
	
	var directive = Object.freeze({
	  parseDirective: parseDirective
	});
	
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	var cache = undefined;
	var tagRE = undefined;
	var htmlRE = undefined;
	/**
	 * Escape a string so it can be used in a RegExp
	 * constructor.
	 *
	 * @param {String} str
	 */
	
	function escapeRegex(str) {
	  return str.replace(regexEscapeRE, '\\$&');
	}
	
	function compileRegex() {
	  var open = escapeRegex(config.delimiters[0]);
	  var close = escapeRegex(config.delimiters[1]);
	  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
	  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
	  tagRE = new RegExp(unsafeOpen + '(.+?)' + unsafeClose + '|' + open + '(.+?)' + close, 'g');
	  htmlRE = new RegExp('^' + unsafeOpen + '.*' + unsafeClose + '$');
	  // reset cache
	  cache = new Cache(1000);
	}
	
	/**
	 * Parse a template text string into an array of tokens.
	 *
	 * @param {String} text
	 * @return {Array<Object> | null}
	 *               - {String} type
	 *               - {String} value
	 *               - {Boolean} [html]
	 *               - {Boolean} [oneTime]
	 */
	
	function parseText(text) {
	  if (!cache) {
	    compileRegex();
	  }
	  var hit = cache.get(text);
	  if (hit) {
	    return hit;
	  }
	  text = text.replace(/\n/g, '');
	  if (!tagRE.test(text)) {
	    return null;
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, html, value, first, oneTime;
	  /* eslint-disable no-cond-assign */
	  while (match = tagRE.exec(text)) {
	    /* eslint-enable no-cond-assign */
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      });
	    }
	    // tag token
	    html = htmlRE.test(match[0]);
	    value = html ? match[1] : match[2];
	    first = value.charCodeAt(0);
	    oneTime = first === 42; // *
	    value = oneTime ? value.slice(1) : value;
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: html,
	      oneTime: oneTime
	    });
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    });
	  }
	  cache.put(text, tokens);
	  return tokens;
	}
	
	/**
	 * Format a list of tokens into an expression.
	 * e.g. tokens parsed from 'a {{b}} c' can be serialized
	 * into one single expression as '"a " + b + " c"'.
	 *
	 * @param {Array} tokens
	 * @param {Vue} [vm]
	 * @return {String}
	 */
	
	function tokensToExp(tokens, vm) {
	  if (tokens.length > 1) {
	    return tokens.map(function (token) {
	      return formatToken(token, vm);
	    }).join('+');
	  } else {
	    return formatToken(tokens[0], vm, true);
	  }
	}
	
	/**
	 * Format a single token.
	 *
	 * @param {Object} token
	 * @param {Vue} [vm]
	 * @param {Boolean} [single]
	 * @return {String}
	 */
	
	function formatToken(token, vm, single) {
	  return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
	}
	
	/**
	 * For an attribute with multiple interpolation tags,
	 * e.g. attr="some-{{thing | filter}}", in order to combine
	 * the whole thing into a single watchable expression, we
	 * have to inline those filters. This function does exactly
	 * that. This is a bit hacky but it avoids heavy changes
	 * to directive parser and watcher mechanism.
	 *
	 * @param {String} exp
	 * @param {Boolean} single
	 * @return {String}
	 */
	
	var filterRE = /[^|]\|[^|]/;
	function inlineFilters(exp, single) {
	  if (!filterRE.test(exp)) {
	    return single ? exp : '(' + exp + ')';
	  } else {
	    var dir = parseDirective(exp);
	    if (!dir.filters) {
	      return '(' + exp + ')';
	    } else {
	      return 'this._applyFilters(' + dir.expression + // value
	      ',null,' + // oldValue (null for read)
	      JSON.stringify(dir.filters) + // filter descriptors
	      ',false)'; // write?
	    }
	  }
	}
	
	var text = Object.freeze({
	  compileRegex: compileRegex,
	  parseText: parseText,
	  tokensToExp: tokensToExp
	});
	
	var delimiters = ['{{', '}}'];
	var unsafeDelimiters = ['{{{', '}}}'];
	
	var config = Object.defineProperties({
	
	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */
	
	  debug: false,
	
	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */
	
	  silent: false,
	
	  /**
	   * Whether to use async rendering.
	   */
	
	  async: true,
	
	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */
	
	  warnExpressionErrors: true,
	
	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */
	
	  _delimitersChanged: true,
	
	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */
	
	  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],
	
	  /**
	   * prop binding modes
	   */
	
	  _propBindingModes: {
	    ONE_WAY: 0,
	    TWO_WAY: 1,
	    ONE_TIME: 2
	  },
	
	  /**
	   * Max circular updates allowed in a batcher flush cycle.
	   */
	
	  _maxUpdateCount: 100
	
	}, {
	  delimiters: { /**
	                 * Interpolation delimiters. Changing these would trigger
	                 * the text parser to re-compile the regular expressions.
	                 *
	                 * @type {Array<String>}
	                 */
	
	    get: function get() {
	      return delimiters;
	    },
	    set: function set(val) {
	      delimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  },
	  unsafeDelimiters: {
	    get: function get() {
	      return unsafeDelimiters;
	    },
	    set: function set(val) {
	      unsafeDelimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  }
	});
	
	var warn = undefined;
	
	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var hasConsole = typeof console !== 'undefined';
	    warn = function (msg, e) {
	      if (hasConsole && (!config.silent || config.debug)) {
	        console.warn('[Vue warn]: ' + msg);
	        /* istanbul ignore if */
	        if (config.debug) {
	          if (e) {
	            throw e;
	          } else {
	            console.warn(new Error('Warning Stack Trace').stack);
	          }
	        }
	      }
	    };
	  })();
	}
	
	/**
	 * Append with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function appendWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    target.appendChild(el);
	  }, vm, cb);
	}
	
	/**
	 * InsertBefore with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function beforeWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    before(el, target);
	  }, vm, cb);
	}
	
	/**
	 * Remove with transition.
	 *
	 * @param {Element} el
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function removeWithTransition(el, vm, cb) {
	  applyTransition(el, -1, function () {
	    remove(el);
	  }, vm, cb);
	}
	
	/**
	 * Apply transitions with an operation callback.
	 *
	 * @param {Element} el
	 * @param {Number} direction
	 *                  1: enter
	 *                 -1: leave
	 * @param {Function} op - the actual DOM operation
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function applyTransition(el, direction, op, vm, cb) {
	  var transition = el.__v_trans;
	  if (!transition ||
	  // skip if there are no js hooks and CSS transition is
	  // not supported
	  !transition.hooks && !transitionEndEvent ||
	  // skip transitions for initial compile
	  !vm._isCompiled ||
	  // if the vm is being manipulated by a parent directive
	  // during the parent's compilation phase, skip the
	  // animation.
	  vm.$parent && !vm.$parent._isCompiled) {
	    op();
	    if (cb) cb();
	    return;
	  }
	  var action = direction > 0 ? 'enter' : 'leave';
	  transition[action](op, cb);
	}
	
	var transition = Object.freeze({
	  appendWithTransition: appendWithTransition,
	  beforeWithTransition: beforeWithTransition,
	  removeWithTransition: removeWithTransition,
	  applyTransition: applyTransition
	});
	
	/**
	 * Query an element selector if it's not an element already.
	 *
	 * @param {String|Element} el
	 * @return {Element}
	 */
	
	function query(el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + selector);
	    }
	  }
	  return el;
	}
	
	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed by doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function inDoc(node) {
	  var doc = document.documentElement;
	  var parent = node && node.parentNode;
	  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
	}
	
	/**
	 * Get and remove an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} _attr
	 */
	
	function getAttr(node, _attr) {
	  var val = node.getAttribute(_attr);
	  if (val !== null) {
	    node.removeAttribute(_attr);
	  }
	  return val;
	}
	
	/**
	 * Get an attribute with colon or v-bind: prefix.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {String|null}
	 */
	
	function getBindAttr(node, name) {
	  var val = getAttr(node, ':' + name);
	  if (val === null) {
	    val = getAttr(node, 'v-bind:' + name);
	  }
	  return val;
	}
	
	/**
	 * Check the presence of a bind attribute.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {Boolean}
	 */
	
	function hasBindAttr(node, name) {
	  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
	}
	
	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function before(el, target) {
	  target.parentNode.insertBefore(el, target);
	}
	
	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function after(el, target) {
	  if (target.nextSibling) {
	    before(el, target.nextSibling);
	  } else {
	    target.parentNode.appendChild(el);
	  }
	}
	
	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */
	
	function remove(el) {
	  el.parentNode.removeChild(el);
	}
	
	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function prepend(el, target) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    target.appendChild(el);
	  }
	}
	
	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */
	
	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}
	
	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 * @param {Boolean} [useCapture]
	 */
	
	function on(el, event, cb, useCapture) {
	  el.addEventListener(event, cb, useCapture);
	}
	
	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	function off(el, event, cb) {
	  el.removeEventListener(event, cb);
	}
	
	/**
	 * In IE9, setAttribute('class') will result in empty class
	 * if the element also has the :class attribute; However in
	 * PhantomJS, setting `className` does not work on SVG elements...
	 * So we have to do a conditional check here.
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function setClass(el, cls) {
	  /* istanbul ignore if */
	  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}
	
	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function addClass(el, cls) {
	  if (el.classList) {
	    el.classList.add(cls);
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      setClass(el, (cur + cls).trim());
	    }
	  }
	}
	
	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function removeClass(el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls);
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    setClass(el, cur.trim());
	  }
	  if (!el.className) {
	    el.removeAttribute('class');
	  }
	}
	
	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element|DocumentFragment}
	 */
	
	function extractContent(el, asFragment) {
	  var child;
	  var rawContent;
	  /* istanbul ignore if */
	  if (isTemplate(el) && isFragment(el.content)) {
	    el = el.content;
	  }
	  if (el.hasChildNodes()) {
	    trimNode(el);
	    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
	    /* eslint-disable no-cond-assign */
	    while (child = el.firstChild) {
	      /* eslint-enable no-cond-assign */
	      rawContent.appendChild(child);
	    }
	  }
	  return rawContent;
	}
	
	/**
	 * Trim possible empty head/tail text and comment
	 * nodes inside a parent.
	 *
	 * @param {Node} node
	 */
	
	function trimNode(node) {
	  var child;
	  /* eslint-disable no-sequences */
	  while ((child = node.firstChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  while ((child = node.lastChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  /* eslint-enable no-sequences */
	}
	
	function isTrimmable(node) {
	  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
	}
	
	/**
	 * Check if an element is a template tag.
	 * Note if the template appears inside an SVG its tagName
	 * will be in lowercase.
	 *
	 * @param {Element} el
	 */
	
	function isTemplate(el) {
	  return el.tagName && el.tagName.toLowerCase() === 'template';
	}
	
	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - fragment instance
	 * - v-html
	 * - v-if
	 * - v-for
	 * - component
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */
	
	function createAnchor(content, persist) {
	  var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
	  anchor.__v_anchor = true;
	  return anchor;
	}
	
	/**
	 * Find a component ref attribute that starts with $.
	 *
	 * @param {Element} node
	 * @return {String|undefined}
	 */
	
	var refRE = /^v-ref:/;
	
	function findRef(node) {
	  if (node.hasAttributes()) {
	    var attrs = node.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var name = attrs[i].name;
	      if (refRE.test(name)) {
	        return camelize(name.replace(refRE, ''));
	      }
	    }
	  }
	}
	
	/**
	 * Map a function to a range of nodes .
	 *
	 * @param {Node} node
	 * @param {Node} end
	 * @param {Function} op
	 */
	
	function mapNodeRange(node, end, op) {
	  var next;
	  while (node !== end) {
	    next = node.nextSibling;
	    op(node);
	    node = next;
	  }
	  op(end);
	}
	
	/**
	 * Remove a range of nodes with transition, store
	 * the nodes in a fragment with correct ordering,
	 * and call callback when done.
	 *
	 * @param {Node} start
	 * @param {Node} end
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Function} cb
	 */
	
	function removeNodeRange(start, end, vm, frag, cb) {
	  var done = false;
	  var removed = 0;
	  var nodes = [];
	  mapNodeRange(start, end, function (node) {
	    if (node === end) done = true;
	    nodes.push(node);
	    removeWithTransition(node, vm, onRemoved);
	  });
	  function onRemoved() {
	    removed++;
	    if (done && removed >= nodes.length) {
	      for (var i = 0; i < nodes.length; i++) {
	        frag.appendChild(nodes[i]);
	      }
	      cb && cb();
	    }
	  }
	}
	
	/**
	 * Check if a node is a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isFragment(node) {
	  return node && node.nodeType === 11;
	}
	
	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 *
	 * @param {Element} el
	 * @return {String}
	 */
	
	function getOuterHTML(el) {
	  if (el.outerHTML) {
	    return el.outerHTML;
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  }
	}
	
	var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/;
	var reservedTagRE = /^(slot|partial|component)$/;
	
	var isUnknownElement = undefined;
	if (process.env.NODE_ENV !== 'production') {
	  isUnknownElement = function (el, tag) {
	    if (tag.indexOf('-') > -1) {
	      // http://stackoverflow.com/a/28210364/1070244
	      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
	    } else {
	      return (/HTMLUnknownElement/.test(el.toString()) &&
	        // Chrome returns unknown for several HTML5 elements.
	        // https://code.google.com/p/chromium/issues/detail?id=540526
	        !/^(data|time|rtc|rb)$/.test(tag)
	      );
	    }
	  };
	}
	
	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Object|undefined}
	 */
	
	function checkComponentAttr(el, options) {
	  var tag = el.tagName.toLowerCase();
	  var hasAttrs = el.hasAttributes();
	  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
	    if (resolveAsset(options, 'components', tag)) {
	      return { id: tag };
	    } else {
	      var is = hasAttrs && getIsBinding(el);
	      if (is) {
	        return is;
	      } else if (process.env.NODE_ENV !== 'production') {
	        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
	        if (expectedTag) {
	          warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
	        } else if (isUnknownElement(el, tag)) {
	          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
	        }
	      }
	    }
	  } else if (hasAttrs) {
	    return getIsBinding(el);
	  }
	}
	
	/**
	 * Get "is" binding from an element.
	 *
	 * @param {Element} el
	 * @return {Object|undefined}
	 */
	
	function getIsBinding(el) {
	  // dynamic syntax
	  var exp = getAttr(el, 'is');
	  if (exp != null) {
	    return { id: exp };
	  } else {
	    exp = getBindAttr(el, 'is');
	    if (exp != null) {
	      return { id: exp, dynamic: true };
	    }
	  }
	}
	
	/**
	 * Set a prop's initial value on a vm and its data object.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function initProp(vm, prop, value) {
	  var key = prop.path;
	  value = coerceProp(prop, value);
	  vm[key] = vm._data[key] = assertProp(prop, value) ? value : undefined;
	}
	
	/**
	 * Assert whether a prop is valid.
	 *
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function assertProp(prop, value) {
	  if (!prop.options.required && ( // non-required
	  prop.raw === null || // abscent
	  value == null) // null or undefined
	  ) {
	      return true;
	    }
	  var options = prop.options;
	  var type = options.type;
	  var valid = true;
	  var expectedType;
	  if (type) {
	    if (type === String) {
	      expectedType = 'string';
	      valid = typeof value === expectedType;
	    } else if (type === Number) {
	      expectedType = 'number';
	      valid = typeof value === 'number';
	    } else if (type === Boolean) {
	      expectedType = 'boolean';
	      valid = typeof value === 'boolean';
	    } else if (type === Function) {
	      expectedType = 'function';
	      valid = typeof value === 'function';
	    } else if (type === Object) {
	      expectedType = 'object';
	      valid = isPlainObject(value);
	    } else if (type === Array) {
	      expectedType = 'array';
	      valid = isArray(value);
	    } else {
	      valid = value instanceof type;
	    }
	  }
	  if (!valid) {
	    process.env.NODE_ENV !== 'production' && warn('Invalid prop: type check failed for ' + prop.path + '="' + prop.raw + '".' + ' Expected ' + formatType(expectedType) + ', got ' + formatValue(value) + '.');
	    return false;
	  }
	  var validator = options.validator;
	  if (validator) {
	    if (!validator(value)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop: custom validator check failed for ' + prop.path + '="' + prop.raw + '"');
	      return false;
	    }
	  }
	  return true;
	}
	
	/**
	 * Force parsing value with coerce option.
	 *
	 * @param {*} value
	 * @param {Object} options
	 * @return {*}
	 */
	
	function coerceProp(prop, value) {
	  var coerce = prop.options.coerce;
	  if (!coerce) {
	    return value;
	  }
	  // coerce is a function
	  return coerce(value);
	}
	
	function formatType(val) {
	  return val ? val.charAt(0).toUpperCase() + val.slice(1) : 'custom type';
	}
	
	function formatValue(val) {
	  return Object.prototype.toString.call(val).slice(8, -1);
	}
	
	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */
	
	var strats = config.optionMergeStrategies = Object.create(null);
	
	/**
	 * Helper that recursively merges two data objects together.
	 */
	
	function mergeData(to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!hasOwn(to, key)) {
	      set(to, key, fromVal);
	    } else if (isObject(toVal) && isObject(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to;
	}
	
	/**
	 * Data
	 */
	
	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal;
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
	      return parentVal;
	    }
	    if (!parentVal) {
	      return childVal;
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn() {
	      return mergeData(childVal.call(this), parentVal.call(this));
	    };
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn() {
	      // instance merge
	      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
	      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData);
	      } else {
	        return defaultData;
	      }
	    };
	  }
	};
	
	/**
	 * El
	 */
	
	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
	    return;
	  }
	  var ret = childVal || parentVal;
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
	};
	
	/**
	 * Hooks and param attributes are merged as arrays.
	 */
	
	strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
	  return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
	};
	
	/**
	 * 0.11 deprecation warning
	 */
	
	strats.paramAttributes = function () {
	  /* istanbul ignore next */
	  process.env.NODE_ENV !== 'production' && warn('"paramAttributes" option has been deprecated in 0.12. ' + 'Use "props" instead.');
	};
	
	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */
	
	function mergeAssets(parentVal, childVal) {
	  var res = Object.create(parentVal);
	  return childVal ? extend(res, guardArrayAssets(childVal)) : res;
	}
	
	config._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});
	
	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */
	
	strats.watch = strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = {};
	  extend(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !isArray(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent ? parent.concat(child) : [child];
	  }
	  return ret;
	};
	
	/**
	 * Other object hashes.
	 */
	
	strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = Object.create(null);
	  extend(ret, parentVal);
	  extend(ret, childVal);
	  return ret;
	};
	
	/**
	 * Default strategy.
	 */
	
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	  return childVal === undefined ? parentVal : childVal;
	};
	
	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} options
	 */
	
	function guardComponents(options) {
	  if (options.components) {
	    var components = options.components = guardArrayAssets(options.components);
	    var ids = Object.keys(components);
	    var def;
	    if (process.env.NODE_ENV !== 'production') {
	      var map = options._componentNameMap = {};
	    }
	    for (var i = 0, l = ids.length; i < l; i++) {
	      var key = ids[i];
	      if (commonTagRE.test(key) || reservedTagRE.test(key)) {
	        process.env.NODE_ENV !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
	        continue;
	      }
	      // record a all lowercase <-> kebab-case mapping for
	      // possible custom element case error warning
	      if (process.env.NODE_ENV !== 'production') {
	        map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
	      }
	      def = components[key];
	      if (isPlainObject(def)) {
	        components[key] = Vue.extend(def);
	      }
	    }
	  }
	}
	
	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 *
	 * @param {Object} options
	 */
	
	function guardProps(options) {
	  var props = options.props;
	  var i, val;
	  if (isArray(props)) {
	    options.props = {};
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        options.props[val] = null;
	      } else if (val.name) {
	        options.props[val.name] = val;
	      }
	    }
	  } else if (isPlainObject(props)) {
	    var keys = Object.keys(props);
	    i = keys.length;
	    while (i--) {
	      val = props[keys[i]];
	      if (typeof val === 'function') {
	        props[keys[i]] = { type: val };
	      }
	    }
	  }
	}
	
	/**
	 * Guard an Array-format assets option and converted it
	 * into the key-value Object format.
	 *
	 * @param {Object|Array} assets
	 * @return {Object}
	 */
	
	function guardArrayAssets(assets) {
	  if (isArray(assets)) {
	    var res = {};
	    var i = assets.length;
	    var asset;
	    while (i--) {
	      asset = assets[i];
	      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
	      } else {
	        res[id] = asset;
	      }
	    }
	    return res;
	  }
	  return assets;
	}
	
	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */
	
	function mergeOptions(parent, child, vm) {
	  guardComponents(child);
	  guardProps(child);
	  var options = {};
	  var key;
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      parent = mergeOptions(parent, child.mixins[i], vm);
	    }
	  }
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!hasOwn(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField(key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options;
	}
	
	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @return {Object|Function}
	 */
	
	function resolveAsset(options, type, id) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return;
	  }
	  var assets = options[type];
	  var camelizedId;
	  return assets[id] ||
	  // camelCase ID
	  assets[camelizedId = camelize(id)] ||
	  // Pascal Case ID
	  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
	}
	
	/**
	 * Assert asset exists
	 */
	
	function assertAsset(val, type, id) {
	  if (!val) {
	    process.env.NODE_ENV !== 'production' && warn('Failed to resolve ' + type + ': ' + id);
	  }
	}
	
	var uid$1 = 0;
	
	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */
	function Dep() {
	  this.id = uid$1++;
	  this.subs = [];
	}
	
	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null;
	
	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.addSub = function (sub) {
	  this.subs.push(sub);
	};
	
	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.removeSub = function (sub) {
	  this.subs.$remove(sub);
	};
	
	/**
	 * Add self as a dependency to the target watcher.
	 */
	
	Dep.prototype.depend = function () {
	  Dep.target.addDep(this);
	};
	
	/**
	 * Notify all subscribers of a new value.
	 */
	
	Dep.prototype.notify = function () {
	  // stablize the subscriber list first
	  var subs = toArray(this.subs);
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update();
	  }
	};
	
	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto)
	
	/**
	 * Intercept mutating methods and emit events
	 */
	
	;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method];
	  def(arrayMethods, method, function mutator() {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length;
	    var args = new Array(i);
	    while (i--) {
	      args[i] = arguments[i];
	    }
	    var result = original.apply(this, args);
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	        inserted = args;
	        break;
	      case 'unshift':
	        inserted = args;
	        break;
	      case 'splice':
	        inserted = args.slice(2);
	        break;
	    }
	    if (inserted) ob.observeArray(inserted);
	    // notify change
	    ob.dep.notify();
	    return result;
	  });
	});
	
	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */
	
	def(arrayProto, '$set', function $set(index, val) {
	  if (index >= this.length) {
	    this.length = Number(index) + 1;
	  }
	  return this.splice(index, 1, val)[0];
	});
	
	/**
	 * Convenience method to remove the element at given index.
	 *
	 * @param {Number} index
	 * @param {*} val
	 */
	
	def(arrayProto, '$remove', function $remove(item) {
	  /* istanbul ignore if */
	  if (!this.length) return;
	  var index = indexOf(this, item);
	  if (index > -1) {
	    return this.splice(index, 1);
	  }
	});
	
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
	
	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @constructor
	 */
	
	function Observer(value) {
	  this.value = value;
	  this.dep = new Dep();
	  def(value, '__ob__', this);
	  if (isArray(value)) {
	    var augment = hasProto ? protoAugment : copyAugment;
	    augment(value, arrayMethods, arrayKeys);
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	}
	
	// Instance methods
	
	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 *
	 * @param {Object} obj
	 */
	
	Observer.prototype.walk = function (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    this.convert(keys[i], obj[keys[i]]);
	  }
	};
	
	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */
	
	Observer.prototype.observeArray = function (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};
	
	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */
	
	Observer.prototype.convert = function (key, val) {
	  defineReactive(this.value, key, val);
	};
	
	/**
	 * Add an owner vm, so that when $set/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.addVm = function (vm) {
	  (this.vms || (this.vms = [])).push(vm);
	};
	
	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.removeVm = function (vm) {
	  this.vms.$remove(vm);
	};
	
	// helpers
	
	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */
	
	function protoAugment(target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}
	
	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */
	
	function copyAugment(target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    def(target, key, src[key]);
	  }
	}
	
	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @param {Vue} [vm]
	 * @return {Observer|undefined}
	 * @static
	 */
	
	function observe(value, vm) {
	  if (!value || typeof value !== 'object') {
	    return;
	  }
	  var ob;
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	    ob = value.__ob__;
	  } else if ((isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
	    ob = new Observer(value);
	  }
	  if (ob && vm) {
	    ob.addVm(vm);
	  }
	  return ob;
	}
	
	/**
	 * Define a reactive property on an Object.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 */
	
	function defineReactive(obj, key, val) {
	  var dep = new Dep();
	
	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  if (property && property.configurable === false) {
	    return;
	  }
	
	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;
	
	  var childOb = observe(val);
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter() {
	      var value = getter ? getter.call(obj) : val;
	      if (Dep.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	        }
	        if (isArray(value)) {
	          for (var e, i = 0, l = value.length; i < l; i++) {
	            e = value[i];
	            e && e.__ob__ && e.__ob__.dep.depend();
	          }
	        }
	      }
	      return value;
	    },
	    set: function reactiveSetter(newVal) {
	      var value = getter ? getter.call(obj) : val;
	      if (newVal === value) {
	        return;
	      }
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      childOb = observe(newVal);
	      dep.notify();
	    }
	  });
	}
	
	
	
	var util = Object.freeze({
		defineReactive: defineReactive,
		set: set,
		del: del,
		hasOwn: hasOwn,
		isLiteral: isLiteral,
		isReserved: isReserved,
		_toString: _toString,
		toNumber: toNumber,
		toBoolean: toBoolean,
		stripQuotes: stripQuotes,
		camelize: camelize,
		hyphenate: hyphenate,
		classify: classify,
		bind: bind,
		toArray: toArray,
		extend: extend,
		isObject: isObject,
		isPlainObject: isPlainObject,
		def: def,
		debounce: _debounce,
		indexOf: indexOf,
		cancellable: cancellable,
		looseEqual: looseEqual,
		isArray: isArray,
		hasProto: hasProto,
		inBrowser: inBrowser,
		devtools: devtools,
		isIE9: isIE9,
		isAndroid: isAndroid,
		get transitionProp () { return transitionProp; },
		get transitionEndEvent () { return transitionEndEvent; },
		get animationProp () { return animationProp; },
		get animationEndEvent () { return animationEndEvent; },
		nextTick: nextTick,
		query: query,
		inDoc: inDoc,
		getAttr: getAttr,
		getBindAttr: getBindAttr,
		hasBindAttr: hasBindAttr,
		before: before,
		after: after,
		remove: remove,
		prepend: prepend,
		replace: replace,
		on: on,
		off: off,
		setClass: setClass,
		addClass: addClass,
		removeClass: removeClass,
		extractContent: extractContent,
		trimNode: trimNode,
		isTemplate: isTemplate,
		createAnchor: createAnchor,
		findRef: findRef,
		mapNodeRange: mapNodeRange,
		removeNodeRange: removeNodeRange,
		isFragment: isFragment,
		getOuterHTML: getOuterHTML,
		mergeOptions: mergeOptions,
		resolveAsset: resolveAsset,
		assertAsset: assertAsset,
		checkComponentAttr: checkComponentAttr,
		initProp: initProp,
		assertProp: assertProp,
		coerceProp: coerceProp,
		commonTagRE: commonTagRE,
		reservedTagRE: reservedTagRE,
		get warn () { return warn; }
	});
	
	var uid = 0;
	
	function initMixin (Vue) {
	  /**
	   * The main init sequence. This is called for every
	   * instance, including ones that are created from extended
	   * constructors.
	   *
	   * @param {Object} options - this options object should be
	   *                           the result of merging class
	   *                           options and the options passed
	   *                           in to the constructor.
	   */
	
	  Vue.prototype._init = function (options) {
	    options = options || {};
	
	    this.$el = null;
	    this.$parent = options.parent;
	    this.$root = this.$parent ? this.$parent.$root : this;
	    this.$children = [];
	    this.$refs = {}; // child vm references
	    this.$els = {}; // element references
	    this._watchers = []; // all watchers as an array
	    this._directives = []; // all directives
	
	    // a uid
	    this._uid = uid++;
	
	    // a flag to avoid this being observed
	    this._isVue = true;
	
	    // events bookkeeping
	    this._events = {}; // registered callbacks
	    this._eventsCount = {}; // for $broadcast optimization
	
	    // fragment instance properties
	    this._isFragment = false;
	    this._fragment = // @type {DocumentFragment}
	    this._fragmentStart = // @type {Text|Comment}
	    this._fragmentEnd = null; // @type {Text|Comment}
	
	    // lifecycle state
	    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
	    this._unlinkFn = null;
	
	    // context:
	    // if this is a transcluded component, context
	    // will be the common parent vm of this instance
	    // and its host.
	    this._context = options._context || this.$parent;
	
	    // scope:
	    // if this is inside an inline v-for, the scope
	    // will be the intermediate scope created for this
	    // repeat fragment. this is used for linking props
	    // and container directives.
	    this._scope = options._scope;
	
	    // fragment:
	    // if this instance is compiled inside a Fragment, it
	    // needs to reigster itself as a child of that fragment
	    // for attach/detach to work properly.
	    this._frag = options._frag;
	    if (this._frag) {
	      this._frag.children.push(this);
	    }
	
	    // push self into parent / transclusion host
	    if (this.$parent) {
	      this.$parent.$children.push(this);
	    }
	
	    // save raw constructor data before merge
	    // so that we know which properties are provided at
	    // instantiation.
	    if (process.env.NODE_ENV !== 'production') {
	      this._runtimeData = options.data;
	    }
	
	    // merge options.
	    options = this.$options = mergeOptions(this.constructor.options, options, this);
	
	    // set ref
	    this._updateRef();
	
	    // initialize data as empty object.
	    // it will be filled up in _initScope().
	    this._data = {};
	
	    // call init hook
	    this._callHook('init');
	
	    // initialize data observation and scope inheritance.
	    this._initState();
	
	    // setup event system and option events.
	    this._initEvents();
	
	    // call created hook
	    this._callHook('created');
	
	    // if `el` option is passed, start compilation.
	    if (options.el) {
	      this.$mount(options.el);
	    }
	  };
	}
	
	var pathCache = new Cache(1000);
	
	// actions
	var APPEND = 0;
	var PUSH = 1;
	var INC_SUB_PATH_DEPTH = 2;
	var PUSH_SUB_PATH = 3;
	
	// states
	var BEFORE_PATH = 0;
	var IN_PATH = 1;
	var BEFORE_IDENT = 2;
	var IN_IDENT = 3;
	var IN_SUB_PATH = 4;
	var IN_SINGLE_QUOTE = 5;
	var IN_DOUBLE_QUOTE = 6;
	var AFTER_PATH = 7;
	var ERROR = 8;
	
	var pathStateMachine = [];
	
	pathStateMachine[BEFORE_PATH] = {
	  'ws': [BEFORE_PATH],
	  'ident': [IN_IDENT, APPEND],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[IN_PATH] = {
	  'ws': [IN_PATH],
	  '.': [BEFORE_IDENT],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[BEFORE_IDENT] = {
	  'ws': [BEFORE_IDENT],
	  'ident': [IN_IDENT, APPEND]
	};
	
	pathStateMachine[IN_IDENT] = {
	  'ident': [IN_IDENT, APPEND],
	  '0': [IN_IDENT, APPEND],
	  'number': [IN_IDENT, APPEND],
	  'ws': [IN_PATH, PUSH],
	  '.': [BEFORE_IDENT, PUSH],
	  '[': [IN_SUB_PATH, PUSH],
	  'eof': [AFTER_PATH, PUSH]
	};
	
	pathStateMachine[IN_SUB_PATH] = {
	  "'": [IN_SINGLE_QUOTE, APPEND],
	  '"': [IN_DOUBLE_QUOTE, APPEND],
	  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
	  ']': [IN_PATH, PUSH_SUB_PATH],
	  'eof': ERROR,
	  'else': [IN_SUB_PATH, APPEND]
	};
	
	pathStateMachine[IN_SINGLE_QUOTE] = {
	  "'": [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_SINGLE_QUOTE, APPEND]
	};
	
	pathStateMachine[IN_DOUBLE_QUOTE] = {
	  '"': [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_DOUBLE_QUOTE, APPEND]
	};
	
	/**
	 * Determine the type of a character in a keypath.
	 *
	 * @param {Char} ch
	 * @return {String} type
	 */
	
	function getPathCharType(ch) {
	  if (ch === undefined) {
	    return 'eof';
	  }
	
	  var code = ch.charCodeAt(0);
	
	  switch (code) {
	    case 0x5B: // [
	    case 0x5D: // ]
	    case 0x2E: // .
	    case 0x22: // "
	    case 0x27: // '
	    case 0x30:
	      // 0
	      return ch;
	
	    case 0x5F: // _
	    case 0x24:
	      // $
	      return 'ident';
	
	    case 0x20: // Space
	    case 0x09: // Tab
	    case 0x0A: // Newline
	    case 0x0D: // Return
	    case 0xA0: // No-break space
	    case 0xFEFF: // Byte Order Mark
	    case 0x2028: // Line Separator
	    case 0x2029:
	      // Paragraph Separator
	      return 'ws';
	  }
	
	  // a-z, A-Z
	  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
	    return 'ident';
	  }
	
	  // 1-9
	  if (code >= 0x31 && code <= 0x39) {
	    return 'number';
	  }
	
	  return 'else';
	}
	
	/**
	 * Format a subPath, return its plain form if it is
	 * a literal string or number. Otherwise prepend the
	 * dynamic indicator (*).
	 *
	 * @param {String} path
	 * @return {String}
	 */
	
	function formatSubPath(path) {
	  var trimmed = path.trim();
	  // invalid leading 0
	  if (path.charAt(0) === '0' && isNaN(path)) {
	    return false;
	  }
	  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
	}
	
	/**
	 * Parse a string path into an array of segments
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parse(path) {
	  var keys = [];
	  var index = -1;
	  var mode = BEFORE_PATH;
	  var subPathDepth = 0;
	  var c, newChar, key, type, transition, action, typeMap;
	
	  var actions = [];
	
	  actions[PUSH] = function () {
	    if (key !== undefined) {
	      keys.push(key);
	      key = undefined;
	    }
	  };
	
	  actions[APPEND] = function () {
	    if (key === undefined) {
	      key = newChar;
	    } else {
	      key += newChar;
	    }
	  };
	
	  actions[INC_SUB_PATH_DEPTH] = function () {
	    actions[APPEND]();
	    subPathDepth++;
	  };
	
	  actions[PUSH_SUB_PATH] = function () {
	    if (subPathDepth > 0) {
	      subPathDepth--;
	      mode = IN_SUB_PATH;
	      actions[APPEND]();
	    } else {
	      subPathDepth = 0;
	      key = formatSubPath(key);
	      if (key === false) {
	        return false;
	      } else {
	        actions[PUSH]();
	      }
	    }
	  };
	
	  function maybeUnescapeQuote() {
	    var nextChar = path[index + 1];
	    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
	      index++;
	      newChar = '\\' + nextChar;
	      actions[APPEND]();
	      return true;
	    }
	  }
	
	  while (mode != null) {
	    index++;
	    c = path[index];
	
	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue;
	    }
	
	    type = getPathCharType(c);
	    typeMap = pathStateMachine[mode];
	    transition = typeMap[type] || typeMap['else'] || ERROR;
	
	    if (transition === ERROR) {
	      return; // parse error
	    }
	
	    mode = transition[0];
	    action = actions[transition[1]];
	    if (action) {
	      newChar = transition[2];
	      newChar = newChar === undefined ? c : newChar;
	      if (action() === false) {
	        return;
	      }
	    }
	
	    if (mode === AFTER_PATH) {
	      keys.raw = path;
	      return keys;
	    }
	  }
	}
	
	/**
	 * External parse that check for a cache hit first
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parsePath(path) {
	  var hit = pathCache.get(path);
	  if (!hit) {
	    hit = parse(path);
	    if (hit) {
	      pathCache.put(path, hit);
	    }
	  }
	  return hit;
	}
	
	/**
	 * Get from an object from a path string
	 *
	 * @param {Object} obj
	 * @param {String} path
	 */
	
	function getPath(obj, path) {
	  return parseExpression(path).get(obj);
	}
	
	/**
	 * Warn against setting non-existent root path on a vm.
	 */
	
	var warnNonExistent;
	if (process.env.NODE_ENV !== 'production') {
	  warnNonExistent = function (path) {
	    warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.');
	  };
	}
	
	/**
	 * Set on an object from a path
	 *
	 * @param {Object} obj
	 * @param {String | Array} path
	 * @param {*} val
	 */
	
	function setPath(obj, path, val) {
	  var original = obj;
	  if (typeof path === 'string') {
	    path = parse(path);
	  }
	  if (!path || !isObject(obj)) {
	    return false;
	  }
	  var last, key;
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj;
	    key = path[i];
	    if (key.charAt(0) === '*') {
	      key = parseExpression(key.slice(1)).get.call(original, original);
	    }
	    if (i < l - 1) {
	      obj = obj[key];
	      if (!isObject(obj)) {
	        obj = {};
	        if (process.env.NODE_ENV !== 'production' && last._isVue) {
	          warnNonExistent(path);
	        }
	        set(last, key, obj);
	      }
	    } else {
	      if (isArray(obj)) {
	        obj.$set(key, val);
	      } else if (key in obj) {
	        obj[key] = val;
	      } else {
	        if (process.env.NODE_ENV !== 'production' && obj._isVue) {
	          warnNonExistent(path);
	        }
	        set(obj, key, val);
	      }
	    }
	  }
	  return true;
	}
	
	var path = Object.freeze({
	  parsePath: parsePath,
	  getPath: getPath,
	  setPath: setPath
	});
	
	var expressionCache = new Cache(1000);
	
	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	// keywords that don't make sense inside expressions
	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'proctected,static,interface,private,public';
	var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	var wsRE = /\s/g;
	var newlineRE = /\n/g;
	var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var restoreRE = /"(\d+)"/g;
	var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
	var booleanLiteralRE = /^(?:true|false)$/;
	
	/**
	 * Save / Rewrite / Restore
	 *
	 * When rewriting paths found in an expression, it is
	 * possible for the same letter sequences to be found in
	 * strings and Object literal property keys. Therefore we
	 * remove and store these parts in a temporary array, and
	 * restore them after the path rewrite.
	 */
	
	var saved = [];
	
	/**
	 * Save replacer
	 *
	 * The save regex can match two possible cases:
	 * 1. An opening object literal
	 * 2. A string
	 * If matched as a plain string, we need to escape its
	 * newlines, since the string needs to be preserved when
	 * generating the function body.
	 *
	 * @param {String} str
	 * @param {String} isString - str if matched as a string
	 * @return {String} - placeholder with index
	 */
	
	function save(str, isString) {
	  var i = saved.length;
	  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
	  return '"' + i + '"';
	}
	
	/**
	 * Path rewrite replacer
	 *
	 * @param {String} raw
	 * @return {String}
	 */
	
	function rewrite(raw) {
	  var c = raw.charAt(0);
	  var path = raw.slice(1);
	  if (allowedKeywordsRE.test(path)) {
	    return raw;
	  } else {
	    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
	    return c + 'scope.' + path;
	  }
	}
	
	/**
	 * Restore replacer
	 *
	 * @param {String} str
	 * @param {String} i - matched save index
	 * @return {String}
	 */
	
	function restore(str, i) {
	  return saved[i];
	}
	
	/**
	 * Rewrite an expression, prefixing all path accessors with
	 * `scope.` and generate getter/setter functions.
	 *
	 * @param {String} exp
	 * @return {Function}
	 */
	
	function compileGetter(exp) {
	  if (improperKeywordsRE.test(exp)) {
	    process.env.NODE_ENV !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
	  }
	  // reset state
	  saved.length = 0;
	  // save strings and object literal keys
	  var body = exp.replace(saveRE, save).replace(wsRE, '');
	  // rewrite all paths
	  // pad 1 space here becaue the regex matches 1 extra char
	  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
	  return makeGetterFn(body);
	}
	
	/**
	 * Build a getter function. Requires eval.
	 *
	 * We isolate the try/catch so it doesn't affect the
	 * optimization of the parse function when it is not called.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */
	
	function makeGetterFn(body) {
	  try {
	    /* eslint-disable no-new-func */
	    return new Function('scope', 'return ' + body + ';');
	    /* eslint-enable no-new-func */
	  } catch (e) {
	    process.env.NODE_ENV !== 'production' && warn('Invalid expression. ' + 'Generated function body: ' + body);
	  }
	}
	
	/**
	 * Compile a setter function for the expression.
	 *
	 * @param {String} exp
	 * @return {Function|undefined}
	 */
	
	function compileSetter(exp) {
	  var path = parsePath(exp);
	  if (path) {
	    return function (scope, val) {
	      setPath(scope, path, val);
	    };
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid setter expression: ' + exp);
	  }
	}
	
	/**
	 * Parse an expression into re-written getter/setters.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */
	
	function parseExpression(exp, needSet) {
	  exp = exp.trim();
	  // try cache
	  var hit = expressionCache.get(exp);
	  if (hit) {
	    if (needSet && !hit.set) {
	      hit.set = compileSetter(hit.exp);
	    }
	    return hit;
	  }
	  var res = { exp: exp };
	  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
	  // optimized super simple getter
	  ? makeGetterFn('scope.' + exp)
	  // dynamic getter
	  : compileGetter(exp);
	  if (needSet) {
	    res.set = compileSetter(exp);
	  }
	  expressionCache.put(exp, res);
	  return res;
	}
	
	/**
	 * Check if an expression is a simple path.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	function isSimplePath(exp) {
	  return pathTestRE.test(exp) &&
	  // don't treat true/false as paths
	  !booleanLiteralRE.test(exp) &&
	  // Math constants e.g. Math.PI, Math.E etc.
	  exp.slice(0, 5) !== 'Math.';
	}
	
	var expression = Object.freeze({
	  parseExpression: parseExpression,
	  isSimplePath: isSimplePath
	});
	
	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.
	var queue = [];
	var userQueue = [];
	var has = {};
	var circular = {};
	var waiting = false;
	var internalQueueDepleted = false;
	
	/**
	 * Reset the batcher's state.
	 */
	
	function resetBatcherState() {
	  queue = [];
	  userQueue = [];
	  has = {};
	  circular = {};
	  waiting = internalQueueDepleted = false;
	}
	
	/**
	 * Flush both queues and run the watchers.
	 */
	
	function flushBatcherQueue() {
	  runBatcherQueue(queue);
	  internalQueueDepleted = true;
	  runBatcherQueue(userQueue);
	  // dev tool hook
	  /* istanbul ignore if */
	  if (devtools) {
	    devtools.emit('flush');
	  }
	  resetBatcherState();
	}
	
	/**
	 * Run the watchers in a single queue.
	 *
	 * @param {Array} queue
	 */
	
	function runBatcherQueue(queue) {
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (var i = 0; i < queue.length; i++) {
	    var watcher = queue[i];
	    var id = watcher.id;
	    has[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > config._maxUpdateCount) {
	        queue.splice(has[id], 1);
	        warn('You may have an infinite update loop for watcher ' + 'with expression: ' + watcher.expression);
	      }
	    }
	  }
	}
	
	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 *
	 * @param {Watcher} watcher
	 *   properties:
	 *   - {Number} id
	 *   - {Function} run
	 */
	
	function pushWatcher(watcher) {
	  var id = watcher.id;
	  if (has[id] == null) {
	    // if an internal watcher is pushed, but the internal
	    // queue is already depleted, we run it immediately.
	    if (internalQueueDepleted && !watcher.user) {
	      watcher.run();
	      return;
	    }
	    // push watcher into appropriate queue
	    var q = watcher.user ? userQueue : queue;
	    has[id] = q.length;
	    q.push(watcher);
	    // queue the flush
	    if (!waiting) {
	      waiting = true;
	      nextTick(flushBatcherQueue);
	    }
	  }
	}
	
	var uid$2 = 0;
	
	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String} expression
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Boolean} sync
	 *                 - {Boolean} lazy
	 *                 - {Function} [preProcess]
	 *                 - {Function} [postProcess]
	 * @constructor
	 */
	function Watcher(vm, expOrFn, cb, options) {
	  // mix in options
	  if (options) {
	    extend(this, options);
	  }
	  var isFn = typeof expOrFn === 'function';
	  this.vm = vm;
	  vm._watchers.push(this);
	  this.expression = isFn ? expOrFn.toString() : expOrFn;
	  this.cb = cb;
	  this.id = ++uid$2; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = Object.create(null);
	  this.newDeps = null;
	  this.prevError = null; // for async error stacks
	  // parse expression for getter/setter
	  if (isFn) {
	    this.getter = expOrFn;
	    this.setter = undefined;
	  } else {
	    var res = parseExpression(expOrFn, this.twoWay);
	    this.getter = res.get;
	    this.setter = res.set;
	  }
	  this.value = this.lazy ? undefined : this.get();
	  // state for avoiding false triggers for deep and Array
	  // watchers during vm._digest()
	  this.queued = this.shallow = false;
	}
	
	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */
	
	Watcher.prototype.addDep = function (dep) {
	  var id = dep.id;
	  if (!this.newDeps[id]) {
	    this.newDeps[id] = dep;
	    if (!this.deps[id]) {
	      this.deps[id] = dep;
	      dep.addSub(this);
	    }
	  }
	};
	
	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */
	
	Watcher.prototype.get = function () {
	  this.beforeGet();
	  var scope = this.scope || this.vm;
	  var value;
	  try {
	    value = this.getter.call(scope, scope);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating expression "' + this.expression + '". ' + (config.debug ? '' : 'Turn on debug mode to see stack trace.'), e);
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value);
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value);
	  }
	  if (this.filters) {
	    value = scope._applyFilters(value, null, this.filters, false);
	  }
	  if (this.postProcess) {
	    value = this.postProcess(value);
	  }
	  this.afterGet();
	  return value;
	};
	
	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */
	
	Watcher.prototype.set = function (value) {
	  var scope = this.scope || this.vm;
	  if (this.filters) {
	    value = scope._applyFilters(value, this.value, this.filters, true);
	  }
	  try {
	    this.setter.call(scope, scope, value);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating setter "' + this.expression + '"', e);
	    }
	  }
	  // two-way sync for v-for alias
	  var forContext = scope.$forContext;
	  if (forContext && forContext.alias === this.expression) {
	    if (forContext.filters) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.');
	      return;
	    }
	    forContext._withLock(function () {
	      if (scope.$key) {
	        // original is an object
	        forContext.rawValue[scope.$key] = value;
	      } else {
	        forContext.rawValue.$set(scope.$index, value);
	      }
	    });
	  }
	};
	
	/**
	 * Prepare for dependency collection.
	 */
	
	Watcher.prototype.beforeGet = function () {
	  Dep.target = this;
	  this.newDeps = Object.create(null);
	};
	
	/**
	 * Clean up for dependency collection.
	 */
	
	Watcher.prototype.afterGet = function () {
	  Dep.target = null;
	  var ids = Object.keys(this.deps);
	  var i = ids.length;
	  while (i--) {
	    var id = ids[i];
	    if (!this.newDeps[id]) {
	      this.deps[id].removeSub(this);
	    }
	  }
	  this.deps = this.newDeps;
	};
	
	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 *
	 * @param {Boolean} shallow
	 */
	
	Watcher.prototype.update = function (shallow) {
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync || !config.async) {
	    this.run();
	  } else {
	    // if queued, only overwrite shallow with non-shallow,
	    // but not the other way around.
	    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
	    this.queued = true;
	    // record before-push error stack in debug mode
	    /* istanbul ignore if */
	    if (process.env.NODE_ENV !== 'production' && config.debug) {
	      this.prevError = new Error('[vue] async stack trace');
	    }
	    pushWatcher(this);
	  }
	};
	
	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */
	
	Watcher.prototype.run = function () {
	  if (this.active) {
	    var value = this.get();
	    if (value !== this.value ||
	    // Deep watchers and watchers on Object/Arrays should fire even
	    // when the value is the same, because the value may
	    // have mutated; but only do so if this is a
	    // non-shallow update (caused by a vm digest).
	    (isObject(value) || this.deep) && !this.shallow) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      // in debug + async mode, when a watcher callbacks
	      // throws, we also throw the saved before-push error
	      // so the full cross-tick stack trace is available.
	      var prevError = this.prevError;
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
	        this.prevError = null;
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          nextTick(function () {
	            throw prevError;
	          }, 0);
	          throw e;
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	    this.queued = this.shallow = false;
	  }
	};
	
	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */
	
	Watcher.prototype.evaluate = function () {
	  // avoid overwriting another watcher that is being
	  // collected.
	  var current = Dep.target;
	  this.value = this.get();
	  this.dirty = false;
	  Dep.target = current;
	};
	
	/**
	 * Depend on all deps collected by this watcher.
	 */
	
	Watcher.prototype.depend = function () {
	  var depIds = Object.keys(this.deps);
	  var i = depIds.length;
	  while (i--) {
	    this.deps[depIds[i]].depend();
	  }
	};
	
	/**
	 * Remove self from all dependencies' subcriber list.
	 */
	
	Watcher.prototype.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed or is performing a v-for
	    // re-render (the watcher list is then filtered by v-for).
	    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
	      this.vm._watchers.$remove(this);
	    }
	    var depIds = Object.keys(this.deps);
	    var i = depIds.length;
	    while (i--) {
	      this.deps[depIds[i]].removeSub(this);
	    }
	    this.active = false;
	    this.vm = this.cb = this.value = null;
	  }
	};
	
	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {*} val
	 */
	
	function traverse(val) {
	  var i, keys;
	  if (isArray(val)) {
	    i = val.length;
	    while (i--) traverse(val[i]);
	  } else if (isObject(val)) {
	    keys = Object.keys(val);
	    i = keys.length;
	    while (i--) traverse(val[keys[i]]);
	  }
	}
	
	var text$1 = {
	
	  bind: function bind() {
	    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
	  },
	
	  update: function update(value) {
	    this.el[this.attr] = _toString(value);
	  }
	};
	
	var templateCache = new Cache(1000);
	var idSelectorCache = new Cache(1000);
	
	var map = {
	  efault: [0, '', ''],
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
	};
	
	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];
	
	map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];
	
	/**
	 * Check if a node is a supported template node with a
	 * DocumentFragment content.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isRealTemplate(node) {
	  return isTemplate(node) && isFragment(node.content);
	}
	
	var tagRE$1 = /<([\w:]+)/;
	var entityRE = /&#?\w+?;/;
	
	/**
	 * Convert a string template to a DocumentFragment.
	 * Determines correct wrapping by tag types. Wrapping
	 * strategy found in jQuery & component/domify.
	 *
	 * @param {String} templateString
	 * @param {Boolean} raw
	 * @return {DocumentFragment}
	 */
	
	function stringToFragment(templateString, raw) {
	  // try a cache hit first
	  var cacheKey = raw ? templateString : templateString.trim();
	  var hit = templateCache.get(cacheKey);
	  if (hit) {
	    return hit;
	  }
	
	  var frag = document.createDocumentFragment();
	  var tagMatch = templateString.match(tagRE$1);
	  var entityMatch = entityRE.test(templateString);
	
	  if (!tagMatch && !entityMatch) {
	    // text only, return a single text node.
	    frag.appendChild(document.createTextNode(templateString));
	  } else {
	    var tag = tagMatch && tagMatch[1];
	    var wrap = map[tag] || map.efault;
	    var depth = wrap[0];
	    var prefix = wrap[1];
	    var suffix = wrap[2];
	    var node = document.createElement('div');
	
	    node.innerHTML = prefix + templateString + suffix;
	    while (depth--) {
	      node = node.lastChild;
	    }
	
	    var child;
	    /* eslint-disable no-cond-assign */
	    while (child = node.firstChild) {
	      /* eslint-enable no-cond-assign */
	      frag.appendChild(child);
	    }
	  }
	  if (!raw) {
	    trimNode(frag);
	  }
	  templateCache.put(cacheKey, frag);
	  return frag;
	}
	
	/**
	 * Convert a template node to a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {DocumentFragment}
	 */
	
	function nodeToFragment(node) {
	  // if its a template tag and the browser supports it,
	  // its content is already a document fragment.
	  if (isRealTemplate(node)) {
	    trimNode(node.content);
	    return node.content;
	  }
	  // script template
	  if (node.tagName === 'SCRIPT') {
	    return stringToFragment(node.textContent);
	  }
	  // normal node, clone it to avoid mutating the original
	  var clonedNode = cloneNode(node);
	  var frag = document.createDocumentFragment();
	  var child;
	  /* eslint-disable no-cond-assign */
	  while (child = clonedNode.firstChild) {
	    /* eslint-enable no-cond-assign */
	    frag.appendChild(child);
	  }
	  trimNode(frag);
	  return frag;
	}
	
	// Test for the presence of the Safari template cloning bug
	// https://bugs.webkit.org/showug.cgi?id=137755
	var hasBrokenTemplate = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var a = document.createElement('div');
	    a.innerHTML = '<template>1</template>';
	    return !a.cloneNode(true).firstChild.innerHTML;
	  } else {
	    return false;
	  }
	})();
	
	// Test for IE10/11 textarea placeholder clone bug
	var hasTextareaCloneBug = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var t = document.createElement('textarea');
	    t.placeholder = 't';
	    return t.cloneNode(true).value === 't';
	  } else {
	    return false;
	  }
	})();
	
	/**
	 * 1. Deal with Safari cloning nested <template> bug by
	 *    manually cloning all template instances.
	 * 2. Deal with IE10/11 textarea placeholder bug by setting
	 *    the correct value after cloning.
	 *
	 * @param {Element|DocumentFragment} node
	 * @return {Element|DocumentFragment}
	 */
	
	function cloneNode(node) {
	  if (!node.querySelectorAll) {
	    return node.cloneNode();
	  }
	  var res = node.cloneNode(true);
	  var i, original, cloned;
	  /* istanbul ignore if */
	  if (hasBrokenTemplate) {
	    var tempClone = res;
	    if (isRealTemplate(node)) {
	      node = node.content;
	      tempClone = res.content;
	    }
	    original = node.querySelectorAll('template');
	    if (original.length) {
	      cloned = tempClone.querySelectorAll('template');
	      i = cloned.length;
	      while (i--) {
	        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
	      }
	    }
	  }
	  /* istanbul ignore if */
	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value;
	    } else {
	      original = node.querySelectorAll('textarea');
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea');
	        i = cloned.length;
	        while (i--) {
	          cloned[i].value = original[i].value;
	        }
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Process the template option and normalizes it into a
	 * a DocumentFragment that can be used as a partial or a
	 * instance template.
	 *
	 * @param {*} template
	 *        Possible values include:
	 *        - DocumentFragment object
	 *        - Node object of type Template
	 *        - id selector: '#some-template-id'
	 *        - template string: '<div><span>{{msg}}</span></div>'
	 * @param {Boolean} shouldClone
	 * @param {Boolean} raw
	 *        inline HTML interpolation. Do not check for id
	 *        selector and keep whitespace in the string.
	 * @return {DocumentFragment|undefined}
	 */
	
	function parseTemplate(template, shouldClone, raw) {
	  var node, frag;
	
	  // if the template is already a document fragment,
	  // do nothing
	  if (isFragment(template)) {
	    trimNode(template);
	    return shouldClone ? cloneNode(template) : template;
	  }
	
	  if (typeof template === 'string') {
	    // id selector
	    if (!raw && template.charAt(0) === '#') {
	      // id selector can be cached too
	      frag = idSelectorCache.get(template);
	      if (!frag) {
	        node = document.getElementById(template.slice(1));
	        if (node) {
	          frag = nodeToFragment(node);
	          // save selector to cache
	          idSelectorCache.put(template, frag);
	        }
	      }
	    } else {
	      // normal string template
	      frag = stringToFragment(template, raw);
	    }
	  } else if (template.nodeType) {
	    // a direct node
	    frag = nodeToFragment(template);
	  }
	
	  return frag && shouldClone ? cloneNode(frag) : frag;
	}
	
	var template = Object.freeze({
	  cloneNode: cloneNode,
	  parseTemplate: parseTemplate
	});
	
	var html = {
	
	  bind: function bind() {
	    // a comment node means this is a binding for
	    // {{{ inline unescaped html }}}
	    if (this.el.nodeType === 8) {
	      // hold nodes
	      this.nodes = [];
	      // replace the placeholder with proper anchor
	      this.anchor = createAnchor('v-html');
	      replace(this.el, this.anchor);
	    }
	  },
	
	  update: function update(value) {
	    value = _toString(value);
	    if (this.nodes) {
	      this.swap(value);
	    } else {
	      this.el.innerHTML = value;
	    }
	  },
	
	  swap: function swap(value) {
	    // remove old nodes
	    var i = this.nodes.length;
	    while (i--) {
	      remove(this.nodes[i]);
	    }
	    // convert new value to a fragment
	    // do not attempt to retrieve from id selector
	    var frag = parseTemplate(value, true, true);
	    // save a reference to these nodes so we can remove later
	    this.nodes = toArray(frag.childNodes);
	    before(frag, this.anchor);
	  }
	};
	
	/**
	 * Abstraction for a partially-compiled fragment.
	 * Can optionally compile content with a child scope.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Vue} [host]
	 * @param {Object} [scope]
	 */
	function Fragment(linker, vm, frag, host, scope, parentFrag) {
	  this.children = [];
	  this.childFrags = [];
	  this.vm = vm;
	  this.scope = scope;
	  this.inserted = false;
	  this.parentFrag = parentFrag;
	  if (parentFrag) {
	    parentFrag.childFrags.push(this);
	  }
	  this.unlink = linker(vm, frag, host, scope, this);
	  var single = this.single = frag.childNodes.length === 1 &&
	  // do not go single mode if the only node is an anchor
	  !frag.childNodes[0].__v_anchor;
	  if (single) {
	    this.node = frag.childNodes[0];
	    this.before = singleBefore;
	    this.remove = singleRemove;
	  } else {
	    this.node = createAnchor('fragment-start');
	    this.end = createAnchor('fragment-end');
	    this.frag = frag;
	    prepend(this.node, frag);
	    frag.appendChild(this.end);
	    this.before = multiBefore;
	    this.remove = multiRemove;
	  }
	  this.node.__v_frag = this;
	}
	
	/**
	 * Call attach/detach for all components contained within
	 * this fragment. Also do so recursively for all child
	 * fragments.
	 *
	 * @param {Function} hook
	 */
	
	Fragment.prototype.callHook = function (hook) {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    this.childFrags[i].callHook(hook);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    hook(this.children[i]);
	  }
	};
	
	/**
	 * Insert fragment before target, single node version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function singleBefore(target, withTransition) {
	  this.inserted = true;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  method(this.node, target, this.vm);
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, single node version
	 */
	
	function singleRemove() {
	  this.inserted = false;
	  var shouldCallRemove = inDoc(this.node);
	  var self = this;
	  this.beforeRemove();
	  removeWithTransition(this.node, this.vm, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Insert fragment before target, multi-nodes version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function multiBefore(target, withTransition) {
	  this.inserted = true;
	  var vm = this.vm;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  mapNodeRange(this.node, this.end, function (node) {
	    method(node, target, vm);
	  });
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, multi-nodes version
	 */
	
	function multiRemove() {
	  this.inserted = false;
	  var self = this;
	  var shouldCallRemove = inDoc(this.node);
	  this.beforeRemove();
	  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Prepare the fragment for removal.
	 */
	
	Fragment.prototype.beforeRemove = function () {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    // call the same method recursively on child
	    // fragments, depth-first
	    this.childFrags[i].beforeRemove(false);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    // Call destroy for all contained instances,
	    // with remove:false and defer:true.
	    // Defer is necessary because we need to
	    // keep the children to call detach hooks
	    // on them.
	    this.children[i].$destroy(false, true);
	  }
	  var dirs = this.unlink.dirs;
	  for (i = 0, l = dirs.length; i < l; i++) {
	    // disable the watchers on all the directives
	    // so that the rendered content stays the same
	    // during removal.
	    dirs[i]._watcher && dirs[i]._watcher.teardown();
	  }
	};
	
	/**
	 * Destroy the fragment.
	 */
	
	Fragment.prototype.destroy = function () {
	  if (this.parentFrag) {
	    this.parentFrag.childFrags.$remove(this);
	  }
	  this.node.__v_frag = null;
	  this.unlink();
	};
	
	/**
	 * Call attach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function attach(child) {
	  if (!child._isAttached) {
	    child._callHook('attached');
	  }
	}
	
	/**
	 * Call detach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function detach(child) {
	  if (child._isAttached) {
	    child._callHook('detached');
	  }
	}
	
	var linkerCache = new Cache(5000);
	
	/**
	 * A factory that can be used to create instances of a
	 * fragment. Caches the compiled linker if possible.
	 *
	 * @param {Vue} vm
	 * @param {Element|String} el
	 */
	function FragmentFactory(vm, el) {
	  this.vm = vm;
	  var template;
	  var isString = typeof el === 'string';
	  if (isString || isTemplate(el)) {
	    template = parseTemplate(el, true);
	  } else {
	    template = document.createDocumentFragment();
	    template.appendChild(el);
	  }
	  this.template = template;
	  // linker can be cached, but only for components
	  var linker;
	  var cid = vm.constructor.cid;
	  if (cid > 0) {
	    var cacheId = cid + (isString ? el : getOuterHTML(el));
	    linker = linkerCache.get(cacheId);
	    if (!linker) {
	      linker = compile(template, vm.$options, true);
	      linkerCache.put(cacheId, linker);
	    }
	  } else {
	    linker = compile(template, vm.$options, true);
	  }
	  this.linker = linker;
	}
	
	/**
	 * Create a fragment instance with given host and scope.
	 *
	 * @param {Vue} host
	 * @param {Object} scope
	 * @param {Fragment} parentFrag
	 */
	
	FragmentFactory.prototype.create = function (host, scope, parentFrag) {
	  var frag = cloneNode(this.template);
	  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
	};
	
	var ON = 700;
	var MODEL = 800;
	var BIND = 850;
	var TRANSITION = 1100;
	var EL = 1500;
	var COMPONENT = 1500;
	var PARTIAL = 1750;
	var FOR = 2000;
	var IF = 2000;
	var SLOT = 2100;
	
	var uid$3 = 0;
	
	var vFor = {
	
	  priority: FOR,
	
	  params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],
	
	  bind: function bind() {
	    // support "item in/of items" syntax
	    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
	    if (inMatch) {
	      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
	      if (itMatch) {
	        this.iterator = itMatch[1].trim();
	        this.alias = itMatch[2].trim();
	      } else {
	        this.alias = inMatch[1].trim();
	      }
	      this.expression = inMatch[2];
	    }
	
	    if (!this.alias) {
	      process.env.NODE_ENV !== 'production' && warn('Alias is required in v-for.');
	      return;
	    }
	
	    // uid as a cache identifier
	    this.id = '__v-for__' + ++uid$3;
	
	    // check if this is an option list,
	    // so that we know if we need to update the <select>'s
	    // v-model when the option list has changed.
	    // because v-model has a lower priority than v-for,
	    // the v-model is not bound here yet, so we have to
	    // retrive it in the actual updateModel() function.
	    var tag = this.el.tagName;
	    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';
	
	    // setup anchor nodes
	    this.start = createAnchor('v-for-start');
	    this.end = createAnchor('v-for-end');
	    replace(this.el, this.end);
	    before(this.start, this.end);
	
	    // cache
	    this.cache = Object.create(null);
	
	    // fragment factory
	    this.factory = new FragmentFactory(this.vm, this.el);
	  },
	
	  update: function update(data) {
	    this.diff(data);
	    this.updateRef();
	    this.updateModel();
	  },
	
	  /**
	   * Diff, based on new data and old data, determine the
	   * minimum amount of DOM manipulations needed to make the
	   * DOM reflect the new data Array.
	   *
	   * The algorithm diffs the new data Array by storing a
	   * hidden reference to an owner vm instance on previously
	   * seen data. This allows us to achieve O(n) which is
	   * better than a levenshtein distance based algorithm,
	   * which is O(m * n).
	   *
	   * @param {Array} data
	   */
	
	  diff: function diff(data) {
	    // check if the Array was converted from an Object
	    var item = data[0];
	    var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');
	
	    var trackByKey = this.params.trackBy;
	    var oldFrags = this.frags;
	    var frags = this.frags = new Array(data.length);
	    var alias = this.alias;
	    var iterator = this.iterator;
	    var start = this.start;
	    var end = this.end;
	    var inDocument = inDoc(start);
	    var init = !oldFrags;
	    var i, l, frag, key, value, primitive;
	
	    // First pass, go through the new Array and fill up
	    // the new frags array. If a piece of data has a cached
	    // instance for it, we reuse it. Otherwise build a new
	    // instance.
	    for (i = 0, l = data.length; i < l; i++) {
	      item = data[i];
	      key = convertedFromObject ? item.$key : null;
	      value = convertedFromObject ? item.$value : item;
	      primitive = !isObject(value);
	      frag = !init && this.getCachedFrag(value, i, key);
	      if (frag) {
	        // reusable fragment
	        frag.reused = true;
	        // update $index
	        frag.scope.$index = i;
	        // update $key
	        if (key) {
	          frag.scope.$key = key;
	        }
	        // update iterator
	        if (iterator) {
	          frag.scope[iterator] = key !== null ? key : i;
	        }
	        // update data for track-by, object repeat &
	        // primitive values.
	        if (trackByKey || convertedFromObject || primitive) {
	          frag.scope[alias] = value;
	        }
	      } else {
	        // new isntance
	        frag = this.create(value, alias, i, key);
	        frag.fresh = !init;
	      }
	      frags[i] = frag;
	      if (init) {
	        frag.before(end);
	      }
	    }
	
	    // we're done for the initial render.
	    if (init) {
	      return;
	    }
	
	    // Second pass, go through the old fragments and
	    // destroy those who are not reused (and remove them
	    // from cache)
	    var removalIndex = 0;
	    var totalRemoved = oldFrags.length - frags.length;
	    // when removing a large number of fragments, watcher removal
	    // turns out to be a perf bottleneck, so we batch the watcher
	    // removals into a single filter call!
	    this.vm._vForRemoving = true;
	    for (i = 0, l = oldFrags.length; i < l; i++) {
	      frag = oldFrags[i];
	      if (!frag.reused) {
	        this.deleteCachedFrag(frag);
	        this.remove(frag, removalIndex++, totalRemoved, inDocument);
	      }
	    }
	    this.vm._vForRemoving = false;
	    if (removalIndex) {
	      this.vm._watchers = this.vm._watchers.filter(function (w) {
	        return w.active;
	      });
	    }
	
	    // Final pass, move/insert new fragments into the
	    // right place.
	    var targetPrev, prevEl, currentPrev;
	    var insertionIndex = 0;
	    for (i = 0, l = frags.length; i < l; i++) {
	      frag = frags[i];
	      // this is the frag that we should be after
	      targetPrev = frags[i - 1];
	      prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
	      if (frag.reused && !frag.staggerCb) {
	        currentPrev = findPrevFrag(frag, start, this.id);
	        if (currentPrev !== targetPrev && (!currentPrev ||
	        // optimization for moving a single item.
	        // thanks to suggestions by @livoras in #1807
	        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
	          this.move(frag, prevEl);
	        }
	      } else {
	        // new instance, or still in stagger.
	        // insert with updated stagger index.
	        this.insert(frag, insertionIndex++, prevEl, inDocument);
	      }
	      frag.reused = frag.fresh = false;
	    }
	  },
	
	  /**
	   * Create a new fragment instance.
	   *
	   * @param {*} value
	   * @param {String} alias
	   * @param {Number} index
	   * @param {String} [key]
	   * @return {Fragment}
	   */
	
	  create: function create(value, alias, index, key) {
	    var host = this._host;
	    // create iteration scope
	    var parentScope = this._scope || this.vm;
	    var scope = Object.create(parentScope);
	    // ref holder for the scope
	    scope.$refs = Object.create(parentScope.$refs);
	    scope.$els = Object.create(parentScope.$els);
	    // make sure point $parent to parent scope
	    scope.$parent = parentScope;
	    // for two-way binding on alias
	    scope.$forContext = this;
	    // define scope properties
	    defineReactive(scope, alias, value);
	    defineReactive(scope, '$index', index);
	    if (key) {
	      defineReactive(scope, '$key', key);
	    } else if (scope.$key) {
	      // avoid accidental fallback
	      def(scope, '$key', null);
	    }
	    if (this.iterator) {
	      defineReactive(scope, this.iterator, key !== null ? key : index);
	    }
	    var frag = this.factory.create(host, scope, this._frag);
	    frag.forId = this.id;
	    this.cacheFrag(value, frag, index, key);
	    return frag;
	  },
	
	  /**
	   * Update the v-ref on owner vm.
	   */
	
	  updateRef: function updateRef() {
	    var ref = this.descriptor.ref;
	    if (!ref) return;
	    var hash = (this._scope || this.vm).$refs;
	    var refs;
	    if (!this.fromObject) {
	      refs = this.frags.map(findVmFromFrag);
	    } else {
	      refs = {};
	      this.frags.forEach(function (frag) {
	        refs[frag.scope.$key] = findVmFromFrag(frag);
	      });
	    }
	    hash[ref] = refs;
	  },
	
	  /**
	   * For option lists, update the containing v-model on
	   * parent <select>.
	   */
	
	  updateModel: function updateModel() {
	    if (this.isOption) {
	      var parent = this.start.parentNode;
	      var model = parent && parent.__v_model;
	      if (model) {
	        model.forceUpdate();
	      }
	    }
	  },
	
	  /**
	   * Insert a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Node} prevEl
	   * @param {Boolean} inDocument
	   */
	
	  insert: function insert(frag, index, prevEl, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	    }
	    var staggerAmount = this.getStagger(frag, index, null, 'enter');
	    if (inDocument && staggerAmount) {
	      // create an anchor and insert it synchronously,
	      // so that we can resolve the correct order without
	      // worrying about some elements not inserted yet
	      var anchor = frag.staggerAnchor;
	      if (!anchor) {
	        anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
	        anchor.__v_frag = frag;
	      }
	      after(anchor, prevEl);
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.before(anchor);
	        remove(anchor);
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      frag.before(prevEl.nextSibling);
	    }
	  },
	
	  /**
	   * Remove a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {Boolean} inDocument
	   */
	
	  remove: function remove(frag, index, total, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	      // it's not possible for the same frag to be removed
	      // twice, so if we have a pending stagger callback,
	      // it means this frag is queued for enter but removed
	      // before its transition started. Since it is already
	      // destroyed, we can just leave it in detached state.
	      return;
	    }
	    var staggerAmount = this.getStagger(frag, index, total, 'leave');
	    if (inDocument && staggerAmount) {
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.remove();
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      frag.remove();
	    }
	  },
	
	  /**
	   * Move a fragment to a new position.
	   * Force no transition.
	   *
	   * @param {Fragment} frag
	   * @param {Node} prevEl
	   */
	
	  move: function move(frag, prevEl) {
	    // fix a common issue with Sortable:
	    // if prevEl doesn't have nextSibling, this means it's
	    // been dragged after the end anchor. Just re-position
	    // the end anchor to the end of the container.
	    /* istanbul ignore if */
	    if (!prevEl.nextSibling) {
	      this.end.parentNode.appendChild(this.end);
	    }
	    frag.before(prevEl.nextSibling, false);
	  },
	
	  /**
	   * Cache a fragment using track-by or the object key.
	   *
	   * @param {*} value
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {String} [key]
	   */
	
	  cacheFrag: function cacheFrag(value, frag, index, key) {
	    var trackByKey = this.params.trackBy;
	    var cache = this.cache;
	    var primitive = !isObject(value);
	    var id;
	    if (key || trackByKey || primitive) {
	      id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      if (!cache[id]) {
	        cache[id] = frag;
	      } else if (trackByKey !== '$index') {
	        process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	      }
	    } else {
	      id = this.id;
	      if (hasOwn(value, id)) {
	        if (value[id] === null) {
	          value[id] = frag;
	        } else {
	          process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	        }
	      } else {
	        def(value, id, frag);
	      }
	    }
	    frag.raw = value;
	  },
	
	  /**
	   * Get a cached fragment from the value/index/key
	   *
	   * @param {*} value
	   * @param {Number} index
	   * @param {String} key
	   * @return {Fragment}
	   */
	
	  getCachedFrag: function getCachedFrag(value, index, key) {
	    var trackByKey = this.params.trackBy;
	    var primitive = !isObject(value);
	    var frag;
	    if (key || trackByKey || primitive) {
	      var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      frag = this.cache[id];
	    } else {
	      frag = value[this.id];
	    }
	    if (frag && (frag.reused || frag.fresh)) {
	      process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	    }
	    return frag;
	  },
	
	  /**
	   * Delete a fragment from cache.
	   *
	   * @param {Fragment} frag
	   */
	
	  deleteCachedFrag: function deleteCachedFrag(frag) {
	    var value = frag.raw;
	    var trackByKey = this.params.trackBy;
	    var scope = frag.scope;
	    var index = scope.$index;
	    // fix #948: avoid accidentally fall through to
	    // a parent repeater which happens to have $key.
	    var key = hasOwn(scope, '$key') && scope.$key;
	    var primitive = !isObject(value);
	    if (trackByKey || key || primitive) {
	      var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
	      this.cache[id] = null;
	    } else {
	      value[this.id] = null;
	      frag.raw = null;
	    }
	  },
	
	  /**
	   * Get the stagger amount for an insertion/removal.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {String} type
	   */
	
	  getStagger: function getStagger(frag, index, total, type) {
	    type = type + 'Stagger';
	    var trans = frag.node.__v_trans;
	    var hooks = trans && trans.hooks;
	    var hook = hooks && (hooks[type] || hooks.stagger);
	    return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
	  },
	
	  /**
	   * Pre-process the value before piping it through the
	   * filters. This is passed to and called by the watcher.
	   */
	
	  _preProcess: function _preProcess(value) {
	    // regardless of type, store the un-filtered raw value.
	    this.rawValue = value;
	    return value;
	  },
	
	  /**
	   * Post-process the value after it has been piped through
	   * the filters. This is passed to and called by the watcher.
	   *
	   * It is necessary for this to be called during the
	   * wathcer's dependency collection phase because we want
	   * the v-for to update when the source Object is mutated.
	   */
	
	  _postProcess: function _postProcess(value) {
	    if (isArray(value)) {
	      return value;
	    } else if (isPlainObject(value)) {
	      // convert plain object to array.
	      var keys = Object.keys(value);
	      var i = keys.length;
	      var res = new Array(i);
	      var key;
	      while (i--) {
	        key = keys[i];
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        };
	      }
	      return res;
	    } else {
	      if (typeof value === 'number' && !isNaN(value)) {
	        value = range(value);
	      }
	      return value || [];
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.descriptor.ref) {
	      (this._scope || this.vm).$refs[this.descriptor.ref] = null;
	    }
	    if (this.frags) {
	      var i = this.frags.length;
	      var frag;
	      while (i--) {
	        frag = this.frags[i];
	        this.deleteCachedFrag(frag);
	        frag.destroy();
	      }
	    }
	  }
	};
	
	/**
	 * Helper to find the previous element that is a fragment
	 * anchor. This is necessary because a destroyed frag's
	 * element could still be lingering in the DOM before its
	 * leaving transition finishes, but its inserted flag
	 * should have been set to false so we can skip them.
	 *
	 * If this is a block repeat, we want to make sure we only
	 * return frag that is bound to this v-for. (see #929)
	 *
	 * @param {Fragment} frag
	 * @param {Comment|Text} anchor
	 * @param {String} id
	 * @return {Fragment}
	 */
	
	function findPrevFrag(frag, anchor, id) {
	  var el = frag.node.previousSibling;
	  /* istanbul ignore if */
	  if (!el) return;
	  frag = el.__v_frag;
	  while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
	    el = el.previousSibling;
	    /* istanbul ignore if */
	    if (!el) return;
	    frag = el.__v_frag;
	  }
	  return frag;
	}
	
	/**
	 * Find a vm from a fragment.
	 *
	 * @param {Fragment} frag
	 * @return {Vue|undefined}
	 */
	
	function findVmFromFrag(frag) {
	  var node = frag.node;
	  // handle multi-node frag
	  if (frag.end) {
	    while (!node.__vue__ && node !== frag.end && node.nextSibling) {
	      node = node.nextSibling;
	    }
	  }
	  return node.__vue__;
	}
	
	/**
	 * Create a range array from given number.
	 *
	 * @param {Number} n
	 * @return {Array}
	 */
	
	function range(n) {
	  var i = -1;
	  var ret = new Array(Math.floor(n));
	  while (++i < n) {
	    ret[i] = i;
	  }
	  return ret;
	}
	
	if (process.env.NODE_ENV !== 'production') {
	  vFor.warnDuplicate = function (value) {
	    warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.');
	  };
	}
	
	var vIf = {
	
	  priority: IF,
	
	  bind: function bind() {
	    var el = this.el;
	    if (!el.__vue__) {
	      // check else block
	      var next = el.nextElementSibling;
	      if (next && getAttr(next, 'v-else') !== null) {
	        remove(next);
	        this.elseFactory = new FragmentFactory(next._context || this.vm, next);
	      }
	      // check main block
	      this.anchor = createAnchor('v-if');
	      replace(el, this.anchor);
	      this.factory = new FragmentFactory(this.vm, el);
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.');
	      this.invalid = true;
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) return;
	    if (value) {
	      if (!this.frag) {
	        this.insert();
	      }
	    } else {
	      this.remove();
	    }
	  },
	
	  insert: function insert() {
	    if (this.elseFrag) {
	      this.elseFrag.remove();
	      this.elseFrag = null;
	    }
	    this.frag = this.factory.create(this._host, this._scope, this._frag);
	    this.frag.before(this.anchor);
	  },
	
	  remove: function remove() {
	    if (this.frag) {
	      this.frag.remove();
	      this.frag = null;
	    }
	    if (this.elseFactory && !this.elseFrag) {
	      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
	      this.elseFrag.before(this.anchor);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	    if (this.elseFrag) {
	      this.elseFrag.destroy();
	    }
	  }
	};
	
	var show = {
	
	  bind: function bind() {
	    // check else block
	    var next = this.el.nextElementSibling;
	    if (next && getAttr(next, 'v-else') !== null) {
	      this.elseEl = next;
	    }
	  },
	
	  update: function update(value) {
	    this.apply(this.el, value);
	    if (this.elseEl) {
	      this.apply(this.elseEl, !value);
	    }
	  },
	
	  apply: function apply(el, value) {
	    if (inDoc(el)) {
	      applyTransition(el, value ? 1 : -1, toggle, this.vm);
	    } else {
	      toggle();
	    }
	    function toggle() {
	      el.style.display = value ? '' : 'none';
	    }
	  }
	};
	
	var text$2 = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	    var isRange = el.type === 'range';
	    var lazy = this.params.lazy;
	    var number = this.params.number;
	    var debounce = this.params.debounce;
	
	    // handle composition events.
	    //   http://blog.evanyou.me/2014/01/03/composition-event/
	    // skip this for Android because it handles composition
	    // events quite differently. Android doesn't trigger
	    // composition events for language input methods e.g.
	    // Chinese, but instead triggers them for spelling
	    // suggestions... (see Discussion/#162)
	    var composing = false;
	    if (!isAndroid && !isRange) {
	      this.on('compositionstart', function () {
	        composing = true;
	      });
	      this.on('compositionend', function () {
	        composing = false;
	        // in IE11 the "compositionend" event fires AFTER
	        // the "input" event, so the input handler is blocked
	        // at the end... have to call it here.
	        //
	        // #1327: in lazy mode this is unecessary.
	        if (!lazy) {
	          self.listener();
	        }
	      });
	    }
	
	    // prevent messing with the input when user is typing,
	    // and force update on blur.
	    this.focused = false;
	    if (!isRange && !lazy) {
	      this.on('focus', function () {
	        self.focused = true;
	      });
	      this.on('blur', function () {
	        self.focused = false;
	      });
	    }
	
	    // Now attach the main listener
	    this.listener = this.rawListener = function () {
	      if (composing || !self._bound) {
	        return;
	      }
	      var val = number || isRange ? toNumber(el.value) : el.value;
	      self.set(val);
	      // force update on next tick to avoid lock & same value
	      // also only update when user is not typing
	      nextTick(function () {
	        if (self._bound && !self.focused) {
	          self.update(self._watcher.value);
	        }
	      });
	    };
	
	    // apply debounce
	    if (debounce) {
	      this.listener = _debounce(this.listener, debounce);
	    }
	
	    // Support jQuery events, since jQuery.trigger() doesn't
	    // trigger native events in some cases and some plugins
	    // rely on $.trigger()
	    //
	    // We want to make sure if a listener is attached using
	    // jQuery, it is also removed with jQuery, that's why
	    // we do the check for each directive instance and
	    // store that check result on itself. This also allows
	    // easier test coverage control by unsetting the global
	    // jQuery variable in tests.
	    this.hasjQuery = typeof jQuery === 'function';
	    if (this.hasjQuery) {
	      var method = jQuery.fn.on ? 'on' : 'bind';
	      jQuery(el)[method]('change', this.rawListener);
	      if (!lazy) {
	        jQuery(el)[method]('input', this.listener);
	      }
	    } else {
	      this.on('change', this.rawListener);
	      if (!lazy) {
	        this.on('input', this.listener);
	      }
	    }
	
	    // IE9 doesn't fire input event on backspace/del/cut
	    if (!lazy && isIE9) {
	      this.on('cut', function () {
	        nextTick(self.listener);
	      });
	      this.on('keyup', function (e) {
	        if (e.keyCode === 46 || e.keyCode === 8) {
	          self.listener();
	        }
	      });
	    }
	
	    // set initial value if present
	    if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    this.el.value = _toString(value);
	  },
	
	  unbind: function unbind() {
	    var el = this.el;
	    if (this.hasjQuery) {
	      var method = jQuery.fn.off ? 'off' : 'unbind';
	      jQuery(el)[method]('change', this.listener);
	      jQuery(el)[method]('input', this.listener);
	    }
	  }
	};
	
	var radio = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      // value overwrite via v-bind:value
	      if (el.hasOwnProperty('_value')) {
	        return el._value;
	      }
	      var val = el.value;
	      if (self.params.number) {
	        val = toNumber(val);
	      }
	      return val;
	    };
	
	    this.listener = function () {
	      self.set(self.getValue());
	    };
	    this.on('change', this.listener);
	
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    this.el.checked = looseEqual(value, this.getValue());
	  }
	};
	
	var select = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    // method to force update DOM using latest value.
	    this.forceUpdate = function () {
	      if (self._watcher) {
	        self.update(self._watcher.get());
	      }
	    };
	
	    // check if this is a multiple select
	    var multiple = this.multiple = el.hasAttribute('multiple');
	
	    // attach listener
	    this.listener = function () {
	      var value = getValue(el, multiple);
	      value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
	      self.set(value);
	    };
	    this.on('change', this.listener);
	
	    // if has initial value, set afterBind
	    var initValue = getValue(el, multiple, true);
	    if (multiple && initValue.length || !multiple && initValue !== null) {
	      this.afterBind = this.listener;
	    }
	
	    // All major browsers except Firefox resets
	    // selectedIndex with value -1 to 0 when the element
	    // is appended to a new parent, therefore we have to
	    // force a DOM update whenever that happens...
	    this.vm.$on('hook:attached', this.forceUpdate);
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    el.selectedIndex = -1;
	    var multi = this.multiple && isArray(value);
	    var options = el.options;
	    var i = options.length;
	    var op, val;
	    while (i--) {
	      op = options[i];
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      /* eslint-disable eqeqeq */
	      op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
	      /* eslint-enable eqeqeq */
	    }
	  },
	
	  unbind: function unbind() {
	    /* istanbul ignore next */
	    this.vm.$off('hook:attached', this.forceUpdate);
	  }
	};
	
	/**
	 * Get select value
	 *
	 * @param {SelectElement} el
	 * @param {Boolean} multi
	 * @param {Boolean} init
	 * @return {Array|*}
	 */
	
	function getValue(el, multi, init) {
	  var res = multi ? [] : null;
	  var op, val, selected;
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    op = el.options[i];
	    selected = init ? op.hasAttribute('selected') : op.selected;
	    if (selected) {
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      if (multi) {
	        res.push(val);
	      } else {
	        return val;
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Native Array.indexOf uses strict equal, but in this
	 * case we need to match string/numbers with custom equal.
	 *
	 * @param {Array} arr
	 * @param {*} val
	 */
	
	function indexOf$1(arr, val) {
	  var i = arr.length;
	  while (i--) {
	    if (looseEqual(arr[i], val)) {
	      return i;
	    }
	  }
	  return -1;
	}
	
	var checkbox = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
	    };
	
	    function getBooleanValue() {
	      var val = el.checked;
	      if (val && el.hasOwnProperty('_trueValue')) {
	        return el._trueValue;
	      }
	      if (!val && el.hasOwnProperty('_falseValue')) {
	        return el._falseValue;
	      }
	      return val;
	    }
	
	    this.listener = function () {
	      var model = self._watcher.value;
	      if (isArray(model)) {
	        var val = self.getValue();
	        if (el.checked) {
	          if (indexOf(model, val) < 0) {
	            model.push(val);
	          }
	        } else {
	          model.$remove(val);
	        }
	      } else {
	        self.set(getBooleanValue());
	      }
	    };
	
	    this.on('change', this.listener);
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    if (isArray(value)) {
	      el.checked = indexOf(value, this.getValue()) > -1;
	    } else {
	      if (el.hasOwnProperty('_trueValue')) {
	        el.checked = looseEqual(value, el._trueValue);
	      } else {
	        el.checked = !!value;
	      }
	    }
	  }
	};
	
	var handlers = {
	  text: text$2,
	  radio: radio,
	  select: select,
	  checkbox: checkbox
	};
	
	var model = {
	
	  priority: MODEL,
	  twoWay: true,
	  handlers: handlers,
	  params: ['lazy', 'number', 'debounce'],
	
	  /**
	   * Possible elements:
	   *   <select>
	   *   <textarea>
	   *   <input type="*">
	   *     - text
	   *     - checkbox
	   *     - radio
	   *     - number
	   */
	
	  bind: function bind() {
	    // friendly warning...
	    this.checkFilters();
	    if (this.hasRead && !this.hasWrite) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model. You might want to use a two-way filter ' + 'to ensure correct behavior.');
	    }
	    var el = this.el;
	    var tag = el.tagName;
	    var handler;
	    if (tag === 'INPUT') {
	      handler = handlers[el.type] || handlers.text;
	    } else if (tag === 'SELECT') {
	      handler = handlers.select;
	    } else if (tag === 'TEXTAREA') {
	      handler = handlers.text;
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-model does not support element type: ' + tag);
	      return;
	    }
	    el.__v_model = this;
	    handler.bind.call(this);
	    this.update = handler.update;
	    this._unbind = handler.unbind;
	  },
	
	  /**
	   * Check read/write filter stats.
	   */
	
	  checkFilters: function checkFilters() {
	    var filters = this.filters;
	    if (!filters) return;
	    var i = filters.length;
	    while (i--) {
	      var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
	      if (typeof filter === 'function' || filter.read) {
	        this.hasRead = true;
	      }
	      if (filter.write) {
	        this.hasWrite = true;
	      }
	    }
	  },
	
	  unbind: function unbind() {
	    this.el.__v_model = null;
	    this._unbind && this._unbind();
	  }
	};
	
	// keyCode aliases
	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  'delete': [8, 46],
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	};
	
	function keyFilter(handler, keys) {
	  var codes = keys.map(function (key) {
	    var charCode = key.charCodeAt(0);
	    if (charCode > 47 && charCode < 58) {
	      return parseInt(key, 10);
	    }
	    if (key.length === 1) {
	      charCode = key.toUpperCase().charCodeAt(0);
	      if (charCode > 64 && charCode < 91) {
	        return charCode;
	      }
	    }
	    return keyCodes[key];
	  });
	  codes = [].concat.apply([], codes);
	  return function keyHandler(e) {
	    if (codes.indexOf(e.keyCode) > -1) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	function stopFilter(handler) {
	  return function stopHandler(e) {
	    e.stopPropagation();
	    return handler.call(this, e);
	  };
	}
	
	function preventFilter(handler) {
	  return function preventHandler(e) {
	    e.preventDefault();
	    return handler.call(this, e);
	  };
	}
	
	function selfFilter(handler) {
	  return function selfHandler(e) {
	    if (e.target === e.currentTarget) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	var on$1 = {
	
	  priority: ON,
	  acceptStatement: true,
	  keyCodes: keyCodes,
	
	  bind: function bind() {
	    // deal with iframes
	    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
	      var self = this;
	      this.iframeBind = function () {
	        on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
	      };
	      this.on('load', this.iframeBind);
	    }
	  },
	
	  update: function update(handler) {
	    // stub a noop for v-on with no value,
	    // e.g. @mousedown.prevent
	    if (!this.descriptor.raw) {
	      handler = function () {};
	    }
	
	    if (typeof handler !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler);
	      return;
	    }
	
	    // apply modifiers
	    if (this.modifiers.stop) {
	      handler = stopFilter(handler);
	    }
	    if (this.modifiers.prevent) {
	      handler = preventFilter(handler);
	    }
	    if (this.modifiers.self) {
	      handler = selfFilter(handler);
	    }
	    // key filter
	    var keys = Object.keys(this.modifiers).filter(function (key) {
	      return key !== 'stop' && key !== 'prevent';
	    });
	    if (keys.length) {
	      handler = keyFilter(handler, keys);
	    }
	
	    this.reset();
	    this.handler = handler;
	
	    if (this.iframeBind) {
	      this.iframeBind();
	    } else {
	      on(this.el, this.arg, this.handler, this.modifiers.capture);
	    }
	  },
	
	  reset: function reset() {
	    var el = this.iframeBind ? this.el.contentWindow : this.el;
	    if (this.handler) {
	      off(el, this.arg, this.handler);
	    }
	  },
	
	  unbind: function unbind() {
	    this.reset();
	  }
	};
	
	var prefixes = ['-webkit-', '-moz-', '-ms-'];
	var camelPrefixes = ['Webkit', 'Moz', 'ms'];
	var importantRE = /!important;?$/;
	var propCache = Object.create(null);
	
	var testEl = null;
	
	var style = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (typeof value === 'string') {
	      this.el.style.cssText = value;
	    } else if (isArray(value)) {
	      this.handleObject(value.reduce(extend, {}));
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  handleObject: function handleObject(value) {
	    // cache object styles so that only changed props
	    // are actually updated.
	    var cache = this.cache || (this.cache = {});
	    var name, val;
	    for (name in cache) {
	      if (!(name in value)) {
	        this.handleSingle(name, null);
	        delete cache[name];
	      }
	    }
	    for (name in value) {
	      val = value[name];
	      if (val !== cache[name]) {
	        cache[name] = val;
	        this.handleSingle(name, val);
	      }
	    }
	  },
	
	  handleSingle: function handleSingle(prop, value) {
	    prop = normalize(prop);
	    if (!prop) return; // unsupported prop
	    // cast possible numbers/booleans into strings
	    if (value != null) value += '';
	    if (value) {
	      var isImportant = importantRE.test(value) ? 'important' : '';
	      if (isImportant) {
	        value = value.replace(importantRE, '').trim();
	      }
	      this.el.style.setProperty(prop, value, isImportant);
	    } else {
	      this.el.style.removeProperty(prop);
	    }
	  }
	
	};
	
	/**
	 * Normalize a CSS property name.
	 * - cache result
	 * - auto prefix
	 * - camelCase -> dash-case
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function normalize(prop) {
	  if (propCache[prop]) {
	    return propCache[prop];
	  }
	  var res = prefix(prop);
	  propCache[prop] = propCache[res] = res;
	  return res;
	}
	
	/**
	 * Auto detect the appropriate prefix for a CSS property.
	 * https://gist.github.com/paulirish/523692
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function prefix(prop) {
	  prop = hyphenate(prop);
	  var camel = camelize(prop);
	  var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
	  if (!testEl) {
	    testEl = document.createElement('div');
	  }
	  var i = prefixes.length;
	  var prefixed;
	  while (i--) {
	    prefixed = camelPrefixes[i] + upper;
	    if (prefixed in testEl.style) {
	      return prefixes[i] + prop;
	    }
	  }
	  if (camel in testEl.style) {
	    return prop;
	  }
	}
	
	// xlink
	var xlinkNS = 'http://www.w3.org/1999/xlink';
	var xlinkRE = /^xlink:/;
	
	// check for attributes that prohibit interpolations
	var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
	// these attributes should also set their corresponding properties
	// because they only affect the initial state of the element
	var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
	// these attributes expect enumrated values of "true" or "false"
	// but are not boolean attributes
	var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;
	
	// these attributes should set a hidden property for
	// binding v-model to object values
	var modelProps = {
	  value: '_value',
	  'true-value': '_trueValue',
	  'false-value': '_falseValue'
	};
	
	var bind$1 = {
	
	  priority: BIND,
	
	  bind: function bind() {
	    var attr = this.arg;
	    var tag = this.el.tagName;
	    // should be deep watch on object mode
	    if (!attr) {
	      this.deep = true;
	    }
	    // handle interpolation bindings
	    var descriptor = this.descriptor;
	    var tokens = descriptor.interp;
	    if (tokens) {
	      // handle interpolations with one-time tokens
	      if (descriptor.hasOneTime) {
	        this.expression = tokensToExp(tokens, this._scope || this.vm);
	      }
	
	      // only allow binding on native attributes
	      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
	        process.env.NODE_ENV !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.');
	        this.el.removeAttribute(attr);
	        this.invalid = true;
	      }
	
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production') {
	        var raw = attr + '="' + descriptor.raw + '": ';
	        // warn src
	        if (attr === 'src') {
	          warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.');
	        }
	
	        // warn style
	        if (attr === 'style') {
	          warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.');
	        }
	      }
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) {
	      return;
	    }
	    var attr = this.arg;
	    if (this.arg) {
	      this.handleSingle(attr, value);
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  // share object handler with v-bind:class
	  handleObject: style.handleObject,
	
	  handleSingle: function handleSingle(attr, value) {
	    var el = this.el;
	    var interp = this.descriptor.interp;
	    if (this.modifiers.camel) {
	      attr = camelize(attr);
	    }
	    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
	      el[attr] = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
	      ? '' : value : value;
	    }
	    // set model props
	    var modelProp = modelProps[attr];
	    if (!interp && modelProp) {
	      el[modelProp] = value;
	      // update v-model if present
	      var model = el.__v_model;
	      if (model) {
	        model.listener();
	      }
	    }
	    // do not set value attribute for textarea
	    if (attr === 'value' && el.tagName === 'TEXTAREA') {
	      el.removeAttribute(attr);
	      return;
	    }
	    // update attribute
	    if (enumeratedAttrRE.test(attr)) {
	      el.setAttribute(attr, value ? 'true' : 'false');
	    } else if (value != null && value !== false) {
	      if (attr === 'class') {
	        // handle edge case #1960:
	        // class interpolation should not overwrite Vue transition class
	        if (el.__v_trans) {
	          value += ' ' + el.__v_trans.id + '-transition';
	        }
	        setClass(el, value);
	      } else if (xlinkRE.test(attr)) {
	        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
	      } else {
	        el.setAttribute(attr, value === true ? '' : value);
	      }
	    } else {
	      el.removeAttribute(attr);
	    }
	  }
	};
	
	var el = {
	
	  priority: EL,
	
	  bind: function bind() {
	    /* istanbul ignore if */
	    if (!this.arg) {
	      return;
	    }
	    var id = this.id = camelize(this.arg);
	    var refs = (this._scope || this.vm).$els;
	    if (hasOwn(refs, id)) {
	      refs[id] = this.el;
	    } else {
	      defineReactive(refs, id, this.el);
	    }
	  },
	
	  unbind: function unbind() {
	    var refs = (this._scope || this.vm).$els;
	    if (refs[this.id] === this.el) {
	      refs[this.id] = null;
	    }
	  }
	};
	
	var ref = {
	  bind: function bind() {
	    process.env.NODE_ENV !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.');
	  }
	};
	
	var cloak = {
	  bind: function bind() {
	    var el = this.el;
	    this.vm.$once('pre-hook:compiled', function () {
	      el.removeAttribute('v-cloak');
	    });
	  }
	};
	
	// must export plain object
	var directives = {
	  text: text$1,
	  html: html,
	  'for': vFor,
	  'if': vIf,
	  show: show,
	  model: model,
	  on: on$1,
	  bind: bind$1,
	  el: el,
	  ref: ref,
	  cloak: cloak
	};
	
	var vClass = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (value && typeof value === 'string') {
	      this.handleObject(stringToObject(value));
	    } else if (isPlainObject(value)) {
	      this.handleObject(value);
	    } else if (isArray(value)) {
	      this.handleArray(value);
	    } else {
	      this.cleanup();
	    }
	  },
	
	  handleObject: function handleObject(value) {
	    this.cleanup(value);
	    var keys = this.prevKeys = Object.keys(value);
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i];
	      if (value[key]) {
	        addClass(this.el, key);
	      } else {
	        removeClass(this.el, key);
	      }
	    }
	  },
	
	  handleArray: function handleArray(value) {
	    this.cleanup(value);
	    for (var i = 0, l = value.length; i < l; i++) {
	      if (value[i]) {
	        addClass(this.el, value[i]);
	      }
	    }
	    this.prevKeys = value.slice();
	  },
	
	  cleanup: function cleanup(value) {
	    if (this.prevKeys) {
	      var i = this.prevKeys.length;
	      while (i--) {
	        var key = this.prevKeys[i];
	        if (key && (!value || !contains(value, key))) {
	          removeClass(this.el, key);
	        }
	      }
	    }
	  }
	};
	
	function stringToObject(value) {
	  var res = {};
	  var keys = value.trim().split(/\s+/);
	  var i = keys.length;
	  while (i--) {
	    res[keys[i]] = true;
	  }
	  return res;
	}
	
	function contains(value, key) {
	  return isArray(value) ? value.indexOf(key) > -1 : hasOwn(value, key);
	}
	
	var component = {
	
	  priority: COMPONENT,
	
	  params: ['keep-alive', 'transition-mode', 'inline-template'],
	
	  /**
	   * Setup. Two possible usages:
	   *
	   * - static:
	   *   <comp> or <div v-component="comp">
	   *
	   * - dynamic:
	   *   <component :is="view">
	   */
	
	  bind: function bind() {
	    if (!this.el.__vue__) {
	      // keep-alive cache
	      this.keepAlive = this.params.keepAlive;
	      if (this.keepAlive) {
	        this.cache = {};
	      }
	      // check inline-template
	      if (this.params.inlineTemplate) {
	        // extract inline template as a DocumentFragment
	        this.inlineTemplate = extractContent(this.el, true);
	      }
	      // component resolution related state
	      this.pendingComponentCb = this.Component = null;
	      // transition related state
	      this.pendingRemovals = 0;
	      this.pendingRemovalCb = null;
	      // create a ref anchor
	      this.anchor = createAnchor('v-component');
	      replace(this.el, this.anchor);
	      // remove is attribute.
	      // this is removed during compilation, but because compilation is
	      // cached, when the component is used elsewhere this attribute
	      // will remain at link time.
	      this.el.removeAttribute('is');
	      // remove ref, same as above
	      if (this.descriptor.ref) {
	        this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
	      }
	      // if static, build right now.
	      if (this.literal) {
	        this.setComponent(this.expression);
	      }
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
	    }
	  },
	
	  /**
	   * Public update, called by the watcher in the dynamic
	   * literal scenario, e.g. <component :is="view">
	   */
	
	  update: function update(value) {
	    if (!this.literal) {
	      this.setComponent(value);
	    }
	  },
	
	  /**
	   * Switch dynamic components. May resolve the component
	   * asynchronously, and perform transition based on
	   * specified transition mode. Accepts a few additional
	   * arguments specifically for vue-router.
	   *
	   * The callback is called when the full transition is
	   * finished.
	   *
	   * @param {String} value
	   * @param {Function} [cb]
	   */
	
	  setComponent: function setComponent(value, cb) {
	    this.invalidatePending();
	    if (!value) {
	      // just remove current
	      this.unbuild(true);
	      this.remove(this.childVM, cb);
	      this.childVM = null;
	    } else {
	      var self = this;
	      this.resolveComponent(value, function () {
	        self.mountComponent(cb);
	      });
	    }
	  },
	
	  /**
	   * Resolve the component constructor to use when creating
	   * the child vm.
	   */
	
	  resolveComponent: function resolveComponent(id, cb) {
	    var self = this;
	    this.pendingComponentCb = cancellable(function (Component) {
	      self.ComponentName = Component.options.name || id;
	      self.Component = Component;
	      cb();
	    });
	    this.vm._resolveComponent(id, this.pendingComponentCb);
	  },
	
	  /**
	   * Create a new instance using the current constructor and
	   * replace the existing instance. This method doesn't care
	   * whether the new component and the old one are actually
	   * the same.
	   *
	   * @param {Function} [cb]
	   */
	
	  mountComponent: function mountComponent(cb) {
	    // actual mount
	    this.unbuild(true);
	    var self = this;
	    var activateHooks = this.Component.options.activate;
	    var cached = this.getCached();
	    var newComponent = this.build();
	    if (activateHooks && !cached) {
	      this.waitingFor = newComponent;
	      callActivateHooks(activateHooks, newComponent, function () {
	        if (self.waitingFor !== newComponent) {
	          return;
	        }
	        self.waitingFor = null;
	        self.transition(newComponent, cb);
	      });
	    } else {
	      // update ref for kept-alive component
	      if (cached) {
	        newComponent._updateRef();
	      }
	      this.transition(newComponent, cb);
	    }
	  },
	
	  /**
	   * When the component changes or unbinds before an async
	   * constructor is resolved, we need to invalidate its
	   * pending callback.
	   */
	
	  invalidatePending: function invalidatePending() {
	    if (this.pendingComponentCb) {
	      this.pendingComponentCb.cancel();
	      this.pendingComponentCb = null;
	    }
	  },
	
	  /**
	   * Instantiate/insert a new child vm.
	   * If keep alive and has cached instance, insert that
	   * instance; otherwise build a new one and cache it.
	   *
	   * @param {Object} [extraOptions]
	   * @return {Vue} - the created instance
	   */
	
	  build: function build(extraOptions) {
	    var cached = this.getCached();
	    if (cached) {
	      return cached;
	    }
	    if (this.Component) {
	      // default options
	      var options = {
	        name: this.ComponentName,
	        el: cloneNode(this.el),
	        template: this.inlineTemplate,
	        // make sure to add the child with correct parent
	        // if this is a transcluded component, its parent
	        // should be the transclusion host.
	        parent: this._host || this.vm,
	        // if no inline-template, then the compiled
	        // linker can be cached for better performance.
	        _linkerCachable: !this.inlineTemplate,
	        _ref: this.descriptor.ref,
	        _asComponent: true,
	        _isRouterView: this._isRouterView,
	        // if this is a transcluded component, context
	        // will be the common parent vm of this instance
	        // and its host.
	        _context: this.vm,
	        // if this is inside an inline v-for, the scope
	        // will be the intermediate scope created for this
	        // repeat fragment. this is used for linking props
	        // and container directives.
	        _scope: this._scope,
	        // pass in the owner fragment of this component.
	        // this is necessary so that the fragment can keep
	        // track of its contained components in order to
	        // call attach/detach hooks for them.
	        _frag: this._frag
	      };
	      // extra options
	      // in 1.0.0 this is used by vue-router only
	      /* istanbul ignore if */
	      if (extraOptions) {
	        extend(options, extraOptions);
	      }
	      var child = new this.Component(options);
	      if (this.keepAlive) {
	        this.cache[this.Component.cid] = child;
	      }
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
	        warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template);
	      }
	      return child;
	    }
	  },
	
	  /**
	   * Try to get a cached instance of the current component.
	   *
	   * @return {Vue|undefined}
	   */
	
	  getCached: function getCached() {
	    return this.keepAlive && this.cache[this.Component.cid];
	  },
	
	  /**
	   * Teardown the current child, but defers cleanup so
	   * that we can separate the destroy and removal steps.
	   *
	   * @param {Boolean} defer
	   */
	
	  unbuild: function unbuild(defer) {
	    if (this.waitingFor) {
	      this.waitingFor.$destroy();
	      this.waitingFor = null;
	    }
	    var child = this.childVM;
	    if (!child || this.keepAlive) {
	      if (child) {
	        // remove ref
	        child._updateRef(true);
	      }
	      return;
	    }
	    // the sole purpose of `deferCleanup` is so that we can
	    // "deactivate" the vm right now and perform DOM removal
	    // later.
	    child.$destroy(false, defer);
	  },
	
	  /**
	   * Remove current destroyed child and manually do
	   * the cleanup after removal.
	   *
	   * @param {Function} cb
	   */
	
	  remove: function remove(child, cb) {
	    var keepAlive = this.keepAlive;
	    if (child) {
	      // we may have a component switch when a previous
	      // component is still being transitioned out.
	      // we want to trigger only one lastest insertion cb
	      // when the existing transition finishes. (#1119)
	      this.pendingRemovals++;
	      this.pendingRemovalCb = cb;
	      var self = this;
	      child.$remove(function () {
	        self.pendingRemovals--;
	        if (!keepAlive) child._cleanup();
	        if (!self.pendingRemovals && self.pendingRemovalCb) {
	          self.pendingRemovalCb();
	          self.pendingRemovalCb = null;
	        }
	      });
	    } else if (cb) {
	      cb();
	    }
	  },
	
	  /**
	   * Actually swap the components, depending on the
	   * transition mode. Defaults to simultaneous.
	   *
	   * @param {Vue} target
	   * @param {Function} [cb]
	   */
	
	  transition: function transition(target, cb) {
	    var self = this;
	    var current = this.childVM;
	    // for devtool inspection
	    if (process.env.NODE_ENV !== 'production') {
	      if (current) current._inactive = true;
	      target._inactive = false;
	    }
	    this.childVM = target;
	    switch (self.params.transitionMode) {
	      case 'in-out':
	        target.$before(self.anchor, function () {
	          self.remove(current, cb);
	        });
	        break;
	      case 'out-in':
	        self.remove(current, function () {
	          target.$before(self.anchor, cb);
	        });
	        break;
	      default:
	        self.remove(current);
	        target.$before(self.anchor, cb);
	    }
	  },
	
	  /**
	   * Unbind.
	   */
	
	  unbind: function unbind() {
	    this.invalidatePending();
	    // Do not defer cleanup when unbinding
	    this.unbuild();
	    // destroy all keep-alive cached instances
	    if (this.cache) {
	      for (var key in this.cache) {
	        this.cache[key].$destroy();
	      }
	      this.cache = null;
	    }
	  }
	};
	
	/**
	 * Call activate hooks in order (asynchronous)
	 *
	 * @param {Array} hooks
	 * @param {Vue} vm
	 * @param {Function} cb
	 */
	
	function callActivateHooks(hooks, vm, cb) {
	  var total = hooks.length;
	  var called = 0;
	  hooks[0].call(vm, next);
	  function next() {
	    if (++called >= total) {
	      cb();
	    } else {
	      hooks[called].call(vm, next);
	    }
	  }
	}
	
	var bindingModes = config._propBindingModes;
	
	var propDef = {
	
	  bind: function bind() {
	    var child = this.vm;
	    var parent = child._context;
	    // passed in from compiler directly
	    var prop = this.descriptor.prop;
	    var childKey = prop.path;
	    var parentKey = prop.parentPath;
	    var twoWay = prop.mode === bindingModes.TWO_WAY;
	
	    var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
	      val = coerceProp(prop, val);
	      if (assertProp(prop, val)) {
	        child[childKey] = val;
	      }
	    }, {
	      twoWay: twoWay,
	      filters: prop.filters,
	      // important: props need to be observed on the
	      // v-for scope if present
	      scope: this._scope
	    });
	
	    // set the child initial value.
	    initProp(child, prop, parentWatcher.value);
	
	    // setup two-way binding
	    if (twoWay) {
	      // important: defer the child watcher creation until
	      // the created hook (after data observation)
	      var self = this;
	      child.$once('pre-hook:created', function () {
	        self.childWatcher = new Watcher(child, childKey, function (val) {
	          parentWatcher.set(val);
	        }, {
	          // ensure sync upward before parent sync down.
	          // this is necessary in cases e.g. the child
	          // mutates a prop array, then replaces it. (#1683)
	          sync: true
	        });
	      });
	    }
	  },
	
	  unbind: function unbind() {
	    this.parentWatcher.teardown();
	    if (this.childWatcher) {
	      this.childWatcher.teardown();
	    }
	  }
	};
	
	var queue$1 = [];
	var queued = false;
	
	/**
	 * Push a job into the queue.
	 *
	 * @param {Function} job
	 */
	
	function pushJob(job) {
	  queue$1.push(job);
	  if (!queued) {
	    queued = true;
	    nextTick(flush);
	  }
	}
	
	/**
	 * Flush the queue, and do one forced reflow before
	 * triggering transitions.
	 */
	
	function flush() {
	  // Force layout
	  var f = document.documentElement.offsetHeight;
	  for (var i = 0; i < queue$1.length; i++) {
	    queue$1[i]();
	  }
	  queue$1 = [];
	  queued = false;
	  // dummy return, so js linters don't complain about
	  // unused variable f
	  return f;
	}
	
	var TYPE_TRANSITION = 'transition';
	var TYPE_ANIMATION = 'animation';
	var transDurationProp = transitionProp + 'Duration';
	var animDurationProp = animationProp + 'Duration';
	
	/**
	 * A Transition object that encapsulates the state and logic
	 * of the transition.
	 *
	 * @param {Element} el
	 * @param {String} id
	 * @param {Object} hooks
	 * @param {Vue} vm
	 */
	function Transition(el, id, hooks, vm) {
	  this.id = id;
	  this.el = el;
	  this.enterClass = hooks && hooks.enterClass || id + '-enter';
	  this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
	  this.hooks = hooks;
	  this.vm = vm;
	  // async state
	  this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
	  this.justEntered = false;
	  this.entered = this.left = false;
	  this.typeCache = {};
	  // check css transition type
	  this.type = hooks && hooks.type;
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV !== 'production') {
	    if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
	      warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type);
	    }
	  }
	  // bind
	  var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
	    self[m] = bind(self[m], self);
	  });
	}
	
	var p$1 = Transition.prototype;
	
	/**
	 * Start an entering transition.
	 *
	 * 1. enter transition triggered
	 * 2. call beforeEnter hook
	 * 3. add enter class
	 * 4. insert/show element
	 * 5. call enter hook (with possible explicit js callback)
	 * 6. reflow
	 * 7. based on transition type:
	 *    - transition:
	 *        remove class now, wait for transitionend,
	 *        then done if there's no explicit js callback.
	 *    - animation:
	 *        wait for animationend, remove class,
	 *        then done if there's no explicit js callback.
	 *    - no css transition:
	 *        done now if there's no explicit js callback.
	 * 8. wait for either done or js callback, then call
	 *    afterEnter hook.
	 *
	 * @param {Function} op - insert/show the element
	 * @param {Function} [cb]
	 */
	
	p$1.enter = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeEnter');
	  this.cb = cb;
	  addClass(this.el, this.enterClass);
	  op();
	  this.entered = false;
	  this.callHookWithCb('enter');
	  if (this.entered) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.enterCancelled;
	  pushJob(this.enterNextTick);
	};
	
	/**
	 * The "nextTick" phase of an entering transition, which is
	 * to be pushed into a queue and executed after a reflow so
	 * that removing the class can trigger a CSS transition.
	 */
	
	p$1.enterNextTick = function () {
	  // Important hack:
	  // in Chrome, if a just-entered element is applied the
	  // leave class while its interpolated property still has
	  // a very small value (within one frame), Chrome will
	  // skip the leave transition entirely and not firing the
	  // transtionend event. Therefore we need to protected
	  // against such cases using a one-frame timeout.
	  this.justEntered = true;
	  var self = this;
	  setTimeout(function () {
	    self.justEntered = false;
	  }, 17);
	
	  var enterDone = this.enterDone;
	  var type = this.getCssTransitionType(this.enterClass);
	  if (!this.pendingJsCb) {
	    if (type === TYPE_TRANSITION) {
	      // trigger transition by removing enter class now
	      removeClass(this.el, this.enterClass);
	      this.setupCssCb(transitionEndEvent, enterDone);
	    } else if (type === TYPE_ANIMATION) {
	      this.setupCssCb(animationEndEvent, enterDone);
	    } else {
	      enterDone();
	    }
	  } else if (type === TYPE_TRANSITION) {
	    removeClass(this.el, this.enterClass);
	  }
	};
	
	/**
	 * The "cleanup" phase of an entering transition.
	 */
	
	p$1.enterDone = function () {
	  this.entered = true;
	  this.cancel = this.pendingJsCb = null;
	  removeClass(this.el, this.enterClass);
	  this.callHook('afterEnter');
	  if (this.cb) this.cb();
	};
	
	/**
	 * Start a leaving transition.
	 *
	 * 1. leave transition triggered.
	 * 2. call beforeLeave hook
	 * 3. add leave class (trigger css transition)
	 * 4. call leave hook (with possible explicit js callback)
	 * 5. reflow if no explicit js callback is provided
	 * 6. based on transition type:
	 *    - transition or animation:
	 *        wait for end event, remove class, then done if
	 *        there's no explicit js callback.
	 *    - no css transition:
	 *        done if there's no explicit js callback.
	 * 7. wait for either done or js callback, then call
	 *    afterLeave hook.
	 *
	 * @param {Function} op - remove/hide the element
	 * @param {Function} [cb]
	 */
	
	p$1.leave = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeLeave');
	  this.op = op;
	  this.cb = cb;
	  addClass(this.el, this.leaveClass);
	  this.left = false;
	  this.callHookWithCb('leave');
	  if (this.left) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.leaveCancelled;
	  // only need to handle leaveDone if
	  // 1. the transition is already done (synchronously called
	  //    by the user, which causes this.op set to null)
	  // 2. there's no explicit js callback
	  if (this.op && !this.pendingJsCb) {
	    // if a CSS transition leaves immediately after enter,
	    // the transitionend event never fires. therefore we
	    // detect such cases and end the leave immediately.
	    if (this.justEntered) {
	      this.leaveDone();
	    } else {
	      pushJob(this.leaveNextTick);
	    }
	  }
	};
	
	/**
	 * The "nextTick" phase of a leaving transition.
	 */
	
	p$1.leaveNextTick = function () {
	  var type = this.getCssTransitionType(this.leaveClass);
	  if (type) {
	    var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
	    this.setupCssCb(event, this.leaveDone);
	  } else {
	    this.leaveDone();
	  }
	};
	
	/**
	 * The "cleanup" phase of a leaving transition.
	 */
	
	p$1.leaveDone = function () {
	  this.left = true;
	  this.cancel = this.pendingJsCb = null;
	  this.op();
	  removeClass(this.el, this.leaveClass);
	  this.callHook('afterLeave');
	  if (this.cb) this.cb();
	  this.op = null;
	};
	
	/**
	 * Cancel any pending callbacks from a previously running
	 * but not finished transition.
	 */
	
	p$1.cancelPending = function () {
	  this.op = this.cb = null;
	  var hasPending = false;
	  if (this.pendingCssCb) {
	    hasPending = true;
	    off(this.el, this.pendingCssEvent, this.pendingCssCb);
	    this.pendingCssEvent = this.pendingCssCb = null;
	  }
	  if (this.pendingJsCb) {
	    hasPending = true;
	    this.pendingJsCb.cancel();
	    this.pendingJsCb = null;
	  }
	  if (hasPending) {
	    removeClass(this.el, this.enterClass);
	    removeClass(this.el, this.leaveClass);
	  }
	  if (this.cancel) {
	    this.cancel.call(this.vm, this.el);
	    this.cancel = null;
	  }
	};
	
	/**
	 * Call a user-provided synchronous hook function.
	 *
	 * @param {String} type
	 */
	
	p$1.callHook = function (type) {
	  if (this.hooks && this.hooks[type]) {
	    this.hooks[type].call(this.vm, this.el);
	  }
	};
	
	/**
	 * Call a user-provided, potentially-async hook function.
	 * We check for the length of arguments to see if the hook
	 * expects a `done` callback. If true, the transition's end
	 * will be determined by when the user calls that callback;
	 * otherwise, the end is determined by the CSS transition or
	 * animation.
	 *
	 * @param {String} type
	 */
	
	p$1.callHookWithCb = function (type) {
	  var hook = this.hooks && this.hooks[type];
	  if (hook) {
	    if (hook.length > 1) {
	      this.pendingJsCb = cancellable(this[type + 'Done']);
	    }
	    hook.call(this.vm, this.el, this.pendingJsCb);
	  }
	};
	
	/**
	 * Get an element's transition type based on the
	 * calculated styles.
	 *
	 * @param {String} className
	 * @return {Number}
	 */
	
	p$1.getCssTransitionType = function (className) {
	  /* istanbul ignore if */
	  if (!transitionEndEvent ||
	  // skip CSS transitions if page is not visible -
	  // this solves the issue of transitionend events not
	  // firing until the page is visible again.
	  // pageVisibility API is supported in IE10+, same as
	  // CSS transitions.
	  document.hidden ||
	  // explicit js-only transition
	  this.hooks && this.hooks.css === false ||
	  // element is hidden
	  isHidden(this.el)) {
	    return;
	  }
	  var type = this.type || this.typeCache[className];
	  if (type) return type;
	  var inlineStyles = this.el.style;
	  var computedStyles = window.getComputedStyle(this.el);
	  var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
	  if (transDuration && transDuration !== '0s') {
	    type = TYPE_TRANSITION;
	  } else {
	    var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
	    if (animDuration && animDuration !== '0s') {
	      type = TYPE_ANIMATION;
	    }
	  }
	  if (type) {
	    this.typeCache[className] = type;
	  }
	  return type;
	};
	
	/**
	 * Setup a CSS transitionend/animationend callback.
	 *
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	p$1.setupCssCb = function (event, cb) {
	  this.pendingCssEvent = event;
	  var self = this;
	  var el = this.el;
	  var onEnd = this.pendingCssCb = function (e) {
	    if (e.target === el) {
	      off(el, event, onEnd);
	      self.pendingCssEvent = self.pendingCssCb = null;
	      if (!self.pendingJsCb && cb) {
	        cb();
	      }
	    }
	  };
	  on(el, event, onEnd);
	};
	
	/**
	 * Check if an element is hidden - in that case we can just
	 * skip the transition alltogether.
	 *
	 * @param {Element} el
	 * @return {Boolean}
	 */
	
	function isHidden(el) {
	  if (/svg$/.test(el.namespaceURI)) {
	    // SVG elements do not have offset(Width|Height)
	    // so we need to check the client rect
	    var rect = el.getBoundingClientRect();
	    return !(rect.width || rect.height);
	  } else {
	    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	  }
	}
	
	var transition$1 = {
	
	  priority: TRANSITION,
	
	  update: function update(id, oldId) {
	    var el = this.el;
	    // resolve on owner vm
	    var hooks = resolveAsset(this.vm.$options, 'transitions', id);
	    id = id || 'v';
	    el.__v_trans = new Transition(el, id, hooks, this.vm);
	    if (oldId) {
	      removeClass(el, oldId + '-transition');
	    }
	    addClass(el, id + '-transition');
	  }
	};
	
	var internalDirectives = {
	  style: style,
	  'class': vClass,
	  component: component,
	  prop: propDef,
	  transition: transition$1
	};
	
	var propBindingModes = config._propBindingModes;
	var empty = {};
	
	// regexes
	var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
	var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;
	
	/**
	 * Compile props on a root element and return
	 * a props link function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Array} propOptions
	 * @return {Function} propsLinkFn
	 */
	
	function compileProps(el, propOptions) {
	  var props = [];
	  var names = Object.keys(propOptions);
	  var i = names.length;
	  var options, name, attr, value, path, parsed, prop;
	  while (i--) {
	    name = names[i];
	    options = propOptions[name] || empty;
	
	    if (process.env.NODE_ENV !== 'production' && name === '$data') {
	      warn('Do not use $data as prop.');
	      continue;
	    }
	
	    // props could contain dashes, which will be
	    // interpreted as minus calculations by the parser
	    // so we need to camelize the path here
	    path = camelize(name);
	    if (!identRE$1.test(path)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.');
	      continue;
	    }
	
	    prop = {
	      name: name,
	      path: path,
	      options: options,
	      mode: propBindingModes.ONE_WAY,
	      raw: null
	    };
	
	    attr = hyphenate(name);
	    // first check dynamic version
	    if ((value = getBindAttr(el, attr)) === null) {
	      if ((value = getBindAttr(el, attr + '.sync')) !== null) {
	        prop.mode = propBindingModes.TWO_WAY;
	      } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
	        prop.mode = propBindingModes.ONE_TIME;
	      }
	    }
	    if (value !== null) {
	      // has dynamic binding!
	      prop.raw = value;
	      parsed = parseDirective(value);
	      value = parsed.expression;
	      prop.filters = parsed.filters;
	      // check binding type
	      if (isLiteral(value) && !parsed.filters) {
	        // for expressions containing literal numbers and
	        // booleans, there's no need to setup a prop binding,
	        // so we can optimize them as a one-time set.
	        prop.optimizedLiteral = true;
	      } else {
	        prop.dynamic = true;
	        // check non-settable path for two-way bindings
	        if (process.env.NODE_ENV !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
	          prop.mode = propBindingModes.ONE_WAY;
	          warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value);
	        }
	      }
	      prop.parentPath = value;
	
	      // warn required two-way
	      if (process.env.NODE_ENV !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
	        warn('Prop "' + name + '" expects a two-way binding type.');
	      }
	    } else if ((value = getAttr(el, attr)) !== null) {
	      // has literal binding!
	      prop.raw = value;
	    } else if (process.env.NODE_ENV !== 'production') {
	      // check possible camelCase prop usage
	      var lowerCaseName = path.toLowerCase();
	      value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
	      if (value) {
	        warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.');
	      } else if (options.required) {
	        // warn missing required
	        warn('Missing required prop: ' + name);
	      }
	    }
	    // push prop
	    props.push(prop);
	  }
	  return makePropsLinkFn(props);
	}
	
	/**
	 * Build a function that applies props to a vm.
	 *
	 * @param {Array} props
	 * @return {Function} propsLinkFn
	 */
	
	function makePropsLinkFn(props) {
	  return function propsLinkFn(vm, scope) {
	    // store resolved props info
	    vm._props = {};
	    var i = props.length;
	    var prop, path, options, value, raw;
	    while (i--) {
	      prop = props[i];
	      raw = prop.raw;
	      path = prop.path;
	      options = prop.options;
	      vm._props[path] = prop;
	      if (raw === null) {
	        // initialize absent prop
	        initProp(vm, prop, getDefault(vm, options));
	      } else if (prop.dynamic) {
	        // dynamic prop
	        if (prop.mode === propBindingModes.ONE_TIME) {
	          // one time binding
	          value = (scope || vm._context || vm).$get(prop.parentPath);
	          initProp(vm, prop, value);
	        } else {
	          if (vm._context) {
	            // dynamic binding
	            vm._bindDir({
	              name: 'prop',
	              def: propDef,
	              prop: prop
	            }, null, null, scope); // el, host, scope
	          } else {
	              // root instance
	              initProp(vm, prop, vm.$get(prop.parentPath));
	            }
	        }
	      } else if (prop.optimizedLiteral) {
	        // optimized literal, cast it and just set once
	        var stripped = stripQuotes(raw);
	        value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
	        initProp(vm, prop, value);
	      } else {
	        // string literal, but we need to cater for
	        // Boolean props with no value
	        value = options.type === Boolean && raw === '' ? true : raw;
	        initProp(vm, prop, value);
	      }
	    }
	  };
	}
	
	/**
	 * Get the default value of a prop.
	 *
	 * @param {Vue} vm
	 * @param {Object} options
	 * @return {*}
	 */
	
	function getDefault(vm, options) {
	  // no default, return undefined
	  if (!hasOwn(options, 'default')) {
	    // absent boolean value defaults to false
	    return options.type === Boolean ? false : undefined;
	  }
	  var def = options['default'];
	  // warn against non-factory defaults for Object & Array
	  if (isObject(def)) {
	    process.env.NODE_ENV !== 'production' && warn('Object/Array as default prop values will be shared ' + 'across multiple instances. Use a factory function ' + 'to return the default value instead.');
	  }
	  // call factory function for non-Function types
	  return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
	}
	
	// special binding prefixes
	var bindRE = /^v-bind:|^:/;
	var onRE = /^v-on:|^@/;
	var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
	var modifierRE = /\.[^\.]+/g;
	var transitionRE = /^(v-bind:|:)?transition$/;
	
	// terminal directives
	var terminalDirectives = ['for', 'if'];
	
	// default directive priority
	var DEFAULT_PRIORITY = 1000;
	
	/**
	 * Compile a template and return a reusable composite link
	 * function, which recursively contains more link functions
	 * inside. This top level compile function would normally
	 * be called on instance root nodes, but can also be used
	 * for partial compilation if the partial argument is true.
	 *
	 * The returned composite link function, when called, will
	 * return an unlink function that tearsdown all directives
	 * created during the linking phase.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} options
	 * @param {Boolean} partial
	 * @return {Function}
	 */
	
	function compile(el, options, partial) {
	  // link function for the node itself.
	  var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
	  // link function for the childNodes
	  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && el.tagName !== 'SCRIPT' && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;
	
	  /**
	   * A composite linker function to be called on a already
	   * compiled piece of DOM, which instantiates all directive
	   * instances.
	   *
	   * @param {Vue} vm
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host] - host vm of transcluded content
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - link context fragment
	   * @return {Function|undefined}
	   */
	
	  return function compositeLinkFn(vm, el, host, scope, frag) {
	    // cache childNodes before linking parent, fix #657
	    var childNodes = toArray(el.childNodes);
	    // link
	    var dirs = linkAndCapture(function compositeLinkCapturer() {
	      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
	      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
	    }, vm);
	    return makeUnlinkFn(vm, dirs);
	  };
	}
	
	/**
	 * Apply a linker to a vm/element pair and capture the
	 * directives created during the process.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 */
	
	function linkAndCapture(linker, vm) {
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV === 'production') {
	    // reset directives before every capture in production
	    // mode, so that when unlinking we don't need to splice
	    // them out (which turns out to be a perf hit).
	    // they are kept in development mode because they are
	    // useful for Vue's own tests.
	    vm._directives = [];
	  }
	  var originalDirCount = vm._directives.length;
	  linker();
	  var dirs = vm._directives.slice(originalDirCount);
	  dirs.sort(directiveComparator);
	  for (var i = 0, l = dirs.length; i < l; i++) {
	    dirs[i]._bind();
	  }
	  return dirs;
	}
	
	/**
	 * Directive priority sort comparator
	 *
	 * @param {Object} a
	 * @param {Object} b
	 */
	
	function directiveComparator(a, b) {
	  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
	  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
	  return a > b ? -1 : a === b ? 0 : 1;
	}
	
	/**
	 * Linker functions return an unlink function that
	 * tearsdown all directives instances generated during
	 * the process.
	 *
	 * We create unlink functions with only the necessary
	 * information to avoid retaining additional closures.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Vue} [context]
	 * @param {Array} [contextDirs]
	 * @return {Function}
	 */
	
	function makeUnlinkFn(vm, dirs, context, contextDirs) {
	  function unlink(destroying) {
	    teardownDirs(vm, dirs, destroying);
	    if (context && contextDirs) {
	      teardownDirs(context, contextDirs);
	    }
	  }
	  // expose linked directives
	  unlink.dirs = dirs;
	  return unlink;
	}
	
	/**
	 * Teardown partial linked directives.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Boolean} destroying
	 */
	
	function teardownDirs(vm, dirs, destroying) {
	  var i = dirs.length;
	  while (i--) {
	    dirs[i]._teardown();
	    if (process.env.NODE_ENV !== 'production' && !destroying) {
	      vm._directives.$remove(dirs[i]);
	    }
	  }
	}
	
	/**
	 * Compile link props on an instance.
	 *
	 * @param {Vue} vm
	 * @param {Element} el
	 * @param {Object} props
	 * @param {Object} [scope]
	 * @return {Function}
	 */
	
	function compileAndLinkProps(vm, el, props, scope) {
	  var propsLinkFn = compileProps(el, props);
	  var propDirs = linkAndCapture(function () {
	    propsLinkFn(vm, scope);
	  }, vm);
	  return makeUnlinkFn(vm, propDirs);
	}
	
	/**
	 * Compile the root element of an instance.
	 *
	 * 1. attrs on context container (context scope)
	 * 2. attrs on the component template root node, if
	 *    replace:true (child scope)
	 *
	 * If this is a fragment instance, we only need to compile 1.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @param {Object} contextOptions
	 * @return {Function}
	 */
	
	function compileRoot(el, options, contextOptions) {
	  var containerAttrs = options._containerAttrs;
	  var replacerAttrs = options._replacerAttrs;
	  var contextLinkFn, replacerLinkFn;
	
	  // only need to compile other attributes for
	  // non-fragment instances
	  if (el.nodeType !== 11) {
	    // for components, container and replacer need to be
	    // compiled separately and linked in different scopes.
	    if (options._asComponent) {
	      // 2. container attributes
	      if (containerAttrs && contextOptions) {
	        contextLinkFn = compileDirectives(containerAttrs, contextOptions);
	      }
	      if (replacerAttrs) {
	        // 3. replacer attributes
	        replacerLinkFn = compileDirectives(replacerAttrs, options);
	      }
	    } else {
	      // non-component, just compile as a normal element.
	      replacerLinkFn = compileDirectives(el.attributes, options);
	    }
	  } else if (process.env.NODE_ENV !== 'production' && containerAttrs) {
	    // warn container directives for fragment instances
	    var names = containerAttrs.filter(function (attr) {
	      // allow vue-loader/vueify scoped css attributes
	      return attr.name.indexOf('_v-') < 0 &&
	      // allow event listeners
	      !onRE.test(attr.name) &&
	      // allow slots
	      attr.name !== 'slot';
	    }).map(function (attr) {
	      return '"' + attr.name + '"';
	    });
	    if (names.length) {
	      var plural = names.length > 1;
	      warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment_Instance');
	    }
	  }
	
	  options._containerAttrs = options._replacerAttrs = null;
	  return function rootLinkFn(vm, el, scope) {
	    // link context scope dirs
	    var context = vm._context;
	    var contextDirs;
	    if (context && contextLinkFn) {
	      contextDirs = linkAndCapture(function () {
	        contextLinkFn(context, el, null, scope);
	      }, context);
	    }
	
	    // link self
	    var selfDirs = linkAndCapture(function () {
	      if (replacerLinkFn) replacerLinkFn(vm, el);
	    }, vm);
	
	    // return the unlink function that tearsdown context
	    // container directives.
	    return makeUnlinkFn(vm, selfDirs, context, contextDirs);
	  };
	}
	
	/**
	 * Compile a node and return a nodeLinkFn based on the
	 * node type.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileNode(node, options) {
	  var type = node.nodeType;
	  if (type === 1 && node.tagName !== 'SCRIPT') {
	    return compileElement(node, options);
	  } else if (type === 3 && node.data.trim()) {
	    return compileTextNode(node, options);
	  } else {
	    return null;
	  }
	}
	
	/**
	 * Compile an element and return a nodeLinkFn.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileElement(el, options) {
	  // preprocess textareas.
	  // textarea treats its text content as the initial value.
	  // just bind it as an attr directive for value.
	  if (el.tagName === 'TEXTAREA') {
	    var tokens = parseText(el.value);
	    if (tokens) {
	      el.setAttribute(':value', tokensToExp(tokens));
	      el.value = '';
	    }
	  }
	  var linkFn;
	  var hasAttrs = el.hasAttributes();
	  // check terminal directives (for & if)
	  if (hasAttrs) {
	    linkFn = checkTerminalDirectives(el, options);
	  }
	  // check element directives
	  if (!linkFn) {
	    linkFn = checkElementDirectives(el, options);
	  }
	  // check component
	  if (!linkFn) {
	    linkFn = checkComponent(el, options);
	  }
	  // normal directives
	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(el.attributes, options);
	  }
	  return linkFn;
	}
	
	/**
	 * Compile a textNode and return a nodeLinkFn.
	 *
	 * @param {TextNode} node
	 * @param {Object} options
	 * @return {Function|null} textNodeLinkFn
	 */
	
	function compileTextNode(node, options) {
	  // skip marked text nodes
	  if (node._skip) {
	    return removeText;
	  }
	
	  var tokens = parseText(node.wholeText);
	  if (!tokens) {
	    return null;
	  }
	
	  // mark adjacent text nodes as skipped,
	  // because we are using node.wholeText to compile
	  // all adjacent text nodes together. This fixes
	  // issues in IE where sometimes it splits up a single
	  // text node into multiple ones.
	  var next = node.nextSibling;
	  while (next && next.nodeType === 3) {
	    next._skip = true;
	    next = next.nextSibling;
	  }
	
	  var frag = document.createDocumentFragment();
	  var el, token;
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i];
	    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
	    frag.appendChild(el);
	  }
	  return makeTextNodeLinkFn(tokens, frag, options);
	}
	
	/**
	 * Linker for an skipped text node.
	 *
	 * @param {Vue} vm
	 * @param {Text} node
	 */
	
	function removeText(vm, node) {
	  remove(node);
	}
	
	/**
	 * Process a single text token.
	 *
	 * @param {Object} token
	 * @param {Object} options
	 * @return {Node}
	 */
	
	function processTextToken(token, options) {
	  var el;
	  if (token.oneTime) {
	    el = document.createTextNode(token.value);
	  } else {
	    if (token.html) {
	      el = document.createComment('v-html');
	      setTokenType('html');
	    } else {
	      // IE will clean up empty textNodes during
	      // frag.cloneNode(true), so we have to give it
	      // something here...
	      el = document.createTextNode(' ');
	      setTokenType('text');
	    }
	  }
	  function setTokenType(type) {
	    if (token.descriptor) return;
	    var parsed = parseDirective(token.value);
	    token.descriptor = {
	      name: type,
	      def: directives[type],
	      expression: parsed.expression,
	      filters: parsed.filters
	    };
	  }
	  return el;
	}
	
	/**
	 * Build a function that processes a textNode.
	 *
	 * @param {Array<Object>} tokens
	 * @param {DocumentFragment} frag
	 */
	
	function makeTextNodeLinkFn(tokens, frag) {
	  return function textNodeLinkFn(vm, el, host, scope) {
	    var fragClone = frag.cloneNode(true);
	    var childNodes = toArray(fragClone.childNodes);
	    var token, value, node;
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i];
	      value = token.value;
	      if (token.tag) {
	        node = childNodes[i];
	        if (token.oneTime) {
	          value = (scope || vm).$eval(value);
	          if (token.html) {
	            replace(node, parseTemplate(value, true));
	          } else {
	            node.data = value;
	          }
	        } else {
	          vm._bindDir(token.descriptor, node, host, scope);
	        }
	      }
	    }
	    replace(el, fragClone);
	  };
	}
	
	/**
	 * Compile a node list and return a childLinkFn.
	 *
	 * @param {NodeList} nodeList
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function compileNodeList(nodeList, options) {
	  var linkFns = [];
	  var nodeLinkFn, childLinkFn, node;
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i];
	    nodeLinkFn = compileNode(node, options);
	    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
	    linkFns.push(nodeLinkFn, childLinkFn);
	  }
	  return linkFns.length ? makeChildLinkFn(linkFns) : null;
	}
	
	/**
	 * Make a child link function for a node's childNodes.
	 *
	 * @param {Array<Function>} linkFns
	 * @return {Function} childLinkFn
	 */
	
	function makeChildLinkFn(linkFns) {
	  return function childLinkFn(vm, nodes, host, scope, frag) {
	    var node, nodeLinkFn, childrenLinkFn;
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n];
	      nodeLinkFn = linkFns[i++];
	      childrenLinkFn = linkFns[i++];
	      // cache childNodes before linking parent, fix #657
	      var childNodes = toArray(node.childNodes);
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, host, scope, frag);
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, host, scope, frag);
	      }
	    }
	  };
	}
	
	/**
	 * Check for element directives (custom elements that should
	 * be resovled as terminal directives).
	 *
	 * @param {Element} el
	 * @param {Object} options
	 */
	
	function checkElementDirectives(el, options) {
	  var tag = el.tagName.toLowerCase();
	  if (commonTagRE.test(tag)) {
	    return;
	  }
	  var def = resolveAsset(options, 'elementDirectives', tag);
	  if (def) {
	    return makeTerminalNodeLinkFn(el, tag, '', options, def);
	  }
	}
	
	/**
	 * Check if an element is a component. If yes, return
	 * a component link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function checkComponent(el, options) {
	  var component = checkComponentAttr(el, options);
	  if (component) {
	    var ref = findRef(el);
	    var descriptor = {
	      name: 'component',
	      ref: ref,
	      expression: component.id,
	      def: internalDirectives.component,
	      modifiers: {
	        literal: !component.dynamic
	      }
	    };
	    var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
	      if (ref) {
	        defineReactive((scope || vm).$refs, ref, null);
	      }
	      vm._bindDir(descriptor, el, host, scope, frag);
	    };
	    componentLinkFn.terminal = true;
	    return componentLinkFn;
	  }
	}
	
	/**
	 * Check an element for terminal directives in fixed order.
	 * If it finds one, return a terminal link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function} terminalLinkFn
	 */
	
	function checkTerminalDirectives(el, options) {
	  // skip v-pre
	  if (getAttr(el, 'v-pre') !== null) {
	    return skip;
	  }
	  // skip v-else block, but only if following v-if
	  if (el.hasAttribute('v-else')) {
	    var prev = el.previousElementSibling;
	    if (prev && prev.hasAttribute('v-if')) {
	      return skip;
	    }
	  }
	  var value, dirName;
	  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
	    dirName = terminalDirectives[i];
	    value = el.getAttribute('v-' + dirName);
	    if (value != null) {
	      return makeTerminalNodeLinkFn(el, dirName, value, options);
	    }
	  }
	}
	
	function skip() {}
	skip.terminal = true;
	
	/**
	 * Build a node link function for a terminal directive.
	 * A terminal link function terminates the current
	 * compilation recursion and handles compilation of the
	 * subtree in the directive.
	 *
	 * @param {Element} el
	 * @param {String} dirName
	 * @param {String} value
	 * @param {Object} options
	 * @param {Object} [def]
	 * @return {Function} terminalLinkFn
	 */
	
	function makeTerminalNodeLinkFn(el, dirName, value, options, def) {
	  var parsed = parseDirective(value);
	  var descriptor = {
	    name: dirName,
	    expression: parsed.expression,
	    filters: parsed.filters,
	    raw: value,
	    // either an element directive, or if/for
	    // #2366 or custom terminal directive
	    def: def || resolveAsset(options, 'directives', dirName)
	  };
	  // check ref for v-for and router-view
	  if (dirName === 'for' || dirName === 'router-view') {
	    descriptor.ref = findRef(el);
	  }
	  var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
	    if (descriptor.ref) {
	      defineReactive((scope || vm).$refs, descriptor.ref, null);
	    }
	    vm._bindDir(descriptor, el, host, scope, frag);
	  };
	  fn.terminal = true;
	  return fn;
	}
	
	/**
	 * Compile the directives on an element and return a linker.
	 *
	 * @param {Array|NamedNodeMap} attrs
	 * @param {Object} options
	 * @return {Function}
	 */
	
	function compileDirectives(attrs, options) {
	  var i = attrs.length;
	  var dirs = [];
	  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
	  while (i--) {
	    attr = attrs[i];
	    name = rawName = attr.name;
	    value = rawValue = attr.value;
	    tokens = parseText(value);
	    // reset arg
	    arg = null;
	    // check modifiers
	    modifiers = parseModifiers(name);
	    name = name.replace(modifierRE, '');
	
	    // attribute interpolations
	    if (tokens) {
	      value = tokensToExp(tokens);
	      arg = name;
	      pushDir('bind', directives.bind, tokens);
	      // warn against mixing mustaches with v-bind
	      if (process.env.NODE_ENV !== 'production') {
	        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
	          return attr.name === ':class' || attr.name === 'v-bind:class';
	        })) {
	          warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.');
	        }
	      }
	    } else
	
	      // special attribute: transition
	      if (transitionRE.test(name)) {
	        modifiers.literal = !bindRE.test(name);
	        pushDir('transition', internalDirectives.transition);
	      } else
	
	        // event handlers
	        if (onRE.test(name)) {
	          arg = name.replace(onRE, '');
	          pushDir('on', directives.on);
	        } else
	
	          // attribute bindings
	          if (bindRE.test(name)) {
	            dirName = name.replace(bindRE, '');
	            if (dirName === 'style' || dirName === 'class') {
	              pushDir(dirName, internalDirectives[dirName]);
	            } else {
	              arg = dirName;
	              pushDir('bind', directives.bind);
	            }
	          } else
	
	            // normal directives
	            if (matched = name.match(dirAttrRE)) {
	              dirName = matched[1];
	              arg = matched[2];
	
	              // skip v-else (when used with v-show)
	              if (dirName === 'else') {
	                continue;
	              }
	
	              dirDef = resolveAsset(options, 'directives', dirName);
	
	              if (process.env.NODE_ENV !== 'production') {
	                assertAsset(dirDef, 'directive', dirName);
	              }
	
	              if (dirDef) {
	                pushDir(dirName, dirDef);
	              }
	            }
	  }
	
	  /**
	   * Push a directive.
	   *
	   * @param {String} dirName
	   * @param {Object|Function} def
	   * @param {Array} [interpTokens]
	   */
	
	  function pushDir(dirName, def, interpTokens) {
	    var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
	    var parsed = !hasOneTimeToken && parseDirective(value);
	    dirs.push({
	      name: dirName,
	      attr: rawName,
	      raw: rawValue,
	      def: def,
	      arg: arg,
	      modifiers: modifiers,
	      // conversion from interpolation strings with one-time token
	      // to expression is differed until directive bind time so that we
	      // have access to the actual vm context for one-time bindings.
	      expression: parsed && parsed.expression,
	      filters: parsed && parsed.filters,
	      interp: interpTokens,
	      hasOneTime: hasOneTimeToken
	    });
	  }
	
	  if (dirs.length) {
	    return makeNodeLinkFn(dirs);
	  }
	}
	
	/**
	 * Parse modifiers from directive attribute name.
	 *
	 * @param {String} name
	 * @return {Object}
	 */
	
	function parseModifiers(name) {
	  var res = Object.create(null);
	  var match = name.match(modifierRE);
	  if (match) {
	    var i = match.length;
	    while (i--) {
	      res[match[i].slice(1)] = true;
	    }
	  }
	  return res;
	}
	
	/**
	 * Build a link function for all directives on a single node.
	 *
	 * @param {Array} directives
	 * @return {Function} directivesLinkFn
	 */
	
	function makeNodeLinkFn(directives) {
	  return function nodeLinkFn(vm, el, host, scope, frag) {
	    // reverse apply because it's sorted low to high
	    var i = directives.length;
	    while (i--) {
	      vm._bindDir(directives[i], el, host, scope, frag);
	    }
	  };
	}
	
	/**
	 * Check if an interpolation string contains one-time tokens.
	 *
	 * @param {Array} tokens
	 * @return {Boolean}
	 */
	
	function hasOneTime(tokens) {
	  var i = tokens.length;
	  while (i--) {
	    if (tokens[i].oneTime) return true;
	  }
	}
	
	var specialCharRE = /[^\w\-:\.]/;
	
	/**
	 * Process an element or a DocumentFragment based on a
	 * instance option object. This allows us to transclude
	 * a template node/fragment before the instance is created,
	 * so the processed fragment can then be cloned and reused
	 * in v-for.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transclude(el, options) {
	  // extract container attributes to pass them down
	  // to compiler, because they need to be compiled in
	  // parent scope. we are mutating the options object here
	  // assuming the same object will be used for compile
	  // right after this.
	  if (options) {
	    options._containerAttrs = extractAttrs(el);
	  }
	  // for template tags, what we want is its content as
	  // a documentFragment (for fragment instances)
	  if (isTemplate(el)) {
	    el = parseTemplate(el);
	  }
	  if (options) {
	    if (options._asComponent && !options.template) {
	      options.template = '<slot></slot>';
	    }
	    if (options.template) {
	      options._content = extractContent(el);
	      el = transcludeTemplate(el, options);
	    }
	  }
	  if (isFragment(el)) {
	    // anchors for fragment instance
	    // passing in `persist: true` to avoid them being
	    // discarded by IE during template cloning
	    prepend(createAnchor('v-start', true), el);
	    el.appendChild(createAnchor('v-end', true));
	  }
	  return el;
	}
	
	/**
	 * Process the template option.
	 * If the replace option is true this will swap the $el.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transcludeTemplate(el, options) {
	  var template = options.template;
	  var frag = parseTemplate(template, true);
	  if (frag) {
	    var replacer = frag.firstChild;
	    var tag = replacer.tagName && replacer.tagName.toLowerCase();
	    if (options.replace) {
	      /* istanbul ignore if */
	      if (el === document.body) {
	        process.env.NODE_ENV !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
	      }
	      // there are many cases where the instance must
	      // become a fragment instance: basically anything that
	      // can create more than 1 root nodes.
	      if (
	      // multi-children template
	      frag.childNodes.length > 1 ||
	      // non-element template
	      replacer.nodeType !== 1 ||
	      // single nested component
	      tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
	      // element directive
	      resolveAsset(options, 'elementDirectives', tag) ||
	      // for block
	      replacer.hasAttribute('v-for') ||
	      // if block
	      replacer.hasAttribute('v-if')) {
	        return frag;
	      } else {
	        options._replacerAttrs = extractAttrs(replacer);
	        mergeAttrs(el, replacer);
	        return replacer;
	      }
	    } else {
	      el.appendChild(frag);
	      return el;
	    }
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid template option: ' + template);
	  }
	}
	
	/**
	 * Helper to extract a component container's attributes
	 * into a plain object array.
	 *
	 * @param {Element} el
	 * @return {Array}
	 */
	
	function extractAttrs(el) {
	  if (el.nodeType === 1 && el.hasAttributes()) {
	    return toArray(el.attributes);
	  }
	}
	
	/**
	 * Merge the attributes of two elements, and make sure
	 * the class names are merged properly.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 */
	
	function mergeAttrs(from, to) {
	  var attrs = from.attributes;
	  var i = attrs.length;
	  var name, value;
	  while (i--) {
	    name = attrs[i].name;
	    value = attrs[i].value;
	    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
	      to.setAttribute(name, value);
	    } else if (name === 'class' && !parseText(value)) {
	      value.split(/\s+/).forEach(function (cls) {
	        addClass(to, cls);
	      });
	    }
	  }
	}
	
	/**
	 * Scan and determine slot content distribution.
	 * We do this during transclusion instead at compile time so that
	 * the distribution is decoupled from the compilation order of
	 * the slots.
	 *
	 * @param {Element|DocumentFragment} template
	 * @param {Element} content
	 * @param {Vue} vm
	 */
	
	function scanSlots(template, content, vm) {
	  if (!content) {
	    return;
	  }
	  var contents = vm._slotContents = {};
	  var slots = template.querySelectorAll('slot');
	  if (slots.length) {
	    var hasDefault, slot, name;
	    for (var i = 0, l = slots.length; i < l; i++) {
	      slot = slots[i];
	      /* eslint-disable no-cond-assign */
	      if (name = slot.getAttribute('name')) {
	        select(slot, name);
	      } else if (process.env.NODE_ENV !== 'production' && (name = getBindAttr(slot, 'name'))) {
	        warn('<slot :name="' + name + '">: slot names cannot be dynamic.');
	      } else {
	        // default slot
	        hasDefault = true;
	      }
	      /* eslint-enable no-cond-assign */
	    }
	    if (hasDefault) {
	      contents['default'] = extractFragment(content.childNodes, content);
	    }
	  }
	
	  function select(slot, name) {
	    // named slot
	    var selector = '[slot="' + name + '"]';
	    var nodes = content.querySelectorAll(selector);
	    if (nodes.length) {
	      contents[name] = extractFragment(nodes, content);
	    }
	  }
	}
	
	/**
	 * Extract qualified content nodes from a node list.
	 *
	 * @param {NodeList} nodes
	 * @param {Element} parent
	 * @return {DocumentFragment}
	 */
	
	function extractFragment(nodes, parent) {
	  var frag = document.createDocumentFragment();
	  nodes = toArray(nodes);
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    var node = nodes[i];
	    if (node.parentNode === parent) {
	      if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
	        parent.removeChild(node);
	        node = parseTemplate(node);
	      }
	      frag.appendChild(node);
	    }
	  }
	  return frag;
	}
	
	
	
	var compiler = Object.freeze({
		compile: compile,
		compileAndLinkProps: compileAndLinkProps,
		compileRoot: compileRoot,
		terminalDirectives: terminalDirectives,
		transclude: transclude,
		scanSlots: scanSlots
	});
	
	function stateMixin (Vue) {
	  /**
	   * Accessor for `$data` property, since setting $data
	   * requires observing the new object and updating
	   * proxied properties.
	   */
	
	  Object.defineProperty(Vue.prototype, '$data', {
	    get: function get() {
	      return this._data;
	    },
	    set: function set(newData) {
	      if (newData !== this._data) {
	        this._setData(newData);
	      }
	    }
	  });
	
	  /**
	   * Setup the scope of an instance, which contains:
	   * - observed data
	   * - computed properties
	   * - user methods
	   * - meta properties
	   */
	
	  Vue.prototype._initState = function () {
	    this._initProps();
	    this._initMeta();
	    this._initMethods();
	    this._initData();
	    this._initComputed();
	  };
	
	  /**
	   * Initialize props.
	   */
	
	  Vue.prototype._initProps = function () {
	    var options = this.$options;
	    var el = options.el;
	    var props = options.props;
	    if (props && !el) {
	      process.env.NODE_ENV !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.');
	    }
	    // make sure to convert string selectors into element now
	    el = options.el = query(el);
	    this._propsUnlinkFn = el && el.nodeType === 1 && props
	    // props must be linked in proper scope if inside v-for
	    ? compileAndLinkProps(this, el, props, this._scope) : null;
	  };
	
	  /**
	   * Initialize the data.
	   */
	
	  Vue.prototype._initData = function () {
	    var propsData = this._data;
	    var optionsDataFn = this.$options.data;
	    var optionsData = optionsDataFn && optionsDataFn();
	    var runtimeData;
	    if (process.env.NODE_ENV !== 'production') {
	      runtimeData = (typeof this._runtimeData === 'function' ? this._runtimeData() : this._runtimeData) || {};
	      this._runtimeData = null;
	    }
	    if (optionsData) {
	      this._data = optionsData;
	      for (var prop in propsData) {
	        if (process.env.NODE_ENV !== 'production' && hasOwn(optionsData, prop) && !hasOwn(runtimeData, prop)) {
	          warn('Data field "' + prop + '" is already defined ' + 'as a prop. Use prop default value instead.');
	        }
	        if (this._props[prop].raw !== null || !hasOwn(optionsData, prop)) {
	          set(optionsData, prop, propsData[prop]);
	        }
	      }
	    }
	    var data = this._data;
	    // proxy data on instance
	    var keys = Object.keys(data);
	    var i, key;
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      this._proxy(key);
	    }
	    // observe data
	    observe(data, this);
	  };
	
	  /**
	   * Swap the instance's $data. Called in $data's setter.
	   *
	   * @param {Object} newData
	   */
	
	  Vue.prototype._setData = function (newData) {
	    newData = newData || {};
	    var oldData = this._data;
	    this._data = newData;
	    var keys, key, i;
	    // unproxy keys not present in new data
	    keys = Object.keys(oldData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!(key in newData)) {
	        this._unproxy(key);
	      }
	    }
	    // proxy keys not already proxied,
	    // and trigger change for changed values
	    keys = Object.keys(newData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!hasOwn(this, key)) {
	        // new property
	        this._proxy(key);
	      }
	    }
	    oldData.__ob__.removeVm(this);
	    observe(newData, this);
	    this._digest();
	  };
	
	  /**
	   * Proxy a property, so that
	   * vm.prop === vm._data.prop
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._proxy = function (key) {
	    if (!isReserved(key)) {
	      // need to store ref to self here
	      // because these getter/setters might
	      // be called by child scopes via
	      // prototype inheritance.
	      var self = this;
	      Object.defineProperty(self, key, {
	        configurable: true,
	        enumerable: true,
	        get: function proxyGetter() {
	          return self._data[key];
	        },
	        set: function proxySetter(val) {
	          self._data[key] = val;
	        }
	      });
	    }
	  };
	
	  /**
	   * Unproxy a property.
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._unproxy = function (key) {
	    if (!isReserved(key)) {
	      delete this[key];
	    }
	  };
	
	  /**
	   * Force update on every watcher in scope.
	   */
	
	  Vue.prototype._digest = function () {
	    for (var i = 0, l = this._watchers.length; i < l; i++) {
	      this._watchers[i].update(true); // shallow updates
	    }
	  };
	
	  /**
	   * Setup computed properties. They are essentially
	   * special getter/setters
	   */
	
	  function noop() {}
	  Vue.prototype._initComputed = function () {
	    var computed = this.$options.computed;
	    if (computed) {
	      for (var key in computed) {
	        var userDef = computed[key];
	        var def = {
	          enumerable: true,
	          configurable: true
	        };
	        if (typeof userDef === 'function') {
	          def.get = makeComputedGetter(userDef, this);
	          def.set = noop;
	        } else {
	          def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
	          def.set = userDef.set ? bind(userDef.set, this) : noop;
	        }
	        Object.defineProperty(this, key, def);
	      }
	    }
	  };
	
	  function makeComputedGetter(getter, owner) {
	    var watcher = new Watcher(owner, getter, null, {
	      lazy: true
	    });
	    return function computedGetter() {
	      if (watcher.dirty) {
	        watcher.evaluate();
	      }
	      if (Dep.target) {
	        watcher.depend();
	      }
	      return watcher.value;
	    };
	  }
	
	  /**
	   * Setup instance methods. Methods must be bound to the
	   * instance since they might be passed down as a prop to
	   * child components.
	   */
	
	  Vue.prototype._initMethods = function () {
	    var methods = this.$options.methods;
	    if (methods) {
	      for (var key in methods) {
	        this[key] = bind(methods[key], this);
	      }
	    }
	  };
	
	  /**
	   * Initialize meta information like $index, $key & $value.
	   */
	
	  Vue.prototype._initMeta = function () {
	    var metas = this.$options._meta;
	    if (metas) {
	      for (var key in metas) {
	        defineReactive(this, key, metas[key]);
	      }
	    }
	  };
	}
	
	var eventRE = /^v-on:|^@/;
	
	function eventsMixin (Vue) {
	  /**
	   * Setup the instance's option events & watchers.
	   * If the value is a string, we pull it from the
	   * instance's methods by name.
	   */
	
	  Vue.prototype._initEvents = function () {
	    var options = this.$options;
	    if (options._asComponent) {
	      registerComponentEvents(this, options.el);
	    }
	    registerCallbacks(this, '$on', options.events);
	    registerCallbacks(this, '$watch', options.watch);
	  };
	
	  /**
	   * Register v-on events on a child component
	   *
	   * @param {Vue} vm
	   * @param {Element} el
	   */
	
	  function registerComponentEvents(vm, el) {
	    var attrs = el.attributes;
	    var name, handler;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      name = attrs[i].name;
	      if (eventRE.test(name)) {
	        name = name.replace(eventRE, '');
	        handler = (vm._scope || vm._context).$eval(attrs[i].value, true);
	        if (typeof handler === 'function') {
	          handler._fromParent = true;
	          vm.$on(name.replace(eventRE), handler);
	        } else if (process.env.NODE_ENV !== 'production') {
	          warn('v-on:' + name + '="' + attrs[i].value + '"' + (vm.$options.name ? ' on component <' + vm.$options.name + '>' : '') + ' expects a function value, got ' + handler);
	        }
	      }
	    }
	  }
	
	  /**
	   * Register callbacks for option events and watchers.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {Object} hash
	   */
	
	  function registerCallbacks(vm, action, hash) {
	    if (!hash) return;
	    var handlers, key, i, j;
	    for (key in hash) {
	      handlers = hash[key];
	      if (isArray(handlers)) {
	        for (i = 0, j = handlers.length; i < j; i++) {
	          register(vm, action, key, handlers[i]);
	        }
	      } else {
	        register(vm, action, key, handlers);
	      }
	    }
	  }
	
	  /**
	   * Helper to register an event/watch callback.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {String} key
	   * @param {Function|String|Object} handler
	   * @param {Object} [options]
	   */
	
	  function register(vm, action, key, handler, options) {
	    var type = typeof handler;
	    if (type === 'function') {
	      vm[action](key, handler, options);
	    } else if (type === 'string') {
	      var methods = vm.$options.methods;
	      var method = methods && methods[handler];
	      if (method) {
	        vm[action](key, method, options);
	      } else {
	        process.env.NODE_ENV !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".');
	      }
	    } else if (handler && type === 'object') {
	      register(vm, action, key, handler.handler, handler);
	    }
	  }
	
	  /**
	   * Setup recursive attached/detached calls
	   */
	
	  Vue.prototype._initDOMHooks = function () {
	    this.$on('hook:attached', onAttached);
	    this.$on('hook:detached', onDetached);
	  };
	
	  /**
	   * Callback to recursively call attached hook on children
	   */
	
	  function onAttached() {
	    if (!this._isAttached) {
	      this._isAttached = true;
	      this.$children.forEach(callAttach);
	    }
	  }
	
	  /**
	   * Iterator to call attached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callAttach(child) {
	    if (!child._isAttached && inDoc(child.$el)) {
	      child._callHook('attached');
	    }
	  }
	
	  /**
	   * Callback to recursively call detached hook on children
	   */
	
	  function onDetached() {
	    if (this._isAttached) {
	      this._isAttached = false;
	      this.$children.forEach(callDetach);
	    }
	  }
	
	  /**
	   * Iterator to call detached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callDetach(child) {
	    if (child._isAttached && !inDoc(child.$el)) {
	      child._callHook('detached');
	    }
	  }
	
	  /**
	   * Trigger all handlers for a hook
	   *
	   * @param {String} hook
	   */
	
	  Vue.prototype._callHook = function (hook) {
	    this.$emit('pre-hook:' + hook);
	    var handlers = this.$options[hook];
	    if (handlers) {
	      for (var i = 0, j = handlers.length; i < j; i++) {
	        handlers[i].call(this);
	      }
	    }
	    this.$emit('hook:' + hook);
	  };
	}
	
	function noop() {}
	
	/**
	 * A directive links a DOM element with a piece of data,
	 * which is the result of evaluating an expression.
	 * It registers a watcher with the expression and calls
	 * the DOM update function when a change is triggered.
	 *
	 * @param {String} name
	 * @param {Node} el
	 * @param {Vue} vm
	 * @param {Object} descriptor
	 *                 - {String} name
	 *                 - {Object} def
	 *                 - {String} expression
	 *                 - {Array<Object>} [filters]
	 *                 - {Boolean} literal
	 *                 - {String} attr
	 *                 - {String} raw
	 * @param {Object} def - directive definition object
	 * @param {Vue} [host] - transclusion host component
	 * @param {Object} [scope] - v-for scope
	 * @param {Fragment} [frag] - owner fragment
	 * @constructor
	 */
	function Directive(descriptor, vm, el, host, scope, frag) {
	  this.vm = vm;
	  this.el = el;
	  // copy descriptor properties
	  this.descriptor = descriptor;
	  this.name = descriptor.name;
	  this.expression = descriptor.expression;
	  this.arg = descriptor.arg;
	  this.modifiers = descriptor.modifiers;
	  this.filters = descriptor.filters;
	  this.literal = this.modifiers && this.modifiers.literal;
	  // private
	  this._locked = false;
	  this._bound = false;
	  this._listeners = null;
	  // link context
	  this._host = host;
	  this._scope = scope;
	  this._frag = frag;
	  // store directives on node in dev mode
	  if (process.env.NODE_ENV !== 'production' && this.el) {
	    this.el._vue_directives = this.el._vue_directives || [];
	    this.el._vue_directives.push(this);
	  }
	}
	
	/**
	 * Initialize the directive, mixin definition properties,
	 * setup the watcher, call definition bind() and update()
	 * if present.
	 *
	 * @param {Object} def
	 */
	
	Directive.prototype._bind = function () {
	  var name = this.name;
	  var descriptor = this.descriptor;
	
	  // remove attribute
	  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
	    var attr = descriptor.attr || 'v-' + name;
	    this.el.removeAttribute(attr);
	  }
	
	  // copy def properties
	  var def = descriptor.def;
	  if (typeof def === 'function') {
	    this.update = def;
	  } else {
	    extend(this, def);
	  }
	
	  // setup directive params
	  this._setupParams();
	
	  // initial bind
	  if (this.bind) {
	    this.bind();
	  }
	  this._bound = true;
	
	  if (this.literal) {
	    this.update && this.update(descriptor.raw);
	  } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
	    // wrapped updater for context
	    var dir = this;
	    if (this.update) {
	      this._update = function (val, oldVal) {
	        if (!dir._locked) {
	          dir.update(val, oldVal);
	        }
	      };
	    } else {
	      this._update = noop;
	    }
	    var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
	    var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
	    var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
	    {
	      filters: this.filters,
	      twoWay: this.twoWay,
	      deep: this.deep,
	      preProcess: preProcess,
	      postProcess: postProcess,
	      scope: this._scope
	    });
	    // v-model with inital inline value need to sync back to
	    // model instead of update to DOM on init. They would
	    // set the afterBind hook to indicate that.
	    if (this.afterBind) {
	      this.afterBind();
	    } else if (this.update) {
	      this.update(watcher.value);
	    }
	  }
	};
	
	/**
	 * Setup all param attributes, e.g. track-by,
	 * transition-mode, etc...
	 */
	
	Directive.prototype._setupParams = function () {
	  if (!this.params) {
	    return;
	  }
	  var params = this.params;
	  // swap the params array with a fresh object.
	  this.params = Object.create(null);
	  var i = params.length;
	  var key, val, mappedKey;
	  while (i--) {
	    key = params[i];
	    mappedKey = camelize(key);
	    val = getBindAttr(this.el, key);
	    if (val != null) {
	      // dynamic
	      this._setupParamWatcher(mappedKey, val);
	    } else {
	      // static
	      val = getAttr(this.el, key);
	      if (val != null) {
	        this.params[mappedKey] = val === '' ? true : val;
	      }
	    }
	  }
	};
	
	/**
	 * Setup a watcher for a dynamic param.
	 *
	 * @param {String} key
	 * @param {String} expression
	 */
	
	Directive.prototype._setupParamWatcher = function (key, expression) {
	  var self = this;
	  var called = false;
	  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
	    self.params[key] = val;
	    // since we are in immediate mode,
	    // only call the param change callbacks if this is not the first update.
	    if (called) {
	      var cb = self.paramWatchers && self.paramWatchers[key];
	      if (cb) {
	        cb.call(self, val, oldVal);
	      }
	    } else {
	      called = true;
	    }
	  }, {
	    immediate: true,
	    user: false
	  });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
	};
	
	/**
	 * Check if the directive is a function caller
	 * and if the expression is a callable one. If both true,
	 * we wrap up the expression and use it as the event
	 * handler.
	 *
	 * e.g. on-click="a++"
	 *
	 * @return {Boolean}
	 */
	
	Directive.prototype._checkStatement = function () {
	  var expression = this.expression;
	  if (expression && this.acceptStatement && !isSimplePath(expression)) {
	    var fn = parseExpression(expression).get;
	    var scope = this._scope || this.vm;
	    var handler = function handler(e) {
	      scope.$event = e;
	      fn.call(scope, scope);
	      scope.$event = null;
	    };
	    if (this.filters) {
	      handler = scope._applyFilters(handler, null, this.filters);
	    }
	    this.update(handler);
	    return true;
	  }
	};
	
	/**
	 * Set the corresponding value with the setter.
	 * This should only be used in two-way directives
	 * e.g. v-model.
	 *
	 * @param {*} value
	 * @public
	 */
	
	Directive.prototype.set = function (value) {
	  /* istanbul ignore else */
	  if (this.twoWay) {
	    this._withLock(function () {
	      this._watcher.set(value);
	    });
	  } else if (process.env.NODE_ENV !== 'production') {
	    warn('Directive.set() can only be used inside twoWay' + 'directives.');
	  }
	};
	
	/**
	 * Execute a function while preventing that function from
	 * triggering updates on this directive instance.
	 *
	 * @param {Function} fn
	 */
	
	Directive.prototype._withLock = function (fn) {
	  var self = this;
	  self._locked = true;
	  fn.call(self);
	  nextTick(function () {
	    self._locked = false;
	  });
	};
	
	/**
	 * Convenience method that attaches a DOM event listener
	 * to the directive element and autometically tears it down
	 * during unbind.
	 *
	 * @param {String} event
	 * @param {Function} handler
	 * @param {Boolean} [useCapture]
	 */
	
	Directive.prototype.on = function (event, handler, useCapture) {
	  on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
	};
	
	/**
	 * Teardown the watcher and call unbind.
	 */
	
	Directive.prototype._teardown = function () {
	  if (this._bound) {
	    this._bound = false;
	    if (this.unbind) {
	      this.unbind();
	    }
	    if (this._watcher) {
	      this._watcher.teardown();
	    }
	    var listeners = this._listeners;
	    var i;
	    if (listeners) {
	      i = listeners.length;
	      while (i--) {
	        off(this.el, listeners[i][0], listeners[i][1]);
	      }
	    }
	    var unwatchFns = this._paramUnwatchFns;
	    if (unwatchFns) {
	      i = unwatchFns.length;
	      while (i--) {
	        unwatchFns[i]();
	      }
	    }
	    if (process.env.NODE_ENV !== 'production' && this.el) {
	      this.el._vue_directives.$remove(this);
	    }
	    this.vm = this.el = this._watcher = this._listeners = null;
	  }
	};
	
	function lifecycleMixin (Vue) {
	  /**
	   * Update v-ref for component.
	   *
	   * @param {Boolean} remove
	   */
	
	  Vue.prototype._updateRef = function (remove) {
	    var ref = this.$options._ref;
	    if (ref) {
	      var refs = (this._scope || this._context).$refs;
	      if (remove) {
	        if (refs[ref] === this) {
	          refs[ref] = null;
	        }
	      } else {
	        refs[ref] = this;
	      }
	    }
	  };
	
	  /**
	   * Transclude, compile and link element.
	   *
	   * If a pre-compiled linker is available, that means the
	   * passed in element will be pre-transcluded and compiled
	   * as well - all we need to do is to call the linker.
	   *
	   * Otherwise we need to call transclude/compile/link here.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._compile = function (el) {
	    var options = this.$options;
	
	    // transclude and init element
	    // transclude can potentially replace original
	    // so we need to keep reference; this step also injects
	    // the template and caches the original attributes
	    // on the container node and replacer node.
	    var original = el;
	    el = transclude(el, options);
	    this._initElement(el);
	
	    // handle v-pre on root node (#2026)
	    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
	      return;
	    }
	
	    // root is always compiled per-instance, because
	    // container attrs and props can be different every time.
	    var contextOptions = this._context && this._context.$options;
	    var rootLinker = compileRoot(el, options, contextOptions);
	
	    // scan for slot distribution before compiling the content
	    // so that it's decoupeld from slot/directive compilation order
	    scanSlots(el, options._content, this);
	
	    // compile and link the rest
	    var contentLinkFn;
	    var ctor = this.constructor;
	    // component compilation can be cached
	    // as long as it's not using inline-template
	    if (options._linkerCachable) {
	      contentLinkFn = ctor.linker;
	      if (!contentLinkFn) {
	        contentLinkFn = ctor.linker = compile(el, options);
	      }
	    }
	
	    // link phase
	    // make sure to link root with prop scope!
	    var rootUnlinkFn = rootLinker(this, el, this._scope);
	    var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);
	
	    // register composite unlink function
	    // to be called during instance destruction
	    this._unlinkFn = function () {
	      rootUnlinkFn();
	      // passing destroying: true to avoid searching and
	      // splicing the directives
	      contentUnlinkFn(true);
	    };
	
	    // finally replace original
	    if (options.replace) {
	      replace(original, el);
	    }
	
	    this._isCompiled = true;
	    this._callHook('compiled');
	  };
	
	  /**
	   * Initialize instance element. Called in the public
	   * $mount() method.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._initElement = function (el) {
	    if (isFragment(el)) {
	      this._isFragment = true;
	      this.$el = this._fragmentStart = el.firstChild;
	      this._fragmentEnd = el.lastChild;
	      // set persisted text anchors to empty
	      if (this._fragmentStart.nodeType === 3) {
	        this._fragmentStart.data = this._fragmentEnd.data = '';
	      }
	      this._fragment = el;
	    } else {
	      this.$el = el;
	    }
	    this.$el.__vue__ = this;
	    this._callHook('beforeCompile');
	  };
	
	  /**
	   * Create and bind a directive to an element.
	   *
	   * @param {String} name - directive name
	   * @param {Node} node   - target node
	   * @param {Object} desc - parsed directive descriptor
	   * @param {Object} def  - directive definition object
	   * @param {Vue} [host] - transclusion host component
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - owner fragment
	   */
	
	  Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
	    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
	  };
	
	  /**
	   * Teardown an instance, unobserves the data, unbind all the
	   * directives, turn off all the event listeners, etc.
	   *
	   * @param {Boolean} remove - whether to remove the DOM node.
	   * @param {Boolean} deferCleanup - if true, defer cleanup to
	   *                                 be called later
	   */
	
	  Vue.prototype._destroy = function (remove, deferCleanup) {
	    if (this._isBeingDestroyed) {
	      if (!deferCleanup) {
	        this._cleanup();
	      }
	      return;
	    }
	
	    var destroyReady;
	    var pendingRemoval;
	
	    var self = this;
	    // Cleanup should be called either synchronously or asynchronoysly as
	    // callback of this.$remove(), or if remove and deferCleanup are false.
	    // In any case it should be called after all other removing, unbinding and
	    // turning of is done
	    var cleanupIfPossible = function cleanupIfPossible() {
	      if (destroyReady && !pendingRemoval && !deferCleanup) {
	        self._cleanup();
	      }
	    };
	
	    // remove DOM element
	    if (remove && this.$el) {
	      pendingRemoval = true;
	      this.$remove(function () {
	        pendingRemoval = false;
	        cleanupIfPossible();
	      });
	    }
	
	    this._callHook('beforeDestroy');
	    this._isBeingDestroyed = true;
	    var i;
	    // remove self from parent. only necessary
	    // if parent is not being destroyed as well.
	    var parent = this.$parent;
	    if (parent && !parent._isBeingDestroyed) {
	      parent.$children.$remove(this);
	      // unregister ref (remove: true)
	      this._updateRef(true);
	    }
	    // destroy all children.
	    i = this.$children.length;
	    while (i--) {
	      this.$children[i].$destroy();
	    }
	    // teardown props
	    if (this._propsUnlinkFn) {
	      this._propsUnlinkFn();
	    }
	    // teardown all directives. this also tearsdown all
	    // directive-owned watchers.
	    if (this._unlinkFn) {
	      this._unlinkFn();
	    }
	    i = this._watchers.length;
	    while (i--) {
	      this._watchers[i].teardown();
	    }
	    // remove reference to self on $el
	    if (this.$el) {
	      this.$el.__vue__ = null;
	    }
	
	    destroyReady = true;
	    cleanupIfPossible();
	  };
	
	  /**
	   * Clean up to ensure garbage collection.
	   * This is called after the leave transition if there
	   * is any.
	   */
	
	  Vue.prototype._cleanup = function () {
	    if (this._isDestroyed) {
	      return;
	    }
	    // remove self from owner fragment
	    // do it in cleanup so that we can call $destroy with
	    // defer right when a fragment is about to be removed.
	    if (this._frag) {
	      this._frag.children.$remove(this);
	    }
	    // remove reference from data ob
	    // frozen object may not have observer.
	    if (this._data.__ob__) {
	      this._data.__ob__.removeVm(this);
	    }
	    // Clean up references to private properties and other
	    // instances. preserve reference to _data so that proxy
	    // accessors still work. The only potential side effect
	    // here is that mutating the instance after it's destroyed
	    // may affect the state of other components that are still
	    // observing the same object, but that seems to be a
	    // reasonable responsibility for the user rather than
	    // always throwing an error on them.
	    this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
	    // call the last hook...
	    this._isDestroyed = true;
	    this._callHook('destroyed');
	    // turn off all instance listeners.
	    this.$off();
	  };
	}
	
	function miscMixin (Vue) {
	  /**
	   * Apply a list of filter (descriptors) to a value.
	   * Using plain for loops here because this will be called in
	   * the getter of any watcher with filters so it is very
	   * performance sensitive.
	   *
	   * @param {*} value
	   * @param {*} [oldValue]
	   * @param {Array} filters
	   * @param {Boolean} write
	   * @return {*}
	   */
	
	  Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
	    var filter, fn, args, arg, offset, i, l, j, k;
	    for (i = 0, l = filters.length; i < l; i++) {
	      filter = filters[i];
	      fn = resolveAsset(this.$options, 'filters', filter.name);
	      if (process.env.NODE_ENV !== 'production') {
	        assertAsset(fn, 'filter', filter.name);
	      }
	      if (!fn) continue;
	      fn = write ? fn.write : fn.read || fn;
	      if (typeof fn !== 'function') continue;
	      args = write ? [value, oldValue] : [value];
	      offset = write ? 2 : 1;
	      if (filter.args) {
	        for (j = 0, k = filter.args.length; j < k; j++) {
	          arg = filter.args[j];
	          args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
	        }
	      }
	      value = fn.apply(this, args);
	    }
	    return value;
	  };
	
	  /**
	   * Resolve a component, depending on whether the component
	   * is defined normally or using an async factory function.
	   * Resolves synchronously if already resolved, otherwise
	   * resolves asynchronously and caches the resolved
	   * constructor on the factory.
	   *
	   * @param {String} id
	   * @param {Function} cb
	   */
	
	  Vue.prototype._resolveComponent = function (id, cb) {
	    var factory = resolveAsset(this.$options, 'components', id);
	    if (process.env.NODE_ENV !== 'production') {
	      assertAsset(factory, 'component', id);
	    }
	    if (!factory) {
	      return;
	    }
	    // async component factory
	    if (!factory.options) {
	      if (factory.resolved) {
	        // cached
	        cb(factory.resolved);
	      } else if (factory.requested) {
	        // pool callbacks
	        factory.pendingCallbacks.push(cb);
	      } else {
	        factory.requested = true;
	        var cbs = factory.pendingCallbacks = [cb];
	        factory.call(this, function resolve(res) {
	          if (isPlainObject(res)) {
	            res = Vue.extend(res);
	          }
	          // cache resolved
	          factory.resolved = res;
	          // invoke callbacks
	          for (var i = 0, l = cbs.length; i < l; i++) {
	            cbs[i](res);
	          }
	        }, function reject(reason) {
	          process.env.NODE_ENV !== 'production' && warn('Failed to resolve async component: ' + id + '. ' + (reason ? '\nReason: ' + reason : ''));
	        });
	      }
	    } else {
	      // normal component
	      cb(factory);
	    }
	  };
	}
	
	var filterRE$1 = /[^|]\|[^|]/;
	
	function dataAPI (Vue) {
	  /**
	   * Get the value from an expression on this vm.
	   *
	   * @param {String} exp
	   * @param {Boolean} [asStatement]
	   * @return {*}
	   */
	
	  Vue.prototype.$get = function (exp, asStatement) {
	    var res = parseExpression(exp);
	    if (res) {
	      if (asStatement && !isSimplePath(exp)) {
	        var self = this;
	        return function statementHandler() {
	          self.$arguments = toArray(arguments);
	          var result = res.get.call(self, self);
	          self.$arguments = null;
	          return result;
	        };
	      } else {
	        try {
	          return res.get.call(this, this);
	        } catch (e) {}
	      }
	    }
	  };
	
	  /**
	   * Set the value from an expression on this vm.
	   * The expression must be a valid left-hand
	   * expression in an assignment.
	   *
	   * @param {String} exp
	   * @param {*} val
	   */
	
	  Vue.prototype.$set = function (exp, val) {
	    var res = parseExpression(exp, true);
	    if (res && res.set) {
	      res.set.call(this, this, val);
	    }
	  };
	
	  /**
	   * Delete a property on the VM
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype.$delete = function (key) {
	    del(this._data, key);
	  };
	
	  /**
	   * Watch an expression, trigger callback when its
	   * value changes.
	   *
	   * @param {String|Function} expOrFn
	   * @param {Function} cb
	   * @param {Object} [options]
	   *                 - {Boolean} deep
	   *                 - {Boolean} immediate
	   * @return {Function} - unwatchFn
	   */
	
	  Vue.prototype.$watch = function (expOrFn, cb, options) {
	    var vm = this;
	    var parsed;
	    if (typeof expOrFn === 'string') {
	      parsed = parseDirective(expOrFn);
	      expOrFn = parsed.expression;
	    }
	    var watcher = new Watcher(vm, expOrFn, cb, {
	      deep: options && options.deep,
	      sync: options && options.sync,
	      filters: parsed && parsed.filters,
	      user: !options || options.user !== false
	    });
	    if (options && options.immediate) {
	      cb.call(vm, watcher.value);
	    }
	    return function unwatchFn() {
	      watcher.teardown();
	    };
	  };
	
	  /**
	   * Evaluate a text directive, including filters.
	   *
	   * @param {String} text
	   * @param {Boolean} [asStatement]
	   * @return {String}
	   */
	
	  Vue.prototype.$eval = function (text, asStatement) {
	    // check for filters.
	    if (filterRE$1.test(text)) {
	      var dir = parseDirective(text);
	      // the filter regex check might give false positive
	      // for pipes inside strings, so it's possible that
	      // we don't get any filters here
	      var val = this.$get(dir.expression, asStatement);
	      return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
	    } else {
	      // no filter
	      return this.$get(text, asStatement);
	    }
	  };
	
	  /**
	   * Interpolate a piece of template text.
	   *
	   * @param {String} text
	   * @return {String}
	   */
	
	  Vue.prototype.$interpolate = function (text) {
	    var tokens = parseText(text);
	    var vm = this;
	    if (tokens) {
	      if (tokens.length === 1) {
	        return vm.$eval(tokens[0].value) + '';
	      } else {
	        return tokens.map(function (token) {
	          return token.tag ? vm.$eval(token.value) : token.value;
	        }).join('');
	      }
	    } else {
	      return text;
	    }
	  };
	
	  /**
	   * Log instance data as a plain JS object
	   * so that it is easier to inspect in console.
	   * This method assumes console is available.
	   *
	   * @param {String} [path]
	   */
	
	  Vue.prototype.$log = function (path) {
	    var data = path ? getPath(this._data, path) : this._data;
	    if (data) {
	      data = clean(data);
	    }
	    // include computed fields
	    if (!path) {
	      for (var key in this.$options.computed) {
	        data[key] = clean(this[key]);
	      }
	    }
	    console.log(data);
	  };
	
	  /**
	   * "clean" a getter/setter converted object into a plain
	   * object copy.
	   *
	   * @param {Object} - obj
	   * @return {Object}
	   */
	
	  function clean(obj) {
	    return JSON.parse(JSON.stringify(obj));
	  }
	}
	
	function domAPI (Vue) {
	  /**
	   * Convenience on-instance nextTick. The callback is
	   * auto-bound to the instance, and this avoids component
	   * modules having to rely on the global Vue.
	   *
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$nextTick = function (fn) {
	    nextTick(fn, this);
	  };
	
	  /**
	   * Append instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$appendTo = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, append, appendWithTransition);
	  };
	
	  /**
	   * Prepend instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$prependTo = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.hasChildNodes()) {
	      this.$before(target.firstChild, cb, withTransition);
	    } else {
	      this.$appendTo(target, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Insert instance before target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$before = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
	  };
	
	  /**
	   * Insert instance after target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$after = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.nextSibling) {
	      this.$before(target.nextSibling, cb, withTransition);
	    } else {
	      this.$appendTo(target.parentNode, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Remove instance from DOM
	   *
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$remove = function (cb, withTransition) {
	    if (!this.$el.parentNode) {
	      return cb && cb();
	    }
	    var inDocument = this._isAttached && inDoc(this.$el);
	    // if we are not in document, no need to check
	    // for transitions
	    if (!inDocument) withTransition = false;
	    var self = this;
	    var realCb = function realCb() {
	      if (inDocument) self._callHook('detached');
	      if (cb) cb();
	    };
	    if (this._isFragment) {
	      removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
	    } else {
	      var op = withTransition === false ? removeWithCb : removeWithTransition;
	      op(this.$el, this, realCb);
	    }
	    return this;
	  };
	
	  /**
	   * Shared DOM insertion function.
	   *
	   * @param {Vue} vm
	   * @param {Element} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition]
	   * @param {Function} op1 - op for non-transition insert
	   * @param {Function} op2 - op for transition insert
	   * @return vm
	   */
	
	  function insert(vm, target, cb, withTransition, op1, op2) {
	    target = query(target);
	    var targetIsDetached = !inDoc(target);
	    var op = withTransition === false || targetIsDetached ? op1 : op2;
	    var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
	    if (vm._isFragment) {
	      mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
	        op(node, target, vm);
	      });
	      cb && cb();
	    } else {
	      op(vm.$el, target, vm, cb);
	    }
	    if (shouldCallHook) {
	      vm._callHook('attached');
	    }
	    return vm;
	  }
	
	  /**
	   * Check for selectors
	   *
	   * @param {String|Element} el
	   */
	
	  function query(el) {
	    return typeof el === 'string' ? document.querySelector(el) : el;
	  }
	
	  /**
	   * Append operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function append(el, target, vm, cb) {
	    target.appendChild(el);
	    if (cb) cb();
	  }
	
	  /**
	   * InsertBefore operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function beforeWithCb(el, target, vm, cb) {
	    before(el, target);
	    if (cb) cb();
	  }
	
	  /**
	   * Remove operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function removeWithCb(el, vm, cb) {
	    remove(el);
	    if (cb) cb();
	  }
	}
	
	function eventsAPI (Vue) {
	  /**
	   * Listen on the given `event` with `fn`.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$on = function (event, fn) {
	    (this._events[event] || (this._events[event] = [])).push(fn);
	    modifyListenerCount(this, event, 1);
	    return this;
	  };
	
	  /**
	   * Adds an `event` listener that will be invoked a single
	   * time then automatically removed.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$once = function (event, fn) {
	    var self = this;
	    function on() {
	      self.$off(event, on);
	      fn.apply(this, arguments);
	    }
	    on.fn = fn;
	    this.$on(event, on);
	    return this;
	  };
	
	  /**
	   * Remove the given callback for `event` or all
	   * registered callbacks.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$off = function (event, fn) {
	    var cbs;
	    // all
	    if (!arguments.length) {
	      if (this.$parent) {
	        for (event in this._events) {
	          cbs = this._events[event];
	          if (cbs) {
	            modifyListenerCount(this, event, -cbs.length);
	          }
	        }
	      }
	      this._events = {};
	      return this;
	    }
	    // specific event
	    cbs = this._events[event];
	    if (!cbs) {
	      return this;
	    }
	    if (arguments.length === 1) {
	      modifyListenerCount(this, event, -cbs.length);
	      this._events[event] = null;
	      return this;
	    }
	    // specific handler
	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        modifyListenerCount(this, event, -1);
	        cbs.splice(i, 1);
	        break;
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Trigger an event on self.
	   *
	   * @param {String|Object} event
	   * @return {Boolean} shouldPropagate
	   */
	
	  Vue.prototype.$emit = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    var cbs = this._events[event];
	    var shouldPropagate = isSource || !cbs;
	    if (cbs) {
	      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	      // this is a somewhat hacky solution to the question raised
	      // in #2102: for an inline component listener like <comp @test="doThis">,
	      // the propagation handling is somewhat broken. Therefore we
	      // need to treat these inline callbacks differently.
	      var hasParentCbs = isSource && cbs.some(function (cb) {
	        return cb._fromParent;
	      });
	      if (hasParentCbs) {
	        shouldPropagate = false;
	      }
	      var args = toArray(arguments, 1);
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        var cb = cbs[i];
	        var res = cb.apply(this, args);
	        if (res === true && (!hasParentCbs || cb._fromParent)) {
	          shouldPropagate = true;
	        }
	      }
	    }
	    return shouldPropagate;
	  };
	
	  /**
	   * Recursively broadcast an event to all children instances.
	   *
	   * @param {String|Object} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$broadcast = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    // if no child has registered for this event,
	    // then there's no need to broadcast.
	    if (!this._eventsCount[event]) return;
	    var children = this.$children;
	    var args = toArray(arguments);
	    if (isSource) {
	      // use object event to indicate non-source emit
	      // on children
	      args[0] = { name: event, source: this };
	    }
	    for (var i = 0, l = children.length; i < l; i++) {
	      var child = children[i];
	      var shouldPropagate = child.$emit.apply(child, args);
	      if (shouldPropagate) {
	        child.$broadcast.apply(child, args);
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Recursively propagate an event up the parent chain.
	   *
	   * @param {String} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$dispatch = function (event) {
	    var shouldPropagate = this.$emit.apply(this, arguments);
	    if (!shouldPropagate) return;
	    var parent = this.$parent;
	    var args = toArray(arguments);
	    // use object event to indicate non-source emit
	    // on parents
	    args[0] = { name: event, source: this };
	    while (parent) {
	      shouldPropagate = parent.$emit.apply(parent, args);
	      parent = shouldPropagate ? parent.$parent : null;
	    }
	    return this;
	  };
	
	  /**
	   * Modify the listener counts on all parents.
	   * This bookkeeping allows $broadcast to return early when
	   * no child has listened to a certain event.
	   *
	   * @param {Vue} vm
	   * @param {String} event
	   * @param {Number} count
	   */
	
	  var hookRE = /^hook:/;
	  function modifyListenerCount(vm, event, count) {
	    var parent = vm.$parent;
	    // hooks do not get broadcasted so no need
	    // to do bookkeeping for them
	    if (!parent || !count || hookRE.test(event)) return;
	    while (parent) {
	      parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
	      parent = parent.$parent;
	    }
	  }
	}
	
	function lifecycleAPI (Vue) {
	  /**
	   * Set instance target element and kick off the compilation
	   * process. The passed in `el` can be a selector string, an
	   * existing Element, or a DocumentFragment (for block
	   * instances).
	   *
	   * @param {Element|DocumentFragment|string} el
	   * @public
	   */
	
	  Vue.prototype.$mount = function (el) {
	    if (this._isCompiled) {
	      process.env.NODE_ENV !== 'production' && warn('$mount() should be called only once.');
	      return;
	    }
	    el = query(el);
	    if (!el) {
	      el = document.createElement('div');
	    }
	    this._compile(el);
	    this._initDOMHooks();
	    if (inDoc(this.$el)) {
	      this._callHook('attached');
	      ready.call(this);
	    } else {
	      this.$once('hook:attached', ready);
	    }
	    return this;
	  };
	
	  /**
	   * Mark an instance as ready.
	   */
	
	  function ready() {
	    this._isAttached = true;
	    this._isReady = true;
	    this._callHook('ready');
	  }
	
	  /**
	   * Teardown the instance, simply delegate to the internal
	   * _destroy.
	   */
	
	  Vue.prototype.$destroy = function (remove, deferCleanup) {
	    this._destroy(remove, deferCleanup);
	  };
	
	  /**
	   * Partially compile a piece of DOM and return a
	   * decompile function.
	   *
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host]
	   * @return {Function}
	   */
	
	  Vue.prototype.$compile = function (el, host, scope, frag) {
	    return compile(el, this.$options, true)(this, el, host, scope, frag);
	  };
	}
	
	/**
	 * The exposed Vue constructor.
	 *
	 * API conventions:
	 * - public API methods/properties are prefixed with `$`
	 * - internal methods/properties are prefixed with `_`
	 * - non-prefixed properties are assumed to be proxied user
	 *   data.
	 *
	 * @constructor
	 * @param {Object} [options]
	 * @public
	 */
	
	function Vue(options) {
	  this._init(options);
	}
	
	// install internals
	initMixin(Vue);
	stateMixin(Vue);
	eventsMixin(Vue);
	lifecycleMixin(Vue);
	miscMixin(Vue);
	
	// install instance APIs
	dataAPI(Vue);
	domAPI(Vue);
	eventsAPI(Vue);
	lifecycleAPI(Vue);
	
	var slot = {
	
	  priority: SLOT,
	  params: ['name'],
	
	  bind: function bind() {
	    // this was resolved during component transclusion
	    var name = this.params.name || 'default';
	    var content = this.vm._slotContents && this.vm._slotContents[name];
	    if (!content || !content.hasChildNodes()) {
	      this.fallback();
	    } else {
	      this.compile(content.cloneNode(true), this.vm._context, this.vm);
	    }
	  },
	
	  compile: function compile(content, context, host) {
	    if (content && context) {
	      if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
	        // if the inserted slot has v-if
	        // inject fallback content as the v-else
	        var elseBlock = document.createElement('template');
	        elseBlock.setAttribute('v-else', '');
	        elseBlock.innerHTML = this.el.innerHTML;
	        // the else block should be compiled in child scope
	        elseBlock._context = this.vm;
	        content.appendChild(elseBlock);
	      }
	      var scope = host ? host._scope : this._scope;
	      this.unlink = context.$compile(content, host, scope, this._frag);
	    }
	    if (content) {
	      replace(this.el, content);
	    } else {
	      remove(this.el);
	    }
	  },
	
	  fallback: function fallback() {
	    this.compile(extractContent(this.el, true), this.vm);
	  },
	
	  unbind: function unbind() {
	    if (this.unlink) {
	      this.unlink();
	    }
	  }
	};
	
	var partial = {
	
	  priority: PARTIAL,
	
	  params: ['name'],
	
	  // watch changes to name for dynamic partials
	  paramWatchers: {
	    name: function name(value) {
	      vIf.remove.call(this);
	      if (value) {
	        this.insert(value);
	      }
	    }
	  },
	
	  bind: function bind() {
	    this.anchor = createAnchor('v-partial');
	    replace(this.el, this.anchor);
	    this.insert(this.params.name);
	  },
	
	  insert: function insert(id) {
	    var partial = resolveAsset(this.vm.$options, 'partials', id);
	    if (process.env.NODE_ENV !== 'production') {
	      assertAsset(partial, 'partial', id);
	    }
	    if (partial) {
	      this.factory = new FragmentFactory(this.vm, partial);
	      vIf.insert.call(this);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	  }
	};
	
	var elementDirectives = {
	  slot: slot,
	  partial: partial
	};
	
	var convertArray = vFor._postProcess;
	
	/**
	 * Limit filter for arrays
	 *
	 * @param {Number} n
	 * @param {Number} offset (Decimal expected)
	 */
	
	function limitBy(arr, n, offset) {
	  offset = offset ? parseInt(offset, 10) : 0;
	  n = toNumber(n);
	  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String} search
	 * @param {String} [delimiter]
	 * @param {String} ...dataKeys
	 */
	
	function filterBy(arr, search, delimiter) {
	  arr = convertArray(arr);
	  if (search == null) {
	    return arr;
	  }
	  if (typeof search === 'function') {
	    return arr.filter(search);
	  }
	  // cast to lowercase string
	  search = ('' + search).toLowerCase();
	  // allow optional `in` delimiter
	  // because why not
	  var n = delimiter === 'in' ? 3 : 2;
	  // extract and flatten keys
	  var keys = toArray(arguments, n).reduce(function (prev, cur) {
	    return prev.concat(cur);
	  }, []);
	  var res = [];
	  var item, key, val, j;
	  for (var i = 0, l = arr.length; i < l; i++) {
	    item = arr[i];
	    val = item && item.$value || item;
	    j = keys.length;
	    if (j) {
	      while (j--) {
	        key = keys[j];
	        if (key === '$key' && contains$1(item.$key, search) || contains$1(getPath(val, key), search)) {
	          res.push(item);
	          break;
	        }
	      }
	    } else if (contains$1(item, search)) {
	      res.push(item);
	    }
	  }
	  return res;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String} sortKey
	 * @param {String} reverse
	 */
	
	function orderBy(arr, sortKey, reverse) {
	  arr = convertArray(arr);
	  if (!sortKey) {
	    return arr;
	  }
	  var order = reverse && reverse < 0 ? -1 : 1;
	  // sort on a copy to avoid mutating original array
	  return arr.slice().sort(function (a, b) {
	    if (sortKey !== '$key') {
	      if (isObject(a) && '$value' in a) a = a.$value;
	      if (isObject(b) && '$value' in b) b = b.$value;
	    }
	    a = isObject(a) ? getPath(a, sortKey) : a;
	    b = isObject(b) ? getPath(b, sortKey) : b;
	    return a === b ? 0 : a > b ? order : -order;
	  });
	}
	
	/**
	 * String contain helper
	 *
	 * @param {*} val
	 * @param {String} search
	 */
	
	function contains$1(val, search) {
	  var i;
	  if (isPlainObject(val)) {
	    var keys = Object.keys(val);
	    i = keys.length;
	    while (i--) {
	      if (contains$1(val[keys[i]], search)) {
	        return true;
	      }
	    }
	  } else if (isArray(val)) {
	    i = val.length;
	    while (i--) {
	      if (contains$1(val[i], search)) {
	        return true;
	      }
	    }
	  } else if (val != null) {
	    return val.toString().toLowerCase().indexOf(search) > -1;
	  }
	}
	
	var digitsRE = /(\d{3})(?=\d)/g;
	
	// asset collections must be a plain object.
	var filters = {
	
	  orderBy: orderBy,
	  filterBy: filterBy,
	  limitBy: limitBy,
	
	  /**
	   * Stringify value.
	   *
	   * @param {Number} indent
	   */
	
	  json: {
	    read: function read(value, indent) {
	      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
	    },
	    write: function write(value) {
	      try {
	        return JSON.parse(value);
	      } catch (e) {
	        return value;
	      }
	    }
	  },
	
	  /**
	   * 'abc' => 'Abc'
	   */
	
	  capitalize: function capitalize(value) {
	    if (!value && value !== 0) return '';
	    value = value.toString();
	    return value.charAt(0).toUpperCase() + value.slice(1);
	  },
	
	  /**
	   * 'abc' => 'ABC'
	   */
	
	  uppercase: function uppercase(value) {
	    return value || value === 0 ? value.toString().toUpperCase() : '';
	  },
	
	  /**
	   * 'AbC' => 'abc'
	   */
	
	  lowercase: function lowercase(value) {
	    return value || value === 0 ? value.toString().toLowerCase() : '';
	  },
	
	  /**
	   * 12345 => $12,345.00
	   *
	   * @param {String} sign
	   */
	
	  currency: function currency(value, _currency) {
	    value = parseFloat(value);
	    if (!isFinite(value) || !value && value !== 0) return '';
	    _currency = _currency != null ? _currency : '$';
	    var stringified = Math.abs(value).toFixed(2);
	    var _int = stringified.slice(0, -3);
	    var i = _int.length % 3;
	    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
	    var _float = stringified.slice(-3);
	    var sign = value < 0 ? '-' : '';
	    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
	  },
	
	  /**
	   * 'item' => 'items'
	   *
	   * @params
	   *  an array of strings corresponding to
	   *  the single, double, triple ... forms of the word to
	   *  be pluralized. When the number to be pluralized
	   *  exceeds the length of the args, it will use the last
	   *  entry in the array.
	   *
	   *  e.g. ['single', 'double', 'triple', 'multiple']
	   */
	
	  pluralize: function pluralize(value) {
	    var args = toArray(arguments, 1);
	    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
	  },
	
	  /**
	   * Debounce a handler function.
	   *
	   * @param {Function} handler
	   * @param {Number} delay = 300
	   * @return {Function}
	   */
	
	  debounce: function debounce(handler, delay) {
	    if (!handler) return;
	    if (!delay) {
	      delay = 300;
	    }
	    return _debounce(handler, delay);
	  }
	};
	
	function installGlobalAPI (Vue) {
	  /**
	   * Vue and every constructor that extends Vue has an
	   * associated options object, which can be accessed during
	   * compilation steps as `this.constructor.options`.
	   *
	   * These can be seen as the default options of every
	   * Vue instance.
	   */
	
	  Vue.options = {
	    directives: directives,
	    elementDirectives: elementDirectives,
	    filters: filters,
	    transitions: {},
	    components: {},
	    partials: {},
	    replace: true
	  };
	
	  /**
	   * Expose useful internals
	   */
	
	  Vue.util = util;
	  Vue.config = config;
	  Vue.set = set;
	  Vue['delete'] = del;
	  Vue.nextTick = nextTick;
	
	  /**
	   * The following are exposed for advanced usage / plugins
	   */
	
	  Vue.compiler = compiler;
	  Vue.FragmentFactory = FragmentFactory;
	  Vue.internalDirectives = internalDirectives;
	  Vue.parsers = {
	    path: path,
	    text: text,
	    template: template,
	    directive: directive,
	    expression: expression
	  };
	
	  /**
	   * Each instance constructor, including Vue, has a unique
	   * cid. This enables us to create wrapped "child
	   * constructors" for prototypal inheritance and cache them.
	   */
	
	  Vue.cid = 0;
	  var cid = 1;
	
	  /**
	   * Class inheritance
	   *
	   * @param {Object} extendOptions
	   */
	
	  Vue.extend = function (extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this;
	    var isFirstExtend = Super.cid === 0;
	    if (isFirstExtend && extendOptions._Ctor) {
	      return extendOptions._Ctor;
	    }
	    var name = extendOptions.name || Super.options.name;
	    if (process.env.NODE_ENV !== 'production') {
	      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
	        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
	        name = null;
	      }
	    }
	    var Sub = createClass(name || 'VueComponent');
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.cid = cid++;
	    Sub.options = mergeOptions(Super.options, extendOptions);
	    Sub['super'] = Super;
	    // allow further extension
	    Sub.extend = Super.extend;
	    // create asset registers, so extended classes
	    // can have their private assets too.
	    config._assetTypes.forEach(function (type) {
	      Sub[type] = Super[type];
	    });
	    // enable recursive self-lookup
	    if (name) {
	      Sub.options.components[name] = Sub;
	    }
	    // cache constructor
	    if (isFirstExtend) {
	      extendOptions._Ctor = Sub;
	    }
	    return Sub;
	  };
	
	  /**
	   * A function that returns a sub-class constructor with the
	   * given name. This gives us much nicer output when
	   * logging instances in the console.
	   *
	   * @param {String} name
	   * @return {Function}
	   */
	
	  function createClass(name) {
	    /* eslint-disable no-new-func */
	    return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
	    /* eslint-enable no-new-func */
	  }
	
	  /**
	   * Plugin system
	   *
	   * @param {Object} plugin
	   */
	
	  Vue.use = function (plugin) {
	    /* istanbul ignore if */
	    if (plugin.installed) {
	      return;
	    }
	    // additional parameters
	    var args = toArray(arguments, 1);
	    args.unshift(this);
	    if (typeof plugin.install === 'function') {
	      plugin.install.apply(plugin, args);
	    } else {
	      plugin.apply(null, args);
	    }
	    plugin.installed = true;
	    return this;
	  };
	
	  /**
	   * Apply a global mixin by merging it into the default
	   * options.
	   */
	
	  Vue.mixin = function (mixin) {
	    Vue.options = mergeOptions(Vue.options, mixin);
	  };
	
	  /**
	   * Create asset registration methods with the following
	   * signature:
	   *
	   * @param {String} id
	   * @param {*} definition
	   */
	
	  config._assetTypes.forEach(function (type) {
	    Vue[type] = function (id, definition) {
	      if (!definition) {
	        return this.options[type + 's'][id];
	      } else {
	        /* istanbul ignore if */
	        if (process.env.NODE_ENV !== 'production') {
	          if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
	            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
	          }
	        }
	        if (type === 'component' && isPlainObject(definition)) {
	          definition.name = id;
	          definition = Vue.extend(definition);
	        }
	        this.options[type + 's'][id] = definition;
	        return definition;
	      }
	    };
	  });
	
	  // expose internal transition API
	  extend(Vue.transition, transition);
	}
	
	installGlobalAPI(Vue);
	
	Vue.version = '1.0.17';
	
	// devtools global hook
	/* istanbul ignore next */
	if (devtools) {
	  devtools.emit('init', Vue);
	} else if (process.env.NODE_ENV !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
	  console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
	}
	
	module.exports = Vue;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(/*! ./../../.0.11.10@process/browser.js */ 8)))

/***/ }),
/* 20 */
/*!**********************************!*\
  !*** ./js/vueModel/mainMenu.vue ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(/*! -!babel-loader?presets[]=es2015&plugins[]=transform-runtime!../../~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./mainMenu.vue */ 21)
	__vue_template__ = __webpack_require__(/*! -!html-loader!../../~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./mainMenu.vue */ 22)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\worklink\\new-home-page\\js\\vueModel\\mainMenu.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 21 */
/*!*********************************************************************************************************************************************************************!*\
  !*** ./~/.6.4.1@babel-loader/lib?presets[]=es2015&plugins[]=transform-runtime!./~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./js/vueModel/mainMenu.vue ***!
  \*********************************************************************************************************************************************************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <script>
	exports.default = {
		props: ['menus', 'addflag'],
		methods: {
			forwardMenu: function forwardMenu(GROUP_ID, GROUP_NAME) {
				var target = event.target;
				$("#mainMenu li").removeClass("hmenu_bg");
				$(target.parentNode).addClass("hmenu_bg");
	
				var className = $(target).attr("class");
				$(target).removeClass(className).addClass(className + "_2");
	
				this.$dispatch('onMenuClick', { GROUP_ID: GROUP_ID, GROUP_NAME: GROUP_NAME });
			},
			addMenu: function addMenu() {
				var _this = this;
	
				this.$set('addflag', false);
				this.$set('newMenuName', '');
				setTimeout(function () {
					_this.$el.querySelector('.addMenuSty').focus();
				}, 500);
			},
			setNewMenu: function setNewMenu(newMenuName) {
				this.$dispatch('setNewMenu', newMenuName, this);
			},
			hideAddBox: function hideAddBox() {
				if (event.relatedTarget != null && event.relatedTarget.className == "button_tj") {
					return;
				}
				this.$set('newMenuName', '');
				this.$set('addflag', true);
			}
		}
	};
	// </script>
	// <template>
	// 	<div class="hmenu">
	//
	// 		<div class="hmenu_search">
	// 			<div class="dropdown-group" style="position:relative;float:left;">
	// 				<div  class="hleft" data-toggle="dropdown"></div>
	// 					<ul class="dropdown-menu" role="menu">
	// 	                    <li>
	// 	                        <a href="javascript:void(0);" @click="addMenu()">添加</a>
	// 	                    </li>
	// 	                    <li>
	// 	                        <a href="javascript:void(0);" >编辑</a>
	// 	                    </li>
	// 	              </ul>
	// 			</div>
	// 			<input type="text" class="h_search"/>
	// 		</div>
	// 		<ul>
	// 		   <li class="hmenu_input"  v-bind:class="{ hideDom:addflag }">
	// 		   		<input type="text" class="addMenuSty" v-model="newMenuName" @blur="hideAddBox(newMenuName)" placeholder="请输入新增菜单名称..." value="" /><button type="button" class="button_tj" @click=setNewMenu(newMenuName)></button>
	// 		   </li>
	// 			<li v-for="menu in menus" >
	// 				<a href="#" class="icon_04" v-on:click="forwardMenu(menu.GROUP_ID,menu.GROUP_NAME,this)">
	// 				<span class="{{menu.ICON_CLS!=''?menu.ICON_CLS:'icon_05'}}"></span>
	// 				{{menu.GROUP_NAME}}
	// 				</a>
	// 			</li>
	//
	// 		</ul>
	//
	// 	</div>
	// </template>
	/* generated by vue-loader */

/***/ }),
/* 22 */
/*!*********************************************************************************************************************!*\
  !*** ./~/.0.3.0@html-loader!./~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./js/vueModel/mainMenu.vue ***!
  \*********************************************************************************************************************/
/***/ (function(module, exports) {

	module.exports = "\r\n\t<div class=\"hmenu\">\r\n\r\n\t\t<div class=\"hmenu_search\">\r\n\t\t\t<div class=\"dropdown-group\" style=\"position:relative;float:left;\">\r\n\t\t\t\t<div  class=\"hleft\" data-toggle=\"dropdown\"></div>\r\n\t\t\t\t\t<ul class=\"dropdown-menu\" role=\"menu\">\r\n\t                    <li>\r\n\t                        <a href=\"javascript:void(0);\" @click=\"addMenu()\">添加</a>\r\n\t                    </li>\r\n\t                    <li>\r\n\t                        <a href=\"javascript:void(0);\" >编辑</a>\r\n\t                    </li>\r\n\t              </ul>\r\n\t\t\t</div>\r\n\t\t\t<input type=\"text\" class=\"h_search\"/>\r\n\t\t</div>\r\n\t\t<ul>\r\n\t\t   <li class=\"hmenu_input\"  v-bind:class=\"{ hideDom:addflag }\">\r\n\t\t   \t\t<input type=\"text\" class=\"addMenuSty\" v-model=\"newMenuName\" @blur=\"hideAddBox(newMenuName)\" placeholder=\"请输入新增菜单名称...\" value=\"\" /><button type=\"button\" class=\"button_tj\" @click=setNewMenu(newMenuName)></button>\r\n\t\t   </li>\r\n\t\t\t<li v-for=\"menu in menus\" >\r\n\t\t\t\t<a href=\"#\" class=\"icon_04\" v-on:click=\"forwardMenu(menu.GROUP_ID,menu.GROUP_NAME,this)\">\r\n\t\t\t\t<span class=\"{{menu.ICON_CLS!=''?menu.ICON_CLS:'icon_05'}}\"></span>\r\n\t\t\t\t{{menu.GROUP_NAME}}\r\n\t\t\t\t</a>\r\n\t\t\t</li>\r\n\t\t\t\r\n\t\t</ul>\r\n\r\n\t</div>\r\n";

/***/ }),
/* 23 */
/*!*******************************!*\
  !*** ./js/vueModel/modal.vue ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(/*! -!babel-loader?presets[]=es2015&plugins[]=transform-runtime!../../~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./modal.vue */ 24)
	__vue_template__ = __webpack_require__(/*! -!html-loader!../../~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./modal.vue */ 32)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\worklink\\new-home-page\\js\\vueModel\\modal.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 24 */
/*!******************************************************************************************************************************************************************!*\
  !*** ./~/.6.4.1@babel-loader/lib?presets[]=es2015&plugins[]=transform-runtime!./~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./js/vueModel/modal.vue ***!
  \******************************************************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ajax = __webpack_require__(/*! util/ajax */ 25);
	
	var _ajax2 = _interopRequireDefault(_ajax);
	
	var _constans = __webpack_require__(/*! util/constans */ 31);
	
	var _constans2 = _interopRequireDefault(_constans);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// <script>
	exports.default = {
	    props: ['menuTree', 'modalstitle'],
	    data: function data() {
	        return {
	            menuTree: [],
	            modalstitle: ''
	        };
	    },
	    ready: function ready() {
	
	        var zTreeCheck = this.getMenuData;
	        var setting = {
	            data: {
	                simpleData: {
	                    enable: true,
	                    idKey: 'id',
	                    pIdKey: 'pId',
	                    rootPId: null
	                }
	            },
	            check: {
	                chkStyle: 'checkbox',
	                enable: true,
	                chkboxType: { Y: 'ps', N: 'ps' }
	            },
	            callback: {
	                onCheck: zTreeCheck
	            }
	        };
	
	        var data = {
	            "linkTree": [{ "MENU_ID": "1", "PAR_MENU": "-1", "MENU_NAME": "总部", "MENU_LINK": "http://www.baidu.com" }, { "MENU_ID": "2", "PAR_MENU": "1", "MENU_NAME": "区域一", "MENU_LINK": "http://www.baidu.com" }, { "MENU_ID": "3", "PAR_MENU": "1", "MENU_NAME": "区域二", "MENU_LINK": "http://www.baidu.com" }, { "MENU_ID": "4", "PAR_MENU": "-1", "MENU_NAME": "区域三", "MENU_LINK": "http://www.baidu.com" }, { "MENU_ID": "5", "PAR_MENU": "4", "MENU_NAME": "区域四", "MENU_LINK": "http://www.baidu.com" }, { "MENU_ID": "6", "PAR_MENU": "4", "MENU_NAME": "区域五", "MENU_LINK": "http://www.baidu.com" }]
	        };
	
	        if (!data.linkTree) {
	            return false;
	        }
	        var zNodes = [];
	        $.each(data.linkTree, function (i, sData) {
	            zNodes.push({ id: sData.MENU_ID, pId: sData.PAR_MENU, name: sData.MENU_NAME, link: sData.MENU_LINK });
	        });
	        $.fn.zTree.init($('#menuTree'), setting, zNodes);
	
	        //   // 测试获取KJDPAJAX
	        // kjdpAjax.post({
	        //   req: {
	        //     service: 'Y1001000',
	        //     MENU_PUR: constans.kjdpConst.MENU_PUR_ALL
	        //   }
	        // }).then((data) => {
	        //   let zNodes = [];
	        //   for (let sData of data[0]) {
	        //     zNodes.push({ id: sData.MENU_ID, pId: sData.PAR_MENU, name: sData.MENU_NAME, link: sData.MENU_LINK });
	        //   }
	        //   $.fn.zTree.init($('#menuTree'), setting, zNodes);
	        // });
	    },
	
	    methods: {
	        getMenuData: function getMenuData(selecteData) {
	            this.$dispatch('popupButtonRight', selecteData);
	        },
	        modalCancel: function modalCancel(target) {
	            var treeObj = $.fn.zTree.getZTreeObj('menuTree');
	            var nodes = treeObj.getCheckedNodes();
	            var nodesIndex = '';
	            $.each(nodes, function (index, cont) {
	                if (target.linkId == cont.id) {
	                    nodesIndex = index;
	                }
	            });
	            treeObj.checkNode(nodes[nodesIndex], false, true, true);
	        },
	        getModal: function getModal(titlecont, menuTree) {
	            this.$dispatch('setModalMeg', { title: titlecont, list: menuTree });
	        },
	        cancelModal: function cancelModal() {
	            this.$dispatch('cancelModal');
	        },
	        resetModal: function resetModal() {
	            this.$dispatch('onReset');
	        }
	    }
	};
	// </script>
	// <template>
	//  <!-- 模态框（Modal） -->
	//     <div class="modal fade" id="boxItemWindow" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	//         <div class="modal-dialog">
	//             <div class="modal-content">
	//                 <div class="popup">
	//                     <div class="popup_bt"><span>添加模版</span><button type="button" data-dismiss="modal"  
	//                     aria-hidden="true" v-on:click="cancelModal"></button></div>
	//                     <div class="popup_ul">
	//                         <div class="popup_ulname"><span>模块名称：</span><input modelId="{{modalstitle.id}}" type="text" class="popup_input" 
	//                         v-model="modalstitle.name" placeholder="请输入模块名称"/></div>
	//                         <div class="popup_ulbox">
	//                             <div class="popup_ulleft">
	//                                 <div class="popup_listbt"><span>菜单库</span><input name="" type="text" class="popup_search"/></div>
	//                                 <div class="ulbox">
	//                                     <ul id="menuTree" class="ztree"></ul>
	//                                 </div>
	//                             </div>
	//                             <div class="popup_ulcenter"><span class="popup_buttonright"></span></div>
	//                             <div class="popup_ulright">
	//                                 <div class="popup_listbt"><span>已选择</span></div>
	//                                  <div class="ulbox">
	//                                     <ul>
	//                                     	<li v-for="(i,cont) in menuTree">
	//                                     		<span  name='{{cont.link}}'>{{cont.name}}
	//                                             <button type="button" v-on:click='modalCancel(cont)'>X</button></span>
	//                                     	</li>
	//                                     </ul>
	//                                 </div>
	//                             </div>
	//                         </div>
	//                     </div>
	//                     <div class="popup_bottom"><button type="button" class="popup_reset" v-on:click="resetModal()">重置</button><button type="button" class="popup_add" v-on:click="getModal(modalstitle,menuTree)">确定</button></div>
	//                 </div>
	//             </div>
	//         </div>
	// </template>
	/* generated by vue-loader */

/***/ }),
/* 25 */
/*!*************************!*\
  !*** ./js/util/ajax.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	/**
	 * ##ajax模块，对接KJDP后端协议##
	 * @module core/ajax
	 * @see module:core/ajax
	 * @author liuqing
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	
	    var _ = __webpack_require__(/*! underscore */ 18);
	    var utils = __webpack_require__(/*! ./utils */ 26);
	    var consts = __webpack_require__(/*! ./constans */ 31).default.kjdpConst;
	
	    var loginData = {},
	        encKey,
	        isTimeoutDialogShowed = false,
	        ajax = {
	
	        /**
	         * **jquery原生的ajax方法**
	         *
	         * 使用方法：
	         * ```javascript
	         * ajax.ajax(param).done(function() {
	         *  console.log("done");    //绑定执行成功的回调函数，支持多次调用done绑定多个回调函数
	         * }).fail(function() {
	         *  console.log("fail");    //绑定执行失败的回调函数，支持多次调用fail绑定多个回调函数
	         * }).always(function() {
	         *  console.log("complete");    //绑定执行完成的回调函数，支持多次调用always绑定多个回调函数
	         * });
	         * ```
	         * @method ajax
	         * @param  {object} param 请求参数
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        ajax: function ajax(param) {
	            return $.ajax($.extend({
	                type: param.type || "POST",
	                dataType: consts.REQ_TYPE_JSON,
	                contentType: "text/plain; charset=utf-8"
	            }, param));
	        },
	
	        post: function post(param) {
	            param.type = "post";
	            return this.ajaxRequest(param);
	        },
	
	        get: function get(param) {
	            param.type = "get";
	            return this.ajax(param);
	        },
	
	        del: function del(param) {
	            param.type = "delete";
	            return this.ajaxRequest(param);
	        },
	
	        put: function put(param) {
	            param.type = "put";
	            return this.ajaxRequest(param);
	        },
	
	        jsonp: function jsonp(param) {
	            return $.ajax($.extend({
	                url: param.url,
	                dataType: "jsonp",
	                jsonp: "jsonpcallback"
	            }, param));
	        },
	
	        ajaxRequest: function ajaxRequest(param) {
	            if ("object" !== $.type(param)) {
	                throw "请求参数不合法，请检查调用参数！";
	            }
	
	            var defObj = $.Deferred(),
	                proxy = $.proxy(function () {
	                ajax.getEncryptKey(true).done(function () {
	                    ajax.ajax(ajax.buildParam(param)).done(function (ansData) {
	                        var ansRet = ajax.resolveParam(ansData);
	
	                        if (ansRet.length) {
	                            defObj.resolveWith(this, [ansRet[0].data, ansRet[0].head, ansRet]);
	                        } else {
	                            defObj.rejectWith(this, arguments);
	                        }
	                    }).fail(function () {
	                        defObj.rejectWith(this, arguments);
	                    });
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            });
	
	            param.checkSession = undefined == param.checkSession ? true : param.checkSession;
	
	            if (param.checkSession) {
	                ajax.session(true).done(function (data) {
	                    var sessionRet = {
	                        ANSWERS: [{
	                            ANS_MSG_HDR: { MSG_CODE: data.IRETCODE, MSG_TEXT: data.IRETINFO, RESULT_NUM: "0" },
	                            ANS_COMM_DATA: []
	                        }] },
	                        ansRet = ajax.resolveParam(sessionRet);
	
	                    if (!ajax.isSuccess(ansRet[0].head)) {
	                        defObj.resolveWith(this, [ansRet[0].data, ansRet[0].head, ansRet]);
	                    } else {
	                        proxy();
	                    }
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            } else {
	                proxy();
	            }
	
	            return defObj.promise();
	        },
	
	        showSessionTimeoutPrompt: function showSessionTimeoutPrompt() {
	            var callback = $.proxy(function () {
	                top.location.reload();
	            });
	
	            !isTimeoutDialogShowed && (isTimeoutDialogShowed = top.alert('提示', '您的服务器会话已过期，请重新登录！', "info", callback, callback));
	        },
	
	        publishCallback: function publishCallback(data0) {
	            var defObj = $.Deferred();
	            //存在发布订阅的处理
	            var pubNo = data0[data0.length - 3][0].PUBNO,
	                num = 60,
	                publishFlag = false,
	                s = setInterval(function () {
	                num--;
	                $dialog.find(".publish-num").text(num);
	                if (num == 0) {
	                    s && clearInterval(s);
	                    $dialog.dialog("close");
	                    $dialog.dialog("destroy");
	                    if (publishFlag) {
	                        defObj.resolveWith(this);
	                    } else {
	                        defObj.rejectWith(this);
	                    }
	                }
	            }, 1000),
	                $dialog = $("<div>" + "<div class='publish-dialog clearfix'>" + "<span class='publish-icon'></span>" + "<div class='publish-tips-box'>" + "<p class='publish-tips'>等待发布订阅，倒计时<span class='publish-num'>" + num + "</span>秒……</p>" + "<p class='publish-error'></p>" + "</div>" + "</div>" + "</div>");
	            $dialog.dialog({
	                width: 400,
	                height: 200,
	                modal: true,
	                closable: false,
	                title: "发布订阅等待提示",
	                onOpen: function onOpen() {
	                    var height = $dialog.find(".publish-tips-box").height();
	                    if (height > 130) {
	                        height = 130;
	                    }
	                    $dialog.find(".publish-tips-box").css({ "margin-top": "-" + height / 2 + "px" });
	                },
	                buttons: [{
	                    text: "取消等待",
	                    iconCls: "icon-cancel",
	                    handler: function handler() {
	                        s && clearInterval(s);
	                        $dialog.dialog("close");
	                        $dialog.dialog("destroy");
	                        if (publishFlag) {
	                            defObj.resolveWith(this);
	                        } else {
	                            defObj.rejectWith(this);
	                        }
	                    }
	                }]
	            });
	            setTimeout(function () {
	                checkPublish();
	            }, 1000);
	            function checkPublish() {
	                if (!$dialog.data("dialog")) {
	                    return;
	                }
	                //发布状态查询
	                ajax.post({
	                    req: {
	                        bex_codes: 'YGT_PubCheckDataQuery',
	                        pubnos: pubNo
	                    },
	                    noProcess: true,
	                    noProcessPub: true
	                }).done(function (data) {
	                    if (data && data[0] && data[0].length > 0) {
	                        for (var i = 0; i < data[0].length; i++) {
	                            if (data[0][i].STATUS == "1") {
	                                if (num > 0) {
	                                    checkPublish();
	                                }
	                                return;
	                            } else if (data[0][i].STATUS != "2" && data[0][i].ERRNO != '100') {
	                                //errno-100 代表没有变化，不做修改。
	                                s && clearInterval(s);
	                                $dialog.find(".publish-tips").text("发布订阅失败！");
	                                $dialog.find(".publish-icon").addClass("error");
	                                $dialog.find(".publish-error").addClass("border").text(data[0][i].ERRMSG);
	                                $dialog.find(".dialog-button .l-btn-text").text("关闭");
	                                var height = $dialog.find(".publish-tips-box").height();
	                                if (height > 130) {
	                                    height = 130;
	                                }
	                                $dialog.find(".publish-tips-box").css({ "margin-top": "-" + height / 2 + "px" });
	                                publishFlag = false;
	                                return;
	                            }
	                        }
	                    }
	                    s && clearInterval(s);
	                    $dialog.find(".publish-tips").text("发布订阅成功！");
	                    $dialog.find(".publish-icon").addClass("success");
	                    $dialog.find(".dialog-button .l-btn-text").text("关闭");
	                    publishFlag = true;
	                });
	            }
	            return defObj;
	        },
	
	        ajax4kui: function ajax4kui(param) {
	            var defObj = $.Deferred(),
	                strMsgText;
	            ajax.ajaxRequest(param).done(function (data0, head0, answers) {
	                if (!param.noProcess && 1 === answers.length && !ajax.isSuccess(head0, param.extMsgCode)) {
	                    strMsgText = head0.MSG_TEXT ? head0.MSG_TEXT.replace("通用调用lbm查询功能调用失败!", "") : "业务执行失败！";
	                    ajax.isSessionTimeout(head0) ? ajax.showSessionTimeoutPrompt() : top.alert("提示", strMsgText, "error");
	                    $.isFunction(param.error) && param.error.apply(this, answers);
	                    defObj.rejectWith(this, [data0, head0, answers]);
	                } else if (!param.noProcessPub && ajax.isPublish(data0)) {
	                    //存在发布订阅的处理
	                    ajax.publishCallback(data0).done(function () {
	                        $.isFunction(param.func) && param.func.apply(answers, [data0, head0]);
	                        defObj.resolveWith(this, [data0, head0, answers]);
	                    }).fail(function () {
	                        $.isFunction(param.error) && param.error.apply(this, answers);
	                        defObj.rejectWith(this, [data0, head0, answers]);
	                    });
	                } else {
	                    $.isFunction(param.func) && param.func.apply(answers, [data0, head0]);
	                    defObj.resolveWith(this, [data0, head0, answers]);
	                }
	            }).fail(function (jqXHR, statusText, error) {
	                false !== param.showErrorPrompt && "timeout" === statusText && top.alert("提示", "请求超时，请检查网络！", "error");
	                false !== param.showErrorPrompt && "error" === statusText && "" != error && top.alert("提示", "服务器发生了错误，错误信息：" + error, "error");
	                $.isFunction(param.error) && param.error.apply(this, arguments);
	                defObj.rejectWith(this, arguments);
	            });
	
	            return defObj.promise();
	        },
	
	        /**
	         *
	         * **用户登录接口，适用KJDP**
	         *
	         * @method login
	         * @param {object} param 请求参数
	         *  @param {string} param.USER_CODE 用户代码
	         *  @param {string} param.TRD_PWD 用户密码
	         *  @param {string} [param.validateCode] 验证码
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        login: function login(param) {
	            if (!param) {
	                throw "登录参数不合法，请检查参数！";
	            }
	
	            var defObj = $.Deferred();
	
	            ajax.getEncryptKey().done(function () {
	
	                if (param.TRD_PWD) {
	                    param.TRD_PWD = utils.encrypt(param.TRD_PWD, param.USER_CODE);
	                }
	
	                ajax.ajax({
	                    url: consts.LOGIN_URL,
	                    data: utils.fsEncrypt(ajax.makeXmlRequest(param), encKey)
	                }).done(function (data) {
	                    if (!data) {
	                        data = { IRETCODE: "-999999999" };
	                    }
	
	                    if (data.IRETCODE === "0") {
	                        loginData = data;
	                    }
	                    defObj.resolveWith(this, [data]);
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            }).fail(function () {
	                defObj.rejectWith(this, arguments);
	            });
	
	            return defObj.promise();
	        },
	
	        /**
	         *
	         * **注销会话接口，适用KJDP**
	         *
	         * @method logout
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        logout: function logout() {
	            return this.ajax({
	                url: consts.LOGOUT_URL + "?&isRedirect=false",
	                dataType: "text"
	            }).done(function () {
	                encKey = null;
	                loginData = {};
	            });
	        },
	
	        /**
	         *
	         * **更新用户在会话中的信息，适用KJDP**
	         *
	         * @method logout
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        updateUserInfo: function updateUserInfo(param) {
	            if (!param) {
	                throw "登录参数不合法，请检查参数！";
	            }
	
	            var defObj = $.Deferred();
	
	            ajax.getEncryptKey(true).done(function () {
	                ajax.ajax({
	                    url: consts.KJDP_USER_INFO_URL,
	                    data: utils.fsEncrypt(ajax.makeXmlRequest(param), encKey)
	                }).done(function (data) {
	                    defObj.resolveWith(this, [data]);
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            }).fail(function () {
	                defObj.rejectWith(this, arguments);
	            });
	
	            return defObj.promise();
	        },
	
	        /**
	         *
	         * **获取会话数据接口，适用KJDP**
	         *
	         * @method session
	         * @param {boolean} useCache 是否使用缓存
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        session: function session(useCache) {
	            var defObj = $.Deferred();
	            if (useCache && !$.isEmptyObject(loginData)) {
	                defObj.resolveWith(this, [loginData]);
	            } else {
	                this.ajax({
	                    url: consts.SESSION_URL
	                }).success(function (data) {
	                    if (data.IRETCODE === "0") {
	                        loginData = data;
	                    }
	                    defObj.resolveWith(this, [data]);
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            }
	            return defObj.promise();
	        },
	
	        /**
	         *
	         * **获取动态密钥，适用KJDP**
	         *
	         * @method getEncryptKey
	         * @param {boolean} useCache 是否使用缓存
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        getEncryptKey: function getEncryptKey(useCache) {
	            var defObj = $.Deferred();
	
	            if (useCache && encKey) {
	                defObj.resolveWith(this, [encKey]);
	            } else {
	                this.ajax({
	                    url: consts.ENCRYPT_KEY_URL
	                }).done(function (data) {
	                    encKey = data + "";
	                    defObj.resolveWith(this, [encKey]);
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            }
	
	            return defObj.promise();
	        },
	
	        /**
	         * **组装请求参数方法，适用KJDP**
	         * @method buildParam
	         * @param {object} param 请求参数
	         *   @param {object|object[]} param.req  请求数据
	         *  @param {string} [param.url] 服务器地址，默认是require("consts").AJAX_URL
	         *  @param {string} [param.type] 请求类型，post或get，默认是post
	         *  @param {string} [param.reqType] 协议类型，xml或json，默认是json
	         *  @param {string} [param.timeout] 超时时间
	         * @return {object} ajax调用参数
	         */
	        buildParam: function buildParam(param) {
	            var _sys_node_mode = utils.getUrlParam()._sys_node_mode,
	                serverId = utils.getHashValByKey("_server_id");
	
	            param.reqType = param.reqType || consts.REQ_TYPE_JSON;
	            param.req = $.isArray(param.req) ? param.req : [param.req];
	
	            $.each(param.req, function (i) {
	                var self = this;
	
	                if (undefined == self._sys_node_mode && _sys_node_mode) {
	                    self._sys_node_mode = _sys_node_mode;
	                }
	
	                switch (self._sys_node_mode) {
	                    case "1":
	                        //统一模式
	                        if (!self._node_query) {
	                            delete self._node_query;
	                        }
	                        //查询模式下 serverId存在 进入
	                        if (serverId && "0" !== serverId && undefined === self._server_id && self._node_query) {
	                            this._server_id = serverId;
	                            this._sys_node_mode = "2";
	                        }
	                        break;
	                    case "2":
	                        //多节点查询参数 _serverId
	                        if (serverId && "0" !== serverId && undefined === this._server_id) {
	                            this._server_id = serverId;
	                            this._sys_node_mode = "2";
	                        }
	                        break;
	                    default:
	                        //多节点查询参数 _serverId
	                        if (serverId && "0" !== serverId && undefined === this._server_id) {
	                            this._server_id = serverId;
	                            this._sys_node_mode = "2";
	                        }
	                        break;
	                }
	
	                if (!param.url) {
	                    if (!this[consts.SERVICE] && !this[consts.BEX_CODES]) {
	                        throw "索引为" + i + "的请求没有设置" + consts.SERVICE + "或" + consts.BEX_CODES + "，请检查参数是否正确！";
	                    }
	                }
	
	                if (this[consts.BEX_CODES] && !this[consts.SERVICE]) {
	                    this[consts.SERVICE] = "P9999999";
	                }
	                //加个view配置超时时间 tangsx 20161015
	                this.AllTimeOut = this.AllTimeOut || param.timeout || 15 * 60 * 1000;
	            });
	
	            return {
	                url: (param.url || consts.AJAX_URL) + "?returnType=" + param.reqType,
	                async: true,
	                type: param.type || "POST",
	                dataType: param.reqType,
	                data: utils.fsEncrypt(consts.REQ_TYPE_JSON === param.reqType ? this.makeJsonRequest(param.req) : this.makeXmlRequest(param.req), encKey),
	                processData: false,
	                timeout: param.timeout || 15 * 60 * 1000,
	                contentType: "text/plain; charset=utf-8"
	            };
	        },
	
	        /**
	        * **解析服务器返回结果方法，适用KJDP**
	        * @method resolveParam
	        * @param {object} param 服务器返回结果
	        *  @param {array} [param.ANSWERS] 服务器返回结果
	        * @return undefined
	        */
	        resolveParam: function resolveParam(ansData) {
	            var answers = ansData && ansData.ANSWERS;
	
	            if (!answers || !answers.length) {
	                return [];
	            }
	
	            return _.chain(answers).map(function (answer) {
	                var ansMsgHdr = answer.ANS_MSG_HDR,
	                    ansCommData = answer.ANS_COMM_DATA;
	
	                return {
	                    data: ajax.isSuccess(ansMsgHdr) && 2 === ansCommData.length && !ansCommData[0].BPM_DATA.length ? [[]].concat(ansCommData) : ansCommData,
	                    head: ansMsgHdr
	                };
	            }).value();
	        },
	
	        /***
	         * **获取单次ajaxRequest请求调用的公共参数**
	         * @method getReqHead
	         * @param {object} sReq 一次ajaxRequest调用的参数
	         *  @param {string} sReq.service 接口编号
	         *  @param {string} sReq.menuId  菜单编号
	         * @return {object} **公共参数**
	         */
	        getReqHead: function getReqHead(sReq) {
	            var urlParam = utils.getUrlParam();
	            return {
	                F_OP_CODE: loginData.USER_CODE || "",
	                F_OP_ROLE: loginData.USER_ROLE || "",
	                F_OP_BRANCH: loginData.ORG_CODE || "",
	                F_OP_SITE: loginData.LOG_IP || "",
	                F_SESSION: loginData.USER_TICKET_INFO || "",
	                F_OP_WAY: '1',
	                F_OP_LANGUAGE: '1',
	                F_OP_PROGRAM: sReq[consts.PROGRAM] || "",
	                F_SERVER_ID: sReq[consts.SERVICE] || "",
	                F_MSG_ID: sReq[consts.SERVICE] || "",
	                F_CUST_ORG_CODE: urlParam.F_CUST_ORG_CODE || sReq.F_CUST_ORG_CODE || ""
	            };
	        },
	
	        /***
	         * **生成请求参数json格式**
	         * @method makeJsonRequest
	         * @param {object|object[]} req 请求参数
	         * @return {string} **json格式的请求串**
	         */
	        makeJsonRequest: function makeJsonRequest(req) {
	            var reqJson = [];
	            req = $.isArray(req) ? req : [req];
	
	            $.each(req, function () {
	                reqJson.push({
	                    REQ_MSG_HDR: ajax.getReqHead(this),
	                    REQ_COMM_DATA: this
	                });
	            });
	
	            return utils.toJSON({ REQUESTS: reqJson });
	        },
	
	        /***
	         * **生成请求参数xml格式**
	         * @method makeXmlRequest
	         * @param {object|object[]} req 请求参数
	         * @return {string} **xml格式的请求串**
	         */
	        makeXmlRequest: function makeXmlRequest(req) {
	            return "<?xml version='1.0' encoding='UTF-8'?><requests><![CDATA[" + utils.toJSON($.isArray(req) ? { req: req } : { req: [req] }) + "]]></requests>";
	        },
	
	        /**
	         * **判断是否登录成功**
	         * @method isLogin
	         * @param {object} data 登录接口返回数据
	         * @return {boolean} **业务执行成功返回true否则返回false**
	         */
	        isLogin: function isLogin(data) {
	            return data && "0" === data["IRETCODE"];
	        },
	
	        /**
	         * **判断请求是否成功**
	         * @method isSuccess
	         * @param {object} head 请求返回头
	         * @return {boolean} **业务执行成功返回true否则返回false**
	         */
	        isSuccess: function isSuccess(head, extMsgCode) {
	
	            var msgCodeArr = ["0", "100", "9010001", "-130011", "-404", "106192"].concat(_.isString(extMsgCode) ? extMsgCode.split(",") : _.isArray(extMsgCode) ? extMsgCode : []);
	
	            if (!head || !head.MSG_CODE) {
	                return false;
	            }
	
	            return -1 !== _.indexOf(msgCodeArr, head.MSG_CODE);
	        },
	
	        /**
	         * 判断请求是否含有发布订阅
	         * @param data
	         * @returns {*}
	         */
	        isPublish: function isPublish(data) {
	            if (data && data.length > 2) {
	                var t = data[data.length - 3];
	                return t && t[0] && t[0].PUBNO;
	            }
	            return false;
	        },
	
	        /***
	         * **判断请求是否会话超时**
	         * @method isSessionTimeout
	         * @param {object} head 请求返回头
	         * @return {boolean} **会话超时返回true否则返回false**
	         */
	        isSessionTimeout: function isSessionTimeout(head) {
	            if (head && head["MSG_CODE"]) {
	                return "8888888888" === head["MSG_CODE"];
	            }
	
	            return false;
	        },
	
	        /***
	         * **判断请求是否超时**
	         * @method isTimeout
	         * @param {object} head 请求返回头
	         * @return {boolean} **请求超时返回true否则返回false**
	         */
	        isTimeout: function isTimeout(head) {
	            if (head && head["MSG_CODE"]) {
	                return "2011" === head["MSG_CODE"];
	            }
	
	            return false;
	        },
	
	        /**
	         * 解锁系统
	         * @method unlockSystem
	         * @param  {object} param [请求参数]
	         * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
	         */
	        unlockSystem: function unlockSystem(param) {
	            if (!param) {
	                throw "登录参数不合法，请检查参数！";
	            }
	
	            var defObj = $.Deferred();
	
	            ajax.getEncryptKey().done(function () {
	
	                if (param.TRD_PWD) {
	                    param.TRD_PWD = utils.encrypt(param.TRD_PWD, param.USER_CODE);
	                }
	
	                ajax.ajax({
	                    url: consts.UNLOCK,
	                    data: utils.fsEncrypt(ajax.makeXmlRequest(param), encKey)
	                }).done(function (data) {
	                    if (!data) {
	                        data = { IRETCODE: "-999999999" };
	                    }
	
	                    if (data.IRETCODE === "0") {
	                        loginData = data;
	                    }
	                    defObj.resolveWith(this, [data]);
	                }).fail(function () {
	                    defObj.rejectWith(this, arguments);
	                });
	            }).fail(function () {
	                defObj.rejectWith(this, arguments);
	            });
	
	            return defObj.promise();
	        },
	
	        //获取数据库日期
	        getSysDate: function getSysDate() {
	            return this.post({ req: {
	                    service: "P9999997"
	                }
	            }).then(function (data) {
	                return data[0][0] && data[0][0].DB_DATE;
	            });
	        },
	
	        //获取数据库时间
	        getSysTime: function getSysTime() {
	            return this.post({ req: {
	                    service: "P9999997"
	                }
	            }).then(function (data) {
	                return data[0][0] && data[0][0].DB_TIME;
	            });
	        },
	
	        //获取数据库日期和时间
	        getSysDateTime: function getSysDateTime() {
	            return this.post({ req: {
	                    service: "P9999997"
	                }
	            }).then(function (data) {
	                return data[0][0] && data[0][0].DB_DATE + ' ' + data[0][0].DB_TIME;
	            });
	        }
	    };
	
	    module.exports = ajax;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 26 */
/*!**************************!*\
  !*** ./js/util/utils.js ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	/**
	 * ##utils模块，包含一些前端的工具方法##
	 * @module core/utils
	 * @author liuqing leiy
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var _ = __webpack_require__(/*! underscore */ 18);
	    var json = __webpack_require__(/*! ./json */ 27),
	        des = __webpack_require__(/*! ./des */ 28),
	        fsenc = __webpack_require__(/*! ./fs-enc */ 29),
	        md5 = __webpack_require__(/*! ./md5 */ 30),
	        utils = {
	        slice: function slice(arrLike, start, end /*不包含end*/) {
	            return Array.prototype.slice.call(arrLike, start, end);
	        },
	        /**
	         * **计算字符串对应的MD5值**
	         * @method md5
	         * @param {string} str 需要计算的字符串
	         * @return {string} 字符串对应的MD5
	         */
	        md5: md5,
	
	        /**
	         * **将json字符串转换成对象，详细请参考：[www.json.org](http://www.json.org/)，[json项目](https://github.com/douglascrockford/JSON-js)**
	         * @method parseJSON
	         * @param {string} param 需要转换的json字符串
	         * @return {object} 字符串对应的javascript对象
	         */
	        parseJSON: json.parse,
	
	        /**
	         * **将对象转换成json字符串，详细请参考：[www.json.org](http://www.json.org/)，[json项目](https://github.com/douglascrockford/JSON-js)**
	         * @method toJSON
	         * @param {object} obj 需要转换的javascript对象
	         * @return {string} javascript对象对象对应的json字符串
	         */
	        toJSON: json.stringify,
	
	        /**
	         * **使用[DES算法](http://zh.wikipedia.org/wiki/DES)加密字符串**
	         * @method encrypt
	         * @param {string} str 需要加密的字符串
	         * @param {string} key 密钥
	         * @return {string} 密文
	         */
	        encrypt: des.encrypt,
	
	        fsEncrypt: fsenc.encrypt,
	
	        /**
	         * **解密字符串**
	         * @method decrypt
	         * @param {string} str 密文
	         * @param {string} key 密钥
	         * @return {string} 明文
	         */
	        decrypt: des.decrypt,
	
	        /**
	         * **使用html的a标签解析URL**
	         * @method parseUrl
	         * @param {string} url 需要解析的URL地址
	         * @return {object} 解析后的URL对象
	         */
	        parseUrl: function parseUrl(url) {
	            var a = document.createElement('a');
	            a.href = url = url || window.location.href;
	            return {
	                source: url,
	                protocol: a.protocol.replace(':', ''),
	                host: a.hostname,
	                port: a.port == "0" || a.port == "" ? 80 : a.port, // a.port 可能会解析不一样的
	                query: a.search,
	                params: function () {
	                    var ret = {},
	                        seg = a.search.replace(/^\?/, '').split('&'),
	                        len = seg.length,
	                        i = 0,
	                        s;
	                    for (; i < len; i++) {
	                        if (!seg[i]) {
	                            continue;
	                        }
	                        s = seg[i].split('=');
	                        ret[s[0]] = decodeURIComponent(s[1]);
	                    }
	                    return ret;
	                }(),
	                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
	                hash: a.hash.replace('#', ''),
	                path: a.pathname.replace(/^([^\/])/, '/$1'),
	                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
	                segments: a.pathname.replace(/^\//, '').split('/')
	            };
	        },
	
	        /**
	         * **获取URL的参数信息**
	         * @method getUrlParam
	         * @param {string} url 需要解析的URL地址
	         * @return {object} 解析后的参数对象
	         */
	        getUrlParam: function getUrlParam(url) {
	            return utils.parseUrl(url).params;
	        },
	
	        /**
	         * **根据参数构建URL地址**
	         * @method buildUrl
	         * @param {string} url 需要构建的URL地址
	         * @param {object} [params] URL参数
	         * @param {string} [hash] 信息片段（hash）
	         * @return {string} 构建后的URL地址
	         */
	        buildUrl: function buildUrl(url, params, hash, opts) {
	            if (!url) {
	                return "";
	            }
	
	            var that = this,
	                opts = (_.isObject(hash) ? hash : opts) || {};
	            parsed = that.parseUrl(url), hashStr = function () {
	                if ("string" === $.type(hash)) {
	                    return hash ? "#" + hash : "";
	                }
	                return parsed.hash ? "#" + parsed.hash : "";
	            }(), qryStr = function () {
	                var obj = $.extend({}, parsed.params, params);
	                return $.isEmptyObject(obj) ? "" : "?" + that.buildQueryString(obj, _.isUndefined(opts.encodeFlag) ? true : opts.encodeFlag);
	            }();
	
	            return url.replace(/(\?|\#).*/, "") + qryStr + hashStr;
	        },
	
	        /**
	         * **根据参数构建URL的查询字符串**
	         * @method buildQueryString
	         * @param {object} obj 参数
	         * @return {string} 查询字符串
	         */
	        buildQueryString: function buildQueryString(obj, encodeFlag) {
	            var arr = [];
	            $.each(obj, function (k, v) {
	                arr.push(k + "=" + (encodeFlag ? encodeURIComponent(v) : v));
	            });
	            return arr.join("&");
	        },
	
	        /**
	         * **根据格式化字符串将日期对象转成字符串**
	         * @method formatDate
	         * @param dateTime{date} 需要格式化的日期
	         * @param fmt {string} 格式化的格式 默认 yyyy-MM-dd hh:mm:ss
	         * @returns {*|string} 格式化后的日期或直接返回格式
	         */
	        formatDate: function formatDate(dateTime, fmt) {
	            fmt = fmt || "yyyy-MM-dd hh:mm:ss";
	
	            if (_.isString(dateTime)) {
	                dateTime = this.parseDate(dateTime);
	            }
	
	            if (!_.isDate(dateTime)) {
	                return dateTime;
	            }
	
	            var o = {
	                "M+": dateTime.getMonth() + 1, //月份
	                "d+": dateTime.getDate(), //日
	                "h+": dateTime.getHours(), //小时
	                "m+": dateTime.getMinutes(), //分
	                "s+": dateTime.getSeconds(), //秒
	                "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度
	                "S": dateTime.getMilliseconds() //毫秒
	            };
	
	            if (/(y+)/.test(fmt)) {
	                fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
	            }
	
	            for (var k in o) {
	                if (new RegExp("(" + k + ")").test(fmt)) {
	                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	                }
	            }
	
	            return fmt;
	        },
	
	        /**
	         * **字符串转换成日期对象**
	         * @method parseDate
	         * @param text{string}  传入的日期字符串 支持yyyy-MM-dd hh:mm:ss、 yyyyMMdd hh:mm:ss 、 yyyy/MM/dd hh:mm:ss格式的字符串
	         * @returns {Date} 根据日期字符串返回日期
	         */
	        parseDate: function parseDate(text) {
	            var dt = text.split(" "),
	                hh = 0,
	                mm = 0,
	                ss = 0,
	                matchD,
	                year,
	                month,
	                dd,
	                hmsStr,
	                hms,
	                ymdStr = dt[0];
	            if (dt.length == 2) {
	                hmsStr = dt[1];
	            }
	
	            if (matchD = ymdStr.match(/^(\d{4})\D(\d{1,2})\D(\d{1,2})$/)) {
	                year = matchD[1];
	                month = matchD[2];
	                dd = matchD[3];
	            } else {
	                if (ymdStr.length === 8) {
	                    year = ymdStr.substring(0, 4);
	                    month = ymdStr.substring(4, 6);
	                    dd = ymdStr.substring(6, 8);
	                }
	            }
	            if (hmsStr) {
	                hms = hmsStr.match(/^(\d{2})\D(\d{2})\D(\d{2})/);
	                hh = hms[1];
	                mm = hms[2];
	                ss = hms[3];
	            }
	            return new Date(year, month - 1, dd, hh, mm, ss);
	        },
	
	        /**
	         * **类的继承实现**
	         * @method inherit
	         * @param Base{function}  父类
	         * @param Sub{function}  子类
	         * @returns {undefined}
	         */
	        inherit: function inherit(Base, Sub) {
	            if (!_.isFunction(Base) || !_.isFunction(Sub)) {
	                return;
	            }
	
	            var TempClass = $.noop;
	
	            TempClass.prototype = Base.prototype;
	            Sub.prototype = new TempClass();
	            Sub.prototype.constructor = Sub;
	        },
	
	        /**
	         * **获取字符长度，一个中文算两个字符**
	         * @method getCharLength
	         * @param str{string} 输入字符串
	         * @returns {number} 字符数
	         */
	        getCharLength: function getCharLength(str) {
	            return _.isString(str) ? str.replace(/[^\x00-\xff]/g, "**").length : 0;
	        },
	
	        /**
	         * **替换字符串中的转义字符**
	         * @method escape
	         * @param str{string} 输入字符串
	         * @returns {string} 转义后的字符串
	         */
	        escape: function escape(str) {
	            if (!str) {
	                return "";
	            }
	            return $("<div></div>").text($.trim(str + "")).html().replace(/\"/g, "&quot;");
	        },
	
	        /**
	         * **字符串反转义**
	         * @method escape
	         * @param str{string} 输入字符串
	         * @returns {string} 反转义后的字符串
	         */
	        unescape: function unescape(str) {
	            if (!str) {
	                return "";
	            }
	            return $("<div></div>").html($.trim(str + "")).text();
	        },
	
	        /**
	         * **获取客户端浏览器日期**
	         * @method getClientDate
	         * @param formate{string} 输出日期格式
	         * @returns {string} 日期字符串
	         */
	        getClientDate: function getClientDate(formate) {
	            return this.formatDate(new Date(), formate || "yyyyMMdd");
	        },
	
	        /**
	         * **获取客户端浏览器时间**
	         * @method getClientTime
	         * @param formate{string} 输出时间格式
	         * @returns {string} 时间字符串
	         */
	        getClientTime: function getClientTime(formate) {
	            return this.formatDate(new Date(), formate || "hh:mm:ss");
	        },
	
	        //获取客户端日期时间
	        getClientDateTime: function getClientDateTime(formate) {
	            return this.formatDate(new Date(), formate || "yyyyMMdd hh:mm:ss");
	        },
	
	        /**
	         * **获取两个日期之间相差的月数**
	         * @method getDifMonths
	         * @param start{string|Date} 开始日期
	         * @param end{string|Date} 结束日期
	         * @returns {number} 相差的月数
	         */
	        getDifferMonths: function getDifferMonths(start, end) {
	            var sDate = _.isString(start) ? this.parseDate(start) : start,
	                eDate = _.isString(end) ? this.parseDate(end) : end,
	                sTime = sDate.getTime(),
	                eTime = eDate.getTime(),
	                sYear,
	                sMonth,
	                sDay,
	                eYear,
	                eMonth,
	                eDay,
	                sMonthDays,
	                eMonthDays;
	
	            if (sTime === eTime) {
	                //日期相等，返回0
	                return 0;
	            }
	
	            if (sTime > eTime) {
	                //起始日期大，返回-1
	                return -1;
	            }
	
	            sYear = sDate.getFullYear();
	            sMonth = sDate.getMonth() + 1;
	            sDay = sDate.getDate();
	
	            eYear = eDate.getFullYear();
	            eMonth = eDate.getMonth() + 1;
	            eDay = eDate.getDate();
	
	            sMonthDays = this.getMonthDays(sYear, sMonth);
	            eMonthDays = this.getMonthDays(eYear, eMonth);
	
	            return eYear > sYear ? (eYear - sYear - 1) * 12 + (eMonth + (eDay >= sDay || eDay === eMonthDays && sDay <= sMonthDays ? 12 - sMonth : 12 - sMonth - 1)) : eMonth === sMonth ? 0 : eMonth - sMonth - (eDay >= sDay || eDay === eMonthDays && sDay <= sMonthDays ? 0 : 1);
	        },
	
	        /**
	         * **获取两个日期之间相差的年数**
	         * @method getDifMonths
	         * @param start{string|Date} 开始日期
	         * @param end{string|Date} 结束日期
	         * @returns {number} 相差的年数
	         */
	        getDifferYears: function getDifferYears(start, end) {
	            var difMonths = this.getDifferMonths(start, end);
	            return difMonths >= 0 ? parseInt(difMonths / 12) : -1;
	        },
	
	        /**
	         * **判断给定年份是否是润年**
	         * @method isLeapYear
	         * @param year{number} 年份
	         * @returns {boolean}
	         */
	        isLeapYear: function isLeapYear(year) {
	            return 0 === year % 4 && 0 !== year % 100 || 0 === year % 100 && 0 === year % 400;
	        },
	
	        /**
	         * **获取某一年某一月的总天数**
	         * @method getMonthDays
	         * @param year{number} 年份
	         * @param month{number} 月份
	         * @returns {number} 天数
	         */
	        getMonthDays: function getMonthDays(year, month) {
	            return [undefined, 31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	        },
	
	        /**
	         * **比较两个日期**
	         * @method compareDate
	         * @param dateStr1{string} 日期1
	         * @param dateStr2{string} 日期2
	         * @returns {number} 0 相等 1 大于 -1 小于
	         */
	        compareDate: function compareDate(dateStr1, dateStr2) {
	            var msec1 = this.parseDate(dateStr1).getTime(),
	                msec2 = this.parseDate(dateStr2).getTime(),
	                dif = msec1 - msec2;
	
	            return dif > 0 ? 1 : dif < 0 ? -1 : 0;
	        },
	
	        /**
	         * **获取两个日期之间相差的天数**
	         * @method getDifDays
	         * @param dateStr1{string|date} 日期1
	         * @param dateStr2{string|date} 日期2
	         * @returns {number} 0 相等 1 大于 -1 小于
	         */
	        getDifDays: function getDifDays(date1, date2) {
	            var time1 = (_.isDate(date1) ? date1 : utils.parseDate(date1)).getTime(),
	                time2 = (_.isDate(date2) ? date1 : utils.parseDate(date2)).getTime();
	
	            return parseInt((time2 - time1) / (24 * 60 * 60 * 1000));
	        },
	
	        /**
	         * **将金额数字转换成对应的金额中文大写**
	         * @method convertMoney
	         * @param value{string|number} 输入数据
	         * @param isChinese{boolean} 是否是人民币大写，不传默认为true
	         * @returns {string} 金额中文大写
	         */
	        convertMoney: function convertMoney(value, isChinese) {
	            isChinese = _.isUndefined(isChinese) ? true : !!isChinese;
	
	            var strVal = $.trim(value + "").replace(/,/g, ""),
	                numVal = Number(strVal),
	                units = "零壹贰叁肆伍陆柒捌玖",
	                suffix = "万仟佰拾亿仟佰拾万仟佰拾圓角分",
	                dotIdx,
	                retStr = "";
	
	            if (isNaN(numVal)) {
	                return "";
	            }
	
	            if (numVal > 9999999999999.99 || numVal < -9999999999999.99) {
	                return "";
	            }
	
	            if (numVal < 0) {
	                strVal = strVal.substring(1, strVal.length);
	            }
	
	            strVal += "00";
	
	            if ((dotIdx = strVal.indexOf('.')) >= 0) {
	                strVal = strVal.substring(0, dotIdx) + strVal.substr(dotIdx + 1, 2);
	            }
	
	            for (var i = 0, l = strVal.length; i < l; i++) {
	                retStr += units.charAt(strVal.charAt(i)) + suffix.substr(suffix.length - strVal.length).charAt(i);
	            }
	
	            retStr = retStr === "零圓零角零分" ? "零圓" : retStr.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|圓)/g, "$1").replace(/(亿)万/g, "$1").replace(/^圓零?|零分/g, "").replace(/圓$/g, "圓整");
	
	            if (!isChinese) {
	                if (-1 !== retStr.indexOf("角") || -1 !== retStr.indexOf("分")) {
	                    retStr = retStr.replace(/(角|分)/g, "").replace(/(圓|圓整)/g, "点");
	                } else {
	                    retStr = retStr.replace(/(圓整|圓)/g, "");
	                }
	            }
	
	            return retStr && numVal < 0 ? "负" + retStr : retStr;
	        },
	
	        /**
	         * **将数字转换成对应的金额千位符格式**
	         * @method formatNumber
	         * @param num{string|number} 输入数据
	         * @returns {string} 金额千位符格式
	         */
	        formatNumber: function formatNumber(num) {
	            if (!/^(\+|-)?(\d+)(,\d{3})*(\.|\.\d+)?$/.test(num)) {
	                return num;
	            }
	            var re = /(\d)(\d{3})(,|$)/,
	                a = RegExp.$1,
	                b = RegExp.$2,
	                c = RegExp.$4;
	            while (re.test(b)) {
	                b = b.replace(re, "$1,$2$3");
	            }
	            return a + "" + b + "" + c;
	        },
	
	        /**
	         * **将金额千位符格式转换成对应的数字**
	         * @method formatMoney
	         * @param strVal{string} 输入数据
	         * @returns {string} 普通数字
	         */
	        formatMoney: function formatMoney(strVal) {
	            return strVal.replace(/,/g, "");
	        },
	
	        /**
	         * **15位身份证升级18位的**
	         * @method updateCardNo
	         * @param idcard  15位身份证
	         * @returns {string} 升级后的身份证或者false
	         */
	        updateCardNo: function updateCardNo(idcard) {
	            var SS,
	                Y,
	                M,
	                JYM,
	                ereg,
	                idcard_array = new Array();
	            if (idcard.length !== 15) {
	                return idcard;
	            }
	
	            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || (parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0) {
	                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
	            } else {
	                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
	            }
	            if (!ereg.test(idcard)) {
	                return idcard;
	            }
	            idcard = idcard.substr(0, 6) + "19" + idcard.substr(6);
	            idcard_array = idcard.split("");
	            //计算校验位
	            SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
	            Y = SS % 11;
	            M = "F";
	            JYM = "10X98765432";
	            M = JYM.substr(Y, 1); //判断校验位
	            return idcard + M;
	        },
	        //身份证降位
	        lowerCardNo: function lowerCardNo(idCard) {
	            if (!idCard || idCard.length !== 18) {
	                return idCard;
	            }
	
	            return idCard.substr(0, 6) + idCard.substr(8, 9);
	        },
	        //设置缓存
	        setLocalStorage: function setLocalStorage(key, obj) {
	            if (window.localStorage) {
	                window.localStorage.setItem(key, utils.toJSON(obj));
	            } else {
	                if (!top.kjdp.localStorage) {
	                    top.kjdp.localStorage = {};
	                }
	                top.kjdp.localStorage[key] = obj;
	            }
	        },
	        //获取缓存
	        getLocalStorage: function getLocalStorage(key) {
	            if (window.localStorage) {
	                return utils.parseJSON(window.localStorage.getItem(key));
	            } else {
	                return top.kjdp.localStorage[key];
	            }
	        },
	        //删除缓存
	        delLocalStorage: function delLocalStorage(key) {
	            if (window.localStorage) {
	                window.localStorage.removeItem(key);
	            } else {
	                delete top.kjdp.localStorage[key];
	            }
	        },
	        //清空所有缓存
	        clearLocalStorage: function clearLocalStorage() {
	            if (window.localStorage) {
	                window.localStorage.clear();
	            } else {
	                top.kjdp.localStorage = {};
	            }
	        },
	        /**
	         * 获取当前日期的前N天，或后N天
	         * @param: days，正整数表示今天后第N天，负数表示今天的前N天
	         */
	        getDateBeforeToday: function getDateBeforeToday(days) {
	            if (isNaN(days)) {
	                return "";
	            }
	            var myDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
	            var year = myDate.getFullYear() + "";
	            var month = myDate.getMonth() + 1 > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1);
	            var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate();
	            return year + month + date;
	        }
	    };
	
	    module.exports = $.extend({}, utils, {
	
	        /**
	         * 补零
	         * @param str
	         * @param num 默认补齐4位
	         * @returns {string}
	         */
	        addZero: function addZero(str, num) {
	            num = num || 4;
	            for (var i = 0; i < num; i++) {
	                str = "0" + str;
	            }
	            return str.substr(str.length - num);
	        },
	
	        /**
	         * 获取系统服务器时间日期
	         * @returns {*}
	         */
	        getSysDateTime: function getSysDateTime() {
	            return ajax.post({
	                req: {
	                    bex_codes: 'dateTimeBex'
	                }
	            });
	        },
	
	        getCurrDate: function getCurrDate(format, separator) {
	            separator = separator || "";
	            var date = new Date(),
	                y = date.getFullYear(),
	                m = date.getMonth() + 1,
	                d = date.getDate(),
	                sysdate,
	                tragetDate;
	            if (!format) {
	                return "";
	            }
	            switch (format) {
	                case ':month_first':
	                    d = 1;
	                    break;
	                case ':month_last':
	                    var a = y,
	                        b = m;
	                    if (m == 12) {
	                        a += 1;
	                        b = 1;
	                    }
	                    d = 32 - new Date(a, b - 1, 32).getDate();
	                    break;
	                case ':week_last':
	                    d = d <= 7 ? 1 : d - 7;
	                    break;
	                case ':next_year':
	                    y = y + 1;
	                    break;
	                case ':curr_date':
	                    break;
	                case ':r_sys_date':
	                    tragetDate = getDate("R_SYS_STATUS", "SYSDATE");
	                    return tragetDate;
	                case ':w_sys_date':
	                    tragetDate = getDate("W_SYS_STATUS", "SYSDATE");
	                    return tragetDate;
	                case ':u_sys_date':
	                    tragetDate = getDate("U_SYS_STATUS", "SYSDATE");
	                    return tragetDate;
	                case ':a_trd_date':
	                    tragetDate = getDate("A_SYS_STATUS", "TRD_DATE");
	                    return tragetDate;
	                case ':a_sett_date':
	                    tragetDate = getDate("A_SYS_STATUS", "SETT_DATE");
	                    return tragetDate;
	
	            }
	            function getDate(key, field) {
	                sysdate = top.kjdp.sysStatus && top.kjdp.sysStatus[key][field] || y + separator + (m < 10 ? '0' + m : m) + separator + (d < 10 ? '0' + d : d);
	                return sysdate.substring(0, 4) + separator + sysdate.substring(4, 6) + separator + sysdate.substring(6, 8);
	            }
	            return y + separator + (m < 10 ? '0' + m : m) + separator + (d < 10 ? '0' + d : d);
	        },
	
	        valueReplace: utils.escape,
	
	        serialize2Json: function serialize2Json(param, seperator, vFilter, target) {
	            seperator = seperator || ",";
	            vFilter = vFilter || $.noop;
	
	            var ret = {},
	                pairsArr = param.split('&'),
	                pair,
	                idx,
	                key,
	                value;
	            $.each(pairsArr, function () {
	                idx = this.indexOf("=");
	                if (-1 === idx) {
	                    return true;
	                }
	                key = this.substring(0, idx);
	                value = this.substring(idx + 1, this.length);
	                //参数值解密
	                key = decParam(key);
	                value = decParam(value);
	                value = vFilter.call(param, key, value) || value;
	                if (ret[key]) {
	                    var sep = seperator,
	                        $combo = $(target).find(".kui-combobox[comboname=" + key + "]").length > 0 ? $(target).find(".kui-combobox[comboname=" + key + "]") : $(target).find("input[comboname=" + key + "]");
	                    if (target && $combo.length > 0) {
	                        var opts = $combo.data("combo").options;
	                        if (opts && opts.singleByte == true) {
	                            sep = "";
	                        } else {
	                            sep = opts.submitSeparator || opts.seperator || seperator;
	                        }
	                    }
	                    // modify by pengqc 20160822： 修复当字符串类似包含1,10,100,100……字符时候，会误判的问题
	                    //if(-1 === ret[key].indexOf(value)) {
	                    if (-1 === _.indexOf(ret[key].split(sep), value)) {
	                        ret[key] = ret[key] + sep + value;
	                    }
	                } else {
	                    ret[key] = value;
	                }
	            });
	            function decParam(v) {
	                try {
	                    return decodeURIComponent(v);
	                } catch (ex) {
	                    return v;
	                }
	            }
	            $.each(ret, function (key, val) {
	                var $combo = $(".kui-combobox[comboname=" + key + "]", target);
	                if ($combo.length > 0) {
	                    var opts = $combo.data("combobox").options,
	                        panel = $combo.combo('panel');
	                    if (opts.atIsAll) {
	                        var flag = true,
	                            sep = opts.singleByte ? "" : opts.submitSeparator || opts.seperator || ",",
	                            checkVal = val.split(sep);
	                        if (checkVal.length == panel.find(".combobox-item").length) {
	                            ret[key] = "@";
	                        }
	                        //                        panel.find(".combobox-item").each(function() {
	                        //                            var v = $(this).attr("value");
	                        //                            if(_.indexOf(checkVal,v) == -1){
	                        //                                flag = false;
	                        //                                return false;
	                        //                            }
	                        //                        });
	                        //                        if(flag){
	                        //                            ret[key] = "@";
	                        //                        }
	                    }
	                }
	            });
	            return ret;
	        },
	
	        quickSort: function quickSort(arr, field, useLocaleCompare) {
	            if (arr.length <= 1) {
	                return arr;
	            }
	            var pivotIndex = Math.floor(arr.length / 2);
	            var pivot = arr[pivotIndex];
	            var left = [];
	            var right = [];
	            for (var i = 0; i < arr.length; i++) {
	                if (i == pivotIndex) continue;
	                var flag;
	                if (useLocaleCompare) {
	                    flag = new String(arr[i][field]).localeCompare(pivot[field]) == -1; // 不同版本不同地区实现不一致，不建议使用
	                } else {
	                    flag = new String(arr[i][field]) < pivot[field]; // 按unicode进行比较
	                }
	                if (flag) {
	                    left.push(arr[i]);
	                } else {
	                    right.push(arr[i]);
	                }
	            }
	            return kui.quickSort(left, field).concat([pivot], kui.quickSort(right, field));
	        },
	        /**
	         * ** 根据key 获取url的hash值**
	         * @method getUrlHashByKey
	         * @param key{string} hash的key
	         * @returns {string} 
	         */
	        getHashValByKey: function getHashValByKey(key) {
	            var hashVal;
	            if (key && _.isString(key)) {
	                hashVal = window.location.hash.match(new RegExp(key + "=\\w+"));
	                hashVal = hashVal ? hashVal[0].replace(key + "=", "") : null;
	            }
	            return hashVal;
	        },
	        /**
	         * ** 设置 获取url的hash值**
	         * @method setHashVal
	         * @param key{string} hash的key
	         * @param val{string} hash的val
	         */
	        setHashVal: function setHashVal(key, val) {
	            var hashVal = this.getHashValByKey(key),
	                regExp = new RegExp(key + "=\\w+");
	            if (_.isString(key) && _.isString(val)) {
	                if (hashVal) {
	                    window.location.hash = window.location.hash.replace(regExp, key + "=" + val);
	                } else {
	                    window.location.hash += window.location.hash ? "/" + key + "=" + val : key + "=" + val;
	                }
	            }
	        },
	
	        /**
	         * 屏幕占满时，获取指定元素所占高宽
	         * @param $el 指定元素
	         * @param marginFlag 是否计算margin 默认为false
	         * @returns {{width: number, height: number}}
	         */
	        getElBoxSize: function getElBoxSize($el, marginFlag) {
	            var difHeight = 0,
	                difWidth = 0;
	            function dif($el) {
	                if (!$el || $el.is("body")) {
	                    return;
	                }
	                var par = $el.parent(),
	                    sib = $el.siblings();
	                sib.each(function () {
	                    var $box = $(this);
	                    if ($box.is(":hidden") || $box.css("position") == "absolute" || $box.hasClass("window-mask")) {
	                        return;
	                    }
	                    if ($box.css("float") == "left" || $box.css("float") == "right") {
	                        difWidth += $box.outerWidth();
	                    } else {
	                        difHeight += $box.outerHeight();
	                    }
	                    if (marginFlag === true) {
	                        if ($box.css("float") == "left" || $box.css("float") == "right") {
	                            difWidth += Number($box.css("marginLeft").replace(/\D/g, ""));
	                            difWidth += Number($box.css("marginRight").replace(/\D/g, ""));
	                        } else {
	                            difHeight += Number($box.css("marginTop").replace(/\D/g, ""));
	                            difHeight += Number($box.css("marginBottom").replace(/\D/g, ""));
	                        }
	                    }
	                });
	                dif(par);
	            }
	            dif($el);
	            return {
	                width: $(window).width() - difWidth,
	                height: $(window).height() - difHeight
	            };
	        },
	
	        /**
	         * 根据机构编码获取分支结构编码
	         * @param orgids
	         */
	        refreshBrhid: function refreshBrhid(orgids, callback) {
	            ajax.post({
	                req: {
	                    bex_codes: 'YGT_W0110134',
	                    brhid: '',
	                    orgid: ''
	                }
	            }).done(function (data) {
	                if (data[0] && data[0].length > 0) {
	                    var allOrg = data[0],
	                        resOrg = _.chain(allOrg).filter(function (o) {
	                        return _.indexOf(orgids.split(","), o.ORGID) != -1;
	                    }).value();
	                    _.isFunction(callback) && callback(resOrg);
	                }
	            });
	        }
	    });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 27 */
/*!*************************!*\
  !*** ./js/util/json.js ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    /*
	     json2.js
	     2014-02-04
	    
	     Public Domain.
	    
	     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	    
	     See http://www.JSON.org/js.html
	    
	    
	     This code should be minified before deployment.
	     See http://javascript.crockford.com/jsmin.html
	    
	     USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	     NOT CONTROL.
	    
	    
	     This file creates a global JSON object containing two methods: stringify
	     and parse.
	    
	     JSON.stringify(value, replacer, space)
	     value       any JavaScript value, usually an object or array.
	    
	     replacer    an optional parameter that determines how object
	     values are stringified for objects. It can be a
	     function or an array of strings.
	    
	     space       an optional parameter that specifies the indentation
	     of nested structures. If it is omitted, the text will
	     be packed without extra whitespace. If it is a number,
	     it will specify the number of spaces to indent at each
	     level. If it is a string (such as '\t' or '&nbsp;'),
	     it contains the characters used to indent at each level.
	    
	     This method produces a JSON text from a JavaScript value.
	    
	     When an object value is found, if the object contains a toJSON
	     method, its toJSON method will be called and the result will be
	     stringified. A toJSON method does not serialize: it returns the
	     value represented by the name/value pair that should be serialized,
	     or undefined if nothing should be serialized. The toJSON method
	     will be passed the key associated with the value, and this will be
	     bound to the value
	    
	     For example, this would serialize Dates as ISO strings.
	    
	     Date.prototype.toJSON = function (key) {
	     function f(n) {
	     // Format integers to have at least two digits.
	     return n < 10 ? '0' + n : n;
	     }
	    
	     return this.getUTCFullYear()   + '-' +
	     f(this.getUTCMonth() + 1) + '-' +
	     f(this.getUTCDate())      + 'T' +
	     f(this.getUTCHours())     + ':' +
	     f(this.getUTCMinutes())   + ':' +
	     f(this.getUTCSeconds())   + 'Z';
	     };
	    
	     You can provide an optional replacer method. It will be passed the
	     key and value of each member, with this bound to the containing
	     object. The value that is returned from your method will be
	     serialized. If your method returns undefined, then the member will
	     be excluded from the serialization.
	    
	     If the replacer parameter is an array of strings, then it will be
	     used to select the members to be serialized. It filters the results
	     such that only members with keys listed in the replacer array are
	     stringified.
	    
	     Values that do not have JSON representations, such as undefined or
	     functions, will not be serialized. Such values in objects will be
	     dropped; in arrays they will be replaced with null. You can use
	     a replacer function to replace those with JSON values.
	     JSON.stringify(undefined) returns undefined.
	    
	     The optional space parameter produces a stringification of the
	     value that is filled with line breaks and indentation to make it
	     easier to read.
	    
	     If the space parameter is a non-empty string, then that string will
	     be used for indentation. If the space parameter is a number, then
	     the indentation will be that many spaces.
	    
	     Example:
	    
	     text = JSON.stringify(['e', {pluribus: 'unum'}]);
	     // text is '["e",{"pluribus":"unum"}]'
	    
	    
	     text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
	     // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
	    
	     text = JSON.stringify([new Date()], function (key, value) {
	     return this[key] instanceof Date ?
	     'Date(' + this[key] + ')' : value;
	     });
	     // text is '["Date(---current time---)"]'
	    
	    
	     JSON.parse(text, reviver)
	     This method parses a JSON text to produce an object or array.
	     It can throw a SyntaxError exception.
	    
	     The optional reviver parameter is a function that can filter and
	     transform the results. It receives each of the keys and values,
	     and its return value is used instead of the original value.
	     If it returns what it received, then the structure is not modified.
	     If it returns undefined then the member is deleted.
	    
	     Example:
	    
	     // Parse the text. Values that look like ISO date strings will
	     // be converted to Date objects.
	    
	     myData = JSON.parse(text, function (key, value) {
	     var a;
	     if (typeof value === 'string') {
	     a =
	     /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
	     if (a) {
	     return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
	     +a[5], +a[6]));
	     }
	     }
	     return value;
	     });
	    
	     myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
	     var d;
	     if (typeof value === 'string' &&
	     value.slice(0, 5) === 'Date(' &&
	     value.slice(-1) === ')') {
	     d = new Date(value.slice(5, -1));
	     if (d) {
	     return d;
	     }
	     }
	     return value;
	     });
	    
	    
	     This is a reference implementation. You are free to copy, modify, or
	     redistribute.
	     */
	
	    /*jslint evil: true, regexp: true */
	
	    /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	     call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	     getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	     lastIndex, length, parse, prototype, push, replace, slice, stringify,
	     test, toJSON, toString, valueOf
	     */
	
	    //Create a JSON object only if one does not already exist. We create the
	    //methods in a closure to avoid creating global variables.
	
	    if ((typeof JSON === 'undefined' ? 'undefined' : _typeof(JSON)) !== 'object') {
	        JSON = {};
	    }
	
	    (function () {
	        'use strict';
	
	        function f(n) {
	            // Format integers to have at least two digits.
	            return n < 10 ? '0' + n : n;
	        }
	
	        if (typeof Date.prototype.toJSON !== 'function') {
	
	            Date.prototype.toJSON = function () {
	
	                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
	            };
	
	            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
	                return this.valueOf();
	            };
	        }
	
	        var cx, escapable, gap, indent, meta, rep;
	
	        function quote(string) {
	
	            //If the string contains no control characters, no quote characters, and no
	            //backslash characters, then we can safely slap some quotes around it.
	            //Otherwise we must also replace the offending characters with safe escape
	            //sequences.
	
	            escapable.lastIndex = 0;
	            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + '"' : '"' + string + '"';
	        }
	
	        function str(key, holder) {
	
	            //Produce a string from holder[key].
	
	            var i,
	                // The loop counter.
	            k,
	                // The member key.
	            v,
	                // The member value.
	            length,
	                mind = gap,
	                partial,
	                value = holder[key];
	
	            //If the value has a toJSON method, call it to obtain a replacement value.
	
	            if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.toJSON === 'function') {
	                value = value.toJSON(key);
	            }
	
	            //If we were called with a replacer function, then call the replacer to
	            //obtain a replacement value.
	
	            if (typeof rep === 'function') {
	                value = rep.call(holder, key, value);
	            }
	
	            //What happens next depends on the value's type.
	
	            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	                case 'string':
	                    return quote(value);
	
	                case 'number':
	
	                    //JSON numbers must be finite. Encode non-finite numbers as null.
	
	                    return isFinite(value) ? String(value) : 'null';
	
	                case 'boolean':
	                case 'null':
	
	                    //If the value is a boolean or null, convert it to a string. Note:
	                    //typeof null does not produce 'null'. The case is included here in
	                    //the remote chance that this gets fixed someday.
	
	                    return String(value);
	
	                //If the type is 'object', we might be dealing with an object or an array or
	                //null.
	
	                case 'object':
	
	                    //Due to a specification blunder in ECMAScript, typeof null is 'object',
	                    //so watch out for that case.
	
	                    if (!value) {
	                        return 'null';
	                    }
	
	                    //Make an array to hold the partial results of stringifying this object value.
	
	                    gap += indent;
	                    partial = [];
	
	                    //Is the value an array?
	
	                    if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	                        //The value is an array. Stringify every element. Use null as a placeholder
	                        //for non-JSON values.
	
	                        length = value.length;
	                        for (i = 0; i < length; i += 1) {
	                            partial[i] = str(i, value) || 'null';
	                        }
	
	                        //Join all of the elements together, separated with commas, and wrap them in
	                        //brackets.
	
	                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
	                        gap = mind;
	                        return v;
	                    }
	
	                    //If the replacer is an array, use it to select the members to be stringified.
	
	                    if (rep && (typeof rep === 'undefined' ? 'undefined' : _typeof(rep)) === 'object') {
	                        length = rep.length;
	                        for (i = 0; i < length; i += 1) {
	                            if (typeof rep[i] === 'string') {
	                                k = rep[i];
	                                v = str(k, value);
	                                if (v) {
	                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                }
	                            }
	                        }
	                    } else {
	
	                        //Otherwise, iterate through all of the keys in the object.
	
	                        for (k in value) {
	                            if (Object.prototype.hasOwnProperty.call(value, k)) {
	                                v = str(k, value);
	                                if (v) {
	                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                }
	                            }
	                        }
	                    }
	
	                    //Join all of the member texts together, separated with commas,
	                    //and wrap them in braces.
	
	                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
	                    gap = mind;
	                    return v;
	            }
	        }
	
	        //If the JSON object does not yet have a stringify method, give it one.
	
	        if (typeof JSON.stringify !== 'function') {
	            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	            meta = { // table of character substitutions
	                '\b': '\\b',
	                '\t': '\\t',
	                '\n': '\\n',
	                '\f': '\\f',
	                '\r': '\\r',
	                '"': '\\"',
	                '\\': '\\\\'
	            };
	            JSON.stringify = function (value, replacer, space) {
	
	                //The stringify method takes a value and an optional replacer, and an optional
	                //space parameter, and returns a JSON text. The replacer can be a function
	                //that can replace values, or an array of strings that will select the keys.
	                //A default replacer method can be provided. Use of the space parameter can
	                //produce text that is more easily readable.
	
	                var i;
	                gap = '';
	                indent = '';
	
	                //If the space parameter is a number, make an indent string containing that
	                //many spaces.
	
	                if (typeof space === 'number') {
	                    for (i = 0; i < space; i += 1) {
	                        indent += ' ';
	                    }
	
	                    //If the space parameter is a string, it will be used as the indent string.
	                } else if (typeof space === 'string') {
	                    indent = space;
	                }
	
	                //If there is a replacer, it must be a function or an array.
	                //Otherwise, throw an error.
	
	                rep = replacer;
	                if (replacer && typeof replacer !== 'function' && ((typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) !== 'object' || typeof replacer.length !== 'number')) {
	                    throw new Error('JSON.stringify');
	                }
	
	                //Make a fake root object containing our value under the key of ''.
	                //Return the result of stringifying the value.
	
	                return str('', { '': value });
	            };
	        }
	
	        //If the JSON object does not yet have a parse method, give it one.
	
	        if (typeof JSON.parse !== 'function') {
	            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	            JSON.parse = function (text, reviver) {
	
	                //The parse method takes a text and an optional reviver function, and returns
	                //a JavaScript value if the text is a valid JSON text.
	
	                var j;
	
	                function walk(holder, key) {
	
	                    //The walk method is used to recursively walk the resulting structure so
	                    //that modifications can be made.
	
	                    var k,
	                        v,
	                        value = holder[key];
	                    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	                        for (k in value) {
	                            if (Object.prototype.hasOwnProperty.call(value, k)) {
	                                v = walk(value, k);
	                                if (v !== undefined) {
	                                    value[k] = v;
	                                } else {
	                                    delete value[k];
	                                }
	                            }
	                        }
	                    }
	                    return reviver.call(holder, key, value);
	                }
	
	                //Parsing happens in four stages. In the first stage, we replace certain
	                //Unicode characters with escape sequences. JavaScript handles many characters
	                //incorrectly, either silently deleting them, or treating them as line endings.
	
	                text = String(text);
	                cx.lastIndex = 0;
	                if (cx.test(text)) {
	                    text = text.replace(cx, function (a) {
	                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                    });
	                }
	
	                //In the second stage, we run the text against regular expressions that look
	                //for non-JSON patterns. We are especially concerned with '()' and 'new'
	                //because they can cause invocation, and '=' because it can cause mutation.
	                //But just to be safe, we want to reject all unexpected forms.
	
	                //We split the second stage into 4 regexp operations in order to work around
	                //crippling inefficiencies in IE's and Safari's regexp engines. First we
	                //replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	                //replace all simple value tokens with ']' characters. Third, we delete all
	                //open brackets that follow a colon or comma or that begin the text. Finally,
	                //we look to see that the remaining characters are only whitespace or ']' or
	                //',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
	                    //In the third stage we use the eval function to compile the text into a
	                    //JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	                    //in JavaScript: it can begin a block or an object literal. We wrap the text
	                    //in parens to eliminate the ambiguity.
	
	                    j = eval('(' + text + ')');
	
	                    //In the optional fourth stage, we recursively walk the new structure, passing
	                    //each name/value pair to a reviver function for possible transformation.
	
	                    return typeof reviver === 'function' ? walk({ '': j }, '') : j;
	                }
	
	                //If the text is not JSON parseable, then a SyntaxError is thrown.
	
	                throw new SyntaxError('JSON.parse');
	            };
	        }
	    })();
	    module.exports = JSON;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 28 */
/*!************************!*\
  !*** ./js/util/des.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    //des加解密函数
	    //key：加密用的密钥
	    //message：需要加密的字符串
	    //encrypt：加密还是解密，1为加密，0，解密
	    function des(key, message, encrypt, mode, iv) {
	
	        //declaring this locally speeds things up a bit
	        var spfunction1 = new Array(0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004);
	
	        var spfunction2 = new Array(-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000);
	
	        var spfunction3 = new Array(0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200);
	
	        var spfunction4 = new Array(0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080);
	
	        var spfunction5 = new Array(0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100);
	
	        var spfunction6 = new Array(0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010);
	
	        var spfunction7 = new Array(0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002);
	
	        var spfunction8 = new Array(0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000);
	
	        //create the 16 or 48 subkeys we will need
	        var keys = des_createKeys(key);
	
	        var m = 0,
	            i,
	            j,
	            temp,
	            temp2,
	            right1,
	            right2,
	            left,
	            right,
	            looping;
	
	        var cbcleft, cbcleft2, cbcright, cbcright2;
	
	        var endloop, loopinc;
	
	        var len = message.length;
	
	        var chunk = 0;
	
	        //set up the loops for single and triple des
	        var iterations = keys.length == 32 ? 3 : 9; //single or triple des
	        if (iterations == 3) {
	            looping = encrypt ? new Array(0, 32, 2) : new Array(30, -2, -2);
	        } else {
	            looping = encrypt ? new Array(0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array(94, 62, -2, 32, 64, 2, 30, -2, -2);
	        }
	
	        message += "\0\0\0\0\0\0\0\0";
	        //pad the message out with null bytes
	        //store the result here
	        var result = "";
	
	        var tempresult = "";
	
	        if (mode == 1) {
	            //CBC mode
	            cbcleft = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
	
	            cbcright = iv.charCodeAt(m++) << 24 | iv.charCodeAt(m++) << 16 | iv.charCodeAt(m++) << 8 | iv.charCodeAt(m++);
	
	            m = 0;
	        }
	
	        //loop through each 64 bit chunk of the message
	        while (m < len) {
	
	            if (encrypt) {
	                /*加密时按双字节操作*/
	
	                left = message.charCodeAt(m++) << 16 | message.charCodeAt(m++);
	
	                right = message.charCodeAt(m++) << 16 | message.charCodeAt(m++);
	            } else {
	
	                left = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);
	
	                right = message.charCodeAt(m++) << 24 | message.charCodeAt(m++) << 16 | message.charCodeAt(m++) << 8 | message.charCodeAt(m++);
	            }
	
	            //for Cipher Block Chaining mode,xor the message with the previous result
	            if (mode == 1) {
	                if (encrypt) {
	                    left ^= cbcleft;
	                    right ^= cbcright;
	                } else {
	                    cbcleft2 = cbcleft;
	                    cbcright2 = cbcright;
	                    cbcleft = left;
	                    cbcright = right;
	                }
	            }
	
	            //first each 64 but chunk of the message must be permuted according to IP
	            temp = (left >>> 4 ^ right) & 0x0f0f0f0f;
	            right ^= temp;
	            left ^= temp << 4;
	
	            temp = (left >>> 16 ^ right) & 0x0000ffff;
	            right ^= temp;
	            left ^= temp << 16;
	
	            temp = (right >>> 2 ^ left) & 0x33333333;
	            left ^= temp;
	            right ^= temp << 2;
	
	            temp = (right >>> 8 ^ left) & 0x00ff00ff;
	            left ^= temp;
	            right ^= temp << 8;
	
	            temp = (left >>> 1 ^ right) & 0x55555555;
	            right ^= temp;
	            left ^= temp << 1;
	
	            left = left << 1 | left >>> 31;
	
	            right = right << 1 | right >>> 31;
	
	            //do this either 1 or 3 times for each chunk of the message
	            for (j = 0; j < iterations; j += 3) {
	
	                endloop = looping[j + 1];
	
	                loopinc = looping[j + 2];
	
	                //now go through and perform the encryption or decryption
	                for (i = looping[j]; i != endloop; i += loopinc) {
	                    //for efficiency
	                    right1 = right ^ keys[i];
	
	                    right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
	
	                    //the result is attained by passing these bytes through the S selection functions
	                    temp = left;
	
	                    left = right;
	
	                    right = temp ^ (spfunction2[right1 >>> 24 & 0x3f] | spfunction4[right1 >>> 16 & 0x3f] | spfunction6[right1 >>> 8 & 0x3f] | spfunction8[right1 & 0x3f] | spfunction1[right2 >>> 24 & 0x3f] | spfunction3[right2 >>> 16 & 0x3f] | spfunction5[right2 >>> 8 & 0x3f] | spfunction7[right2 & 0x3f]);
	                }
	
	                temp = left;
	                left = right;
	                right = temp;
	                //unreverse left and right
	            }
	            //for either 1 or 3 iterations
	            //move then each one bit to the right
	            left = left >>> 1 | left << 31;
	
	            right = right >>> 1 | right << 31;
	
	            //now perform IP-1,which is IP in the opposite direction
	            temp = (left >>> 1 ^ right) & 0x55555555;
	            right ^= temp;
	            left ^= temp << 1;
	
	            temp = (right >>> 8 ^ left) & 0x00ff00ff;
	            left ^= temp;
	            right ^= temp << 8;
	
	            temp = (right >>> 2 ^ left) & 0x33333333;
	            left ^= temp;
	            right ^= temp << 2;
	
	            temp = (left >>> 16 ^ right) & 0x0000ffff;
	            right ^= temp;
	            left ^= temp << 16;
	
	            temp = (left >>> 4 ^ right) & 0x0f0f0f0f;
	            right ^= temp;
	            left ^= temp << 4;
	
	            //for Cipher Block Chaining mode,xor the message with the previous result
	            if (mode == 1) {
	                if (encrypt) {
	                    cbcleft = left;
	                    cbcright = right;
	                } else {
	                    left ^= cbcleft2;
	                    right ^= cbcright2;
	                }
	            }
	
	            if (encrypt) {
	                tempresult += String.fromCharCode(left >>> 24, left >>> 16 & 0xff, left >>> 8 & 0xff, left & 0xff, right >>> 24, right >>> 16 & 0xff, right >>> 8 & 0xff, right & 0xff);
	            } else {
	                tempresult += String.fromCharCode(left >>> 16 & 0xffff, left & 0xffff, right >>> 16 & 0xffff, right & 0xffff);
	            }
	            /*解密时输出双字节*/
	
	            encrypt ? chunk += 16 : chunk += 8;
	
	            if (chunk == 512) {
	                result += tempresult;
	                tempresult = "";
	                chunk = 0;
	            }
	        }
	        //for every 8 characters,or 64 bits in the message
	        //return the result as an array
	        return result + tempresult;
	    }
	    //end of des
	    //des_createKeys
	    //this takes as input a 64 bit key(even though only 56 bits are used)
	    //as an array of 2 integers,and returns 16 48 bit keys
	    function des_createKeys(key) {
	
	        //declaring this locally speeds things up a bit
	        var pc2bytes0 = new Array(0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204);
	
	        var pc2bytes1 = new Array(0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101);
	
	        var pc2bytes2 = new Array(0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808);
	
	        var pc2bytes3 = new Array(0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000);
	
	        var pc2bytes4 = new Array(0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010);
	
	        var pc2bytes5 = new Array(0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420);
	
	        var pc2bytes6 = new Array(0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002);
	
	        var pc2bytes7 = new Array(0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800);
	
	        var pc2bytes8 = new Array(0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002);
	
	        var pc2bytes9 = new Array(0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408);
	
	        var pc2bytes10 = new Array(0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020);
	
	        var pc2bytes11 = new Array(0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200);
	
	        var pc2bytes12 = new Array(0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010);
	
	        var pc2bytes13 = new Array(0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105);
	
	        //how many iterations(1 for des,3 for triple des)
	        var iterations = key.length >= 24 ? 3 : 1;
	
	        //stores the return keys
	        var keys = new Array(32 * iterations);
	
	        //now define the left shifts which need to be done
	        var shifts = new Array(0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
	
	        //other variables
	        var lefttemp,
	            righttemp,
	            m = 0,
	            n = 0,
	            temp;
	
	        var left, right;
	        for (var j = 0; j < iterations; j++) {
	            //either 1 or 3 iterations
	            left = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
	
	            right = key.charCodeAt(m++) << 24 | key.charCodeAt(m++) << 16 | key.charCodeAt(m++) << 8 | key.charCodeAt(m++);
	
	            temp = (left >>> 4 ^ right) & 0x0f0f0f0f;
	            right ^= temp;
	            left ^= temp << 4;
	
	            temp = (right >>> -16 ^ left) & 0x0000ffff;
	            left ^= temp;
	            right ^= temp << -16;
	
	            temp = (left >>> 2 ^ right) & 0x33333333;
	            right ^= temp;
	            left ^= temp << 2;
	
	            temp = (right >>> -16 ^ left) & 0x0000ffff;
	            left ^= temp;
	            right ^= temp << -16;
	
	            temp = (left >>> 1 ^ right) & 0x55555555;
	            right ^= temp;
	            left ^= temp << 1;
	
	            temp = (right >>> 8 ^ left) & 0x00ff00ff;
	            left ^= temp;
	            right ^= temp << 8;
	
	            temp = (left >>> 1 ^ right) & 0x55555555;
	            right ^= temp;
	            left ^= temp << 1;
	
	            //the right side needs to be shifted and to get the last four bits of the left side
	            temp = left << 8 | right >>> 20 & 0x000000f0;
	
	            //left needs to be put upside down
	            left = right << 24 | right << 8 & 0xff0000 | right >>> 8 & 0xff00 | right >>> 24 & 0xf0;
	
	            right = temp;
	
	            //now go through and perform these shifts on the left and right keys
	            for (var i = 0; i < shifts.length; i++) {
	
	                //shift the keys either one or two bits to the left
	                if (shifts[i]) {
	                    left = left << 2 | left >>> 26;
	                    right = right << 2 | right >>> 26;
	                } else {
	                    left = left << 1 | left >>> 27;
	                    right = right << 1 | right >>> 27;
	                }
	
	                left &= -0xf;
	                right &= -0xf;
	
	                //now apply PC-2,in such a way that E is easier when encrypting or decrypting
	                //this conversion will look like PC-2 except only the last 6 bits of each byte are used
	                //rather than 48 consecutive bits and the order of lines will be according to
	                //how the S selection functions will be applied:S2,S4,S6,S8,S1,S3,S5,S7
	                lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 0xf] | pc2bytes2[left >>> 20 & 0xf] | pc2bytes3[left >>> 16 & 0xf] | pc2bytes4[left >>> 12 & 0xf] | pc2bytes5[left >>> 8 & 0xf] | pc2bytes6[left >>> 4 & 0xf];
	
	                righttemp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 0xf] | pc2bytes9[right >>> 20 & 0xf] | pc2bytes10[right >>> 16 & 0xf] | pc2bytes11[right >>> 12 & 0xf] | pc2bytes12[right >>> 8 & 0xf] | pc2bytes13[right >>> 4 & 0xf];
	
	                temp = (righttemp >>> 16 ^ lefttemp) & 0x0000ffff;
	
	                keys[n++] = lefttemp ^ temp;
	                keys[n++] = righttemp ^ temp << 16;
	            }
	        }
	        //for each iterations
	        //return the keys we"ve created
	        return keys;
	    }
	    //end of des_createKeys
	    ////////////////////////////// 测试 //////////////////////////////
	    function stringToHex(s) {
	
	        var r = "";
	
	        var hexes = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	
	        for (var i = 0; i < s.length; i++) {
	            r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf];
	        }
	
	        return r;
	    }
	
	    function HexTostring(s) {
	
	        var r = "";
	
	        for (var i = 0; i < s.length; i += 2) {
	
	            var sxx = parseInt(s.substring(i, i + 2), 16);
	
	            r += String.fromCharCode(sxx);
	        }
	        return r;
	    }
	
	    function decrypt(enStr, key) {
	        return des(key, HexTostring(enStr), 0, 0).replace(/\0+$/g, "");
	    }
	
	    //使用key为frame加密
	    function encrypt(enStr, key) {
	        return stringToHex(des(key || '888888', enStr, 1, 0));
	    }
	
	    module.exports = {
	        decrypt: decrypt,
	        encrypt: encrypt
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 29 */
/*!***************************!*\
  !*** ./js/util/fs-enc.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	  var CryptoJS = CryptoJS || function (u, p) {
	    var d = {},
	        l = d.lib = {},
	        s = function s() {},
	        t = l.Base = { extend: function extend(a) {
	        s.prototype = this;var c = new s();a && c.mixIn(a);c.hasOwnProperty("init") || (c.init = function () {
	          c.$super.init.apply(this, arguments);
	        });c.init.prototype = c;c.$super = this;return c;
	      }, create: function create() {
	        var a = this.extend();a.init.apply(a, arguments);return a;
	      }, init: function init() {}, mixIn: function mixIn(a) {
	        for (var c in a) {
	          a.hasOwnProperty(c) && (this[c] = a[c]);
	        }a.hasOwnProperty("toString") && (this.toString = a.toString);
	      }, clone: function clone() {
	        return this.init.prototype.extend(this);
	      } },
	        r = l.WordArray = t.extend({ init: function init(a, c) {
	        a = this.words = a || [];this.sigBytes = c != p ? c : 4 * a.length;
	      }, toString: function toString(a) {
	        return (a || v).stringify(this);
	      }, concat: function concat(a) {
	        var c = this.words,
	            e = a.words,
	            j = this.sigBytes;a = a.sigBytes;this.clamp();if (j % 4) for (var k = 0; k < a; k++) {
	          c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4);
	        } else if (65535 < e.length) for (k = 0; k < a; k += 4) {
	          c[j + k >>> 2] = e[k >>> 2];
	        } else c.push.apply(c, e);this.sigBytes += a;return this;
	      }, clamp: function clamp() {
	        var a = this.words,
	            c = this.sigBytes;a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);a.length = u.ceil(c / 4);
	      }, clone: function clone() {
	        var a = t.clone.call(this);a.words = this.words.slice(0);return a;
	      }, random: function random(a) {
	        for (var c = [], e = 0; e < a; e += 4) {
	          c.push(4294967296 * u.random() | 0);
	        }return new r.init(c, a);
	      } }),
	        w = d.enc = {},
	        v = w.Hex = { stringify: function stringify(a) {
	        var c = a.words;a = a.sigBytes;for (var e = [], j = 0; j < a; j++) {
	          var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255;e.push((k >>> 4).toString(16));e.push((k & 15).toString(16));
	        }return e.join("");
	      }, parse: function parse(a) {
	        for (var c = a.length, e = [], j = 0; j < c; j += 2) {
	          e[j >>> 3] |= parseInt(a.substr(j, 2), 16) << 24 - 4 * (j % 8);
	        }return new r.init(e, c / 2);
	      } },
	        b = w.Latin1 = { stringify: function stringify(a) {
	        var c = a.words;a = a.sigBytes;for (var e = [], j = 0; j < a; j++) {
	          e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
	        }return e.join("");
	      }, parse: function parse(a) {
	        for (var c = a.length, e = [], j = 0; j < c; j++) {
	          e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
	        }return new r.init(e, c);
	      } },
	        x = w.Utf8 = { stringify: function stringify(a) {
	        try {
	          return decodeURIComponent(escape(b.stringify(a)));
	        } catch (c) {
	          throw Error("Malformed UTF-8 data");
	        }
	      }, parse: function parse(a) {
	        return b.parse(unescape(encodeURIComponent(a)));
	      } },
	        q = l.BufferedBlockAlgorithm = t.extend({ reset: function reset() {
	        this._data = new r.init();this._nDataBytes = 0;
	      }, _append: function _append(a) {
	        "string" == typeof a && (a = x.parse(a));this._data.concat(a);this._nDataBytes += a.sigBytes;
	      }, _process: function _process(a) {
	        var c = this._data,
	            e = c.words,
	            j = c.sigBytes,
	            k = this.blockSize,
	            b = j / (4 * k),
	            b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0);a = b * k;j = u.min(4 * a, j);if (a) {
	          for (var q = 0; q < a; q += k) {
	            this._doProcessBlock(e, q);
	          }q = e.splice(0, a);c.sigBytes -= j;
	        }return new r.init(q, j);
	      }, clone: function clone() {
	        var a = t.clone.call(this);
	        a._data = this._data.clone();return a;
	      }, _minBufferSize: 0 });l.Hasher = q.extend({ cfg: t.extend(), init: function init(a) {
	        this.cfg = this.cfg.extend(a);this.reset();
	      }, reset: function reset() {
	        q.reset.call(this);this._doReset();
	      }, update: function update(a) {
	        this._append(a);this._process();return this;
	      }, finalize: function finalize(a) {
	        a && this._append(a);return this._doFinalize();
	      }, blockSize: 16, _createHelper: function _createHelper(a) {
	        return function (b, e) {
	          return new a.init(e).finalize(b);
	        };
	      }, _createHmacHelper: function _createHmacHelper(a) {
	        return function (b, e) {
	          return new n.HMAC.init(a, e).finalize(b);
	        };
	      } });var n = d.algo = {};return d;
	  }(Math);
	  (function () {
	    var u = CryptoJS,
	        p = u.lib.WordArray;u.enc.Base64 = { stringify: function stringify(d) {
	        var l = d.words,
	            p = d.sigBytes,
	            t = this._map;d.clamp();d = [];for (var r = 0; r < p; r += 3) {
	          for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++) {
	            d.push(t.charAt(w >>> 6 * (3 - v) & 63));
	          }
	        }if (l = t.charAt(64)) for (; d.length % 4;) {
	          d.push(l);
	        }return d.join("");
	      }, parse: function parse(d) {
	        var l = d.length,
	            s = this._map,
	            t = s.charAt(64);t && (t = d.indexOf(t), -1 != t && (l = t));for (var t = [], r = 0, w = 0; w < l; w++) {
	          if (w % 4) {
	            var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4),
	                b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4);t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4);r++;
	          }
	        }return p.create(t, r);
	      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
	  })();
	  (function (u) {
	    function p(b, n, a, c, e, j, k) {
	      b = b + (n & a | ~n & c) + e + k;return (b << j | b >>> 32 - j) + n;
	    }function d(b, n, a, c, e, j, k) {
	      b = b + (n & c | a & ~c) + e + k;return (b << j | b >>> 32 - j) + n;
	    }function l(b, n, a, c, e, j, k) {
	      b = b + (n ^ a ^ c) + e + k;return (b << j | b >>> 32 - j) + n;
	    }function s(b, n, a, c, e, j, k) {
	      b = b + (a ^ (n | ~c)) + e + k;return (b << j | b >>> 32 - j) + n;
	    }for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++) {
	      b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0;
	    }r = r.MD5 = v.extend({ _doReset: function _doReset() {
	        this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]);
	      },
	      _doProcessBlock: function _doProcessBlock(q, n) {
	        for (var a = 0; 16 > a; a++) {
	          var c = n + a,
	              e = q[c];q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
	        }var a = this._hash.words,
	            c = q[n + 0],
	            e = q[n + 1],
	            j = q[n + 2],
	            k = q[n + 3],
	            z = q[n + 4],
	            r = q[n + 5],
	            t = q[n + 6],
	            w = q[n + 7],
	            v = q[n + 8],
	            A = q[n + 9],
	            B = q[n + 10],
	            C = q[n + 11],
	            u = q[n + 12],
	            D = q[n + 13],
	            E = q[n + 14],
	            x = q[n + 15],
	            f = a[0],
	            m = a[1],
	            g = a[2],
	            h = a[3],
	            f = p(f, m, g, h, c, 7, b[0]),
	            h = p(h, f, m, g, e, 12, b[1]),
	            g = p(g, h, f, m, j, 17, b[2]),
	            m = p(m, g, h, f, k, 22, b[3]),
	            f = p(f, m, g, h, z, 7, b[4]),
	            h = p(h, f, m, g, r, 12, b[5]),
	            g = p(g, h, f, m, t, 17, b[6]),
	            m = p(m, g, h, f, w, 22, b[7]),
	            f = p(f, m, g, h, v, 7, b[8]),
	            h = p(h, f, m, g, A, 12, b[9]),
	            g = p(g, h, f, m, B, 17, b[10]),
	            m = p(m, g, h, f, C, 22, b[11]),
	            f = p(f, m, g, h, u, 7, b[12]),
	            h = p(h, f, m, g, D, 12, b[13]),
	            g = p(g, h, f, m, E, 17, b[14]),
	            m = p(m, g, h, f, x, 22, b[15]),
	            f = d(f, m, g, h, e, 5, b[16]),
	            h = d(h, f, m, g, t, 9, b[17]),
	            g = d(g, h, f, m, C, 14, b[18]),
	            m = d(m, g, h, f, c, 20, b[19]),
	            f = d(f, m, g, h, r, 5, b[20]),
	            h = d(h, f, m, g, B, 9, b[21]),
	            g = d(g, h, f, m, x, 14, b[22]),
	            m = d(m, g, h, f, z, 20, b[23]),
	            f = d(f, m, g, h, A, 5, b[24]),
	            h = d(h, f, m, g, E, 9, b[25]),
	            g = d(g, h, f, m, k, 14, b[26]),
	            m = d(m, g, h, f, v, 20, b[27]),
	            f = d(f, m, g, h, D, 5, b[28]),
	            h = d(h, f, m, g, j, 9, b[29]),
	            g = d(g, h, f, m, w, 14, b[30]),
	            m = d(m, g, h, f, u, 20, b[31]),
	            f = l(f, m, g, h, r, 4, b[32]),
	            h = l(h, f, m, g, v, 11, b[33]),
	            g = l(g, h, f, m, C, 16, b[34]),
	            m = l(m, g, h, f, E, 23, b[35]),
	            f = l(f, m, g, h, e, 4, b[36]),
	            h = l(h, f, m, g, z, 11, b[37]),
	            g = l(g, h, f, m, w, 16, b[38]),
	            m = l(m, g, h, f, B, 23, b[39]),
	            f = l(f, m, g, h, D, 4, b[40]),
	            h = l(h, f, m, g, c, 11, b[41]),
	            g = l(g, h, f, m, k, 16, b[42]),
	            m = l(m, g, h, f, t, 23, b[43]),
	            f = l(f, m, g, h, A, 4, b[44]),
	            h = l(h, f, m, g, u, 11, b[45]),
	            g = l(g, h, f, m, x, 16, b[46]),
	            m = l(m, g, h, f, j, 23, b[47]),
	            f = s(f, m, g, h, c, 6, b[48]),
	            h = s(h, f, m, g, w, 10, b[49]),
	            g = s(g, h, f, m, E, 15, b[50]),
	            m = s(m, g, h, f, r, 21, b[51]),
	            f = s(f, m, g, h, u, 6, b[52]),
	            h = s(h, f, m, g, k, 10, b[53]),
	            g = s(g, h, f, m, B, 15, b[54]),
	            m = s(m, g, h, f, e, 21, b[55]),
	            f = s(f, m, g, h, v, 6, b[56]),
	            h = s(h, f, m, g, x, 10, b[57]),
	            g = s(g, h, f, m, t, 15, b[58]),
	            m = s(m, g, h, f, D, 21, b[59]),
	            f = s(f, m, g, h, z, 6, b[60]),
	            h = s(h, f, m, g, C, 10, b[61]),
	            g = s(g, h, f, m, j, 15, b[62]),
	            m = s(m, g, h, f, A, 21, b[63]);a[0] = a[0] + f | 0;a[1] = a[1] + m | 0;a[2] = a[2] + g | 0;a[3] = a[3] + h | 0;
	      }, _doFinalize: function _doFinalize() {
	        var b = this._data,
	            n = b.words,
	            a = 8 * this._nDataBytes,
	            c = 8 * b.sigBytes;n[c >>> 5] |= 128 << 24 - c % 32;var e = u.floor(a / 4294967296);n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;b.sigBytes = 4 * (n.length + 1);this._process();b = this._hash;n = b.words;for (a = 0; 4 > a; a++) {
	          c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
	        }return b;
	      }, clone: function clone() {
	        var b = v.clone.call(this);b._hash = this._hash.clone();return b;
	      } });t.MD5 = v._createHelper(r);t.HmacMD5 = v._createHmacHelper(r);
	  })(Math);
	  (function () {
	    var u = CryptoJS,
	        p = u.lib,
	        d = p.Base,
	        l = p.WordArray,
	        p = u.algo,
	        s = p.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }), init: function init(d) {
	        this.cfg = this.cfg.extend(d);
	      }, compute: function compute(d, r) {
	        for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) {
	          n && s.update(n);var n = s.update(d).finalize(r);s.reset();for (var a = 1; a < p; a++) {
	            n = s.finalize(n), s.reset();
	          }b.concat(n);
	        }b.sigBytes = 4 * q;return b;
	      } });u.EvpKDF = function (d, l, p) {
	      return s.create(p).compute(d, l);
	    };
	  })();var x = "We@53&es&esT*7%s";CryptoJS.lib.Cipher || function (u) {
	    var p = CryptoJS,
	        d = p.lib,
	        l = d.Base,
	        s = d.WordArray,
	        t = d.BufferedBlockAlgorithm,
	        r = p.enc.Base64,
	        w = p.algo.EvpKDF,
	        v = d.Cipher = t.extend({ cfg: l.extend(), createEncryptor: function createEncryptor(e, a) {
	        return this.create(this._ENC_XFORM_MODE, e, a);
	      }, createDecryptor: function createDecryptor(e, a) {
	        return this.create(this._DEC_XFORM_MODE, e, a);
	      }, init: function init(e, a, b) {
	        this.cfg = this.cfg.extend(b);this._xformMode = e;this._key = a;this.reset();
	      }, reset: function reset() {
	        t.reset.call(this);this._doReset();
	      }, process: function process(e) {
	        this._append(e);return this._process();
	      },
	      finalize: function finalize(e) {
	        e && this._append(e);return this._doFinalize();
	      }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function _createHelper(e) {
	        return { encrypt: function encrypt(b, k, d) {
	            return ("string" == typeof k ? c : a).encrypt(e, b, k, d);
	          }, decrypt: function decrypt(b, k, d) {
	            return ("string" == typeof k ? c : a).decrypt(e, b, k, d);
	          } };
	      } });d.StreamCipher = v.extend({ _doFinalize: function _doFinalize() {
	        return this._process(!0);
	      }, blockSize: 1 });var b = p.mode = {},
	        x = function x(e, a, b) {
	      var c = this._iv;c ? this._iv = u : c = this._prevBlock;for (var d = 0; d < b; d++) {
	        e[a + d] ^= c[d];
	      }
	    },
	        q = (d.BlockCipherMode = l.extend({ createEncryptor: function createEncryptor(e, a) {
	        return this.Encryptor.create(e, a);
	      }, createDecryptor: function createDecryptor(e, a) {
	        return this.Decryptor.create(e, a);
	      }, init: function init(e, a) {
	        this._cipher = e;this._iv = a;
	      } })).extend();q.Encryptor = q.extend({ processBlock: function processBlock(e, a) {
	        var b = this._cipher,
	            c = b.blockSize;x.call(this, e, a, c);b.encryptBlock(e, a);this._prevBlock = e.slice(a, a + c);
	      } });q.Decryptor = q.extend({ processBlock: function processBlock(e, a) {
	        var b = this._cipher,
	            c = b.blockSize,
	            d = e.slice(a, a + c);b.decryptBlock(e, a);x.call(this, e, a, c);this._prevBlock = d;
	      } });b = b.CBC = q;q = (p.pad = {}).Pkcs7 = { pad: function pad(a, b) {
	        for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4) {
	          l.push(d);
	        }c = s.create(l, c);a.concat(c);
	      }, unpad: function unpad(a) {
	        a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255;
	      } };d.BlockCipher = v.extend({ cfg: v.cfg.extend({ mode: b, padding: q }), reset: function reset() {
	        v.reset.call(this);var a = this.cfg,
	            b = a.iv,
	            a = a.mode;if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;else c = a.createDecryptor, this._minBufferSize = 1;this._mode = c.call(a, this, b && b.words);
	      }, _doProcessBlock: function _doProcessBlock(a, b) {
	        this._mode.processBlock(a, b);
	      }, _doFinalize: function _doFinalize() {
	        var a = this.cfg.padding;if (this._xformMode == this._ENC_XFORM_MODE) {
	          a.pad(this._data, this.blockSize);var b = this._process(!0);
	        } else b = this._process(!0), a.unpad(b);return b;
	      }, blockSize: 4 });var n = d.CipherParams = l.extend({ init: function init(a) {
	        this.mixIn(a);
	      }, toString: function toString(a) {
	        return (a || this.formatter).stringify(this);
	      } }),
	        b = (p.format = {}).OpenSSL = { stringify: function stringify(a) {
	        var b = a.ciphertext;a = a.salt;return (a ? s.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(r);
	      }, parse: function parse(a) {
	        a = r.parse(a);var b = a.words;if (1398893684 == b[0] && 1701076831 == b[1]) {
	          var c = s.create(b.slice(2, 4));b.splice(0, 4);a.sigBytes -= 16;
	        }return n.create({ ciphertext: a, salt: c });
	      } },
	        a = d.SerializableCipher = l.extend({ cfg: l.extend({ format: b }), encrypt: function encrypt(a, b, c, d) {
	        d = this.cfg.extend(d);var l = a.createEncryptor(c, d);b = l.finalize(b);l = l.cfg;return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format });
	      },
	      decrypt: function decrypt(a, b, c, d) {
	        d = this.cfg.extend(d);b = this._parse(b, d.format);return a.createDecryptor(c, d).finalize(b.ciphertext);
	      }, _parse: function _parse(a, b) {
	        return "string" == typeof a ? b.parse(a, this) : a;
	      } }),
	        p = (p.kdf = {}).OpenSSL = { execute: function execute(a, b, c, d) {
	        d || (d = s.random(8));a = w.create({ keySize: b + c }).compute(a, d);c = s.create(a.words.slice(b), 4 * c);a.sigBytes = 4 * b;return n.create({ key: a, iv: c, salt: d });
	      } },
	        c = d.PasswordBasedCipher = a.extend({ cfg: a.cfg.extend({ kdf: p }), encrypt: function encrypt(b, c, d, l) {
	        l = this.cfg.extend(l);d = l.kdf.execute(d, b.keySize, b.ivSize);l.iv = d.iv;b = a.encrypt.call(this, b, c, d.key, l);b.mixIn(d);return b;
	      }, decrypt: function decrypt(b, c, d, l) {
	        l = this.cfg.extend(l);c = this._parse(c, l.format);d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt);l.iv = d.iv;return a.decrypt.call(this, b, c, d.key, l);
	      } });
	  }();
	  (function () {
	    for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++) {
	      a[c] = 128 > c ? c << 1 : c << 1 ^ 283;
	    }for (var e = 0, j = 0, c = 0; 256 > c; c++) {
	      var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4,
	          k = k >>> 8 ^ k & 255 ^ 99;l[e] = k;s[k] = e;var z = a[e],
	          F = a[z],
	          G = a[F],
	          y = 257 * a[k] ^ 16843008 * k;t[e] = y << 24 | y >>> 8;r[e] = y << 16 | y >>> 16;w[e] = y << 8 | y >>> 24;v[e] = y;y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e;b[k] = y << 24 | y >>> 8;x[k] = y << 16 | y >>> 16;q[k] = y << 8 | y >>> 24;n[k] = y;e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1;
	    }var H = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
	        d = d.AES = p.extend({ _doReset: function _doReset() {
	        for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++) {
	          if (j < d) e[j] = c[j];else {
	            var k = e[j - 1];j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24);e[j] = e[j - d] ^ k;
	          }
	        }c = this._invKeySchedule = [];for (d = 0; d < a; d++) {
	          j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>> 8 & 255]] ^ n[l[k & 255]];
	        }
	      }, encryptBlock: function encryptBlock(a, b) {
	        this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l);
	      }, decryptBlock: function decryptBlock(a, c) {
	        var d = a[c + 1];a[c + 1] = a[c + 3];a[c + 3] = d;this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s);d = a[c + 1];a[c + 1] = a[c + 3];a[c + 3] = d;
	      }, _doCryptBlock: function _doCryptBlock(a, b, c, d, e, j, l, f) {
	        for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++) {
	          var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++],
	              s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++],
	              t = d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++],
	              n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++],
	              g = q,
	              h = s,
	              k = t;
	        }q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++];s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++];t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++];n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++];a[b] = q;a[b + 1] = s;a[b + 2] = t;a[b + 3] = n;
	      }, keySize: 8 });u.AES = p._createHelper(d);
	  })();
	  CryptoJS.pad.Iso10126 = { pad: function pad(a, c) {
	      var b = 4 * c,
	          b = b - a.sigBytes % b;a.concat(CryptoJS.lib.WordArray.random(b - 1)).concat(CryptoJS.lib.WordArray.create([b << 24], 1));
	    }, unpad: function unpad(a) {
	      a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255;
	    } };function kjdp_commenc(enStr, key) {
	    var i = CryptoJS.enc.Utf8.parse(x),
	        e = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(enStr), i, { iv: i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126 });return CryptoJS.enc.Base64.stringify(e.ciphertext);
	  }
	  exports.encrypt = kjdp_commenc;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 30 */
/*!************************!*\
  !*** ./js/util/md5.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/*!
	 * Joseph Myer's md5() algorithm wrapped in a self-invoked function to prevent
	 * global namespace polution, modified to hash unicode characters as UTF-8.
	 *  
	 * Copyright 1999-2010, Joseph Myers, Paul Johnston, Greg Holt, Will Bond <will@wbond.net>
	 * http://www.myersdaily.org/joseph/javascript/md5-text.html
	 * http://pajhome.org.uk/crypt/md5
	 * 
	 * Released under the BSD license
	 * http://www.opensource.org/licenses/bsd-license
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    (function (factory, global) {
	        module.exports = factory();
	    })(function () {
	        function md5cycle(x, k) {
	            var a = x[0],
	                b = x[1],
	                c = x[2],
	                d = x[3];
	
	            a = ff(a, b, c, d, k[0], 7, -680876936);
	            d = ff(d, a, b, c, k[1], 12, -389564586);
	            c = ff(c, d, a, b, k[2], 17, 606105819);
	            b = ff(b, c, d, a, k[3], 22, -1044525330);
	            a = ff(a, b, c, d, k[4], 7, -176418897);
	            d = ff(d, a, b, c, k[5], 12, 1200080426);
	            c = ff(c, d, a, b, k[6], 17, -1473231341);
	            b = ff(b, c, d, a, k[7], 22, -45705983);
	            a = ff(a, b, c, d, k[8], 7, 1770035416);
	            d = ff(d, a, b, c, k[9], 12, -1958414417);
	            c = ff(c, d, a, b, k[10], 17, -42063);
	            b = ff(b, c, d, a, k[11], 22, -1990404162);
	            a = ff(a, b, c, d, k[12], 7, 1804603682);
	            d = ff(d, a, b, c, k[13], 12, -40341101);
	            c = ff(c, d, a, b, k[14], 17, -1502002290);
	            b = ff(b, c, d, a, k[15], 22, 1236535329);
	
	            a = gg(a, b, c, d, k[1], 5, -165796510);
	            d = gg(d, a, b, c, k[6], 9, -1069501632);
	            c = gg(c, d, a, b, k[11], 14, 643717713);
	            b = gg(b, c, d, a, k[0], 20, -373897302);
	            a = gg(a, b, c, d, k[5], 5, -701558691);
	            d = gg(d, a, b, c, k[10], 9, 38016083);
	            c = gg(c, d, a, b, k[15], 14, -660478335);
	            b = gg(b, c, d, a, k[4], 20, -405537848);
	            a = gg(a, b, c, d, k[9], 5, 568446438);
	            d = gg(d, a, b, c, k[14], 9, -1019803690);
	            c = gg(c, d, a, b, k[3], 14, -187363961);
	            b = gg(b, c, d, a, k[8], 20, 1163531501);
	            a = gg(a, b, c, d, k[13], 5, -1444681467);
	            d = gg(d, a, b, c, k[2], 9, -51403784);
	            c = gg(c, d, a, b, k[7], 14, 1735328473);
	            b = gg(b, c, d, a, k[12], 20, -1926607734);
	
	            a = hh(a, b, c, d, k[5], 4, -378558);
	            d = hh(d, a, b, c, k[8], 11, -2022574463);
	            c = hh(c, d, a, b, k[11], 16, 1839030562);
	            b = hh(b, c, d, a, k[14], 23, -35309556);
	            a = hh(a, b, c, d, k[1], 4, -1530992060);
	            d = hh(d, a, b, c, k[4], 11, 1272893353);
	            c = hh(c, d, a, b, k[7], 16, -155497632);
	            b = hh(b, c, d, a, k[10], 23, -1094730640);
	            a = hh(a, b, c, d, k[13], 4, 681279174);
	            d = hh(d, a, b, c, k[0], 11, -358537222);
	            c = hh(c, d, a, b, k[3], 16, -722521979);
	            b = hh(b, c, d, a, k[6], 23, 76029189);
	            a = hh(a, b, c, d, k[9], 4, -640364487);
	            d = hh(d, a, b, c, k[12], 11, -421815835);
	            c = hh(c, d, a, b, k[15], 16, 530742520);
	            b = hh(b, c, d, a, k[2], 23, -995338651);
	
	            a = ii(a, b, c, d, k[0], 6, -198630844);
	            d = ii(d, a, b, c, k[7], 10, 1126891415);
	            c = ii(c, d, a, b, k[14], 15, -1416354905);
	            b = ii(b, c, d, a, k[5], 21, -57434055);
	            a = ii(a, b, c, d, k[12], 6, 1700485571);
	            d = ii(d, a, b, c, k[3], 10, -1894986606);
	            c = ii(c, d, a, b, k[10], 15, -1051523);
	            b = ii(b, c, d, a, k[1], 21, -2054922799);
	            a = ii(a, b, c, d, k[8], 6, 1873313359);
	            d = ii(d, a, b, c, k[15], 10, -30611744);
	            c = ii(c, d, a, b, k[6], 15, -1560198380);
	            b = ii(b, c, d, a, k[13], 21, 1309151649);
	            a = ii(a, b, c, d, k[4], 6, -145523070);
	            d = ii(d, a, b, c, k[11], 10, -1120210379);
	            c = ii(c, d, a, b, k[2], 15, 718787259);
	            b = ii(b, c, d, a, k[9], 21, -343485551);
	
	            x[0] = add32(a, x[0]);
	            x[1] = add32(b, x[1]);
	            x[2] = add32(c, x[2]);
	            x[3] = add32(d, x[3]);
	        }
	
	        function cmn(q, a, b, x, s, t) {
	            a = add32(add32(a, q), add32(x, t));
	            return add32(a << s | a >>> 32 - s, b);
	        }
	
	        function ff(a, b, c, d, x, s, t) {
	            return cmn(b & c | ~b & d, a, b, x, s, t);
	        }
	
	        function gg(a, b, c, d, x, s, t) {
	            return cmn(b & d | c & ~d, a, b, x, s, t);
	        }
	
	        function hh(a, b, c, d, x, s, t) {
	            return cmn(b ^ c ^ d, a, b, x, s, t);
	        }
	
	        function ii(a, b, c, d, x, s, t) {
	            return cmn(c ^ (b | ~d), a, b, x, s, t);
	        }
	
	        function md51(s) {
	            // Converts the string to UTF-8 "bytes" when necessary
	            if (/[\x80-\xFF]/.test(s)) {
	                s = unescape(encodeURI(s));
	            }
	            txt = '';
	            var n = s.length,
	                state = [1732584193, -271733879, -1732584194, 271733878],
	                i;
	            for (i = 64; i <= s.length; i += 64) {
	                md5cycle(state, md5blk(s.substring(i - 64, i)));
	            }
	            s = s.substring(i - 64);
	            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	            for (i = 0; i < s.length; i++) {
	                tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
	            }tail[i >> 2] |= 0x80 << (i % 4 << 3);
	            if (i > 55) {
	                md5cycle(state, tail);
	                for (i = 0; i < 16; i++) {
	                    tail[i] = 0;
	                }
	            }
	            tail[14] = n * 8;
	            md5cycle(state, tail);
	            return state;
	        }
	
	        function md5blk(s) {
	            /* I figured global was faster.   */
	            var md5blks = [],
	                i; /* Andy King said do it this way. */
	            for (i = 0; i < 64; i += 4) {
	                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
	            }
	            return md5blks;
	        }
	
	        var hex_chr = '0123456789abcdef'.split('');
	
	        function rhex(n) {
	            var s = '',
	                j = 0;
	            for (; j < 4; j++) {
	                s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
	            }return s;
	        }
	
	        function hex(x) {
	            for (var i = 0; i < x.length; i++) {
	                x[i] = rhex(x[i]);
	            }return x.join('');
	        }
	
	        function md5(s) {
	            return hex(md51(s));
	        }
	
	        /* this function is much faster, so if possible we use it. Some IEs are the
	         only ones I know of that need the idiotic second function, generated by an
	         if clause.  */
	        function add32(a, b) {
	            return a + b & 0xFFFFFFFF;
	        }
	
	        if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
	            var _add = function _add(x, y) {
	                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
	                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	                return msw << 16 | lsw & 0xFFFF;
	            };
	        }
	
	        return md5;
	    }, this);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 31 */
/*!*****************************!*\
  !*** ./js/util/constans.js ***!
  \*****************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Constans = function () {
	  function Constans() {
	    _classCallCheck(this, Constans);
	  }
	
	  _createClass(Constans, null, [{
	    key: 'getContextPath',
	    value: function getContextPath() {
	      var pathName = document.location.pathname;
	      var index = pathName.substr(1).indexOf('/');
	      var result = pathName.substr(0, index + 1);
	      if (result == '/apps') {
	        result = '';
	      }
	      return result;
	    }
	  }]);
	
	  return Constans;
	}();
	
	Constans.kjdpConst = {
	  AJAX_URL: Constans.getContextPath() + '/kjdp_ajax',
	  BEX_CODES: 'bex_codes',
	  CACHE_URL: '/kjdp_cache/',
	  ENCRYPT_KEY_URL: Constans.getContextPath() + '/kjdp_encrypkey',
	  GEN_PAGE: '/apps/frame/pages/genericParam.html',
	  GET_DATA_URL: '/kjdp_getData/',
	  KJDP_DOWNLOAD_URL: '/kjdp_download/',
	  KJDP_UPLOAD_URL: '/kjdp_upload/',
	  KJDP_USER_INFO_URL: '/kjdp_userInfo/',
	  KJDP_VALIDATE_URL: '/kjdp_validate/',
	  LOGIN_URL: '/kjdp_login/',
	  LOGOUT_URL: '/kjdp_logout/',
	  MODELER_URL: '/kjdp_modeler/',
	  PROGRAM: 'menuId',
	  REQ_TYPE_JSON: 'json',
	  REQ_TYPE_XML: 'xml',
	  SERVICE: 'service',
	  SESSION_URL: Constans.getContextPath() + '/kjdp_session',
	  UNLOCK: '/kjdp_unlock',
	  WEB_BASE: '/',
	
	  MENU_PUR_ALL: '1', //菜单用途 1-管理（包含5） 2-业务 3-功能
	  MENU_PUR_BUS: '2',
	  MENU_PUR_FUN: '3'
	};
	exports.default = Constans;

/***/ }),
/* 32 */
/*!******************************************************************************************************************!*\
  !*** ./~/.0.3.0@html-loader!./~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./js/vueModel/modal.vue ***!
  \******************************************************************************************************************/
/***/ (function(module, exports) {

	module.exports = "\r\n <!-- 模态框（Modal） -->\r\n    <div class=\"modal fade\" id=\"boxItemWindow\" data-keyboard=\"false\" data-backdrop=\"static\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"popup\">\r\n                    <div class=\"popup_bt\"><span>添加模版</span><button type=\"button\" data-dismiss=\"modal\"  \r\n                    aria-hidden=\"true\" v-on:click=\"cancelModal\"></button></div>\r\n                    <div class=\"popup_ul\">\r\n                        <div class=\"popup_ulname\"><span>模块名称：</span><input modelId=\"{{modalstitle.id}}\" type=\"text\" class=\"popup_input\" \r\n                        v-model=\"modalstitle.name\" placeholder=\"请输入模块名称\"/></div>\r\n                        <div class=\"popup_ulbox\">\r\n                            <div class=\"popup_ulleft\">\r\n                                <div class=\"popup_listbt\"><span>菜单库</span><input name=\"\" type=\"text\" class=\"popup_search\"/></div>\r\n                                <div class=\"ulbox\">\r\n                                    <ul id=\"menuTree\" class=\"ztree\"></ul>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"popup_ulcenter\"><span class=\"popup_buttonright\"></span></div>\r\n                            <div class=\"popup_ulright\">\r\n                                <div class=\"popup_listbt\"><span>已选择</span></div>\r\n                                 <div class=\"ulbox\">\r\n                                    <ul>\r\n                                    \t<li v-for=\"(i,cont) in menuTree\">\r\n                                    \t\t<span  name='{{cont.link}}'>{{cont.name}}\r\n                                            <button type=\"button\" v-on:click='modalCancel(cont)'>X</button></span>\r\n                                    \t</li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"popup_bottom\"><button type=\"button\" class=\"popup_reset\" v-on:click=\"resetModal()\">重置</button><button type=\"button\" class=\"popup_add\" v-on:click=\"getModal(modalstitle,menuTree)\">确定</button></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n</template>";

/***/ }),
/* 33 */
/*!***********************************!*\
  !*** ./js/dashboard/dashboard.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _dragula = __webpack_require__(/*! dragula */ 1);
	
	var _dragula2 = _interopRequireDefault(_dragula);
	
	__webpack_require__(/*! css/dragula.css */ 13);
	
	var _underscore = __webpack_require__(/*! underscore */ 18);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _vue = __webpack_require__(/*! vue */ 19);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _itemBox = __webpack_require__(/*! vueModel/itemBox.vue */ 34);
	
	var _itemBox2 = _interopRequireDefault(_itemBox);
	
	var _ztree = __webpack_require__(/*! ztree */ 38);
	
	var _ztree2 = _interopRequireDefault(_ztree);
	
	var _modal = __webpack_require__(/*! ./modal */ 39);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//import kjdpAjax from 'util/ajax';
	var Dashboard = function () {
	  function Dashboard(leftId, rightId) {
	    // _.extend(this,{leftId:leftId,rightId:rightId});
	
	    _classCallCheck(this, Dashboard);
	  }
	
	  _createClass(Dashboard, [{
	    key: 'initPage',
	    value: function initPage(tabDomId, rawTabId, groupId) {
	      var me = this;
	      return new _vue2.default({
	        el: '#' + tabDomId,
	        components: {
	          itemsBox: _itemBox2.default
	        },
	        ready: function ready() {
	          var that = this;
	
	          that.getBoxData();
	
	          (0, _dragula2.default)([$('#' + tabDomId + 'left-events')[0], $('#' + tabDomId + 'right-events')[0]], {
	            moves: function moves(el, container, handle) {
	              return handle.classList.contains('hmain_listbt') || handle.classList.contains('itemBoxTitle');
	            }
	          }).on('drop', function (el, container) {
	            // reorder the left blank block, it should be always on the bottom
	            var lastOne = $('#' + tabDomId + 'left-events').find('.hmain_list:last');
	            var addBlock = $('#' + tabDomId + 'left-events').find('.hmain_list_add');
	
	            if (lastOne.length === 0) {
	              addBlock.show();
	            } else {
	              $('#' + tabDomId + 'left-events').find('.hmain_list:last').after(addBlock.show());
	            }
	
	            that.positionSave();
	          }).on('drag', function (el, container) {
	            // addBlock toggle show and hide
	            var leftBlock = $('#' + tabDomId + 'left-events').find('.hmain_list');
	            var addBlock = $('#' + tabDomId + 'left-events').find('.hmain_list_add');
	
	            if (leftBlock.length === 1) {
	              if (!leftBlock.is(el)) {
	                addBlock.hide();
	              } else {
	                addBlock.show();
	              }
	            } else if (leftBlock.length === 0) {
	              addBlock.show();
	            } else {
	              addBlock.hide();
	            }
	          }).on('cancel', function (el, container) {
	            var addBlock = $('#' + tabDomId + 'left-events').find('.hmain_list_add');
	            addBlock.show();
	          });
	        },
	        data: function data() {
	          // initialization
	          return {
	            pleftLinks: [],
	            prightLinks: [],
	            ptabId: tabDomId,
	            rawTabId: rawTabId,
	            groupId: groupId
	          };
	        },
	
	        methods: {
	          positionSave: function positionSave() {
	            var leftWidget = $('#' + tabDomId + 'left-events').find('.hmain_list');
	            var rightWidget = $('#' + tabDomId + 'right-events').find('.hmain_list');
	
	            var newWidgets = [];
	
	            var iteratorFn = function iteratorFn(position) {
	              return function (index, item) {
	                //把menuId改成boxId,groupId改成tabId----"groupId-1-tabs-1"
	                newWidgets.push({
	                  boxId: $(item).attr('boxId'),
	                  tabId: $(item).attr('tabId'),
	                  orderNum: index,
	                  position: position
	                });
	              };
	            };
	            $.each(leftWidget, iteratorFn('L'));
	            $.each(rightWidget, iteratorFn('R'));
	            console.log(newWidgets);
	            // here is the way to save the newWidgets position
	          },
	          getBoxData: function getBoxData(newBoxId) {
	            var that = this;
	            var currentGroupId = that.$get('groupId');
	            var addHeightLine = false;
	            //模拟AJAX
	            //that.$get('rawTabId');当有多个tabId时
	            //that.$get('rawTabId');当有多个tabId时需要对比刷新哪一个
	
	
	            var leftData = [];
	            var rightData = [];
	
	            var linkCont = [{ "LINK_ID": "01", "LINK_NAME": "linkname1", "LINK_URL": "http://www.baidu.com" }, { "LINK_ID": "02", "LINK_NAME": "linkname2", "LINK_URL": "http://www.baidu.com" }, { "LINK_ID": "03", "LINK_NAME": "linkname3", "LINK_URL": "http://www.baidu.com" }, { "LINK_ID": "04", "LINK_NAME": "linkname4", "LINK_URL": "http://www.baidu.com" }, { "LINK_ID": "05", "LINK_NAME": "linkname5", "LINK_URL": "http://www.baidu.com" }];
	            var dataBoxs = [{ "POSITION": "L", "BOX_NAME": "boxname1", "BOX_ID": "001" }, { "POSITION": "R", "BOX_NAME": "boxname2", "BOX_ID": "002" }, { "POSITION": "L", "BOX_NAME": "boxname3", "BOX_ID": "003" }, { "POSITION": "R", "BOX_NAME": "boxname4", "BOX_ID": "004" }];
	
	            $.each(dataBoxs, function (i, boxItem) {
	
	              if (newBoxId && boxItem.BOX_ID == newBoxId) {
	                addHeightLine = true;
	              }
	              if (boxItem.POSITION === 'L') {
	
	                leftData.push({ menuLinks: linkCont, BOX_NAME: boxItem.BOX_NAME, BOX_ID: boxItem.BOX_ID, BOXFLAG: addHeightLine });
	              } else {
	                rightData.push({ menuLinks: linkCont, BOX_NAME: boxItem.BOX_NAME, BOX_ID: boxItem.BOX_ID, BOXFLAG: addHeightLine });
	              }
	
	              addHeightLine = false;
	            });
	
	            that.$set('pleftLinks', leftData);
	            that.$set('prightLinks', rightData);
	          }
	        },
	        events: {
	          onModalClick: function onModalClick() {
	            var tabId = this.$get('rawTabId');
	            var pTarget = this;
	
	            var modal = _modal2.default.getModalInst({ tabId: tabId, pTarget: pTarget });
	
	            _modal2.default.showModal({ success: function success(boxId) {
	                $('#boxItemWindow').modal('hide');
	                console.log(boxId);
	                pTarget.getBoxData(boxId);
	              }, scope: this });
	          },
	          removeItemBox: function removeItemBox(item, direction, boxId) {
	            //bexDeleteOPP_MENU_BOX 不知道是不是级联删除，先注释掉
	            if (!confirm("确定要删除吗？")) {
	              return;
	            }
	            // kjdpAjax.post({
	            //   req: {
	            //     service: 'Y3000001',
	            //     LBM: 'bexDeleteOPP_MENU_BOX',
	            //     BOX_ID: boxId
	            //   }
	            // }).then((data) => {
	
	            // })
	            if (direction == 'left') {
	              this.pleftLinks.$remove(this.pleftLinks[item]);
	            } else if (direction == 'right') {
	              this.prightLinks.$remove(this.prightLinks[item]);
	            }
	          },
	          boxEditor: function boxEditor(linksData) {
	            console.log(linksData);
	            var boxId = linksData.BOX_ID;
	            var boxName = linksData.BOX_NAME;
	            //bexSelectOPP_MENU_LINK
	            var tabId = this.$get('rawTabId');
	            var pTarget = this;
	            var startData = { boxId: boxId, boxName: boxName };
	            var modal = _modal2.default.getModalInst({ tabId: tabId, pTarget: pTarget });
	
	            //kjdpAjax.post({
	            //  req: {
	            //    service: 'Y3000001',
	            //    LBM: 'bexSelectOPP_MENU_LINK',
	            //    BOX_ID: boxId
	            //  }
	            //}).then((data) => {
	            //  //返回的字段需要多一个BUS_CODE
	            //
	            //  startData.menuLink=data[0];
	            //
	            //  Modal.showModal({success:(boxId) => {
	            //    $('#boxItemWindow').modal('hide');
	            //    console.log(boxId);
	            //    pTarget.getBoxData(boxId);
	            //  },scope:pTarget,InitData:startData});
	            //
	            //
	            //})
	          }
	        }
	      });
	    }
	  }]);
	
	  return Dashboard;
	}();
	
	exports.default = Dashboard;

/***/ }),
/* 34 */
/*!*********************************!*\
  !*** ./js/vueModel/itemBox.vue ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(/*! -!babel-loader?presets[]=es2015&plugins[]=transform-runtime!../../~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./itemBox.vue */ 35)
	__vue_template__ = __webpack_require__(/*! -!html-loader!../../~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./itemBox.vue */ 36)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\worklink\\new-home-page\\js\\vueModel\\itemBox.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 35 */
/*!********************************************************************************************************************************************************************!*\
  !*** ./~/.6.4.1@babel-loader/lib?presets[]=es2015&plugins[]=transform-runtime!./~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./js/vueModel/itemBox.vue ***!
  \********************************************************************************************************************************************************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <script>
	exports.default = {
		props: ['leftLinks', 'rightLinks', 'tabId'],
		methods: {
			forwardLink: function forwardLink(linkId, tabId) {
				this.$dispatch('onLinkClick', { linkId: linkId, tabId: tabId });
			},
			showModal: function showModal() {
				this.$dispatch('onModalClick');
			},
			removeItemBox: function removeItemBox(boxItem, direction, boxId) {
				this.$dispatch('removeItemBox', boxItem, direction, boxId);
			},
			boxEditor: function boxEditor(linksData) {
				this.$dispatch('boxEditor', linksData);
			}
		}
	};
	// </script>
	// <template>
	// <div class="hmain" >
	// 	<div class="hmain_margin">
	// 		<div class="hmain_left" id="{{tabId+'left-events'}}" >
	//
	// 			<div class="hmain_list" v-for="(key,links) in leftLinks" tabId="{{tabId}}" boxId="{{links.BOX_ID}}" >
	// 				<div class="hmain_listbt">
	// 				<div style="display:none" v-bind:class="{ boxHL:links.BOXFLAG }" ></div>
	// 				<span class="itemBoxTitle">{{links.BOX_NAME}}</span>
	// 				        <div class="dropdown-group hright">
	//                                         <img class="dropdown-img" src="../../images/icon_cz.png" data-toggle="dropdown">
	//                                         </img>
	//                                         <ul class="dropdown-menu" style="right:0;" role="menu">
	//                                             <li>
	//                                                 <a href="javascript:void(0);" @click="boxEditor(links)">编辑</a>
	//                                             </li>
	//                                             <li>
	//                                                 <a href="javascript:void(0);" @click="removeItemBox(key,'left',links.BOX_ID)">删除</a>
	//                                             </li>
	//                                         </ul>
	//                         </div>
	// 				</div>
	// 				<ul>
	// 					<li v-for="link in links.menuLinks">
	// 						<a href="#{{link.url}}" v-on:click="forwardLink(link.LINK_ID,tabId)" >{{link.LINK_NAME}}</a>
	// 					</li>
	// 					<div style="clear:both;"></div>
	// 				</ul>
	// 			</div>
	// 			<div class="hmain_list_add" v-on:click="showModal()"><a href="#"></a></div>
	// 		</div>
	// 		<div class="hmain_right" id="{{tabId+'right-events'}}" style="min-height:200px">
	//
	// 			<div class="hmain_list" v-for="(key,links) in rightLinks" tabId="{{tabId}}" boxid="{{links.BOX_ID}}" >
	// 				<div class="hmain_listbt">
	// 				<div style="display:none" v-bind:class="{ boxHL:links.BOXFLAG }" ></div>
	// 				<span class="itemBoxTitle">{{links.BOX_NAME}}</span>
	// 				        <div class="dropdown-group hright">
	//                                         <img class="dropdown-img" src="../../images/icon_cz.png" data-toggle="dropdown">
	//                                         </img>
	//                                         <ul class="dropdown-menu" style="right:0;" role="menu">
	//                                             <li>
	//                                                 <a href="javascript:void(0);" @click="boxEditor(links)">编辑</a>
	//                                             </li>
	//                                             <li>
	//                                                 <a href="javascript:void(0);" @click="removeItemBox(key,'right',links.BOX_ID)">删除</a>
	//                                             </li>
	//                                         </ul>
	//                         </div>
	// 				</div>
	// 				<ul>
	// 					<li v-for="link in links.menuLinks">
	// 						<a href="#{{link.LINK_URL}}" v-on:click="forwardLink(link.LINK_ID,tabId)">{{link.LINK_NAME}}</a>
	// 					</li>
	// 					<div style="clear:both;"></div>
	// 				</ul>
	// 			</div>
	// 		</div>
	// 	</div>
	// </div>
	// </template>
	/* generated by vue-loader */

/***/ }),
/* 36 */
/*!********************************************************************************************************************!*\
  !*** ./~/.0.3.0@html-loader!./~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./js/vueModel/itemBox.vue ***!
  \********************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = "\r\n<div class=\"hmain\" >\r\n\t<div class=\"hmain_margin\">\r\n\t\t<div class=\"hmain_left\" id=\"{{tabId+'left-events'}}\" >\r\n\t\t\t\t\t\t\r\n\t\t\t<div class=\"hmain_list\" v-for=\"(key,links) in leftLinks\" tabId=\"{{tabId}}\" boxId=\"{{links.BOX_ID}}\" >\r\n\t\t\t\t<div class=\"hmain_listbt\">\r\n\t\t\t\t<div style=\"display:none\" v-bind:class=\"{ boxHL:links.BOXFLAG }\" ></div>\r\n\t\t\t\t<span class=\"itemBoxTitle\">{{links.BOX_NAME}}</span>\r\n\t\t\t\t        <div class=\"dropdown-group hright\">\r\n                                        <img class=\"dropdown-img\" src=\"" + __webpack_require__(/*! ../../images/icon_cz.png */ 37) + "\" data-toggle=\"dropdown\">\r\n                                        </img>\r\n                                        <ul class=\"dropdown-menu\" style=\"right:0;\" role=\"menu\">\r\n                                            <li>\r\n                                                <a href=\"javascript:void(0);\" @click=\"boxEditor(links)\">编辑</a>\r\n                                            </li>\r\n                                            <li>\r\n                                                <a href=\"javascript:void(0);\" @click=\"removeItemBox(key,'left',links.BOX_ID)\">删除</a>\r\n                                            </li>\r\n                                        </ul>\r\n                        </div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li v-for=\"link in links.menuLinks\">\r\n\t\t\t\t\t\t<a href=\"#{{link.url}}\" v-on:click=\"forwardLink(link.LINK_ID,tabId)\" >{{link.LINK_NAME}}</a>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<div style=\"clear:both;\"></div>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"hmain_list_add\" v-on:click=\"showModal()\"><a href=\"#\"></a></div>\r\n\t\t</div>\r\n\t\t<div class=\"hmain_right\" id=\"{{tabId+'right-events'}}\" style=\"min-height:200px\">\r\n\t\t\t\r\n\t\t\t<div class=\"hmain_list\" v-for=\"(key,links) in rightLinks\" tabId=\"{{tabId}}\" boxid=\"{{links.BOX_ID}}\" >\r\n\t\t\t\t<div class=\"hmain_listbt\">\r\n\t\t\t\t<div style=\"display:none\" v-bind:class=\"{ boxHL:links.BOXFLAG }\" ></div>\r\n\t\t\t\t<span class=\"itemBoxTitle\">{{links.BOX_NAME}}</span>\r\n\t\t\t\t        <div class=\"dropdown-group hright\">\r\n                                        <img class=\"dropdown-img\" src=\"" + __webpack_require__(/*! ../../images/icon_cz.png */ 37) + "\" data-toggle=\"dropdown\">\r\n                                        </img>\r\n                                        <ul class=\"dropdown-menu\" style=\"right:0;\" role=\"menu\">\r\n                                            <li>\r\n                                                <a href=\"javascript:void(0);\" @click=\"boxEditor(links)\">编辑</a>\r\n                                            </li>\r\n                                            <li>\r\n                                                <a href=\"javascript:void(0);\" @click=\"removeItemBox(key,'right',links.BOX_ID)\">删除</a>\r\n                                            </li>\r\n                                        </ul>\r\n                        </div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li v-for=\"link in links.menuLinks\">\r\n\t\t\t\t\t\t<a href=\"#{{link.LINK_URL}}\" v-on:click=\"forwardLink(link.LINK_ID,tabId)\">{{link.LINK_NAME}}</a>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<div style=\"clear:both;\"></div>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";

/***/ }),
/* 37 */
/*!****************************!*\
  !*** ./images/icon_cz.png ***!
  \****************************/
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAADphp8SAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMWE0YzBlNy1mYWNiLTNjNGItYTdlZi0wOWY3NGJhZjBkMjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTgxOUQ2RTk5NTEyMTFFNjhDRTJEQjNDQzQxRDVGRjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTgxOUQ2RTg5NTEyMTFFNjhDRTJEQjNDQzQxRDVGRjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjY2JkNTJiLTJlNjUtNWI0OC05NzQ5LWZiYjg4MGYyNWNiMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMWE0YzBlNy1mYWNiLTNjNGItYTdlZi0wOWY3NGJhZjBkMjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5z5Zh/AAAAo0lEQVR42uySTQrEIAyFE43SLj2fC6+mXrJgWx2eYJnV2EV3nQcBMf8f4ZRSO46DtNYUQuAYY2Nmaq1RrZV+CXnLstC2bSRI2PedzvPsTrxR6I4Qh3hIlFIEc871D0wGGx1nEpFekDHRE5Kccyul0Lqu5L3vjOBAg1kTTGyt7SwvRlhvMPpmMBOGAIrOCFWNMReju+uOHMQ/y+h/R2+9o48AAwDtn6jd6DIApgAAAABJRU5ErkJggg=="

/***/ }),
/* 38 */
/*!************************************************!*\
  !*** ./~/.3.5.24@ztree/js/jquery.ztree.all.js ***!
  \************************************************/
/***/ (function(module, exports) {

	
	/*
	 * JQuery zTree core v3.5.23
	 * http://zTree.me/
	 *
	 * Copyright (c) 2010 Hunter.z
	 *
	 * Licensed same as jquery - MIT License
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * email: hunter.z@263.net
	 * Date: 2016-04-01
	 */
	(function($){
		var settings = {}, roots = {}, caches = {},
		//default consts of core
		_consts = {
			className: {
				BUTTON: "button",
				LEVEL: "level",
				ICO_LOADING: "ico_loading",
				SWITCH: "switch",
				NAME: 'node_name'
			},
			event: {
				NODECREATED: "ztree_nodeCreated",
				CLICK: "ztree_click",
				EXPAND: "ztree_expand",
				COLLAPSE: "ztree_collapse",
				ASYNC_SUCCESS: "ztree_async_success",
				ASYNC_ERROR: "ztree_async_error",
				REMOVE: "ztree_remove",
				SELECTED: "ztree_selected",
				UNSELECTED: "ztree_unselected"
			},
			id: {
				A: "_a",
				ICON: "_ico",
				SPAN: "_span",
				SWITCH: "_switch",
				UL: "_ul"
			},
			line: {
				ROOT: "root",
				ROOTS: "roots",
				CENTER: "center",
				BOTTOM: "bottom",
				NOLINE: "noline",
				LINE: "line"
			},
			folder: {
				OPEN: "open",
				CLOSE: "close",
				DOCU: "docu"
			},
			node: {
				CURSELECTED: "curSelectedNode"
			}
		},
		//default setting of core
		_setting = {
			treeId: "",
			treeObj: null,
			view: {
				addDiyDom: null,
				autoCancelSelected: true,
				dblClickExpand: true,
				expandSpeed: "fast",
				fontCss: {},
				nameIsHTML: false,
				selectedMulti: true,
				showIcon: true,
				showLine: true,
				showTitle: true,
				txtSelectedEnable: false
			},
			data: {
				key: {
					children: "children",
					name: "name",
					title: "",
					url: "url",
					icon: "icon"
				},
				simpleData: {
					enable: false,
					idKey: "id",
					pIdKey: "pId",
					rootPId: null
				},
				keep: {
					parent: false,
					leaf: false
				}
			},
			async: {
				enable: false,
				contentType: "application/x-www-form-urlencoded",
				type: "post",
				dataType: "text",
				url: "",
				autoParam: [],
				otherParam: [],
				dataFilter: null
			},
			callback: {
				beforeAsync:null,
				beforeClick:null,
				beforeDblClick:null,
				beforeRightClick:null,
				beforeMouseDown:null,
				beforeMouseUp:null,
				beforeExpand:null,
				beforeCollapse:null,
				beforeRemove:null,
	
				onAsyncError:null,
				onAsyncSuccess:null,
				onNodeCreated:null,
				onClick:null,
				onDblClick:null,
				onRightClick:null,
				onMouseDown:null,
				onMouseUp:null,
				onExpand:null,
				onCollapse:null,
				onRemove:null
			}
		},
		//default root of core
		//zTree use root to save full data
		_initRoot = function (setting) {
			var r = data.getRoot(setting);
			if (!r) {
				r = {};
				data.setRoot(setting, r);
			}
			r[setting.data.key.children] = [];
			r.expandTriggerFlag = false;
			r.curSelectedList = [];
			r.noSelection = true;
			r.createdNodes = [];
			r.zId = 0;
			r._ver = (new Date()).getTime();
		},
		//default cache of core
		_initCache = function(setting) {
			var c = data.getCache(setting);
			if (!c) {
				c = {};
				data.setCache(setting, c);
			}
			c.nodes = [];
			c.doms = [];
		},
		//default bindEvent of core
		_bindEvent = function(setting) {
			var o = setting.treeObj,
			c = consts.event;
			o.bind(c.NODECREATED, function (event, treeId, node) {
				tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
			});
	
			o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
				tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
			});
	
			o.bind(c.EXPAND, function (event, treeId, node) {
				tools.apply(setting.callback.onExpand, [event, treeId, node]);
			});
	
			o.bind(c.COLLAPSE, function (event, treeId, node) {
				tools.apply(setting.callback.onCollapse, [event, treeId, node]);
			});
	
			o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
				tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
			});
	
			o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
				tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
			});
	
			o.bind(c.REMOVE, function (event, treeId, treeNode) {
				tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
			});
	
			o.bind(c.SELECTED, function (event, treeId, node) {
				tools.apply(setting.callback.onSelected, [treeId, node]);
			});
			o.bind(c.UNSELECTED, function (event, treeId, node) {
				tools.apply(setting.callback.onUnSelected, [treeId, node]);
			});
		},
		_unbindEvent = function(setting) {
			var o = setting.treeObj,
			c = consts.event;
			o.unbind(c.NODECREATED)
			.unbind(c.CLICK)
			.unbind(c.EXPAND)
			.unbind(c.COLLAPSE)
			.unbind(c.ASYNC_SUCCESS)
			.unbind(c.ASYNC_ERROR)
			.unbind(c.REMOVE)
			.unbind(c.SELECTED)
			.unbind(c.UNSELECTED);
		},
		//default event proxy of core
		_eventProxy = function(event) {
			var target = event.target,
			setting = data.getSetting(event.data.treeId),
			tId = "", node = null,
			nodeEventType = "", treeEventType = "",
			nodeEventCallback = null, treeEventCallback = null,
			tmp = null;
	
			if (tools.eqs(event.type, "mousedown")) {
				treeEventType = "mousedown";
			} else if (tools.eqs(event.type, "mouseup")) {
				treeEventType = "mouseup";
			} else if (tools.eqs(event.type, "contextmenu")) {
				treeEventType = "contextmenu";
			} else if (tools.eqs(event.type, "click")) {
				if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
					tId = tools.getNodeMainDom(target).id;
					nodeEventType = "switchNode";
				} else {
					tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
					if (tmp) {
						tId = tools.getNodeMainDom(tmp).id;
						nodeEventType = "clickNode";
					}
				}
			} else if (tools.eqs(event.type, "dblclick")) {
				treeEventType = "dblclick";
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "switchNode";
				}
			}
			if (treeEventType.length > 0 && tId.length == 0) {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {tId = tools.getNodeMainDom(tmp).id;}
			}
			// event to node
			if (tId.length>0) {
				node = data.getNodeCache(setting, tId);
				switch (nodeEventType) {
					case "switchNode" :
						if (!node.isParent) {
							nodeEventType = "";
						} else if (tools.eqs(event.type, "click")
							|| (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
							nodeEventCallback = handler.onSwitchNode;
						} else {
							nodeEventType = "";
						}
						break;
					case "clickNode" :
						nodeEventCallback = handler.onClickNode;
						break;
				}
			}
			// event to zTree
			switch (treeEventType) {
				case "mousedown" :
					treeEventCallback = handler.onZTreeMousedown;
					break;
				case "mouseup" :
					treeEventCallback = handler.onZTreeMouseup;
					break;
				case "dblclick" :
					treeEventCallback = handler.onZTreeDblclick;
					break;
				case "contextmenu" :
					treeEventCallback = handler.onZTreeContextmenu;
					break;
			}
			var proxyResult = {
				stop: false,
				node: node,
				nodeEventType: nodeEventType,
				nodeEventCallback: nodeEventCallback,
				treeEventType: treeEventType,
				treeEventCallback: treeEventCallback
			};
			return proxyResult
		},
		//default init node of core
		_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
			if (!n) return;
			var r = data.getRoot(setting),
			childKey = setting.data.key.children;
			n.level = level;
			n.tId = setting.treeId + "_" + (++r.zId);
			n.parentTId = parentNode ? parentNode.tId : null;
			n.open = (typeof n.open == "string") ? tools.eqs(n.open, "true") : !!n.open;
			if (n[childKey] && n[childKey].length > 0) {
				n.isParent = true;
				n.zAsync = true;
			} else {
				n.isParent = (typeof n.isParent == "string") ? tools.eqs(n.isParent, "true") : !!n.isParent;
				n.open = (n.isParent && !setting.async.enable) ? n.open : false;
				n.zAsync = !n.isParent;
			}
			n.isFirstNode = isFirstNode;
			n.isLastNode = isLastNode;
			n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
			n.getPreNode = function() {return data.getPreNode(setting, n);};
			n.getNextNode = function() {return data.getNextNode(setting, n);};
			n.getIndex = function() {return data.getNodeIndex(setting, n);};
			n.getPath = function() {return data.getNodePath(setting, n);};
			n.isAjaxing = false;
			data.fixPIdKeyValue(setting, n);
		},
		_init = {
			bind: [_bindEvent],
			unbind: [_unbindEvent],
			caches: [_initCache],
			nodes: [_initNode],
			proxys: [_eventProxy],
			roots: [_initRoot],
			beforeA: [],
			afterA: [],
			innerBeforeA: [],
			innerAfterA: [],
			zTreeTools: []
		},
		//method of operate data
		data = {
			addNodeCache: function(setting, node) {
				data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
			},
			getNodeCacheId: function(tId) {
				return tId.substring(tId.lastIndexOf("_")+1);
			},
			addAfterA: function(afterA) {
				_init.afterA.push(afterA);
			},
			addBeforeA: function(beforeA) {
				_init.beforeA.push(beforeA);
			},
			addInnerAfterA: function(innerAfterA) {
				_init.innerAfterA.push(innerAfterA);
			},
			addInnerBeforeA: function(innerBeforeA) {
				_init.innerBeforeA.push(innerBeforeA);
			},
			addInitBind: function(bindEvent) {
				_init.bind.push(bindEvent);
			},
			addInitUnBind: function(unbindEvent) {
				_init.unbind.push(unbindEvent);
			},
			addInitCache: function(initCache) {
				_init.caches.push(initCache);
			},
			addInitNode: function(initNode) {
				_init.nodes.push(initNode);
			},
			addInitProxy: function(initProxy, isFirst) {
				if (!!isFirst) {
					_init.proxys.splice(0,0,initProxy);
				} else {
					_init.proxys.push(initProxy);
				}
			},
			addInitRoot: function(initRoot) {
				_init.roots.push(initRoot);
			},
			addNodesData: function(setting, parentNode, index, nodes) {
				var childKey = setting.data.key.children, params;
				if (!parentNode[childKey]) {
					parentNode[childKey] = [];
					index = -1;
				} else if (index >= parentNode[childKey].length) {
					index = -1;
				}
	
				if (parentNode[childKey].length > 0 && index === 0) {
					parentNode[childKey][0].isFirstNode = false;
					view.setNodeLineIcos(setting, parentNode[childKey][0]);
				} else if (parentNode[childKey].length > 0 && index < 0) {
					parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
					view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1]);
				}
				parentNode.isParent = true;
	
				if (index<0) {
					parentNode[childKey] = parentNode[childKey].concat(nodes);
				} else {
					params = [index, 0].concat(nodes);
					parentNode[childKey].splice.apply(parentNode[childKey], params);
				}
			},
			addSelectedNode: function(setting, node) {
				var root = data.getRoot(setting);
				if (!data.isSelectedNode(setting, node)) {
					root.curSelectedList.push(node);
				}
			},
			addCreatedNode: function(setting, node) {
				if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
					var root = data.getRoot(setting);
					root.createdNodes.push(node);
				}
			},
			addZTreeTools: function(zTreeTools) {
				_init.zTreeTools.push(zTreeTools);
			},
			exSetting: function(s) {
				$.extend(true, _setting, s);
			},
			fixPIdKeyValue: function(setting, node) {
				if (setting.data.simpleData.enable) {
					node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
				}
			},
			getAfterA: function(setting, node, array) {
				for (var i=0, j=_init.afterA.length; i<j; i++) {
					_init.afterA[i].apply(this, arguments);
				}
			},
			getBeforeA: function(setting, node, array) {
				for (var i=0, j=_init.beforeA.length; i<j; i++) {
					_init.beforeA[i].apply(this, arguments);
				}
			},
			getInnerAfterA: function(setting, node, array) {
				for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
					_init.innerAfterA[i].apply(this, arguments);
				}
			},
			getInnerBeforeA: function(setting, node, array) {
				for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
					_init.innerBeforeA[i].apply(this, arguments);
				}
			},
			getCache: function(setting) {
				return caches[setting.treeId];
			},
			getNodeIndex: function(setting, node) {
				if (!node) return null;
				var childKey = setting.data.key.children,
				p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
				for (var i=0, l=p[childKey].length-1; i<=l; i++) {
					if (p[childKey][i] === node) {
						return i;
					}
				}
				return -1;
			},
			getNextNode: function(setting, node) {
				if (!node) return null;
				var childKey = setting.data.key.children,
				p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
				for (var i=0, l=p[childKey].length-1; i<=l; i++) {
					if (p[childKey][i] === node) {
						return (i==l ? null : p[childKey][i+1]);
					}
				}
				return null;
			},
			getNodeByParam: function(setting, nodes, key, value) {
				if (!nodes || !key) return null;
				var childKey = setting.data.key.children;
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (nodes[i][key] == value) {
						return nodes[i];
					}
					var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
					if (tmp) return tmp;
				}
				return null;
			},
			getNodeCache: function(setting, tId) {
				if (!tId) return null;
				var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
				return n ? n : null;
			},
			getNodeName: function(setting, node) {
				var nameKey = setting.data.key.name;
				return "" + node[nameKey];
			},
			getNodePath: function(setting, node) {
				if (!node) return null;
	
				var path;
				if(node.parentTId) {
					path = node.getParentNode().getPath();
				} else {
					path = [];
				}
	
				if (path) {
					path.push(node);
				}
	
				return path;
			},
			getNodeTitle: function(setting, node) {
				var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
				return "" + node[t];
			},
			getNodes: function(setting) {
				return data.getRoot(setting)[setting.data.key.children];
			},
			getNodesByParam: function(setting, nodes, key, value) {
				if (!nodes || !key) return [];
				var childKey = setting.data.key.children,
				result = [];
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (nodes[i][key] == value) {
						result.push(nodes[i]);
					}
					result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value));
				}
				return result;
			},
			getNodesByParamFuzzy: function(setting, nodes, key, value) {
				if (!nodes || !key) return [];
				var childKey = setting.data.key.children,
				result = [];
				value = value.toLowerCase();
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value)>-1) {
						result.push(nodes[i]);
					}
					result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value));
				}
				return result;
			},
			getNodesByFilter: function(setting, nodes, filter, isSingle, invokeParam) {
				if (!nodes) return (isSingle ? null : []);
				var childKey = setting.data.key.children,
				result = isSingle ? null : [];
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (tools.apply(filter, [nodes[i], invokeParam], false)) {
						if (isSingle) {return nodes[i];}
						result.push(nodes[i]);
					}
					var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
					if (isSingle && !!tmpResult) {return tmpResult;}
					result = isSingle ? tmpResult : result.concat(tmpResult);
				}
				return result;
			},
			getPreNode: function(setting, node) {
				if (!node) return null;
				var childKey = setting.data.key.children,
				p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
				for (var i=0, l=p[childKey].length; i<l; i++) {
					if (p[childKey][i] === node) {
						return (i==0 ? null : p[childKey][i-1]);
					}
				}
				return null;
			},
			getRoot: function(setting) {
				return setting ? roots[setting.treeId] : null;
			},
			getRoots: function() {
				return roots;
			},
			getSetting: function(treeId) {
				return settings[treeId];
			},
			getSettings: function() {
				return settings;
			},
			getZTreeTools: function(treeId) {
				var r = this.getRoot(this.getSetting(treeId));
				return r ? r.treeTools : null;
			},
			initCache: function(setting) {
				for (var i=0, j=_init.caches.length; i<j; i++) {
					_init.caches[i].apply(this, arguments);
				}
			},
			initNode: function(setting, level, node, parentNode, preNode, nextNode) {
				for (var i=0, j=_init.nodes.length; i<j; i++) {
					_init.nodes[i].apply(this, arguments);
				}
			},
			initRoot: function(setting) {
				for (var i=0, j=_init.roots.length; i<j; i++) {
					_init.roots[i].apply(this, arguments);
				}
			},
			isSelectedNode: function(setting, node) {
				var root = data.getRoot(setting);
				for (var i=0, j=root.curSelectedList.length; i<j; i++) {
					if(node === root.curSelectedList[i]) return true;
				}
				return false;
			},
			removeNodeCache: function(setting, node) {
				var childKey = setting.data.key.children;
				if (node[childKey]) {
					for (var i=0, l=node[childKey].length; i<l; i++) {
						data.removeNodeCache(setting, node[childKey][i]);
					}
				}
				data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
			},
			removeSelectedNode: function(setting, node) {
				var root = data.getRoot(setting);
				for (var i=0, j=root.curSelectedList.length; i<j; i++) {
					if(node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
						root.curSelectedList.splice(i, 1);
						setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
						i--;j--;
					}
				}
			},
			setCache: function(setting, cache) {
				caches[setting.treeId] = cache;
			},
			setRoot: function(setting, root) {
				roots[setting.treeId] = root;
			},
			setZTreeTools: function(setting, zTreeTools) {
				for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
					_init.zTreeTools[i].apply(this, arguments);
				}
			},
			transformToArrayFormat: function (setting, nodes) {
				if (!nodes) return [];
				var childKey = setting.data.key.children,
				r = [];
				if (tools.isArray(nodes)) {
					for (var i=0, l=nodes.length; i<l; i++) {
						r.push(nodes[i]);
						if (nodes[i][childKey])
							r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]));
					}
				} else {
					r.push(nodes);
					if (nodes[childKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]));
				}
				return r;
			},
			transformTozTreeFormat: function(setting, sNodes) {
				var i,l,
				key = setting.data.simpleData.idKey,
				parentKey = setting.data.simpleData.pIdKey,
				childKey = setting.data.key.children;
				if (!key || key=="" || !sNodes) return [];
	
				if (tools.isArray(sNodes)) {
					var r = [];
					var tmpMap = [];
					for (i=0, l=sNodes.length; i<l; i++) {
						tmpMap[sNodes[i][key]] = sNodes[i];
					}
					for (i=0, l=sNodes.length; i<l; i++) {
						if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
							if (!tmpMap[sNodes[i][parentKey]][childKey])
								tmpMap[sNodes[i][parentKey]][childKey] = [];
							tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
						} else {
							r.push(sNodes[i]);
						}
					}
					return r;
				}else {
					return [sNodes];
				}
			}
		},
		//method of event proxy
		event = {
			bindEvent: function(setting) {
				for (var i=0, j=_init.bind.length; i<j; i++) {
					_init.bind[i].apply(this, arguments);
				}
			},
			unbindEvent: function(setting) {
				for (var i=0, j=_init.unbind.length; i<j; i++) {
					_init.unbind[i].apply(this, arguments);
				}
			},
			bindTree: function(setting) {
				var eventParam = {
					treeId: setting.treeId
				},
				o = setting.treeObj;
				if (!setting.view.txtSelectedEnable) {
					// for can't select text
					o.bind('selectstart', handler.onSelectStart).css({
						"-moz-user-select":"-moz-none"
					});
				}
				o.bind('click', eventParam, event.proxy);
				o.bind('dblclick', eventParam, event.proxy);
				o.bind('mouseover', eventParam, event.proxy);
				o.bind('mouseout', eventParam, event.proxy);
				o.bind('mousedown', eventParam, event.proxy);
				o.bind('mouseup', eventParam, event.proxy);
				o.bind('contextmenu', eventParam, event.proxy);
			},
			unbindTree: function(setting) {
				var o = setting.treeObj;
				o.unbind('selectstart', handler.onSelectStart)
					.unbind('click', event.proxy)
					.unbind('dblclick', event.proxy)
					.unbind('mouseover', event.proxy)
					.unbind('mouseout', event.proxy)
					.unbind('mousedown', event.proxy)
					.unbind('mouseup', event.proxy)
					.unbind('contextmenu', event.proxy);
			},
			doProxy: function(e) {
				var results = [];
				for (var i=0, j=_init.proxys.length; i<j; i++) {
					var proxyResult = _init.proxys[i].apply(this, arguments);
					results.push(proxyResult);
					if (proxyResult.stop) {
						break;
					}
				}
				return results;
			},
			proxy: function(e) {
				var setting = data.getSetting(e.data.treeId);
				if (!tools.uCanDo(setting, e)) return true;
				var results = event.doProxy(e),
				r = true, x = false;
				for (var i=0, l=results.length; i<l; i++) {
					var proxyResult = results[i];
					if (proxyResult.nodeEventCallback) {
						x = true;
						r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
					}
					if (proxyResult.treeEventCallback) {
						x = true;
						r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
					}
				}
				return r;
			}
		},
		//method of event handler
		handler = {
			onSwitchNode: function (event, node) {
				var setting = data.getSetting(event.data.treeId);
				if (node.open) {
					if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
					data.getRoot(setting).expandTriggerFlag = true;
					view.switchNode(setting, node);
				} else {
					if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
					data.getRoot(setting).expandTriggerFlag = true;
					view.switchNode(setting, node);
				}
				return true;
			},
			onClickNode: function (event, node) {
				var setting = data.getSetting(event.data.treeId),
				clickFlag = ( (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey)) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey) && setting.view.selectedMulti) ? 2 : 1;
				if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) return true;
				if (clickFlag === 0) {
					view.cancelPreSelectedNode(setting, node);
				} else {
					view.selectNode(setting, node, clickFlag === 2);
				}
				setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
				return true;
			},
			onZTreeMousedown: function(event, node) {
				var setting = data.getSetting(event.data.treeId);
				if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
					tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
				}
				return true;
			},
			onZTreeMouseup: function(event, node) {
				var setting = data.getSetting(event.data.treeId);
				if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
					tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
				}
				return true;
			},
			onZTreeDblclick: function(event, node) {
				var setting = data.getSetting(event.data.treeId);
				if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
					tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
				}
				return true;
			},
			onZTreeContextmenu: function(event, node) {
				var setting = data.getSetting(event.data.treeId);
				if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
					tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
				}
				return (typeof setting.callback.onRightClick) != "function";
			},
			onSelectStart: function(e){
				var n = e.originalEvent.srcElement.nodeName.toLowerCase();
				return (n === "input" || n === "textarea" );
			}
		},
		//method of tools for zTree
		tools = {
			apply: function(fun, param, defaultValue) {
				if ((typeof fun) == "function") {
					return fun.apply(zt, param?param:[]);
				}
				return defaultValue;
			},
			canAsync: function(setting, node) {
				var childKey = setting.data.key.children;
				return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)));
			},
			clone: function (obj){
				if (obj === null) return null;
				var o = tools.isArray(obj) ? [] : {};
				for(var i in obj){
					o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? tools.clone(obj[i]) : obj[i]);
				}
				return o;
			},
			eqs: function(str1, str2) {
				return str1.toLowerCase() === str2.toLowerCase();
			},
			isArray: function(arr) {
				return Object.prototype.toString.apply(arr) === "[object Array]";
			},
			$: function(node, exp, setting) {
				if (!!exp && typeof exp != "string") {
					setting = exp;
					exp = "";
				}
				if (typeof node == "string") {
					return $(node, setting ? setting.treeObj.get(0).ownerDocument : null);
				} else {
					return $("#" + node.tId + exp, setting ? setting.treeObj : null);
				}
			},
			getMDom: function (setting, curDom, targetExpr) {
				if (!curDom) return null;
				while (curDom && curDom.id !== setting.treeId) {
					for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
						if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
							return curDom;
						}
					}
					curDom = curDom.parentNode;
				}
				return null;
			},
			getNodeMainDom:function(target) {
				return ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0));
			},
			isChildOrSelf: function(dom, parentId) {
				return ( $(dom).closest("#" + parentId).length> 0 );
			},
			uCanDo: function(setting, e) {
				return true;
			}
		},
		//method of operate ztree dom
		view = {
			addNodes: function(setting, parentNode, index, newNodes, isSilent) {
				if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
					return;
				}
				if (!tools.isArray(newNodes)) {
					newNodes = [newNodes];
				}
				if (setting.data.simpleData.enable) {
					newNodes = data.transformTozTreeFormat(setting, newNodes);
				}
				if (parentNode) {
					var target_switchObj = $$(parentNode, consts.id.SWITCH, setting),
					target_icoObj = $$(parentNode, consts.id.ICON, setting),
					target_ulObj = $$(parentNode, consts.id.UL, setting);
	
					if (!parentNode.open) {
						view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
						view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
						parentNode.open = false;
						target_ulObj.css({
							"display": "none"
						});
					}
	
					data.addNodesData(setting, parentNode, index, newNodes);
					view.createNodes(setting, parentNode.level + 1, newNodes, parentNode, index);
					if (!isSilent) {
						view.expandCollapseParentNode(setting, parentNode, true);
					}
				} else {
					data.addNodesData(setting, data.getRoot(setting), index, newNodes);
					view.createNodes(setting, 0, newNodes, null, index);
				}
			},
			appendNodes: function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
				if (!nodes) return [];
				var html = [],
				childKey = setting.data.key.children;
	
				var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
					tmpPChild = tmpPNode[childKey],
					isFirstNode, isLastNode;
	
				if (!tmpPChild || index >= tmpPChild.length) {
					index = -1;
				}
	
				for (var i = 0, l = nodes.length; i < l; i++) {
					var node = nodes[i];
					if (initFlag) {
						isFirstNode = ((index===0 || tmpPChild.length == nodes.length) && (i == 0));
						isLastNode = (index < 0 && i == (nodes.length - 1));
						data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
						data.addNodeCache(setting, node);
					}
	
					var childHtml = [];
					if (node[childKey] && node[childKey].length > 0) {
						//make child html first, because checkType
						childHtml = view.appendNodes(setting, level + 1, node[childKey], node, -1, initFlag, openFlag && node.open);
					}
					if (openFlag) {
	
						view.makeDOMNodeMainBefore(html, setting, node);
						view.makeDOMNodeLine(html, setting, node);
						data.getBeforeA(setting, node, html);
						view.makeDOMNodeNameBefore(html, setting, node);
						data.getInnerBeforeA(setting, node, html);
						view.makeDOMNodeIcon(html, setting, node);
						data.getInnerAfterA(setting, node, html);
						view.makeDOMNodeNameAfter(html, setting, node);
						data.getAfterA(setting, node, html);
						if (node.isParent && node.open) {
							view.makeUlHtml(setting, node, html, childHtml.join(''));
						}
						view.makeDOMNodeMainAfter(html, setting, node);
						data.addCreatedNode(setting, node);
					}
				}
				return html;
			},
			appendParentULDom: function(setting, node) {
				var html = [],
				nObj = $$(node, setting);
				if (!nObj.get(0) && !!node.parentTId) {
					view.appendParentULDom(setting, node.getParentNode());
					nObj = $$(node, setting);
				}
				var ulObj = $$(node, consts.id.UL, setting);
				if (ulObj.get(0)) {
					ulObj.remove();
				}
				var childKey = setting.data.key.children,
				childHtml = view.appendNodes(setting, node.level+1, node[childKey], node, -1, false, true);
				view.makeUlHtml(setting, node, html, childHtml.join(''));
				nObj.append(html.join(''));
			},
			asyncNode: function(setting, node, isSilent, callback) {
				var i, l;
				if (node && !node.isParent) {
					tools.apply(callback);
					return false;
				} else if (node && node.isAjaxing) {
					return false;
				} else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
					tools.apply(callback);
					return false;
				}
				if (node) {
					node.isAjaxing = true;
					var icoObj = $$(node, consts.id.ICON, setting);
					icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
				}
	
				var tmpParam = {};
				for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
					var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
					if (pKey.length>1) {
						spKey = pKey[1];
						pKey = pKey[0];
					}
					tmpParam[spKey] = node[pKey];
				}
				if (tools.isArray(setting.async.otherParam)) {
					for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
						tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
					}
				} else {
					for (var p in setting.async.otherParam) {
						tmpParam[p] = setting.async.otherParam[p];
					}
				}
	
				var _tmpV = data.getRoot(setting)._ver;
				$.ajax({
					contentType: setting.async.contentType,
	                cache: false,
					type: setting.async.type,
					url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
					data: tmpParam,
					dataType: setting.async.dataType,
					success: function(msg) {
						if (_tmpV != data.getRoot(setting)._ver) {
							return;
						}
						var newNodes = [];
						try {
							if (!msg || msg.length == 0) {
								newNodes = [];
							} else if (typeof msg == "string") {
								newNodes = eval("(" + msg + ")");
							} else {
								newNodes = msg;
							}
						} catch(err) {
							newNodes = msg;
						}
	
						if (node) {
							node.isAjaxing = null;
							node.zAsync = true;
						}
						view.setNodeLineIcos(setting, node);
						if (newNodes && newNodes !== "") {
							newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
							view.addNodes(setting, node, -1, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
						} else {
							view.addNodes(setting, node, -1, [], !!isSilent);
						}
						setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
						tools.apply(callback);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						if (_tmpV != data.getRoot(setting)._ver) {
							return;
						}
						if (node) node.isAjaxing = null;
						view.setNodeLineIcos(setting, node);
						setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
					}
				});
				return true;
			},
			cancelPreSelectedNode: function (setting, node, excludeNode) {
				var list = data.getRoot(setting).curSelectedList,
					i, n;
				for (i=list.length-1; i>=0; i--) {
					n = list[i];
					if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
						$$(n, consts.id.A, setting).removeClass(consts.node.CURSELECTED);
						if (node) {
							data.removeSelectedNode(setting, node);
							break;
						} else {
							list.splice(i, 1);
							setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, n]);
						}
					}
				}
			},
			createNodeCallback: function(setting) {
				if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
					var root = data.getRoot(setting);
					while (root.createdNodes.length>0) {
						var node = root.createdNodes.shift();
						tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
						if (!!setting.callback.onNodeCreated) {
							setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
						}
					}
				}
			},
			createNodes: function(setting, level, nodes, parentNode, index) {
				if (!nodes || nodes.length == 0) return;
				var root = data.getRoot(setting),
				childKey = setting.data.key.children,
				openFlag = !parentNode || parentNode.open || !!$$(parentNode[childKey][0], setting).get(0);
				root.createdNodes = [];
				var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, index, true, openFlag),
					parentObj, nextObj;
	
				if (!parentNode) {
					parentObj = setting.treeObj;
					//setting.treeObj.append(zTreeHtml.join(''));
				} else {
					var ulObj = $$(parentNode, consts.id.UL, setting);
					if (ulObj.get(0)) {
						parentObj = ulObj;
						//ulObj.append(zTreeHtml.join(''));
					}
				}
				if (parentObj) {
					if (index >= 0) {
						nextObj = parentObj.children()[index];
					}
					if (index >=0 && nextObj) {
						$(nextObj).before(zTreeHtml.join(''));
					} else {
						parentObj.append(zTreeHtml.join(''));
					}
				}
	
				view.createNodeCallback(setting);
			},
			destroy: function(setting) {
				if (!setting) return;
				data.initCache(setting);
				data.initRoot(setting);
				event.unbindTree(setting);
				event.unbindEvent(setting);
				setting.treeObj.empty();
				delete settings[setting.treeId];
			},
			expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
				var root = data.getRoot(setting),
				childKey = setting.data.key.children;
				var tmpCb, _callback;
				if (!node) {
					tools.apply(callback, []);
					return;
				}
				if (root.expandTriggerFlag) {
					_callback = callback;
					tmpCb = function(){
						if (_callback) _callback();
						if (node.open) {
							setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
						} else {
							setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
						}
					};
					callback = tmpCb;
					root.expandTriggerFlag = false;
				}
				if (!node.open && node.isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (node[childKey] && node[childKey].length>0 && !$$(node[childKey][0], setting).get(0)))) {
					view.appendParentULDom(setting, node);
					view.createNodeCallback(setting);
				}
				if (node.open == expandFlag) {
					tools.apply(callback, []);
					return;
				}
				var ulObj = $$(node, consts.id.UL, setting),
				switchObj = $$(node, consts.id.SWITCH, setting),
				icoObj = $$(node, consts.id.ICON, setting);
	
				if (node.isParent) {
					node.open = !node.open;
					if (node.iconOpen && node.iconClose) {
						icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
					}
	
					if (node.open) {
						view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
						view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
						if (animateFlag == false || setting.view.expandSpeed == "") {
							ulObj.show();
							tools.apply(callback, []);
						} else {
							if (node[childKey] && node[childKey].length > 0) {
								ulObj.slideDown(setting.view.expandSpeed, callback);
							} else {
								ulObj.show();
								tools.apply(callback, []);
							}
						}
					} else {
						view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
						view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
						if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
							ulObj.hide();
							tools.apply(callback, []);
						} else {
							ulObj.slideUp(setting.view.expandSpeed, callback);
						}
					}
				} else {
					tools.apply(callback, []);
				}
			},
			expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
				if (!node) return;
				if (!node.parentTId) {
					view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
					return;
				} else {
					view.expandCollapseNode(setting, node, expandFlag, animateFlag);
				}
				if (node.parentTId) {
					view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
				}
			},
			expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
				var root = data.getRoot(setting),
				childKey = setting.data.key.children,
				treeNodes = (node) ? node[childKey]: root[childKey],
				selfAnimateSign = (node) ? false : animateFlag,
				expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
				data.getRoot(setting).expandTriggerFlag = false;
				if (treeNodes) {
					for (var i = 0, l = treeNodes.length; i < l; i++) {
						if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
					}
				}
				data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
			},
			isSelectedNode: function (setting, node) {
				if (!node) {
					return false;
				}
				var list = data.getRoot(setting).curSelectedList,
					i;
				for (i=list.length-1; i>=0; i--) {
					if (node === list[i]) {
						return true;
					}
				}
				return false;
			},
			makeDOMNodeIcon: function(html, setting, node) {
				var nameStr = data.getNodeName(setting, node),
				name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
				html.push("<span id='", node.tId, consts.id.ICON,
					"' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node),
					"' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
					"' class='", consts.className.NAME,
					"'>",name,"</span>");
			},
			makeDOMNodeLine: function(html, setting, node) {
				html.push("<span id='", node.tId, consts.id.SWITCH,	"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
			},
			makeDOMNodeMainAfter: function(html, setting, node) {
				html.push("</li>");
			},
			makeDOMNodeMainBefore: function(html, setting, node) {
				html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level,"' tabindex='0' hidefocus='true' treenode>");
			},
			makeDOMNodeNameAfter: function(html, setting, node) {
				html.push("</a>");
			},
			makeDOMNodeNameBefore: function(html, setting, node) {
				var title = data.getNodeTitle(setting, node),
				url = view.makeNodeUrl(setting, node),
				fontcss = view.makeNodeFontCss(setting, node),
				fontStyle = [];
				for (var f in fontcss) {
					fontStyle.push(f, ":", fontcss[f], ";");
				}
				html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
					"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
					"'");
				if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {html.push("title='", title.replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
				html.push(">");
			},
			makeNodeFontCss: function(setting, node) {
				var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
				return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
			},
			makeNodeIcoClass: function(setting, node) {
				var icoCss = ["ico"];
				if (!node.isAjaxing) {
					icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
					if (node.isParent) {
						icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
					} else {
						icoCss.push(consts.folder.DOCU);
					}
				}
				return consts.className.BUTTON + " " + icoCss.join('_');
			},
			makeNodeIcoStyle: function(setting, node) {
				var icoStyle = [];
				if (!node.isAjaxing) {
					var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node[setting.data.key.icon];
					if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
					if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
						icoStyle.push("width:0px;height:0px;");
					}
				}
				return icoStyle.join('');
			},
			makeNodeLineClass: function(setting, node) {
				var lineClass = [];
				if (setting.view.showLine) {
					if (node.level == 0 && node.isFirstNode && node.isLastNode) {
						lineClass.push(consts.line.ROOT);
					} else if (node.level == 0 && node.isFirstNode) {
						lineClass.push(consts.line.ROOTS);
					} else if (node.isLastNode) {
						lineClass.push(consts.line.BOTTOM);
					} else {
						lineClass.push(consts.line.CENTER);
					}
				} else {
					lineClass.push(consts.line.NOLINE);
				}
				if (node.isParent) {
					lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					lineClass.push(consts.folder.DOCU);
				}
				return view.makeNodeLineClassEx(node) + lineClass.join('_');
			},
			makeNodeLineClassEx: function(node) {
				return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
			},
			makeNodeTarget: function(node) {
				return (node.target || "_blank");
			},
			makeNodeUrl: function(setting, node) {
				var urlKey = setting.data.key.url;
				return node[urlKey] ? node[urlKey] : null;
			},
			makeUlHtml: function(setting, node, html, content) {
				html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
				html.push(content);
				html.push("</ul>");
			},
			makeUlLineClass: function(setting, node) {
				return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
			},
			removeChildNodes: function(setting, node) {
				if (!node) return;
				var childKey = setting.data.key.children,
				nodes = node[childKey];
				if (!nodes) return;
	
				for (var i = 0, l = nodes.length; i < l; i++) {
					data.removeNodeCache(setting, nodes[i]);
				}
				data.removeSelectedNode(setting);
				delete node[childKey];
	
				if (!setting.data.keep.parent) {
					node.isParent = false;
					node.open = false;
					var tmp_switchObj = $$(node, consts.id.SWITCH, setting),
					tmp_icoObj = $$(node, consts.id.ICON, setting);
					view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
					view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
					$$(node, consts.id.UL, setting).remove();
				} else {
					$$(node, consts.id.UL, setting).empty();
				}
			},
			scrollIntoView: function(dom) {
				if (!dom) {
					return;
				}
				if (dom.scrollIntoViewIfNeeded) {
					dom.scrollIntoViewIfNeeded();
				} else if (dom.scrollIntoView) {
					dom.scrollIntoView(false);
				} else {
					try{dom.focus().blur();}catch(e){}
				}
			},
			setFirstNode: function(setting, parentNode) {
				var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
				if ( childLength > 0) {
					parentNode[childKey][0].isFirstNode = true;
				}
			},
			setLastNode: function(setting, parentNode) {
				var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
				if ( childLength > 0) {
					parentNode[childKey][childLength - 1].isLastNode = true;
				}
			},
			removeNode: function(setting, node) {
				var root = data.getRoot(setting),
				childKey = setting.data.key.children,
				parentNode = (node.parentTId) ? node.getParentNode() : root;
	
				node.isFirstNode = false;
				node.isLastNode = false;
				node.getPreNode = function() {return null;};
				node.getNextNode = function() {return null;};
	
				if (!data.getNodeCache(setting, node.tId)) {
					return;
				}
	
				$$(node, setting).remove();
				data.removeNodeCache(setting, node);
				data.removeSelectedNode(setting, node);
	
				for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
					if (parentNode[childKey][i].tId == node.tId) {
						parentNode[childKey].splice(i, 1);
						break;
					}
				}
				view.setFirstNode(setting, parentNode);
				view.setLastNode(setting, parentNode);
	
				var tmp_ulObj,tmp_switchObj,tmp_icoObj,
				childLength = parentNode[childKey].length;
	
				//repair nodes old parent
				if (!setting.data.keep.parent && childLength == 0) {
					//old parentNode has no child nodes
					parentNode.isParent = false;
					parentNode.open = false;
					tmp_ulObj = $$(parentNode, consts.id.UL, setting);
					tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
					tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
					view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
					view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
					tmp_ulObj.css("display", "none");
	
				} else if (setting.view.showLine && childLength > 0) {
					//old parentNode has child nodes
					var newLast = parentNode[childKey][childLength - 1];
					tmp_ulObj = $$(newLast, consts.id.UL, setting);
					tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
					tmp_icoObj = $$(newLast, consts.id.ICON, setting);
					if (parentNode == root) {
						if (parentNode[childKey].length == 1) {
							//node was root, and ztree has only one root after move node
							view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
						} else {
							var tmp_first_switchObj = $$(parentNode[childKey][0], consts.id.SWITCH, setting);
							view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
							view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
						}
					} else {
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
					}
					tmp_ulObj.removeClass(consts.line.LINE);
				}
			},
			replaceIcoClass: function(node, obj, newName) {
				if (!obj || node.isAjaxing) return;
				var tmpName = obj.attr("class");
				if (tmpName == undefined) return;
				var tmpList = tmpName.split("_");
				switch (newName) {
					case consts.folder.OPEN:
					case consts.folder.CLOSE:
					case consts.folder.DOCU:
						tmpList[tmpList.length-1] = newName;
						break;
				}
				obj.attr("class", tmpList.join("_"));
			},
			replaceSwitchClass: function(node, obj, newName) {
				if (!obj) return;
				var tmpName = obj.attr("class");
				if (tmpName == undefined) return;
				var tmpList = tmpName.split("_");
				switch (newName) {
					case consts.line.ROOT:
					case consts.line.ROOTS:
					case consts.line.CENTER:
					case consts.line.BOTTOM:
					case consts.line.NOLINE:
						tmpList[0] = view.makeNodeLineClassEx(node) + newName;
						break;
					case consts.folder.OPEN:
					case consts.folder.CLOSE:
					case consts.folder.DOCU:
						tmpList[1] = newName;
						break;
				}
				obj.attr("class", tmpList.join("_"));
				if (newName !== consts.folder.DOCU) {
					obj.removeAttr("disabled");
				} else {
					obj.attr("disabled", "disabled");
				}
			},
			selectNode: function(setting, node, addFlag) {
				if (!addFlag) {
					view.cancelPreSelectedNode(setting, null, node);
				}
				$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED);
				data.addSelectedNode(setting, node);
				setting.treeObj.trigger(consts.event.SELECTED, [setting.treeId, node]);
			},
			setNodeFontCss: function(setting, treeNode) {
				var aObj = $$(treeNode, consts.id.A, setting),
				fontCss = view.makeNodeFontCss(setting, treeNode);
				if (fontCss) {
					aObj.css(fontCss);
				}
			},
			setNodeLineIcos: function(setting, node) {
				if (!node) return;
				var switchObj = $$(node, consts.id.SWITCH, setting),
				ulObj = $$(node, consts.id.UL, setting),
				icoObj = $$(node, consts.id.ICON, setting),
				ulLine = view.makeUlLineClass(setting, node);
				if (ulLine.length==0) {
					ulObj.removeClass(consts.line.LINE);
				} else {
					ulObj.addClass(ulLine);
				}
				switchObj.attr("class", view.makeNodeLineClass(setting, node));
				if (node.isParent) {
					switchObj.removeAttr("disabled");
				} else {
					switchObj.attr("disabled", "disabled");
				}
				icoObj.removeAttr("style");
				icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				icoObj.attr("class", view.makeNodeIcoClass(setting, node));
			},
			setNodeName: function(setting, node) {
				var title = data.getNodeTitle(setting, node),
				nObj = $$(node, consts.id.SPAN, setting);
				nObj.empty();
				if (setting.view.nameIsHTML) {
					nObj.html(data.getNodeName(setting, node));
				} else {
					nObj.text(data.getNodeName(setting, node));
				}
				if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
					var aObj = $$(node, consts.id.A, setting);
					aObj.attr("title", !title ? "" : title);
				}
			},
			setNodeTarget: function(setting, node) {
				var aObj = $$(node, consts.id.A, setting);
				aObj.attr("target", view.makeNodeTarget(node));
			},
			setNodeUrl: function(setting, node) {
				var aObj = $$(node, consts.id.A, setting),
				url = view.makeNodeUrl(setting, node);
				if (url == null || url.length == 0) {
					aObj.removeAttr("href");
				} else {
					aObj.attr("href", url);
				}
			},
			switchNode: function(setting, node) {
				if (node.open || !tools.canAsync(setting, node)) {
					view.expandCollapseNode(setting, node, !node.open);
				} else if (setting.async.enable) {
					if (!view.asyncNode(setting, node)) {
						view.expandCollapseNode(setting, node, !node.open);
						return;
					}
				} else if (node) {
					view.expandCollapseNode(setting, node, !node.open);
				}
			}
		};
		// zTree defind
		$.fn.zTree = {
			consts : _consts,
			_z : {
				tools: tools,
				view: view,
				event: event,
				data: data
			},
			getZTreeObj: function(treeId) {
				var o = data.getZTreeTools(treeId);
				return o ? o : null;
			},
			destroy: function(treeId) {
				if (!!treeId && treeId.length > 0) {
					view.destroy(data.getSetting(treeId));
				} else {
					for(var s in settings) {
						view.destroy(settings[s]);
					}
				}
			},
			init: function(obj, zSetting, zNodes) {
				var setting = tools.clone(_setting);
				$.extend(true, setting, zSetting);
				setting.treeId = obj.attr("id");
				setting.treeObj = obj;
				setting.treeObj.empty();
				settings[setting.treeId] = setting;
				//For some older browser,(e.g., ie6)
				if(typeof document.body.style.maxHeight === "undefined") {
					setting.view.expandSpeed = "";
				}
				data.initRoot(setting);
				var root = data.getRoot(setting),
				childKey = setting.data.key.children;
				zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
				if (setting.data.simpleData.enable) {
					root[childKey] = data.transformTozTreeFormat(setting, zNodes);
				} else {
					root[childKey] = zNodes;
				}
	
				data.initCache(setting);
				event.unbindTree(setting);
				event.bindTree(setting);
				event.unbindEvent(setting);
				event.bindEvent(setting);
	
				var zTreeTools = {
					setting : setting,
					addNodes : function(parentNode, index, newNodes, isSilent) {
						if (!parentNode) parentNode = null;
						if (parentNode && !parentNode.isParent && setting.data.keep.leaf) return null;
	
						var i = parseInt(index, 10);
						if (isNaN(i)) {
							isSilent = !!newNodes;
							newNodes = index;
							index = -1;
						} else {
							index = i;
						}
						if (!newNodes) return null;
	
	
						var xNewNodes = tools.clone(tools.isArray(newNodes)? newNodes: [newNodes]);
						function addCallback() {
							view.addNodes(setting, parentNode, index, xNewNodes, (isSilent==true));
						}
	
						if (tools.canAsync(setting, parentNode)) {
							view.asyncNode(setting, parentNode, isSilent, addCallback);
						} else {
							addCallback();
						}
						return xNewNodes;
					},
					cancelSelectedNode : function(node) {
						view.cancelPreSelectedNode(setting, node);
					},
					destroy : function() {
						view.destroy(setting);
					},
					expandAll : function(expandFlag) {
						expandFlag = !!expandFlag;
						view.expandCollapseSonNode(setting, null, expandFlag, true);
						return expandFlag;
					},
					expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
						if (!node || !node.isParent) return null;
						if (expandFlag !== true && expandFlag !== false) {
							expandFlag = !node.open;
						}
						callbackFlag = !!callbackFlag;
	
						if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
							return null;
						} else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
							return null;
						}
						if (expandFlag && node.parentTId) {
							view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
						}
						if (expandFlag === node.open && !sonSign) {
							return null;
						}
	
						data.getRoot(setting).expandTriggerFlag = callbackFlag;
						if (!tools.canAsync(setting, node) && sonSign) {
							view.expandCollapseSonNode(setting, node, expandFlag, true, showNodeFocus);
						} else {
							node.open = !expandFlag;
							view.switchNode(this.setting, node);
							showNodeFocus();
						}
						return expandFlag;
	
						function showNodeFocus() {
							var a = $$(node, setting).get(0);
							if (a && focus !== false) {
								view.scrollIntoView(a);
							}
						}
					},
					getNodes : function() {
						return data.getNodes(setting);
					},
					getNodeByParam : function(key, value, parentNode) {
						if (!key) return null;
						return data.getNodeByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
					},
					getNodeByTId : function(tId) {
						return data.getNodeCache(setting, tId);
					},
					getNodesByParam : function(key, value, parentNode) {
						if (!key) return null;
						return data.getNodesByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
					},
					getNodesByParamFuzzy : function(key, value, parentNode) {
						if (!key) return null;
						return data.getNodesByParamFuzzy(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
					},
					getNodesByFilter: function(filter, isSingle, parentNode, invokeParam) {
						isSingle = !!isSingle;
						if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
						return data.getNodesByFilter(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), filter, isSingle, invokeParam);
					},
					getNodeIndex : function(node) {
						if (!node) return null;
						var childKey = setting.data.key.children,
						parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
						for (var i=0, l = parentNode[childKey].length; i < l; i++) {
							if (parentNode[childKey][i] == node) return i;
						}
						return -1;
					},
					getSelectedNodes : function() {
						var r = [], list = data.getRoot(setting).curSelectedList;
						for (var i=0, l=list.length; i<l; i++) {
							r.push(list[i]);
						}
						return r;
					},
					isSelectedNode : function(node) {
						return data.isSelectedNode(setting, node);
					},
					reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
						if (!this.setting.async.enable) return;
						var isRoot = !parentNode;
						if (isRoot) {
							parentNode = data.getRoot(setting);
						}
						if (reloadType=="refresh") {
							var childKey = this.setting.data.key.children;
							for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
								data.removeNodeCache(setting, parentNode[childKey][i]);
							}
							data.removeSelectedNode(setting);
							parentNode[childKey] = [];
							if (isRoot) {
								this.setting.treeObj.empty();
							} else {
								var ulObj = $$(parentNode, consts.id.UL, setting);
								ulObj.empty();
							}
						}
						view.asyncNode(this.setting, isRoot? null:parentNode, !!isSilent);
					},
					refresh : function() {
						this.setting.treeObj.empty();
						var root = data.getRoot(setting),
						nodes = root[setting.data.key.children]
						data.initRoot(setting);
						root[setting.data.key.children] = nodes
						data.initCache(setting);
						view.createNodes(setting, 0, root[setting.data.key.children], null, -1);
					},
					removeChildNodes : function(node) {
						if (!node) return null;
						var childKey = setting.data.key.children,
						nodes = node[childKey];
						view.removeChildNodes(setting, node);
						return nodes ? nodes : null;
					},
					removeNode : function(node, callbackFlag) {
						if (!node) return;
						callbackFlag = !!callbackFlag;
						if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
						view.removeNode(setting, node);
						if (callbackFlag) {
							this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
						}
					},
					selectNode : function(node, addFlag, isSilent) {
						if (!node) return;
						if (tools.uCanDo(setting)) {
							addFlag = setting.view.selectedMulti && addFlag;
							if (node.parentTId) {
								view.expandCollapseParentNode(setting, node.getParentNode(), true, false, showNodeFocus);
							} else {
								try{$$(node, setting).focus().blur();}catch(e){}
							}
							view.selectNode(setting, node, addFlag);
						}
	
						function showNodeFocus() {
							if (isSilent) {
								return;
							}
							var a = $$(node, setting).get(0);
							view.scrollIntoView(a);
						}
					},
					transformTozTreeNodes : function(simpleNodes) {
						return data.transformTozTreeFormat(setting, simpleNodes);
					},
					transformToArray : function(nodes) {
						return data.transformToArrayFormat(setting, nodes);
					},
					updateNode : function(node, checkTypeFlag) {
						if (!node) return;
						var nObj = $$(node, setting);
						if (nObj.get(0) && tools.uCanDo(setting)) {
							view.setNodeName(setting, node);
							view.setNodeTarget(setting, node);
							view.setNodeUrl(setting, node);
							view.setNodeLineIcos(setting, node);
							view.setNodeFontCss(setting, node);
						}
					}
				}
				root.treeTools = zTreeTools;
				data.setZTreeTools(setting, zTreeTools);
	
				if (root[childKey] && root[childKey].length > 0) {
					view.createNodes(setting, 0, root[childKey], null, -1);
				} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
					view.asyncNode(setting);
				}
				return zTreeTools;
			}
		};
	
		var zt = $.fn.zTree,
		$$ = tools.$,
		consts = zt.consts;
	})(jQuery);
	/*
	 * JQuery zTree excheck v3.5.23
	 * http://zTree.me/
	 *
	 * Copyright (c) 2010 Hunter.z
	 *
	 * Licensed same as jquery - MIT License
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * email: hunter.z@263.net
	 * Date: 2016-04-01
	 */
	(function($){
		//default consts of excheck
		var _consts = {
			event: {
				CHECK: "ztree_check"
			},
			id: {
				CHECK: "_check"
			},
			checkbox: {
				STYLE: "checkbox",
				DEFAULT: "chk",
				DISABLED: "disable",
				FALSE: "false",
				TRUE: "true",
				FULL: "full",
				PART: "part",
				FOCUS: "focus"
			},
			radio: {
				STYLE: "radio",
				TYPE_ALL: "all",
				TYPE_LEVEL: "level"
			}
		},
		//default setting of excheck
		_setting = {
			check: {
				enable: false,
				autoCheckTrigger: false,
				chkStyle: _consts.checkbox.STYLE,
				nocheckInherit: false,
				chkDisabledInherit: false,
				radioType: _consts.radio.TYPE_LEVEL,
				chkboxType: {
					"Y": "ps",
					"N": "ps"
				}
			},
			data: {
				key: {
					checked: "checked"
				}
			},
			callback: {
				beforeCheck:null,
				onCheck:null
			}
		},
		//default root of excheck
		_initRoot = function (setting) {
			var r = data.getRoot(setting);
			r.radioCheckedList = [];
		},
		//default cache of excheck
		_initCache = function(treeId) {},
		//default bind event of excheck
		_bindEvent = function(setting) {
			var o = setting.treeObj,
			c = consts.event;
			o.bind(c.CHECK, function (event, srcEvent, treeId, node) {
				event.srcEvent = srcEvent;
				tools.apply(setting.callback.onCheck, [event, treeId, node]);
			});
		},
		_unbindEvent = function(setting) {
			var o = setting.treeObj,
			c = consts.event;
			o.unbind(c.CHECK);
		},
		//default event proxy of excheck
		_eventProxy = function(e) {
			var target = e.target,
			setting = data.getSetting(e.data.treeId),
			tId = "", node = null,
			nodeEventType = "", treeEventType = "",
			nodeEventCallback = null, treeEventCallback = null;
	
			if (tools.eqs(e.type, "mouseover")) {
				if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
					tId = tools.getNodeMainDom(target).id;
					nodeEventType = "mouseoverCheck";
				}
			} else if (tools.eqs(e.type, "mouseout")) {
				if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
					tId = tools.getNodeMainDom(target).id;
					nodeEventType = "mouseoutCheck";
				}
			} else if (tools.eqs(e.type, "click")) {
				if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
					tId = tools.getNodeMainDom(target).id;
					nodeEventType = "checkNode";
				}
			}
			if (tId.length>0) {
				node = data.getNodeCache(setting, tId);
				switch (nodeEventType) {
					case "checkNode" :
						nodeEventCallback = _handler.onCheckNode;
						break;
					case "mouseoverCheck" :
						nodeEventCallback = _handler.onMouseoverCheck;
						break;
					case "mouseoutCheck" :
						nodeEventCallback = _handler.onMouseoutCheck;
						break;
				}
			}
			var proxyResult = {
				stop: nodeEventType === "checkNode",
				node: node,
				nodeEventType: nodeEventType,
				nodeEventCallback: nodeEventCallback,
				treeEventType: treeEventType,
				treeEventCallback: treeEventCallback
			};
			return proxyResult
		},
		//default init node of excheck
		_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
			if (!n) return;
			var checkedKey = setting.data.key.checked;
			if (typeof n[checkedKey] == "string") n[checkedKey] = tools.eqs(n[checkedKey], "true");
			n[checkedKey] = !!n[checkedKey];
			n.checkedOld = n[checkedKey];
			if (typeof n.nocheck == "string") n.nocheck = tools.eqs(n.nocheck, "true");
			n.nocheck = !!n.nocheck || (setting.check.nocheckInherit && parentNode && !!parentNode.nocheck);
			if (typeof n.chkDisabled == "string") n.chkDisabled = tools.eqs(n.chkDisabled, "true");
			n.chkDisabled = !!n.chkDisabled || (setting.check.chkDisabledInherit && parentNode && !!parentNode.chkDisabled);
			if (typeof n.halfCheck == "string") n.halfCheck = tools.eqs(n.halfCheck, "true");
			n.halfCheck = !!n.halfCheck;
			n.check_Child_State = -1;
			n.check_Focus = false;
			n.getCheckStatus = function() {return data.getCheckStatus(setting, n);};
	
			if (setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL && n[checkedKey] ) {
				var r = data.getRoot(setting);
				r.radioCheckedList.push(n);
			}
		},
		//add dom for check
		_beforeA = function(setting, node, html) {
			var checkedKey = setting.data.key.checked;
			if (setting.check.enable) {
				data.makeChkFlag(setting, node);
				html.push("<span ID='", node.tId, consts.id.CHECK, "' class='", view.makeChkClass(setting, node), "' treeNode", consts.id.CHECK, (node.nocheck === true?" style='display:none;'":""),"></span>");
			}
		},
		//update zTreeObj, add method of check
		_zTreeTools = function(setting, zTreeTools) {
			zTreeTools.checkNode = function(node, checked, checkTypeFlag, callbackFlag) {
				var checkedKey = this.setting.data.key.checked;
				if (node.chkDisabled === true) return;
				if (checked !== true && checked !== false) {
					checked = !node[checkedKey];
				}
				callbackFlag = !!callbackFlag;
	
				if (node[checkedKey] === checked && !checkTypeFlag) {
					return;
				} else if (callbackFlag && tools.apply(this.setting.callback.beforeCheck, [this.setting.treeId, node], true) == false) {
					return;
				}
				if (tools.uCanDo(this.setting) && this.setting.check.enable && node.nocheck !== true) {
					node[checkedKey] = checked;
					var checkObj = $$(node, consts.id.CHECK, this.setting);
					if (checkTypeFlag || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
					view.setChkClass(this.setting, checkObj, node);
					view.repairParentChkClassWithSelf(this.setting, node);
					if (callbackFlag) {
						this.setting.treeObj.trigger(consts.event.CHECK, [null, this.setting.treeId, node]);
					}
				}
			}
	
			zTreeTools.checkAllNodes = function(checked) {
				view.repairAllChk(this.setting, !!checked);
			}
	
			zTreeTools.getCheckedNodes = function(checked) {
				var childKey = this.setting.data.key.children;
				checked = (checked !== false);
				return data.getTreeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey], checked);
			}
	
			zTreeTools.getChangeCheckedNodes = function() {
				var childKey = this.setting.data.key.children;
				return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey]);
			}
	
			zTreeTools.setChkDisabled = function(node, disabled, inheritParent, inheritChildren) {
				disabled = !!disabled;
				inheritParent = !!inheritParent;
				inheritChildren = !!inheritChildren;
				view.repairSonChkDisabled(this.setting, node, disabled, inheritChildren);
				view.repairParentChkDisabled(this.setting, node.getParentNode(), disabled, inheritParent);
			}
	
			var _updateNode = zTreeTools.updateNode;
			zTreeTools.updateNode = function(node, checkTypeFlag) {
				if (_updateNode) _updateNode.apply(zTreeTools, arguments);
				if (!node || !this.setting.check.enable) return;
				var nObj = $$(node, this.setting);
				if (nObj.get(0) && tools.uCanDo(this.setting)) {
					var checkObj = $$(node, consts.id.CHECK, this.setting);
					if (checkTypeFlag == true || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
					view.setChkClass(this.setting, checkObj, node);
					view.repairParentChkClassWithSelf(this.setting, node);
				}
			}
		},
		//method of operate data
		_data = {
			getRadioCheckedList: function(setting) {
				var checkedList = data.getRoot(setting).radioCheckedList;
				for (var i=0, j=checkedList.length; i<j; i++) {
					if(!data.getNodeCache(setting, checkedList[i].tId)) {
						checkedList.splice(i, 1);
						i--; j--;
					}
				}
				return checkedList;
			},
			getCheckStatus: function(setting, node) {
				if (!setting.check.enable || node.nocheck || node.chkDisabled) return null;
				var checkedKey = setting.data.key.checked,
				r = {
					checked: node[checkedKey],
					half: node.halfCheck ? node.halfCheck : (setting.check.chkStyle == consts.radio.STYLE ? (node.check_Child_State === 2) : (node[checkedKey] ? (node.check_Child_State > -1 && node.check_Child_State < 2) : (node.check_Child_State > 0)))
				};
				return r;
			},
			getTreeCheckedNodes: function(setting, nodes, checked, results) {
				if (!nodes) return [];
				var childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked,
				onlyOne = (checked && setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL);
				results = !results ? [] : results;
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] == checked) {
						results.push(nodes[i]);
						if(onlyOne) {
							break;
						}
					}
					data.getTreeCheckedNodes(setting, nodes[i][childKey], checked, results);
					if(onlyOne && results.length > 0) {
						break;
					}
				}
				return results;
			},
			getTreeChangeCheckedNodes: function(setting, nodes, results) {
				if (!nodes) return [];
				var childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked;
				results = !results ? [] : results;
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] != nodes[i].checkedOld) {
						results.push(nodes[i]);
					}
					data.getTreeChangeCheckedNodes(setting, nodes[i][childKey], results);
				}
				return results;
			},
			makeChkFlag: function(setting, node) {
				if (!node) return;
				var childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked,
				chkFlag = -1;
				if (node[childKey]) {
					for (var i = 0, l = node[childKey].length; i < l; i++) {
						var cNode = node[childKey][i];
						var tmp = -1;
						if (setting.check.chkStyle == consts.radio.STYLE) {
							if (cNode.nocheck === true || cNode.chkDisabled === true) {
								tmp = cNode.check_Child_State;
							} else if (cNode.halfCheck === true) {
								tmp = 2;
							} else if (cNode[checkedKey]) {
								tmp = 2;
							} else {
								tmp = cNode.check_Child_State > 0 ? 2:0;
							}
							if (tmp == 2) {
								chkFlag = 2; break;
							} else if (tmp == 0){
								chkFlag = 0;
							}
						} else if (setting.check.chkStyle == consts.checkbox.STYLE) {
							if (cNode.nocheck === true || cNode.chkDisabled === true) {
								tmp = cNode.check_Child_State;
							} else if (cNode.halfCheck === true) {
								tmp = 1;
							} else if (cNode[checkedKey] ) {
								tmp = (cNode.check_Child_State === -1 || cNode.check_Child_State === 2) ? 2 : 1;
							} else {
								tmp = (cNode.check_Child_State > 0) ? 1 : 0;
							}
							if (tmp === 1) {
								chkFlag = 1; break;
							} else if (tmp === 2 && chkFlag > -1 && i > 0 && tmp !== chkFlag) {
								chkFlag = 1; break;
							} else if (chkFlag === 2 && tmp > -1 && tmp < 2) {
								chkFlag = 1; break;
							} else if (tmp > -1) {
								chkFlag = tmp;
							}
						}
					}
				}
				node.check_Child_State = chkFlag;
			}
		},
		//method of event proxy
		_event = {
	
		},
		//method of event handler
		_handler = {
			onCheckNode: function (event, node) {
				if (node.chkDisabled === true) return false;
				var setting = data.getSetting(event.data.treeId),
				checkedKey = setting.data.key.checked;
				if (tools.apply(setting.callback.beforeCheck, [setting.treeId, node], true) == false) return true;
				node[checkedKey] = !node[checkedKey];
				view.checkNodeRelation(setting, node);
				var checkObj = $$(node, consts.id.CHECK, setting);
				view.setChkClass(setting, checkObj, node);
				view.repairParentChkClassWithSelf(setting, node);
				setting.treeObj.trigger(consts.event.CHECK, [event, setting.treeId, node]);
				return true;
			},
			onMouseoverCheck: function(event, node) {
				if (node.chkDisabled === true) return false;
				var setting = data.getSetting(event.data.treeId),
				checkObj = $$(node, consts.id.CHECK, setting);
				node.check_Focus = true;
				view.setChkClass(setting, checkObj, node);
				return true;
			},
			onMouseoutCheck: function(event, node) {
				if (node.chkDisabled === true) return false;
				var setting = data.getSetting(event.data.treeId),
				checkObj = $$(node, consts.id.CHECK, setting);
				node.check_Focus = false;
				view.setChkClass(setting, checkObj, node);
				return true;
			}
		},
		//method of tools for zTree
		_tools = {
	
		},
		//method of operate ztree dom
		_view = {
			checkNodeRelation: function(setting, node) {
				var pNode, i, l,
				childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked,
				r = consts.radio;
				if (setting.check.chkStyle == r.STYLE) {
					var checkedList = data.getRadioCheckedList(setting);
					if (node[checkedKey]) {
						if (setting.check.radioType == r.TYPE_ALL) {
							for (i = checkedList.length-1; i >= 0; i--) {
								pNode = checkedList[i];
								if (pNode[checkedKey] && pNode != node) {
									pNode[checkedKey] = false;
									checkedList.splice(i, 1);
	
									view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
									if (pNode.parentTId != node.parentTId) {
										view.repairParentChkClassWithSelf(setting, pNode);
									}
								}
							}
							checkedList.push(node);
						} else {
							var parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
							for (i = 0, l = parentNode[childKey].length; i < l; i++) {
								pNode = parentNode[childKey][i];
								if (pNode[checkedKey] && pNode != node) {
									pNode[checkedKey] = false;
									view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
								}
							}
						}
					} else if (setting.check.radioType == r.TYPE_ALL) {
						for (i = 0, l = checkedList.length; i < l; i++) {
							if (node == checkedList[i]) {
								checkedList.splice(i, 1);
								break;
							}
						}
					}
	
				} else {
					if (node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.Y.indexOf("s") > -1)) {
						view.setSonNodeCheckBox(setting, node, true);
					}
					if (!node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.N.indexOf("s") > -1)) {
						view.setSonNodeCheckBox(setting, node, false);
					}
					if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("p") > -1) {
						view.setParentNodeCheckBox(setting, node, true);
					}
					if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("p") > -1) {
						view.setParentNodeCheckBox(setting, node, false);
					}
				}
			},
			makeChkClass: function(setting, node) {
				var checkedKey = setting.data.key.checked,
				c = consts.checkbox, r = consts.radio,
				fullStyle = "";
				if (node.chkDisabled === true) {
					fullStyle = c.DISABLED;
				} else if (node.halfCheck) {
					fullStyle = c.PART;
				} else if (setting.check.chkStyle == r.STYLE) {
					fullStyle = (node.check_Child_State < 1)? c.FULL:c.PART;
				} else {
					fullStyle = node[checkedKey] ? ((node.check_Child_State === 2 || node.check_Child_State === -1) ? c.FULL:c.PART) : ((node.check_Child_State < 1)? c.FULL:c.PART);
				}
				var chkName = setting.check.chkStyle + "_" + (node[checkedKey] ? c.TRUE : c.FALSE) + "_" + fullStyle;
				chkName = (node.check_Focus && node.chkDisabled !== true) ? chkName + "_" + c.FOCUS : chkName;
				return consts.className.BUTTON + " " + c.DEFAULT + " " + chkName;
			},
			repairAllChk: function(setting, checked) {
				if (setting.check.enable && setting.check.chkStyle === consts.checkbox.STYLE) {
					var checkedKey = setting.data.key.checked,
					childKey = setting.data.key.children,
					root = data.getRoot(setting);
					for (var i = 0, l = root[childKey].length; i<l ; i++) {
						var node = root[childKey][i];
						if (node.nocheck !== true && node.chkDisabled !== true) {
							node[checkedKey] = checked;
						}
						view.setSonNodeCheckBox(setting, node, checked);
					}
				}
			},
			repairChkClass: function(setting, node) {
				if (!node) return;
				data.makeChkFlag(setting, node);
				if (node.nocheck !== true) {
					var checkObj = $$(node, consts.id.CHECK, setting);
					view.setChkClass(setting, checkObj, node);
				}
			},
			repairParentChkClass: function(setting, node) {
				if (!node || !node.parentTId) return;
				var pNode = node.getParentNode();
				view.repairChkClass(setting, pNode);
				view.repairParentChkClass(setting, pNode);
			},
			repairParentChkClassWithSelf: function(setting, node) {
				if (!node) return;
				var childKey = setting.data.key.children;
				if (node[childKey] && node[childKey].length > 0) {
					view.repairParentChkClass(setting, node[childKey][0]);
				} else {
					view.repairParentChkClass(setting, node);
				}
			},
			repairSonChkDisabled: function(setting, node, chkDisabled, inherit) {
				if (!node) return;
				var childKey = setting.data.key.children;
				if (node.chkDisabled != chkDisabled) {
					node.chkDisabled = chkDisabled;
				}
				view.repairChkClass(setting, node);
				if (node[childKey] && inherit) {
					for (var i = 0, l = node[childKey].length; i < l; i++) {
						var sNode = node[childKey][i];
						view.repairSonChkDisabled(setting, sNode, chkDisabled, inherit);
					}
				}
			},
			repairParentChkDisabled: function(setting, node, chkDisabled, inherit) {
				if (!node) return;
				if (node.chkDisabled != chkDisabled && inherit) {
					node.chkDisabled = chkDisabled;
				}
				view.repairChkClass(setting, node);
				view.repairParentChkDisabled(setting, node.getParentNode(), chkDisabled, inherit);
			},
			setChkClass: function(setting, obj, node) {
				if (!obj) return;
				if (node.nocheck === true) {
					obj.hide();
				} else {
					obj.show();
				}
	            obj.attr('class', view.makeChkClass(setting, node));
			},
			setParentNodeCheckBox: function(setting, node, value, srcNode) {
				var childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked,
				checkObj = $$(node, consts.id.CHECK, setting);
				if (!srcNode) srcNode = node;
				data.makeChkFlag(setting, node);
				if (node.nocheck !== true && node.chkDisabled !== true) {
					node[checkedKey] = value;
					view.setChkClass(setting, checkObj, node);
					if (setting.check.autoCheckTrigger && node != srcNode) {
						setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
					}
				}
				if (node.parentTId) {
					var pSign = true;
					if (!value) {
						var pNodes = node.getParentNode()[childKey];
						for (var i = 0, l = pNodes.length; i < l; i++) {
							if ((pNodes[i].nocheck !== true && pNodes[i].chkDisabled !== true && pNodes[i][checkedKey])
							|| ((pNodes[i].nocheck === true || pNodes[i].chkDisabled === true) && pNodes[i].check_Child_State > 0)) {
								pSign = false;
								break;
							}
						}
					}
					if (pSign) {
						view.setParentNodeCheckBox(setting, node.getParentNode(), value, srcNode);
					}
				}
			},
			setSonNodeCheckBox: function(setting, node, value, srcNode) {
				if (!node) return;
				var childKey = setting.data.key.children,
				checkedKey = setting.data.key.checked,
				checkObj = $$(node, consts.id.CHECK, setting);
				if (!srcNode) srcNode = node;
	
				var hasDisable = false;
				if (node[childKey]) {
					for (var i = 0, l = node[childKey].length; i < l; i++) {
						var sNode = node[childKey][i];
						view.setSonNodeCheckBox(setting, sNode, value, srcNode);
						if (sNode.chkDisabled === true) hasDisable = true;
					}
				}
	
				if (node != data.getRoot(setting) && node.chkDisabled !== true) {
					if (hasDisable && node.nocheck !== true) {
						data.makeChkFlag(setting, node);
					}
					if (node.nocheck !== true && node.chkDisabled !== true) {
						node[checkedKey] = value;
						if (!hasDisable) node.check_Child_State = (node[childKey] && node[childKey].length > 0) ? (value ? 2 : 0) : -1;
					} else {
						node.check_Child_State = -1;
					}
					view.setChkClass(setting, checkObj, node);
					if (setting.check.autoCheckTrigger && node != srcNode && node.nocheck !== true && node.chkDisabled !== true) {
						setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
					}
				}
	
			}
		},
	
		_z = {
			tools: _tools,
			view: _view,
			event: _event,
			data: _data
		};
		$.extend(true, $.fn.zTree.consts, _consts);
		$.extend(true, $.fn.zTree._z, _z);
	
		var zt = $.fn.zTree,
		tools = zt._z.tools,
		consts = zt.consts,
		view = zt._z.view,
		data = zt._z.data,
		event = zt._z.event,
		$$ = tools.$;
	
		data.exSetting(_setting);
		data.addInitBind(_bindEvent);
		data.addInitUnBind(_unbindEvent);
		data.addInitCache(_initCache);
		data.addInitNode(_initNode);
		data.addInitProxy(_eventProxy, true);
		data.addInitRoot(_initRoot);
		data.addBeforeA(_beforeA);
		data.addZTreeTools(_zTreeTools);
	
		var _createNodes = view.createNodes;
		view.createNodes = function(setting, level, nodes, parentNode, index) {
			if (_createNodes) _createNodes.apply(view, arguments);
			if (!nodes) return;
			view.repairParentChkClassWithSelf(setting, parentNode);
		}
		var _removeNode = view.removeNode;
		view.removeNode = function(setting, node) {
			var parentNode = node.getParentNode();
			if (_removeNode) _removeNode.apply(view, arguments);
			if (!node || !parentNode) return;
			view.repairChkClass(setting, parentNode);
			view.repairParentChkClass(setting, parentNode);
		}
	
		var _appendNodes = view.appendNodes;
		view.appendNodes = function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
			var html = "";
			if (_appendNodes) {
				html = _appendNodes.apply(view, arguments);
			}
			if (parentNode) {
				data.makeChkFlag(setting, parentNode);
			}
			return html;
		}
	})(jQuery);
	/*
	 * JQuery zTree exedit v3.5.23
	 * http://zTree.me/
	 *
	 * Copyright (c) 2010 Hunter.z
	 *
	 * Licensed same as jquery - MIT License
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * email: hunter.z@263.net
	 * Date: 2016-04-01
	 */
	(function($){
		//default consts of exedit
		var _consts = {
			event: {
				DRAG: "ztree_drag",
				DROP: "ztree_drop",
				RENAME: "ztree_rename",
				DRAGMOVE:"ztree_dragmove"
			},
			id: {
				EDIT: "_edit",
				INPUT: "_input",
				REMOVE: "_remove"
			},
			move: {
				TYPE_INNER: "inner",
				TYPE_PREV: "prev",
				TYPE_NEXT: "next"
			},
			node: {
				CURSELECTED_EDIT: "curSelectedNode_Edit",
				TMPTARGET_TREE: "tmpTargetzTree",
				TMPTARGET_NODE: "tmpTargetNode"
			}
		},
		//default setting of exedit
		_setting = {
			edit: {
				enable: false,
				editNameSelectAll: false,
				showRemoveBtn: true,
				showRenameBtn: true,
				removeTitle: "remove",
				renameTitle: "rename",
				drag: {
					autoExpandTrigger: false,
					isCopy: true,
					isMove: true,
					prev: true,
					next: true,
					inner: true,
					minMoveSize: 5,
					borderMax: 10,
					borderMin: -5,
					maxShowNodeNum: 5,
					autoOpenTime: 500
				}
			},
			view: {
				addHoverDom: null,
				removeHoverDom: null
			},
			callback: {
				beforeDrag:null,
				beforeDragOpen:null,
				beforeDrop:null,
				beforeEditName:null,
				beforeRename:null,
				onDrag:null,
				onDragMove:null,
				onDrop:null,
				onRename:null
			}
		},
		//default root of exedit
		_initRoot = function (setting) {
			var r = data.getRoot(setting), rs = data.getRoots();
			r.curEditNode = null;
			r.curEditInput = null;
			r.curHoverNode = null;
			r.dragFlag = 0;
			r.dragNodeShowBefore = [];
			r.dragMaskList = new Array();
			rs.showHoverDom = true;
		},
		//default cache of exedit
		_initCache = function(treeId) {},
		//default bind event of exedit
		_bindEvent = function(setting) {
			var o = setting.treeObj;
			var c = consts.event;
			o.bind(c.RENAME, function (event, treeId, treeNode, isCancel) {
				tools.apply(setting.callback.onRename, [event, treeId, treeNode, isCancel]);
			});
	
			o.bind(c.DRAG, function (event, srcEvent, treeId, treeNodes) {
				tools.apply(setting.callback.onDrag, [srcEvent, treeId, treeNodes]);
			});
	
			o.bind(c.DRAGMOVE,function(event, srcEvent, treeId, treeNodes){
				tools.apply(setting.callback.onDragMove,[srcEvent, treeId, treeNodes]);
			});
	
			o.bind(c.DROP, function (event, srcEvent, treeId, treeNodes, targetNode, moveType, isCopy) {
				tools.apply(setting.callback.onDrop, [srcEvent, treeId, treeNodes, targetNode, moveType, isCopy]);
			});
		},
		_unbindEvent = function(setting) {
			var o = setting.treeObj;
			var c = consts.event;
			o.unbind(c.RENAME);
			o.unbind(c.DRAG);
			o.unbind(c.DRAGMOVE);
			o.unbind(c.DROP);
		},
		//default event proxy of exedit
		_eventProxy = function(e) {
			var target = e.target,
			setting = data.getSetting(e.data.treeId),
			relatedTarget = e.relatedTarget,
			tId = "", node = null,
			nodeEventType = "", treeEventType = "",
			nodeEventCallback = null, treeEventCallback = null,
			tmp = null;
	
			if (tools.eqs(e.type, "mouseover")) {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "hoverOverNode";
				}
			} else if (tools.eqs(e.type, "mouseout")) {
				tmp = tools.getMDom(setting, relatedTarget, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (!tmp) {
					tId = "remove";
					nodeEventType = "hoverOutNode";
				}
			} else if (tools.eqs(e.type, "mousedown")) {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "mousedownNode";
				}
			}
			if (tId.length>0) {
				node = data.getNodeCache(setting, tId);
				switch (nodeEventType) {
					case "mousedownNode" :
						nodeEventCallback = _handler.onMousedownNode;
						break;
					case "hoverOverNode" :
						nodeEventCallback = _handler.onHoverOverNode;
						break;
					case "hoverOutNode" :
						nodeEventCallback = _handler.onHoverOutNode;
						break;
				}
			}
			var proxyResult = {
				stop: false,
				node: node,
				nodeEventType: nodeEventType,
				nodeEventCallback: nodeEventCallback,
				treeEventType: treeEventType,
				treeEventCallback: treeEventCallback
			};
			return proxyResult
		},
		//default init node of exedit
		_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
			if (!n) return;
			n.isHover = false;
			n.editNameFlag = false;
		},
		//update zTreeObj, add method of edit
		_zTreeTools = function(setting, zTreeTools) {
			zTreeTools.cancelEditName = function(newName) {
				var root = data.getRoot(this.setting);
				if (!root.curEditNode) return;
				view.cancelCurEditNode(this.setting, newName?newName:null, true);
			}
			zTreeTools.copyNode = function(targetNode, node, moveType, isSilent) {
				if (!node) return null;
				if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) return null;
				var _this = this,
					newNode = tools.clone(node);
				if (!targetNode) {
					targetNode = null;
					moveType = consts.move.TYPE_INNER;
				}
				if (moveType == consts.move.TYPE_INNER) {
					function copyCallback() {
						view.addNodes(_this.setting, targetNode, -1, [newNode], isSilent);
					}
	
					if (tools.canAsync(this.setting, targetNode)) {
						view.asyncNode(this.setting, targetNode, isSilent, copyCallback);
					} else {
						copyCallback();
					}
				} else {
					view.addNodes(this.setting, targetNode.parentNode, -1, [newNode], isSilent);
					view.moveNode(this.setting, targetNode, newNode, moveType, false, isSilent);
				}
				return newNode;
			}
			zTreeTools.editName = function(node) {
				if (!node || !node.tId || node !== data.getNodeCache(this.setting, node.tId)) return;
				if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), true);
				view.editNode(this.setting, node)
			}
			zTreeTools.moveNode = function(targetNode, node, moveType, isSilent) {
				if (!node) return node;
				if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) {
					return null;
				} else if (targetNode && ((node.parentTId == targetNode.tId && moveType == consts.move.TYPE_INNER) || $$(node, this.setting).find("#" + targetNode.tId).length > 0)) {
					return null;
				} else if (!targetNode) {
					targetNode = null;
				}
				var _this = this;
				function moveCallback() {
					view.moveNode(_this.setting, targetNode, node, moveType, false, isSilent);
				}
				if (tools.canAsync(this.setting, targetNode) && moveType === consts.move.TYPE_INNER) {
					view.asyncNode(this.setting, targetNode, isSilent, moveCallback);
				} else {
					moveCallback();
				}
				return node;
			}
			zTreeTools.setEditable = function(editable) {
				this.setting.edit.enable = editable;
				return this.refresh();
			}
		},
		//method of operate data
		_data = {
			setSonNodeLevel: function(setting, parentNode, node) {
				if (!node) return;
				var childKey = setting.data.key.children;
				node.level = (parentNode)? parentNode.level + 1 : 0;
				if (!node[childKey]) return;
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					if (node[childKey][i]) data.setSonNodeLevel(setting, node, node[childKey][i]);
				}
			}
		},
		//method of event proxy
		_event = {
	
		},
		//method of event handler
		_handler = {
			onHoverOverNode: function(event, node) {
				var setting = data.getSetting(event.data.treeId),
				root = data.getRoot(setting);
				if (root.curHoverNode != node) {
					_handler.onHoverOutNode(event);
				}
				root.curHoverNode = node;
				view.addHoverDom(setting, node);
			},
			onHoverOutNode: function(event, node) {
				var setting = data.getSetting(event.data.treeId),
				root = data.getRoot(setting);
				if (root.curHoverNode && !data.isSelectedNode(setting, root.curHoverNode)) {
					view.removeTreeDom(setting, root.curHoverNode);
					root.curHoverNode = null;
				}
			},
			onMousedownNode: function(eventMouseDown, _node) {
				var i,l,
				setting = data.getSetting(eventMouseDown.data.treeId),
				root = data.getRoot(setting), roots = data.getRoots();
				//right click can't drag & drop
				if (eventMouseDown.button == 2 || !setting.edit.enable || (!setting.edit.drag.isCopy && !setting.edit.drag.isMove)) return true;
	
				//input of edit node name can't drag & drop
				var target = eventMouseDown.target,
				_nodes = data.getRoot(setting).curSelectedList,
				nodes = [];
				if (!data.isSelectedNode(setting, _node)) {
					nodes = [_node];
				} else {
					for (i=0, l=_nodes.length; i<l; i++) {
						if (_nodes[i].editNameFlag && tools.eqs(target.tagName, "input") && target.getAttribute("treeNode"+consts.id.INPUT) !== null) {
							return true;
						}
						nodes.push(_nodes[i]);
						if (nodes[0].parentTId !== _nodes[i].parentTId) {
							nodes = [_node];
							break;
						}
					}
				}
	
				view.editNodeBlur = true;
				view.cancelCurEditNode(setting);
	
				var doc = $(setting.treeObj.get(0).ownerDocument),
				body = $(setting.treeObj.get(0).ownerDocument.body), curNode, tmpArrow, tmpTarget,
				isOtherTree = false,
				targetSetting = setting,
				sourceSetting = setting,
				preNode, nextNode,
				preTmpTargetNodeId = null,
				preTmpMoveType = null,
				tmpTargetNodeId = null,
				moveType = consts.move.TYPE_INNER,
				mouseDownX = eventMouseDown.clientX,
				mouseDownY = eventMouseDown.clientY,
				startTime = (new Date()).getTime();
	
				if (tools.uCanDo(setting)) {
					doc.bind("mousemove", _docMouseMove);
				}
				function _docMouseMove(event) {
					//avoid start drag after click node
					if (root.dragFlag == 0 && Math.abs(mouseDownX - event.clientX) < setting.edit.drag.minMoveSize
						&& Math.abs(mouseDownY - event.clientY) < setting.edit.drag.minMoveSize) {
						return true;
					}
					var i, l, tmpNode, tmpDom, tmpNodes,
					childKey = setting.data.key.children;
					body.css("cursor", "pointer");
	
					if (root.dragFlag == 0) {
						if (tools.apply(setting.callback.beforeDrag, [setting.treeId, nodes], true) == false) {
							_docMouseUp(event);
							return true;
						}
	
						for (i=0, l=nodes.length; i<l; i++) {
							if (i==0) {
								root.dragNodeShowBefore = [];
							}
							tmpNode = nodes[i];
							if (tmpNode.isParent && tmpNode.open) {
								view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
								root.dragNodeShowBefore[tmpNode.tId] = true;
							} else {
								root.dragNodeShowBefore[tmpNode.tId] = false;
							}
						}
	
						root.dragFlag = 1;
						roots.showHoverDom = false;
						tools.showIfameMask(setting, true);
	
						//sort
						var isOrder = true, lastIndex = -1;
						if (nodes.length>1) {
							var pNodes = nodes[0].parentTId ? nodes[0].getParentNode()[childKey] : data.getNodes(setting);
							tmpNodes = [];
							for (i=0, l=pNodes.length; i<l; i++) {
								if (root.dragNodeShowBefore[pNodes[i].tId] !== undefined) {
									if (isOrder && lastIndex > -1 && (lastIndex+1) !== i) {
										isOrder = false;
									}
									tmpNodes.push(pNodes[i]);
									lastIndex = i;
								}
								if (nodes.length === tmpNodes.length) {
									nodes = tmpNodes;
									break;
								}
							}
						}
						if (isOrder) {
							preNode = nodes[0].getPreNode();
							nextNode = nodes[nodes.length-1].getNextNode();
						}
	
						//set node in selected
						curNode = $$("<ul class='zTreeDragUL'></ul>", setting);
						for (i=0, l=nodes.length; i<l; i++) {
							tmpNode = nodes[i];
							tmpNode.editNameFlag = false;
							view.selectNode(setting, tmpNode, i>0);
							view.removeTreeDom(setting, tmpNode);
	
							if (i > setting.edit.drag.maxShowNodeNum-1) {
								continue;
							}
	
							tmpDom = $$("<li id='"+ tmpNode.tId +"_tmp'></li>", setting);
							tmpDom.append($$(tmpNode, consts.id.A, setting).clone());
							tmpDom.css("padding", "0");
							tmpDom.children("#" + tmpNode.tId + consts.id.A).removeClass(consts.node.CURSELECTED);
							curNode.append(tmpDom);
							if (i == setting.edit.drag.maxShowNodeNum-1) {
								tmpDom = $$("<li id='"+ tmpNode.tId +"_moretmp'><a>  ...  </a></li>", setting);
								curNode.append(tmpDom);
							}
						}
						curNode.attr("id", nodes[0].tId + consts.id.UL + "_tmp");
						curNode.addClass(setting.treeObj.attr("class"));
						curNode.appendTo(body);
	
						tmpArrow = $$("<span class='tmpzTreeMove_arrow'></span>", setting);
						tmpArrow.attr("id", "zTreeMove_arrow_tmp");
						tmpArrow.appendTo(body);
	
						setting.treeObj.trigger(consts.event.DRAG, [event, setting.treeId, nodes]);
					}
	
					if (root.dragFlag == 1) {
						if (tmpTarget && tmpArrow.attr("id") == event.target.id && tmpTargetNodeId && (event.clientX + doc.scrollLeft()+2) > ($("#" + tmpTargetNodeId + consts.id.A, tmpTarget).offset().left)) {
							var xT = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget);
							event.target = (xT.length > 0) ? xT.get(0) : event.target;
						} else if (tmpTarget) {
							tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
							if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
								.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
						}
						tmpTarget = null;
						tmpTargetNodeId = null;
	
						//judge drag & drop in multi ztree
						isOtherTree = false;
						targetSetting = setting;
						var settings = data.getSettings();
						for (var s in settings) {
							if (settings[s].treeId && settings[s].edit.enable && settings[s].treeId != setting.treeId
								&& (event.target.id == settings[s].treeId || $(event.target).parents("#" + settings[s].treeId).length>0)) {
								isOtherTree = true;
								targetSetting = settings[s];
							}
						}
	
						var docScrollTop = doc.scrollTop(),
						docScrollLeft = doc.scrollLeft(),
						treeOffset = targetSetting.treeObj.offset(),
						scrollHeight = targetSetting.treeObj.get(0).scrollHeight,
						scrollWidth = targetSetting.treeObj.get(0).scrollWidth,
						dTop = (event.clientY + docScrollTop - treeOffset.top),
						dBottom = (targetSetting.treeObj.height() + treeOffset.top - event.clientY - docScrollTop),
						dLeft = (event.clientX + docScrollLeft - treeOffset.left),
						dRight = (targetSetting.treeObj.width() + treeOffset.left - event.clientX - docScrollLeft),
						isTop = (dTop < setting.edit.drag.borderMax && dTop > setting.edit.drag.borderMin),
						isBottom = (dBottom < setting.edit.drag.borderMax && dBottom > setting.edit.drag.borderMin),
						isLeft = (dLeft < setting.edit.drag.borderMax && dLeft > setting.edit.drag.borderMin),
						isRight = (dRight < setting.edit.drag.borderMax && dRight > setting.edit.drag.borderMin),
						isTreeInner = dTop > setting.edit.drag.borderMin && dBottom > setting.edit.drag.borderMin && dLeft > setting.edit.drag.borderMin && dRight > setting.edit.drag.borderMin,
						isTreeTop = (isTop && targetSetting.treeObj.scrollTop() <= 0),
						isTreeBottom = (isBottom && (targetSetting.treeObj.scrollTop() + targetSetting.treeObj.height()+10) >= scrollHeight),
						isTreeLeft = (isLeft && targetSetting.treeObj.scrollLeft() <= 0),
						isTreeRight = (isRight && (targetSetting.treeObj.scrollLeft() + targetSetting.treeObj.width()+10) >= scrollWidth);
	
						if (event.target && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
							//get node <li> dom
							var targetObj = event.target;
							while (targetObj && targetObj.tagName && !tools.eqs(targetObj.tagName, "li") && targetObj.id != targetSetting.treeId) {
								targetObj = targetObj.parentNode;
							}
	
							var canMove = true;
							//don't move to self or children of self
							for (i=0, l=nodes.length; i<l; i++) {
								tmpNode = nodes[i];
								if (targetObj.id === tmpNode.tId) {
									canMove = false;
									break;
								} else if ($$(tmpNode, setting).find("#" + targetObj.id).length > 0) {
									canMove = false;
									break;
								}
							}
							if (canMove && event.target && tools.isChildOrSelf(event.target, targetObj.id + consts.id.A)) {
								tmpTarget = $(targetObj);
								tmpTargetNodeId = targetObj.id;
							}
						}
	
						//the mouse must be in zTree
						tmpNode = nodes[0];
						if (isTreeInner && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
							//judge mouse move in root of ztree
							if (!tmpTarget && (event.target.id == targetSetting.treeId || isTreeTop || isTreeBottom || isTreeLeft || isTreeRight) && (isOtherTree || (!isOtherTree && tmpNode.parentTId))) {
								tmpTarget = targetSetting.treeObj;
							}
							//auto scroll top
							if (isTop) {
								targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()-10);
							} else if (isBottom)  {
								targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()+10);
							}
							if (isLeft) {
								targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()-10);
							} else if (isRight) {
								targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+10);
							}
							//auto scroll left
							if (tmpTarget && tmpTarget != targetSetting.treeObj && tmpTarget.offset().left < targetSetting.treeObj.offset().left) {
								targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+ tmpTarget.offset().left - targetSetting.treeObj.offset().left);
							}
						}
	
						curNode.css({
							"top": (event.clientY + docScrollTop + 3) + "px",
							"left": (event.clientX + docScrollLeft + 3) + "px"
						});
	
						var dX = 0;
						var dY = 0;
						if (tmpTarget && tmpTarget.attr("id")!=targetSetting.treeId) {
							var tmpTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId),
								isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy),
								isPrev = !!(preNode && tmpTargetNodeId === preNode.tId),
								isNext = !!(nextNode && tmpTargetNodeId === nextNode.tId),
								isInner = (tmpNode.parentTId && tmpNode.parentTId == tmpTargetNodeId),
								canPrev = (isCopy || !isNext) && tools.apply(targetSetting.edit.drag.prev, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.prev),
								canNext = (isCopy || !isPrev) && tools.apply(targetSetting.edit.drag.next, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.next),
								canInner = (isCopy || !isInner) && !(targetSetting.data.keep.leaf && !tmpTargetNode.isParent) && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.inner);
	
							function clearMove() {
								tmpTarget = null;
								tmpTargetNodeId = "";
								moveType = consts.move.TYPE_INNER;
								tmpArrow.css({
									"display":"none"
								});
								if (window.zTreeMoveTimer) {
									clearTimeout(window.zTreeMoveTimer);
									window.zTreeMoveTargetNodeTId = null
								}
							}
							if (!canPrev && !canNext && !canInner) {
								clearMove();
							} else {
								var tmpTargetA = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget),
									tmpNextA = tmpTargetNode.isLastNode ? null : $("#" + tmpTargetNode.getNextNode().tId + consts.id.A, tmpTarget.next()),
									tmpTop = tmpTargetA.offset().top,
									tmpLeft = tmpTargetA.offset().left,
									prevPercent = canPrev ? (canInner ? 0.25 : (canNext ? 0.5 : 1) ) : -1,
									nextPercent = canNext ? (canInner ? 0.75 : (canPrev ? 0.5 : 0) ) : -1,
									dY_percent = (event.clientY + docScrollTop - tmpTop)/tmpTargetA.height();
	
								if ((prevPercent==1 || dY_percent<=prevPercent && dY_percent>=-.2) && canPrev) {
									dX = 1 - tmpArrow.width();
									dY = tmpTop - tmpArrow.height()/2;
									moveType = consts.move.TYPE_PREV;
								} else if ((nextPercent==0 || dY_percent>=nextPercent && dY_percent<=1.2) && canNext) {
									dX = 1 - tmpArrow.width();
									dY = (tmpNextA == null || (tmpTargetNode.isParent && tmpTargetNode.open)) ? (tmpTop + tmpTargetA.height() - tmpArrow.height()/2) : (tmpNextA.offset().top - tmpArrow.height()/2);
									moveType = consts.move.TYPE_NEXT;
								} else if (canInner) {
									dX = 5 - tmpArrow.width();
									dY = tmpTop;
									moveType = consts.move.TYPE_INNER;
								} else {
									clearMove();
								}
	
								if (tmpTarget) {
									tmpArrow.css({
										"display":"block",
										"top": dY + "px",
										"left": (tmpLeft + dX) + "px"
									});
									tmpTargetA.addClass(consts.node.TMPTARGET_NODE + "_" + moveType);
	
									if (preTmpTargetNodeId != tmpTargetNodeId || preTmpMoveType != moveType) {
										startTime = (new Date()).getTime();
									}
									if (tmpTargetNode && tmpTargetNode.isParent && moveType == consts.move.TYPE_INNER) {
										var startTimer = true;
										if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== tmpTargetNode.tId) {
											clearTimeout(window.zTreeMoveTimer);
											window.zTreeMoveTargetNodeTId = null;
										} else if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === tmpTargetNode.tId) {
											startTimer = false;
										}
										if (startTimer) {
											window.zTreeMoveTimer = setTimeout(function() {
												if (moveType != consts.move.TYPE_INNER) return;
												if (tmpTargetNode && tmpTargetNode.isParent && !tmpTargetNode.open && (new Date()).getTime() - startTime > targetSetting.edit.drag.autoOpenTime
													&& tools.apply(targetSetting.callback.beforeDragOpen, [targetSetting.treeId, tmpTargetNode], true)) {
													view.switchNode(targetSetting, tmpTargetNode);
													if (targetSetting.edit.drag.autoExpandTrigger) {
														targetSetting.treeObj.trigger(consts.event.EXPAND, [targetSetting.treeId, tmpTargetNode]);
													}
												}
											}, targetSetting.edit.drag.autoOpenTime+50);
											window.zTreeMoveTargetNodeTId = tmpTargetNode.tId;
										}
									}
								}
							}
						} else {
							moveType = consts.move.TYPE_INNER;
							if (tmpTarget && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, null], !!targetSetting.edit.drag.inner)) {
								tmpTarget.addClass(consts.node.TMPTARGET_TREE);
							} else {
								tmpTarget = null;
							}
							tmpArrow.css({
								"display":"none"
							});
							if (window.zTreeMoveTimer) {
								clearTimeout(window.zTreeMoveTimer);
								window.zTreeMoveTargetNodeTId = null;
							}
						}
						preTmpTargetNodeId = tmpTargetNodeId;
						preTmpMoveType = moveType;
	
						setting.treeObj.trigger(consts.event.DRAGMOVE, [event, setting.treeId, nodes]);
					}
					return false;
				}
	
				doc.bind("mouseup", _docMouseUp);
				function _docMouseUp(event) {
					if (window.zTreeMoveTimer) {
						clearTimeout(window.zTreeMoveTimer);
						window.zTreeMoveTargetNodeTId = null;
					}
					preTmpTargetNodeId = null;
					preTmpMoveType = null;
					doc.unbind("mousemove", _docMouseMove);
					doc.unbind("mouseup", _docMouseUp);
					doc.unbind("selectstart", _docSelect);
					body.css("cursor", "auto");
					if (tmpTarget) {
						tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
						if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
								.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
					}
					tools.showIfameMask(setting, false);
	
					roots.showHoverDom = true;
					if (root.dragFlag == 0) return;
					root.dragFlag = 0;
	
					var i, l, tmpNode;
					for (i=0, l=nodes.length; i<l; i++) {
						tmpNode = nodes[i];
						if (tmpNode.isParent && root.dragNodeShowBefore[tmpNode.tId] && !tmpNode.open) {
							view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
							delete root.dragNodeShowBefore[tmpNode.tId];
						}
					}
	
					if (curNode) curNode.remove();
					if (tmpArrow) tmpArrow.remove();
	
					var isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy);
					if (!isCopy && tmpTarget && tmpTargetNodeId && nodes[0].parentTId && tmpTargetNodeId==nodes[0].parentTId && moveType == consts.move.TYPE_INNER) {
						tmpTarget = null;
					}
					if (tmpTarget) {
						var dragTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId);
						if (tools.apply(setting.callback.beforeDrop, [targetSetting.treeId, nodes, dragTargetNode, moveType, isCopy], true) == false) {
							view.selectNodes(sourceSetting, nodes);
							return;
						}
						var newNodes = isCopy ? tools.clone(nodes) : nodes;
	
						function dropCallback() {
							if (isOtherTree) {
								if (!isCopy) {
									for(var i=0, l=nodes.length; i<l; i++) {
										view.removeNode(setting, nodes[i]);
									}
								}
								if (moveType == consts.move.TYPE_INNER) {
									view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
								} else {
									view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
								}
							} else {
								if (isCopy && moveType == consts.move.TYPE_INNER) {
									view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
								} else if (isCopy) {
									view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
								} else {
									if (moveType != consts.move.TYPE_NEXT) {
										for (i=0, l=newNodes.length; i<l; i++) {
											view.moveNode(targetSetting, dragTargetNode, newNodes[i], moveType, false);
										}
									} else {
										for (i=-1, l=newNodes.length-1; i<l; l--) {
											view.moveNode(targetSetting, dragTargetNode, newNodes[l], moveType, false);
										}
									}
								}
							}
							view.selectNodes(targetSetting, newNodes);
	
							var a = $$(newNodes[0], setting).get(0);
							view.scrollIntoView(a);
	
							setting.treeObj.trigger(consts.event.DROP, [event, targetSetting.treeId, newNodes, dragTargetNode, moveType, isCopy]);
						}
	
						if (moveType == consts.move.TYPE_INNER && tools.canAsync(targetSetting, dragTargetNode)) {
							view.asyncNode(targetSetting, dragTargetNode, false, dropCallback);
						} else {
							dropCallback();
						}
	
					} else {
						view.selectNodes(sourceSetting, nodes);
						setting.treeObj.trigger(consts.event.DROP, [event, setting.treeId, nodes, null, null, null]);
					}
				}
	
				doc.bind("selectstart", _docSelect);
				function _docSelect() {
					return false;
				}
	
				//Avoid FireFox's Bug
				//If zTree Div CSS set 'overflow', so drag node outside of zTree, and event.target is error.
				if(eventMouseDown.preventDefault) {
					eventMouseDown.preventDefault();
				}
				return true;
			}
		},
		//method of tools for zTree
		_tools = {
			getAbs: function (obj) {
				var oRect = obj.getBoundingClientRect(),
				scrollTop = document.body.scrollTop+document.documentElement.scrollTop,
				scrollLeft = document.body.scrollLeft+document.documentElement.scrollLeft;
				return [oRect.left+scrollLeft,oRect.top+scrollTop];
			},
			inputFocus: function(inputObj) {
				if (inputObj.get(0)) {
					inputObj.focus();
					tools.setCursorPosition(inputObj.get(0), inputObj.val().length);
				}
			},
			inputSelect: function(inputObj) {
				if (inputObj.get(0)) {
					inputObj.focus();
					inputObj.select();
				}
			},
			setCursorPosition: function(obj, pos){
				if(obj.setSelectionRange) {
					obj.focus();
					obj.setSelectionRange(pos,pos);
				} else if (obj.createTextRange) {
					var range = obj.createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}
			},
			showIfameMask: function(setting, showSign) {
				var root = data.getRoot(setting);
				//clear full mask
				while (root.dragMaskList.length > 0) {
					root.dragMaskList[0].remove();
					root.dragMaskList.shift();
				}
				if (showSign) {
					//show mask
					var iframeList = $$("iframe", setting);
					for (var i = 0, l = iframeList.length; i < l; i++) {
						var obj = iframeList.get(i),
						r = tools.getAbs(obj),
						dragMask = $$("<div id='zTreeMask_" + i + "' class='zTreeMask' style='top:" + r[1] + "px; left:" + r[0] + "px; width:" + obj.offsetWidth + "px; height:" + obj.offsetHeight + "px;'></div>", setting);
						dragMask.appendTo($$("body", setting));
						root.dragMaskList.push(dragMask);
					}
				}
			}
		},
		//method of operate ztree dom
		_view = {
			addEditBtn: function(setting, node) {
				if (node.editNameFlag || $$(node, consts.id.EDIT, setting).length > 0) {
					return;
				}
				if (!tools.apply(setting.edit.showRenameBtn, [setting.treeId, node], setting.edit.showRenameBtn)) {
					return;
				}
				var aObj = $$(node, consts.id.A, setting),
				editStr = "<span class='" + consts.className.BUTTON + " edit' id='" + node.tId + consts.id.EDIT + "' title='"+tools.apply(setting.edit.renameTitle, [setting.treeId, node], setting.edit.renameTitle)+"' treeNode"+consts.id.EDIT+" style='display:none;'></span>";
				aObj.append(editStr);
	
				$$(node, consts.id.EDIT, setting).bind('click',
					function() {
						if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeEditName, [setting.treeId, node], true) == false) return false;
						view.editNode(setting, node);
						return false;
					}
					).show();
			},
			addRemoveBtn: function(setting, node) {
				if (node.editNameFlag || $$(node, consts.id.REMOVE, setting).length > 0) {
					return;
				}
				if (!tools.apply(setting.edit.showRemoveBtn, [setting.treeId, node], setting.edit.showRemoveBtn)) {
					return;
				}
				var aObj = $$(node, consts.id.A, setting),
				removeStr = "<span class='" + consts.className.BUTTON + " remove' id='" + node.tId + consts.id.REMOVE + "' title='"+tools.apply(setting.edit.removeTitle, [setting.treeId, node], setting.edit.removeTitle)+"' treeNode"+consts.id.REMOVE+" style='display:none;'></span>";
				aObj.append(removeStr);
	
				$$(node, consts.id.REMOVE, setting).bind('click',
					function() {
						if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return false;
						view.removeNode(setting, node);
						setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
						return false;
					}
					).bind('mousedown',
					function(eventMouseDown) {
						return true;
					}
					).show();
			},
			addHoverDom: function(setting, node) {
				if (data.getRoots().showHoverDom) {
					node.isHover = true;
					if (setting.edit.enable) {
						view.addEditBtn(setting, node);
						view.addRemoveBtn(setting, node);
					}
					tools.apply(setting.view.addHoverDom, [setting.treeId, node]);
				}
			},
			cancelCurEditNode: function (setting, forceName, isCancel) {
				var root = data.getRoot(setting),
				nameKey = setting.data.key.name,
				node = root.curEditNode;
	
				if (node) {
					var inputObj = root.curEditInput,
					newName = forceName ? forceName:(isCancel ? node[nameKey]: inputObj.val());
					if (tools.apply(setting.callback.beforeRename, [setting.treeId, node, newName, isCancel], true) === false) {
						return false;
					}
	                node[nameKey] = newName;
	                var aObj = $$(node, consts.id.A, setting);
					aObj.removeClass(consts.node.CURSELECTED_EDIT);
					inputObj.unbind();
					view.setNodeName(setting, node);
					node.editNameFlag = false;
					root.curEditNode = null;
					root.curEditInput = null;
					view.selectNode(setting, node, false);
	                setting.treeObj.trigger(consts.event.RENAME, [setting.treeId, node, isCancel]);
				}
				root.noSelection = true;
				return true;
			},
			editNode: function(setting, node) {
				var root = data.getRoot(setting);
				view.editNodeBlur = false;
				if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
					setTimeout(function() {tools.inputFocus(root.curEditInput);}, 0);
					return;
				}
				var nameKey = setting.data.key.name;
				node.editNameFlag = true;
				view.removeTreeDom(setting, node);
				view.cancelCurEditNode(setting);
				view.selectNode(setting, node, false);
				$$(node, consts.id.SPAN, setting).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");
				var inputObj = $$(node, consts.id.INPUT, setting);
				inputObj.attr("value", node[nameKey]);
				if (setting.edit.editNameSelectAll) {
					tools.inputSelect(inputObj);
				} else {
					tools.inputFocus(inputObj);
				}
	
				inputObj.bind('blur', function(event) {
					if (!view.editNodeBlur) {
						view.cancelCurEditNode(setting);
					}
				}).bind('keydown', function(event) {
					if (event.keyCode=="13") {
						view.editNodeBlur = true;
						view.cancelCurEditNode(setting);
					} else if (event.keyCode=="27") {
						view.cancelCurEditNode(setting, null, true);
					}
				}).bind('click', function(event) {
					return false;
				}).bind('dblclick', function(event) {
					return false;
				});
	
				$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED_EDIT);
				root.curEditInput = inputObj;
				root.noSelection = false;
				root.curEditNode = node;
			},
			moveNode: function(setting, targetNode, node, moveType, animateFlag, isSilent) {
				var root = data.getRoot(setting),
				childKey = setting.data.key.children;
				if (targetNode == node) return;
				if (setting.data.keep.leaf && targetNode && !targetNode.isParent && moveType == consts.move.TYPE_INNER) return;
				var oldParentNode = (node.parentTId ? node.getParentNode(): root),
				targetNodeIsRoot = (targetNode === null || targetNode == root);
				if (targetNodeIsRoot && targetNode === null) targetNode = root;
				if (targetNodeIsRoot) moveType = consts.move.TYPE_INNER;
				var targetParentNode = (targetNode.parentTId ? targetNode.getParentNode() : root);
	
				if (moveType != consts.move.TYPE_PREV && moveType != consts.move.TYPE_NEXT) {
					moveType = consts.move.TYPE_INNER;
				}
	
				if (moveType == consts.move.TYPE_INNER) {
					if (targetNodeIsRoot) {
						//parentTId of root node is null
						node.parentTId = null;
					} else {
						if (!targetNode.isParent) {
							targetNode.isParent = true;
							targetNode.open = !!targetNode.open;
							view.setNodeLineIcos(setting, targetNode);
						}
						node.parentTId = targetNode.tId;
					}
				}
	
				//move node Dom
				var targetObj, target_ulObj;
				if (targetNodeIsRoot) {
					targetObj = setting.treeObj;
					target_ulObj = targetObj;
				} else {
					if (!isSilent && moveType == consts.move.TYPE_INNER) {
						view.expandCollapseNode(setting, targetNode, true, false);
					} else if (!isSilent) {
						view.expandCollapseNode(setting, targetNode.getParentNode(), true, false);
					}
					targetObj = $$(targetNode, setting);
					target_ulObj = $$(targetNode, consts.id.UL, setting);
					if (!!targetObj.get(0) && !target_ulObj.get(0)) {
						var ulstr = [];
						view.makeUlHtml(setting, targetNode, ulstr, '');
						targetObj.append(ulstr.join(''));
					}
					target_ulObj = $$(targetNode, consts.id.UL, setting);
				}
				var nodeDom = $$(node, setting);
				if (!nodeDom.get(0)) {
					nodeDom = view.appendNodes(setting, node.level, [node], null, -1, false, true).join('');
				} else if (!targetObj.get(0)) {
					nodeDom.remove();
				}
				if (target_ulObj.get(0) && moveType == consts.move.TYPE_INNER) {
					target_ulObj.append(nodeDom);
				} else if (targetObj.get(0) && moveType == consts.move.TYPE_PREV) {
					targetObj.before(nodeDom);
				} else if (targetObj.get(0) && moveType == consts.move.TYPE_NEXT) {
					targetObj.after(nodeDom);
				}
	
				//repair the data after move
				var i,l,
				tmpSrcIndex = -1,
				tmpTargetIndex = 0,
				oldNeighbor = null,
				newNeighbor = null,
				oldLevel = node.level;
				if (node.isFirstNode) {
					tmpSrcIndex = 0;
					if (oldParentNode[childKey].length > 1 ) {
						oldNeighbor = oldParentNode[childKey][1];
						oldNeighbor.isFirstNode = true;
					}
				} else if (node.isLastNode) {
					tmpSrcIndex = oldParentNode[childKey].length -1;
					oldNeighbor = oldParentNode[childKey][tmpSrcIndex - 1];
					oldNeighbor.isLastNode = true;
				} else {
					for (i = 0, l = oldParentNode[childKey].length; i < l; i++) {
						if (oldParentNode[childKey][i].tId == node.tId) {
							tmpSrcIndex = i;
							break;
						}
					}
				}
				if (tmpSrcIndex >= 0) {
					oldParentNode[childKey].splice(tmpSrcIndex, 1);
				}
				if (moveType != consts.move.TYPE_INNER) {
					for (i = 0, l = targetParentNode[childKey].length; i < l; i++) {
						if (targetParentNode[childKey][i].tId == targetNode.tId) tmpTargetIndex = i;
					}
				}
				if (moveType == consts.move.TYPE_INNER) {
					if (!targetNode[childKey]) targetNode[childKey] = new Array();
					if (targetNode[childKey].length > 0) {
						newNeighbor = targetNode[childKey][targetNode[childKey].length - 1];
						newNeighbor.isLastNode = false;
					}
					targetNode[childKey].splice(targetNode[childKey].length, 0, node);
					node.isLastNode = true;
					node.isFirstNode = (targetNode[childKey].length == 1);
				} else if (targetNode.isFirstNode && moveType == consts.move.TYPE_PREV) {
					targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
					newNeighbor = targetNode;
					newNeighbor.isFirstNode = false;
					node.parentTId = targetNode.parentTId;
					node.isFirstNode = true;
					node.isLastNode = false;
	
				} else if (targetNode.isLastNode && moveType == consts.move.TYPE_NEXT) {
					targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
					newNeighbor = targetNode;
					newNeighbor.isLastNode = false;
					node.parentTId = targetNode.parentTId;
					node.isFirstNode = false;
					node.isLastNode = true;
	
				} else {
					if (moveType == consts.move.TYPE_PREV) {
						targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
					} else {
						targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
					}
					node.parentTId = targetNode.parentTId;
					node.isFirstNode = false;
					node.isLastNode = false;
				}
				data.fixPIdKeyValue(setting, node);
				data.setSonNodeLevel(setting, node.getParentNode(), node);
	
				//repair node what been moved
				view.setNodeLineIcos(setting, node);
				view.repairNodeLevelClass(setting, node, oldLevel)
	
				//repair node's old parentNode dom
				if (!setting.data.keep.parent && oldParentNode[childKey].length < 1) {
					//old parentNode has no child nodes
					oldParentNode.isParent = false;
					oldParentNode.open = false;
					var tmp_ulObj = $$(oldParentNode, consts.id.UL, setting),
					tmp_switchObj = $$(oldParentNode, consts.id.SWITCH, setting),
					tmp_icoObj = $$(oldParentNode, consts.id.ICON, setting);
					view.replaceSwitchClass(oldParentNode, tmp_switchObj, consts.folder.DOCU);
					view.replaceIcoClass(oldParentNode, tmp_icoObj, consts.folder.DOCU);
					tmp_ulObj.css("display", "none");
	
				} else if (oldNeighbor) {
					//old neigbor node
					view.setNodeLineIcos(setting, oldNeighbor);
				}
	
				//new neigbor node
				if (newNeighbor) {
					view.setNodeLineIcos(setting, newNeighbor);
				}
	
				//repair checkbox / radio
				if (!!setting.check && setting.check.enable && view.repairChkClass) {
					view.repairChkClass(setting, oldParentNode);
					view.repairParentChkClassWithSelf(setting, oldParentNode);
					if (oldParentNode != node.parent)
						view.repairParentChkClassWithSelf(setting, node);
				}
	
				//expand parents after move
				if (!isSilent) {
					view.expandCollapseParentNode(setting, node.getParentNode(), true, animateFlag);
				}
			},
			removeEditBtn: function(setting, node) {
				$$(node, consts.id.EDIT, setting).unbind().remove();
			},
			removeRemoveBtn: function(setting, node) {
				$$(node, consts.id.REMOVE, setting).unbind().remove();
			},
			removeTreeDom: function(setting, node) {
				node.isHover = false;
				view.removeEditBtn(setting, node);
				view.removeRemoveBtn(setting, node);
				tools.apply(setting.view.removeHoverDom, [setting.treeId, node]);
			},
			repairNodeLevelClass: function(setting, node, oldLevel) {
				if (oldLevel === node.level) return;
				var liObj = $$(node, setting),
				aObj = $$(node, consts.id.A, setting),
				ulObj = $$(node, consts.id.UL, setting),
				oldClass = consts.className.LEVEL + oldLevel,
				newClass = consts.className.LEVEL + node.level;
				liObj.removeClass(oldClass);
				liObj.addClass(newClass);
				aObj.removeClass(oldClass);
				aObj.addClass(newClass);
				ulObj.removeClass(oldClass);
				ulObj.addClass(newClass);
			},
			selectNodes : function(setting, nodes) {
				for (var i=0, l=nodes.length; i<l; i++) {
					view.selectNode(setting, nodes[i], i>0);
				}
			}
		},
	
		_z = {
			tools: _tools,
			view: _view,
			event: _event,
			data: _data
		};
		$.extend(true, $.fn.zTree.consts, _consts);
		$.extend(true, $.fn.zTree._z, _z);
	
		var zt = $.fn.zTree,
		tools = zt._z.tools,
		consts = zt.consts,
		view = zt._z.view,
		data = zt._z.data,
		event = zt._z.event,
		$$ = tools.$;
	
		data.exSetting(_setting);
		data.addInitBind(_bindEvent);
		data.addInitUnBind(_unbindEvent);
		data.addInitCache(_initCache);
		data.addInitNode(_initNode);
		data.addInitProxy(_eventProxy);
		data.addInitRoot(_initRoot);
		data.addZTreeTools(_zTreeTools);
	
		var _cancelPreSelectedNode = view.cancelPreSelectedNode;
		view.cancelPreSelectedNode = function (setting, node) {
			var list = data.getRoot(setting).curSelectedList;
			for (var i=0, j=list.length; i<j; i++) {
				if (!node || node === list[i]) {
					view.removeTreeDom(setting, list[i]);
					if (node) break;
				}
			}
			if (_cancelPreSelectedNode) _cancelPreSelectedNode.apply(view, arguments);
		}
	
		var _createNodes = view.createNodes;
		view.createNodes = function(setting, level, nodes, parentNode, index) {
			if (_createNodes) {
				_createNodes.apply(view, arguments);
			}
			if (!nodes) return;
			if (view.repairParentChkClassWithSelf) {
				view.repairParentChkClassWithSelf(setting, parentNode);
			}
		}
	
		var _makeNodeUrl = view.makeNodeUrl;
		view.makeNodeUrl = function(setting, node) {
			return setting.edit.enable ? null : (_makeNodeUrl.apply(view, arguments));
		}
	
		var _removeNode = view.removeNode;
		view.removeNode = function(setting, node) {
			var root = data.getRoot(setting);
			if (root.curEditNode === node) root.curEditNode = null;
			if (_removeNode) {
				_removeNode.apply(view, arguments);
			}
		}
	
		var _selectNode = view.selectNode;
		view.selectNode = function(setting, node, addFlag) {
			var root = data.getRoot(setting);
			if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
				return false;
			}
			if (_selectNode) _selectNode.apply(view, arguments);
			view.addHoverDom(setting, node);
			return true;
		}
	
		var _uCanDo = tools.uCanDo;
		tools.uCanDo = function(setting, e) {
			var root = data.getRoot(setting);
			if (e && (tools.eqs(e.type, "mouseover") || tools.eqs(e.type, "mouseout") || tools.eqs(e.type, "mousedown") || tools.eqs(e.type, "mouseup"))) {
				return true;
			}
			if (root.curEditNode) {
				view.editNodeBlur = false;
				root.curEditInput.focus();
			}
			return (!root.curEditNode) && (_uCanDo ? _uCanDo.apply(view, arguments) : true);
		}
	})(jQuery);


/***/ }),
/* 39 */
/*!*******************************!*\
  !*** ./js/dashboard/modal.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _vue = __webpack_require__(/*! vue */ 19);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	__webpack_require__(/*! css/dragula.css */ 13);
	
	var _modal = __webpack_require__(/*! vueModel/modal.vue */ 23);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	var _underscore = __webpack_require__(/*! underscore */ 18);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _dashboard = __webpack_require__(/*! ./dashboard */ 33);
	
	var _dashboard2 = _interopRequireDefault(_dashboard);
	
	var _ztree = __webpack_require__(/*! ztree */ 38);
	
	var _ztree2 = _interopRequireDefault(_ztree);
	
	var _constans = __webpack_require__(/*! util/constans */ 31);
	
	var _constans2 = _interopRequireDefault(_constans);
	
	var _utils = __webpack_require__(/*! util/utils */ 26);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Modal = function () {
	  _createClass(Modal, null, [{
	    key: 'getModalInst',
	    value: function getModalInst(param) {
	
	      Modal.tabId = param.tabId;
	
	      if (_underscore2.default.isEmpty(Modal.modalInst)) {
	        Modal.modalInst = new _vue2.default({
	          el: '#modalBox',
	          data: { tabId: param.tabId, pTarget: param.pTarget, pmodalstitle: { name: '', id: '' } },
	          components: {
	            modalDialog: _modal2.default
	          },
	          ready: function ready() {},
	
	          events: {
	            popupButtonRight: function popupButtonRight(selectData) {
	              var treeObj = $.fn.zTree.getZTreeObj('menuTree');
	              var nodes = treeObj.getCheckedNodes(true);
	              var newNodes = [];
	
	              if (selectData.length > '0') {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;
	
	                try {
	                  for (var _iterator = selectData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var selectNodes = _step.value;
	
	                    newNodes.push({ link: selectNodes.link, name: selectNodes.name, linkId: selectNodes.linkId });
	                  }
	                } catch (err) {
	                  _didIteratorError = true;
	                  _iteratorError = err;
	                } finally {
	                  try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                      _iterator.return();
	                    }
	                  } finally {
	                    if (_didIteratorError) {
	                      throw _iteratorError;
	                    }
	                  }
	                }
	              }
	
	              var _iteratorNormalCompletion2 = true;
	              var _didIteratorError2 = false;
	              var _iteratorError2 = undefined;
	
	              try {
	                var _loop = function _loop() {
	                  var sNodes = _step2.value;
	
	                  if (!sNodes.isParent) {
	                    var flag = true;
	                    if (selectData.length > 0) {
	                      $.each(selectData, function (index, selectNode) {
	                        if (sNodes.id == selectNode.linkId) {
	                          flag = false;
	                          return;
	                        };
	                      });
	                    }
	
	                    if (flag) {
	                      newNodes.push({ link: sNodes.link, name: sNodes.name, linkId: sNodes.id });
	                    }
	                  }
	                };
	
	                for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                  _loop();
	                }
	              } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                  }
	                } finally {
	                  if (_didIteratorError2) {
	                    throw _iteratorError2;
	                  }
	                }
	              }
	
	              this.$set('modals', newNodes);
	            },
	            setModalMeg: function setModalMeg(dataModal) {
	              if (!dataModal.title.name) {
	                alert('请输入模块名称！');
	                this.$el.querySelector('.popup_input').focus();
	                return;
	              }
	              if (!dataModal.list || dataModal.list.length == '0') {
	                alert('请选择需要添加的菜单！');
	                return;
	              }
	
	              //新增
	              if (!dataModal.title.id) {
	
	                //设置添加在左边或右边
	                var LorR = '';
	                if (this.pTarget.$get('prightLinks').length < this.pTarget.$get('pleftLinks').length) {
	                  LorR = 'R';
	                } else {
	                  LorR = 'L';
	                }
	                var linkData = [];
	                $.each(dataModal.list, function (index, item) {
	                  linkData.push({ LINK_NAME: item.name, LINK_URL: item.link, CLS_TYPE: '' });
	                });
	
	                var setData = { TAB_ID: this.tabId, BOX_NAME: dataModal.title.name, POSITION: LorR, CLS_TYPE: '', LINKS: _utils2.default.toJSON(linkData) };
	
	                // homepage_insert_boxAndLinks
	                //kjdpAjax.post({
	                //  req: $.extend({
	                //    service: 'homepage_insert_boxAndLinks'
	                //
	                //  },setData)
	                //}).then((data,head,meg) => {
	                //  //data[0][0].id
	                //  if(!_.isUndefined(Modal.success)){
	                //  Modal.success.call(Modal.scope,data[0][0].ID);
	                //}
	                //});
	              } else {
	                  //修改
	                  //没有级联修改的API
	
	
	                }
	            },
	            cancelModal: function cancelModal() {
	
	              // this.$destroy();
	            },
	            onReset: function onReset() {
	              var dataReset = [];
	              this.$set('modals', dataReset);
	              var treeObj = $.fn.zTree.getZTreeObj('menuTree');
	              treeObj.checkAllNodes(false);
	            }
	          }
	        });
	        return Modal.modalInst;
	      } else {
	        //CALL AJAX
	
	
	        Modal.modalInst.$set('tabId', param.tabId);
	        return Modal.modalInst;
	      }
	    }
	  }]);
	
	  function Modal(targId, tabId, pTarget) {
	    _classCallCheck(this, Modal);
	
	    _underscore2.default.extend(this, { targId: targId, tabId: tabId, pTarget: pTarget });
	    this.initModal();
	  }
	
	  _createClass(Modal, [{
	    key: 'initModal',
	    value: function initModal(param, data) {}
	  }, {
	    key: 'vueStrap',
	    value: function vueStrap() {
	      // :TODO
	    }
	  }], [{
	    key: 'showModal',
	    value: function showModal(param) {
	      Modal.modalInst.$children[0].$set('menuTree', []);
	      Modal.modalInst.$children[0].$set('modalstitle', { name: '', id: '' });
	      setTimeout(function () {
	        var treeObj = $.fn.zTree.getZTreeObj('menuTree');
	        if (!_underscore2.default.isEmpty(treeObj)) {
	          //checkAllNodes不会触发事件回调
	          treeObj.checkAllNodes(false);
	          treeObj.expandAll(false);
	        }
	        if (param.InitData) {
	          //初始化标题
	          Modal.modalInst.$children[0].$set('modalstitle', { name: param.InitData.boxName, id: param.InitData.boxId });
	          //初始化节点树
	          $.each(param.InitData.menuLink, function (index, linkItem) {
	            var node = treeObj.getNodeByParam("link", linkItem.LINK_URL, null);
	            treeObj.checkNode(node, true, true, true);
	          });
	        }
	
	        $('#boxItemWindow').modal('show');
	
	        _underscore2.default.extend(Modal, param);
	      }, 500);
	    }
	  }]);
	
	  return Modal;
	}();
	
	Modal.modalInst = {};
	exports.default = Modal;

/***/ }),
/* 40 */
/*!************************************!*\
  !*** ./js/dashboard/favourMenu.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _underscore = __webpack_require__(/*! underscore */ 18);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _vue = __webpack_require__(/*! vue */ 19);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _favourMenu = __webpack_require__(/*! vueModel/favourMenu.vue */ 41);
	
	var _favourMenu2 = _interopRequireDefault(_favourMenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FavourMenu = function () {
		function FavourMenu() {
			_classCallCheck(this, FavourMenu);
		}
	
		_createClass(FavourMenu, [{
			key: "initMenu",
			value: function initMenu() {
				var me = this;
				this.inst = new _vue2.default({
					el: '#favourMenu',
					components: {
						favourMenu: _favourMenu2.default
					},
					ready: function ready() {
						var that = this;
						//模拟AJAX
						setTimeout(function () {
							var testData = [{ menuName: "test11", menuId: "112233", url: 'test/test/test.html' }, { menuName: "test11", menuId: "112233", url: 'test/test/test.html' }, { menuName: "test11", menuId: "112233", url: 'test/test/test.html' }, { menuName: "test11", menuId: "112233", url: 'test/test/test.html' }];
							that.$set('pfavourlist', testData);
						}, 500);
					},
	
					events: {},
					data: function data() {
						return {
							pfavourlist: { boardId: 'testid', menuName: 'test222' }
						};
					}
				});
			}
		}]);
	
		return FavourMenu;
	}();
	
	exports.default = FavourMenu;

/***/ }),
/* 41 */
/*!************************************!*\
  !*** ./js/vueModel/favourMenu.vue ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(/*! -!babel-loader?presets[]=es2015&plugins[]=transform-runtime!../../~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./favourMenu.vue */ 42)
	__vue_template__ = __webpack_require__(/*! -!html-loader!../../~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./favourMenu.vue */ 43)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\worklink\\new-home-page\\js\\vueModel\\favourMenu.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 42 */
/*!***********************************************************************************************************************************************************************!*\
  !*** ./~/.6.4.1@babel-loader/lib?presets[]=es2015&plugins[]=transform-runtime!./~/.7.5.3@vue-loader/lib/selector.js?type=script&index=0!./js/vueModel/favourMenu.vue ***!
  \***********************************************************************************************************************************************************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <script>
	exports.default = {
		props: ['favourlist'],
		methods: {
			forwardMenu: function forwardMenu(url, urlId) {
				this.$dispatch('onMenuClick', { boardId: boardId });
			}
		}
	};
	// </script>
	// <template>
	// <div class="hmain_common_bt"><a href="#"></a><span>常用菜单</span></div>
	// <ul>
	// 	<li class="hbutton_red" v-for="menu in favourlist" ><a href="{{menu.url}}" v-on:click="forwardMenu(menu.url,menu.menuId)">{{menu.menuName}}</a></li>
	// </ul>
	// </template>
	/* generated by vue-loader */

/***/ }),
/* 43 */
/*!***********************************************************************************************************************!*\
  !*** ./~/.0.3.0@html-loader!./~/.7.5.3@vue-loader/lib/selector.js?type=template&index=0!./js/vueModel/favourMenu.vue ***!
  \***********************************************************************************************************************/
/***/ (function(module, exports) {

	module.exports = "\r\n<div class=\"hmain_common_bt\"><a href=\"#\"></a><span>常用菜单</span></div>\r\n<ul>\r\n\t<li class=\"hbutton_red\" v-for=\"menu in favourlist\" ><a href=\"{{menu.url}}\" v-on:click=\"forwardMenu(menu.url,menu.menuId)\">{{menu.menuName}}</a></li>\r\n</ul>\r\n";

/***/ })
/******/ ]);
//# sourceMappingURL=dashboard.js.map
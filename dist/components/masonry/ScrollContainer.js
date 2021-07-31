"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getScrollContainer(scrollContainer) {
  return typeof scrollContainer === 'function' ? scrollContainer() : scrollContainer;
}

class ScrollContainer extends _react.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "scrollContainer", void 0);

    _defineProperty(this, "getScrollContainerRef", () => this.scrollContainer);

    _defineProperty(this, "handleScroll", event => {
      this.props.onScroll(event);
    });
  }

  componentDidMount() {
    const scrollContainer = getScrollContainer(this.props.scrollContainer);

    if (scrollContainer) {
      this.updateScrollContainer(scrollContainer);
    }
  }

  componentDidUpdate() {
    const nextScrollContainer = getScrollContainer(this.props.scrollContainer);

    if (nextScrollContainer && nextScrollContainer !== this.scrollContainer) {
      this.updateScrollContainer(nextScrollContainer);
    }
  }

  componentWillUnmount() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    }
  }

  updateScrollContainer(scrollContainer) {
    if (this.scrollContainer) {
      // cleanup existing scroll container if it exists
      this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    }

    this.scrollContainer = scrollContainer;
    this.scrollContainer.addEventListener('scroll', this.handleScroll);
  }

  render() {
    return _react.Children.only(this.props.children);
  }

}

exports.default = ScrollContainer;

_defineProperty(ScrollContainer, "propTypes", {
  children: _propTypes.default.node.isRequired,
  onScroll: _propTypes.default.func.isRequired,
  scrollContainer: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]).isRequired
});
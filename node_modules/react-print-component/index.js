"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./Print.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PrintWarpper = function (_Component) {
    _inherits(PrintWarpper, _Component);

    function PrintWarpper(props) {
        _classCallCheck(this, PrintWarpper);

        var _this = _possibleConstructorReturn(this, (PrintWarpper.__proto__ || Object.getPrototypeOf(PrintWarpper)).call(this, props));

        _this.state = {
            component: props.component
        };
        return _this;
    }

    _createClass(PrintWarpper, [{
        key: "render",
        value: function render() {
            return this.state.component;
        }
    }]);

    return PrintWarpper;
}(_react.Component);

var PrintComponent = function (_Component2) {
    _inherits(PrintComponent, _Component2);

    function PrintComponent(props) {
        _classCallCheck(this, PrintComponent);

        var _this2 = _possibleConstructorReturn(this, (PrintComponent.__proto__ || Object.getPrototypeOf(PrintComponent)).call(this, props));

        if (PrintComponent.Instance) {
            throw "Can and only have one <Print /> element";
        }
        _this2.generateClassName = _this2.generateClassName.bind(_this2);
        PrintComponent.Instance = _this2;

        _this2.state = {
            component: props.component,
            print: false,
            singlePage: props.singlePage
        };
        return _this2;
    }
    /**
     * @type {PrintComponent}
     */


    _createClass(PrintComponent, [{
        key: "generateClassName",
        value: function generateClassName() {
            var print = this.state.print ? "react-print-print " : "react-print-hidden ";
            var page = this.state.singlePage ? "react-print-single" : "react-print-multi";
            return print + page;
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                {
                    className: this.generateClassName() },
                this.state.component ? this.state.component : false
            );
        }
    }], [{
        key: "SetPrintContent",
        value: function SetPrintContent(component) {
            var xs = [];
            var x = _react2.default.createElement(PrintWarpper, { component: component });
            xs.push(x);
            PrintComponent.Instance.setState({
                component: xs
            });
        }
    }, {
        key: "AddPrintContent",
        value: function AddPrintContent(component) {
            var xs = PrintComponent.Instance.state.component;
            if (!xs) xs = [];
            var x = _react2.default.createElement(PrintWarpper, { component: component });
            xs.push(x);
            PrintComponent.Instance.setState({ component: xs });
        }
    }, {
        key: "GetPrintComponent",
        value: function GetPrintComponent() {
            return PrintComponent.Instance.state.component;
        }
    }, {
        key: "ClearComponent",
        value: function ClearComponent() {

            PrintComponent.Instance.setState({ component: [] });
        }
    }, {
        key: "Print",
        value: function Print() {
            PrintComponent.Instance.setState({
                print: true
            });
            PrintComponent.Instance.forceUpdate();
            setTimeout(function () {
                window.print();
                PrintComponent.Instance.setState({
                    print: false
                });
                PrintComponent.Instance.forceUpdate();
            }, 1000);
        }
    }]);

    return PrintComponent;
}(_react.Component);

exports.default = PrintComponent;
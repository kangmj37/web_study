define(["require", "exports"], function (require, exports) {
    "use strict";
    var OPER_ENUM;
    (function (OPER_ENUM) {
        OPER_ENUM[OPER_ENUM["_OPERATION"] = 0] = "_OPERATION";
        OPER_ENUM[OPER_ENUM["_OPERATOR"] = 1] = "_OPERATOR";
        OPER_ENUM[OPER_ENUM["_MAX"] = 2] = "_MAX";
    })(OPER_ENUM || (OPER_ENUM = {}));
    function CreateOperationObj(val) {
        return {
            type: OPER_ENUM._OPERATION,
            value: val,
            action: function (target) { return (target.length > 0 && target.charAt(target.length - 1) == ')' ? target : target + val); }
        };
    }
    exports.oper_zero = CreateOperationObj('0');
    exports.oper_one = CreateOperationObj('1');
    exports.oper_two = CreateOperationObj('2');
    exports.oper_three = CreateOperationObj('3');
    exports.oper_four = CreateOperationObj('4');
    exports.oper_five = CreateOperationObj('5');
    exports.oper_six = CreateOperationObj('6');
    exports.oper_seven = CreateOperationObj('7');
    exports.oper_eight = CreateOperationObj('8');
    exports.oper_nine = CreateOperationObj('9');
    exports.oper_dot = CreateOperationObj('.');
    exports.oper_dot.action = function (target) {
        var i, len = target.length;
        var c, last_c;
        if (len == 0)
            return '0.';
        last_c = target.charAt(len - 1);
        if (last_c == ')' || last_c == '.')
            return target;
        for (i = len - 1; i >= 0; i--) {
            c = target.charAt(i);
            if (isNaN(Number(c))) {
                if (c == '.')
                    return target; // XX.XX
                break;
            }
        }
        if (isNaN(Number(last_c)))
            return target + "0.";
        return target + ".";
    };
    exports.oper_negative = CreateOperationObj('+/-');
    exports.oper_negative.action = function (target) {
        var i, len = target.length;
        var c;
        if (len == 0)
            return '(-';
        else if (target.charAt(len - 1) == ')')
            return target;
        // get last digit idx
        for (i = len; i > 0; i--) {
            c = target.charAt(i - 1);
            if (isNaN(Number(c)) && c != '.')
                break; // not number
        }
        if (i > 1) {
            if (target.charAt(i - 1) == '-' && target.charAt(i - 2) == '(')
                return target.substring(0, i - 2) + target.substring(i, len);
        }
        return target.substring(0, i) + '(-' + target.substring(i, len);
    };
    function CreateOperatorObj(val) {
        return {
            type: OPER_ENUM._OPERATOR,
            value: val,
            action: function (target) {
                var len = target.length, c;
                if (len == 0)
                    return target;
                c = target.charAt(len - 1);
                if (c == '+' || c == '%' || c == '/' || c == 'x' || (c == '-' && !(len > 1 && target.charAt(len - 2) == '(')) ||
                    c == '(')
                    return target;
                return target + val;
            }
        };
    }
    exports.oper_remain = CreateOperatorObj('%');
    exports.oper_plus = CreateOperatorObj('+');
    exports.oper_minus = CreateOperatorObj('-');
    exports.oper_multi = CreateOperatorObj('x');
    exports.oper_div = CreateOperatorObj('/');
    exports.oper_cancel = CreateOperatorObj('C');
    exports.oper_cancel.action = function (target) { return (''); };
    exports.oper_del = CreateOperatorObj('->');
    exports.oper_del.action = function (target) { return (target.length > 0 ? target.substring(0, target.length - 1) : ''); };
    exports.oper_parenthesis = CreateOperatorObj('( )');
    exports.oper_parenthesis.action = function (target) {
        var i, len = target.length, cnt1 = 0, cnt2 = 0;
        var c;
        if (len == 0)
            return '(';
        c = target.charAt(len - 1);
        if (c == '+' || c == '%' || c == '/' || c == 'x' || (c == '-' && !(len > 1 && target.charAt(len - 2) == '(')) ||
            c == '(')
            return target + '(';
        for (i = 0; i < len; i++) {
            c = target.charAt(i);
            if (c == '(')
                cnt1++;
            else if (c == ')')
                cnt2++;
        }
        if (cnt1 > cnt2)
            return target + ')';
        return target;
    };
    //function Operate_number<T extends OPER_NUMBER>():
    var CalculatorView = (function () {
        function CalculatorView() {
            var i;
            this._action = new Array(OPER_ENUM._MAX);
            for (i = 0; i < OPER_ENUM._MAX; i++)
                this._action[i] = new Array();
            this._Init();
        }
        CalculatorView.prototype._Init = function () {
            this._display_value = "";
        };
        CalculatorView.prototype.AddAction = function (oper) {
            var i = 0;
            for (; i < this._action[oper.type].length; i++) {
                var instance = this._action[oper.type][i];
                if (instance.value == oper.value)
                    break;
            }
            if (i < this._action[oper.type].length)
                return;
            this._action[oper.type][i] = oper;
        };
        CalculatorView.prototype._RunAction = function (value, oper) {
            var i = 0, _act = this._action[oper];
            for (; i < _act.length; i++) {
                if (_act[i].value == value) {
                    this._display_value = _act[i].action(this._display_value);
                    break;
                }
            }
        };
        CalculatorView.prototype.AddNumber = function (value) {
            this._RunAction(value, OPER_ENUM._OPERATION);
        };
        CalculatorView.prototype.AddOperator = function (value) {
            this._RunAction(value, OPER_ENUM._OPERATOR);
        };
        Object.defineProperty(CalculatorView.prototype, "display_name", {
            get: function () {
                return this._display_value;
            },
            enumerable: true,
            configurable: true
        });
        return CalculatorView;
    }());
    exports.CalculatorView = CalculatorView;
});

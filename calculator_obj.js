define(["require", "exports", "./calculator_view", "./calculator_eval"], function (require, exports, view_m, eval_m) {
    "use strict";
    var cal_obj;
    var _exports = (function () {
        function _exports(target) {
            var _this = this;
            this.add_number = function (value) {
                var display_output;
                var element = _this._target;
                _this._view_obj.AddNumber(value);
                display_output = _this._view_obj.display_name;
                element.value = display_output;
            };
            this.add_operator = function (value) {
                var display_output;
                var element = _this._target;
                _this._view_obj.AddOperator(value);
                display_output = _this._view_obj.display_name;
                element.value = display_output;
            };
            this.run_eval = function () {
                var element = _this._target;
                var ret;
                ret = _this._eval_obj.CalEval(element.value, eval_m.CAL_EVAL._ALL);
                if (ret == 'error') {
                    alert('invalid expression.');
                    return;
                }
                element.value = ret.toString();
            };
            this._view_obj = new view_m.CalculatorView();
            this._eval_obj = new eval_m.CalculatorEval();
            this._view_obj.AddAction(view_m.oper_zero);
            this._view_obj.AddAction(view_m.oper_one);
            this._view_obj.AddAction(view_m.oper_two);
            this._view_obj.AddAction(view_m.oper_three);
            this._view_obj.AddAction(view_m.oper_four);
            this._view_obj.AddAction(view_m.oper_five);
            this._view_obj.AddAction(view_m.oper_six);
            this._view_obj.AddAction(view_m.oper_seven);
            this._view_obj.AddAction(view_m.oper_eight);
            this._view_obj.AddAction(view_m.oper_nine);
            this._view_obj.AddAction(view_m.oper_dot);
            this._view_obj.AddAction(view_m.oper_negative);
            this._view_obj.AddAction(view_m.oper_cancel);
            this._view_obj.AddAction(view_m.oper_del);
            this._view_obj.AddAction(view_m.oper_parenthesis);
            this._view_obj.AddAction(view_m.oper_plus);
            this._view_obj.AddAction(view_m.oper_minus);
            this._view_obj.AddAction(view_m.oper_multi);
            this._view_obj.AddAction(view_m.oper_div);
            this._view_obj.AddAction(view_m.oper_remain);
            this._target = target;
        }
        return _exports;
    }());
    var element = document.getElementById("output");
    cal_obj = new _exports(element);
    var i;
    var cal_nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+/-"];
    for (i = 0; i < cal_nums.length; i++) {
        var _func_1 = (function (value, obj) {
            var _func = function () {
                obj.add_number(value);
            };
            return _func;
        }(cal_nums[i], cal_obj));
        document.getElementById(cal_nums[i]).addEventListener("click", _func_1);
    }
    var cal_operators = ["C", "->", "( )", "+", "-", "x", "/", "%"];
    for (i = 0; i < cal_operators.length; i++) {
        var _func_2 = (function (value, obj) {
            var _func = function () {
                obj.add_operator(value);
            };
            return _func;
        }(cal_operators[i], cal_obj));
        document.getElementById(cal_operators[i]).addEventListener("click", _func_2);
    }
    var _func = (function (obj) {
        var _func = function () {
            obj.run_eval();
        };
        return _func;
    }(cal_obj));
    document.getElementById("=").addEventListener("click", _func);
});

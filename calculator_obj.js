define(["require", "exports", "./calculator_view", "./calculator_eval"], function (require, exports, view_m, eval_m) {
    "use strict";
    //import * as view_m from "./calculator_view";
    //import * as eval_m from "./calculator_eval";
    var _exports = (function () {
        function _exports() {
            var _this = this;
            this.add_number = function (value) {
                var display_output;
                var element = document.getElementById("output");
                _this.view_obj.AddNumber(value);
                display_output = _this.view_obj.display_name;
                element.value = display_output;
            };
            this.add_operator = function (value) {
                var display_output;
                var element = document.getElementById("output");
                _this.view_obj.AddOperator(value);
                display_output = _this.view_obj.display_name;
                element.value = display_output;
            };
            this.run_eval = function () {
                var element = document.getElementById("output");
                var ret;
                ret = _this.eval_obj.CalEval(element.value, eval_m.CAL_EVAL._ALL);
                if (ret == 'error') {
                    alert('invalid expression.');
                    return;
                }
                element.value = ret.toString();
            };
            this.view_obj.AddAction(view_m.oper_zero);
            this.view_obj.AddAction(view_m.oper_one);
            this.view_obj.AddAction(view_m.oper_two);
            this.view_obj.AddAction(view_m.oper_three);
            this.view_obj.AddAction(view_m.oper_four);
            this.view_obj.AddAction(view_m.oper_five);
            this.view_obj.AddAction(view_m.oper_six);
            this.view_obj.AddAction(view_m.oper_seven);
            this.view_obj.AddAction(view_m.oper_eight);
            this.view_obj.AddAction(view_m.oper_nine);
            this.view_obj.AddAction(view_m.oper_dot);
            this.view_obj.AddAction(view_m.oper_negative);
            this.view_obj.AddAction(view_m.oper_cancel);
            this.view_obj.AddAction(view_m.oper_del);
            this.view_obj.AddAction(view_m.oper_parenthesis);
            this.view_obj.AddAction(view_m.oper_plus);
            this.view_obj.AddAction(view_m.oper_minus);
            this.view_obj.AddAction(view_m.oper_multi);
            this.view_obj.AddAction(view_m.oper_div);
            this.view_obj.AddAction(view_m.oper_remain);
        }
        return _exports;
    }());
    var cal_obj = new _exports();
    return cal_obj;
});


let cal_obj;

//import view_m = require("./calculator_view");
//import eval_m = require("./calculator_eval");
import * as view_m from "./calculator_view";
import * as eval_m from "./calculator_eval";

class _exports {
    private _target: HTMLInputElement;
	private _view_obj: view_m.CalculatorView;
	private _eval_obj: eval_m.CalculatorEval;

	constructor(target: HTMLInputElement) {
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

    add_number = (value: string): any => {
        let display_output: string;
        let element = this._target;

        this._view_obj.AddNumber(value);
        display_output = this._view_obj.display_name;

        element.value = display_output;
    }

    add_operator = (value: string): any => {
        let display_output: string;
        let element = this._target;

        this._view_obj.AddOperator(value);
        display_output = this._view_obj.display_name;

        element.value = display_output;
    }

    run_eval = (): any => {
        let element = this._target;
        let ret: number | string;

        ret = this._eval_obj.CalEval(element.value, eval_m.CAL_EVAL._ALL);
        if (ret == 'error') {
            alert('invalid expression.');
            return;
        }
        element.value = ret.toString();
    }
}

let element = <HTMLInputElement>document.getElementById("output");
cal_obj = new _exports(element);
let i: number;
let cal_nums: string[] = ["0","1","2","3","4","5","6","7","8","9",".","+/-"];
for (i = 0; i < cal_nums.length; i++) {
    let _func = (function(value, obj) {
        let _func = (): void => {
            obj.add_number(value);
        }
        return _func;
    }(cal_nums[i], cal_obj));
    document.getElementById(cal_nums[i]).addEventListener("click", _func)
}

let cal_operators: string[] = ["C","->","( )","+","-","x","/","%"];
for (i = 0; i < cal_operators.length; i++) {
    let _func = (function(value, obj) {
        let _func = (): void => {
            obj.add_operator(value);
        }
        return _func;
    }(cal_operators[i], cal_obj));
    document.getElementById(cal_operators[i]).addEventListener("click", _func)
}

let _func = (function(obj) {
    let _func = (): void => {
        obj.run_eval();
    }
    return _func;
}(cal_obj));
document.getElementById("=").addEventListener("click", _func)
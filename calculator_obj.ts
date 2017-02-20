import view_m = require("./calculator_view");
import eval_m = require("./calculator_eval");
//import * as view_m from "./calculator_view";
//import * as eval_m from "./calculator_eval";

class _exports {
    private _target: HTMLInputElement;
	private _view_obj: view_m.CalculatorView;
	private _eval_obj: eval_m.CalculatorEval;

	constructor(target: HTMLInputElement) {
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

    private _add_number = (value: string): any => {
        let display_output: string;
        let element = this._target;

        this._view_obj.AddNumber(value);
        display_output = this._view_obj.display_name;

        element.value = display_output;
    }

    private _add_operator = (value: string): any => {
        let display_output: string;
        let element = this._target;

        this._view_obj.AddOperator(value);
        display_output = this._view_obj.display_name;

        element.value = display_output;
    }

    private _run_eval = (): any => {
        let element = this._target;
        let ret: number | string;

        ret = this._eval_obj.CalEval(element.value, eval_m.CAL_EVAL._ALL);
        if (ret == 'error') {
            alert('invalid expression.');
            return;
        }
        element.value = ret.toString();
    }

    add_number_event = (value: string[]): void => {
        for (let i = 0; i < value.length; i++)
            document.getElementById(value[i]).onclick = (function(value:string) {
                return this._add_number(value[i]);
            )(value[i])};
    }

    add_operator_event = (value: string[]): void =>{
        for (let i = 0; i < value.length; i++)
            document.getElementById(value[i]).onclick = this._add_operator(value[i]);
    }
    
    add_eval_event = (value: string[]): void => {
        for (let i = 0; i < value.length; i++)
            document.getElementById(value[i]).onclick = this._run_eval(value[i]);
    }
}

let element = <HTMLInputElement>document.getElementById("output");
let cal_obj = new _exports(element);


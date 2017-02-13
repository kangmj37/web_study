import view_m = require("./calculator_view");
import eval_m = require("./calculator_eval");

let view_obj = new view_m.CalculatorView();
let eval_obj = new eval_m.CalculatorEval();

view_obj.AddAction(view_m.oper_zero);
view_obj.AddAction(view_m.oper_one);
view_obj.AddAction(view_m.oper_two);
view_obj.AddAction(view_m.oper_three);
view_obj.AddAction(view_m.oper_four);
view_obj.AddAction(view_m.oper_five);
view_obj.AddAction(view_m.oper_six);
view_obj.AddAction(view_m.oper_seven);
view_obj.AddAction(view_m.oper_eight);
view_obj.AddAction(view_m.oper_nine);
view_obj.AddAction(view_m.oper_dot);
view_obj.AddAction(view_m.oper_negative);

view_obj.AddAction(view_m.oper_cancel);
view_obj.AddAction(view_m.oper_del);
view_obj.AddAction(view_m.oper_parenthesis);
view_obj.AddAction(view_m.oper_plus);
view_obj.AddAction(view_m.oper_minus);
view_obj.AddAction(view_m.oper_multi);
view_obj.AddAction(view_m.oper_div);
view_obj.AddAction(view_m.oper_remain);

function add_number(value: string): void {
	let display_output: string;
	let element = document.getElementById("output");
    
	view_obj.AddNumber(value);
    display_output = view_obj.display_name;

	element.value = display_output;
}

function add_operator(value: string): void {
	let display_output: string;
	let element = document.getElementById("output");
    
	view_obj.AddOperator(value);
    display_output = view_obj.display_name;

	element.value = display_output;
}

function run_eval(): void {
	let element = document.getElementById("output");
    let ret: number | string;

	ret = eval_obj.CalEval(element.value, eval_obj.CAL_EVAL._ALL);	
    if (ret == 'error') {
	    alert('invalid expression.');
		return;
	}
    element.value = ret;
}

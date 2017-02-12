interface CalStrCombination {
    (target:string): string;
}

enum OPER_ENUM {
    _OPERATION,
    _OPERATOR,
    _MAX
}

type OPER_TYPE<T extends string, U extends OPER_ENUM> = {
    type: U,
    value: T,
    action: CalStrCombination
}
type OPER_ALL = OPER_TYPE<string, OPER_ENUM>;

function CreateOperationObj<T extends string>(val:T): OPER_TYPE<T,OPER_ENUM._OPERATION> {
    return {
        type: OPER_ENUM._OPERATION, 
        value: val,
        action: (target:string): string => (target.length > 0 && target.charAt(target.length - 1) == ')' ? target : target + val)
    };
}
let oper_zero = CreateOperationObj<'0'>('0');
let oper_one = CreateOperationObj<'1'>('1');
let oper_two = CreateOperationObj<'2'>('2');
let oper_three = CreateOperationObj<'3'>('3');
let oper_four = CreateOperationObj<'4'>('4');
let oper_five = CreateOperationObj<'5'>('5');
let oper_six = CreateOperationObj<'6'>('6');
let oper_seven = CreateOperationObj<'7'>('7');
let oper_eight = CreateOperationObj<'8'>('8');
let oper_nine = CreateOperationObj<'9'>('9');
let oper_dot = CreateOperationObj<'.'>('.');
oper_dot.action = (target:string):string => {
    let i: number, len = target.length;
    let c: string, last_c: string;
 
    if (len == 0)
        return '0.';

    last_c = target.charAt(len - 1);
    if (last_c == ')' || last_c == '.')     
        return target;
    
    for (i = len - 1; i >= 0; i--) {
        c = target.charAt(i);
        if (isNaN(c)) {
            if (c == '.')
                return target;  // XX.XX
            break;
        }
    }

    if (isNaN(last_c))
        return target + "0.";

    return target + ".";
}
let oper_negative = CreateOperationObj<'+/-'>('+/-');
oper_negative.action = (target:string):string => {
    let i: number, len = target.length;
    let c: string;

    if (len == 0)
        return '(-';
    else if (target.charAt(len - 1) == ')')
        return target;

    // get last digit idx
    for (i = len; i > 0; i--) {
        c = target.charAt(i - 1);
        if (isNaN(c) && c != '.')
            break;  // not number
    }
    if (i > 1) {
        if (target.charAt(i - 1) == '-' && target.charAt(i - 2) == '(')
            return target.substring(0, i - 2) + target.substring(i, len);
    }

    return target.substring(0, i) + '(-' + target.substring(i, len);
}

function CreateOperatorObj<T extends string>(val:T): OPER_TYPE<T,OPER_ENUM._OPERATOR> {
    return {
        type: OPER_ENUM._OPERATOR, 
        value: val,
        action: (target:string): string => {
            let len = target.length, c:string;
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
let oper_remain = CreateOperatorObj<'%'>('%');
let oper_plus = CreateOperatorObj<'+'>('+');
let oper_minus = CreateOperatorObj<'-'>('-');
let oper_multi =  CreateOperatorObj<'x'>('x');
let oper_div =  CreateOperatorObj<'/'>('/');
let oper_cancel = CreateOperatorObj<'C'>('C');
oper_cancel.action = (target:string):string => ('');
let oper_del = CreateOperatorObj<'->'>('->');
oper_del.action = (target:string):string => (target.length > 0 ? target.substring(0, target.length - 1) : '');
let oper_parenthesis = CreateOperatorObj<'( )'>('( )');
oper_parenthesis.action = (target:string):string => {
    let i:number, len = target.length, cnt1 = 0, cnt2 = 0; 
    let c:string;

    if (len == 0)
        return '(';

    c = target.charAt(len - 1);
    if (c == '+' || c == '%' || c == '/' || c == 'x' || (c == '-' && !(len > 1 && target.charAt(len - 2) == '(')) ||
        c == '(')
        return target +'(';

    for (i = 0; i < len; i++) {
        c = target.charAt(i);
        if (c == '(') cnt1++;
        else if (c == ')') cnt2++;
    }
    if (cnt1 > cnt2)
        return target + ')';

    return target;         
}

//function Operate_number<T extends OPER_NUMBER>():
class CalculatorView {
    private _display_value: string;
    private _action: OPER_ALL[][];
    
    constructor() {
        this._display_value = "";
        this._action = new Array(OPER_ENUM._MAX);
    }

    AddAction(oper: OPER_ALL): void {
        let i = 0;

        for (; i < this._action[oper.type].length; i++) {
            let instance = this._action[oper.type][i];
            if (instance.value == oper.value)
                break;
        }

        if (i < this._action[oper.type].length)
            return;
        
        this._action[oper.type][i] = oper;
    }

    private _RunAction(value:string, oper:OPER_ENUM): void {
        let i = 0, _act = this._action[oper];
        
        for (; i < _act.length; i++) {
            if (_act[i].value == value) {
                this._display_value = _act[i].action(this._display_value);
                break;        
            }
        }
    }

    AddNumber(value: string): void {
        this._RunAction(value, OPER_ENUM._OPERATION);        
    }

    AddOperator(value: string): void {
        this._RunAction(value, OPER_ENUM._OPERATOR);        
    }   
}

let cal_view = new CalculatorView();

cal_view.AddAction(oper_zero);
cal_view.AddAction(oper_one);
cal_view.AddAction(oper_two);
cal_view.AddAction(oper_three);
cal_view.AddAction(oper_four);
cal_view.AddAction(oper_five);
cal_view.AddAction(oper_six);
cal_view.AddAction(oper_seven);
cal_view.AddAction(oper_eight);
cal_view.AddAction(oper_nine);
cal_view.AddAction(oper_dot);
cal_view.AddAction(oper_negative);

cal_view.AddAction(oper_cancel);
cal_view.AddAction(oper_del);
cal_view.AddAction(oper_parenthesis);
cal_view.AddAction(oper_plus);
cal_view.AddAction(oper_minus);
cal_view.AddAction(oper_multi);
cal_view.AddAction(oper_div);
cal_view.AddAction(oper_remain);
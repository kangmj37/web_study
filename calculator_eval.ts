export enum CAL_EVAL {
    _MAKE_POSTFIX,
    _CAL_POSTFIX,
    _ALL
}

export class CalculatorEval {
    private _GetOperatorPri(value:string): number {
        switch (value) {
            case "(": return 1;
            case "+":
            case "-": return 2;
            case "x":
            case "/":
            case "%": return 3;
            default: return 0;
        } 
    }

    private _MakePostfix(value:string):string {
        let i: number, pri: number, len = value.length;
        let str = value;
        let cnt1 = 0, cnt2 = 0, idx = 0;
        let c:string, postfix = '';
        let operator_stack: string[] = [];
        let operator_stack_top = -1; 

        for (i = 0; i < len; i++) {
            if (str.charAt(i) == '(') cnt1++;
            else if (str.charAt(i) == ')') cnt2++;
        }
        if (cnt1 != cnt2) return "error";

        while(idx < len) {
            c = str.charAt(idx);
            if (!isNaN(Number(c)) ||
            (idx + 1 < len && idx > 0 && str.charAt(idx - 1) == '(' && c == '-' && !isNaN(Number(str.charAt(idx + 1))))) {
                if (c == '-') {
                     postfix = postfix + '-';
                     idx++;
                }

                for (i = idx; i < len; i++) {
                    c = str.charAt(i);
                    if (isNaN(Number(c)) && c != '.') break;
                    postfix = postfix + c;
                    idx++;
                }
                postfix = postfix + ' '; 
            } else if (c == '+' || c == '%' || c == '/' || c == 'x' || (c == '-' && !(idx > 0 && str.charAt(idx - 1) == '('))) {
                // + - * / %
                pri = this._GetOperatorPri(c);
                while (operator_stack_top != -1) {
                    let s_operator = operator_stack[operator_stack_top];
                    let s_pri = this._GetOperatorPri(s_operator);
                    if (s_pri < pri) 
                        break;
                    postfix = postfix + s_operator + ' ';
                    operator_stack_top--;
                }
                operator_stack_top++;
                operator_stack[operator_stack_top] = c;
                idx++; 
            } else if (c == '(') {
                operator_stack_top++;
                operator_stack[operator_stack_top] = c;
                idx++; 
            } else if (c == ')') {
                while (true) {
                    let s_operator = operator_stack[operator_stack_top];
                    operator_stack_top--;
                    if (s_operator == '(') 
                        break;
                    postfix = postfix + s_operator + ' '; 
                }
                idx++;
            } else {
                idx++;
            } 
        }

        while (operator_stack_top != -1) {
            postfix = postfix + operator_stack[operator_stack_top] + ' ';
            operator_stack_top--;
        }
        
        return postfix;
    }

    private _CalPostfix(postfix:string): string | number{
        let idx = 0, i: number, postfix_len = postfix.length, c: string;
        let number_stack: number[] = [];
        let number_stack_top: number = -1;
        let max_float_tofix = 1;
        let result_str: string;

        while (idx < postfix_len) {
            c = postfix.charAt(idx);
            if (!isNaN(Number(c)) ||
                (idx + 1 < postfix_len && c == '-' && postfix.charAt(idx + 1) != ' ')) {
                // No !isNaN(postfix.charAt(idx + 1)). because isNaN(' ') is false ...
                let num: number, start_idx = idx, is_float = false, float_tofix = 0;
                if (c == '-')
                    idx++;

                for (i = idx; i < postfix_len; i++) {
                    c = postfix.charAt(i);
                    if (c == ' ')
                        break;
                    if (c == '.') is_float = true;
                    else if (is_float) float_tofix++;
                    idx++; 
                }
                max_float_tofix = max_float_tofix < float_tofix ? float_tofix : max_float_tofix;

                num = Number(postfix.substring(start_idx, idx));
                number_stack_top++;
                number_stack[number_stack_top] = num;
                idx++; // ' '
            } else if (c == '+' || c == '%' || c == '/' || c == 'x' || (c == '-' && !(idx > 0 && postfix.charAt(idx - 1) == '('))) {
                let cal_num: number, num1: number, num2: number;
                if (number_stack_top < 1)
                    return "error";
                num2 = number_stack[number_stack_top];
                num1 = number_stack[number_stack_top - 1];
                number_stack_top -= 2;
                switch (c) {
                    case '+':
                        cal_num = Number(num1) + Number(num2);
                        break
                    case '-':
                        cal_num = Number(num1) - Number(num2);
                        break;
                    case 'x':
                        cal_num = Number(num1) * Number(num2);
                        break;
                    case '/':
                        cal_num = Number(num1) / Number(num2);
                        break;
                    case '%':
                        cal_num = Number(num1) % Number(num2);
                        break;
                    default:
                        return "error";    
                }
                number_stack_top++;
                number_stack[number_stack_top] = cal_num;
                idx += 2; // ' ' 
            } else {
                return "error";
            }
        }

        if (number_stack_top != 0)
			return "error";

        result_str = number_stack[0].toString();
        for (i = 0; i < result_str.length; i++) {
            if (result_str.charAt(i) == '.') {
                result_str = number_stack[0].toString();
                return parseFloat(result_str).toFixed(max_float_tofix);
            }
        } 

        return number_stack[0]; 
    }

    CalEval(value:string, type:CAL_EVAL): string | number {
        let result: string | number;
        let str: string; 

        str = value; 
        switch (type) {
            case CAL_EVAL._ALL:
            case CAL_EVAL._MAKE_POSTFIX:
                result = this._MakePostfix(str);
                if (type == CAL_EVAL._MAKE_POSTFIX || result == 'error')
                    return result;
                str = result.toString();  
            case CAL_EVAL._CAL_POSTFIX:
                result = this._CalPostfix(str);
                return result;
            default:
                return "error";    
        }
    }
}

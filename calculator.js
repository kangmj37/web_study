function _get_last_digit_idx(str) {
    var i = str.length;
    for (; i > 0; i--) {
        if (isNaN(str.charAt(i - 1)) && str.charAt(i - 1) != '.') {
            break;
        }  // not number
    }
    return i;
}

function _splice_str(orig_str, insert_str, idx) {
    var new_str = orig_str.substring(0, idx) + insert_str + orig_str.substring(idx, orig_str.length);
    return new_str;
}

function _cut_str(orig_str, idx, size) {
    var new_str = orig_str.substring(0, idx) + orig_str.substring(idx + size, orig_str.length);
    return new_str;
}

function add_number(number) {
    var element = document.getElementById("output"); 
    var i, char, last_char;

    if (number == undefined)
        return;
        
    // first value
    if (element.value == undefined || element.value == null || element.value == "") {
        if (number == ".") {
            element.value = "0.";
        } else if (number == "+/-") {
            element.value = "(-";
        } else {
            element.value = number;
        }
        return;
    }
    
    last_char = element.value.charAt(element.value.length - 1);
    if (last_char == ')') {
        return;
    }

    if (number == ".") {
       
       if (last_char == ".") {
           return;
       }

       for (i = element.value.length - 1; i >= 0; i--) {
           char = element.value.charAt(i);
           if (isNaN(char)) {
               if (char == '.') {   // XX.XX.
                   return;
               }
               break;
           }
       }
       
       if (isNaN(last_char)) {  // not number
           number = "0."
       }
    } else if (number == "+/-") {
        i = _get_last_digit_idx(element.value);

        if (i > 1) {
            if (element.value.charAt(i - 1) == '-' && element.value.charAt(i - 2) == '(') {
                element.value = _cut_str(element.value, i - 2, 2);                
                return;
            }
        }
        element.value = _splice_str(element.value, "(-", i);
        return;
    }

    element.value += number;
}

function _is_operator_char(str, idx) {
    var char = str.charAt(idx);
    if (char == '+' || char == '%' || char == '/' || char == 'x') {
        return true;
    }
    if (char == '-') {
        if (idx > 0 && str.charAt(idx - 1) == '(') {
            return false
        }
        return true;
    }
    return false;
}

function add_operator(operator) {
    var element = document.getElementById("output"); 

    if (operator == undefined)
        return;
    
    if (operator == "C") {
        element.value = null;
        return;
    }

    if (element.value == undefined || element.value == null || element.value == "") {
        if (operator == "( )") {
            element.value = "(";
        }
        return;
    }

    if (operator == "->") {
        element.value = _cut_str(element.value, element.value.length - 1, 1);
        return;
    } else if (operator == "( )") {
        var last_idx = element.value.length - 1;
        var last_char = element.value.charAt(last_idx);
        if (_is_operator_char(element.value, last_idx) || last_char == '(') {
            element.value = element.value + "(";
        } else {
            var i, cnt1 = 0; cnt2 = 0;
            for (i = 0; i < last_idx + 1; i++) {
                if (element.value.charAt(i) == '(') {
                    cnt1++;
                } else if (element.value.charAt(i) == ')') {
                    cnt2++;
                }
            }
            if (cnt1 > cnt2) {
                element.value = element.value + ")";
            }
        }
    } else if (operator == "%" || operator == "+" || operator == "-" || operator == "/" || operator == "x") {
        var last_idx = element.value.length - 1;
        var last_char = element.value.charAt(last_idx);
        if (_is_operator_char(element.value, last_idx) || last_char == '(') {
            return;
        }
        element.value = element.value + operator;
    }
    return;
}

function _cal_postfix_exp(postfix) {
    var idx = 0, i, postfix_len, char;
    var number_stack = [];
    var number_stack_top = -1;
    var max_float_tofix = 1;
    var result_string;

    postfix_len = postfix.length;
    while (idx < postfix_len) {
        char = postfix.charAt(idx);
        if (!isNaN(char) || 
            (idx + 1 < postfix_len && char == '-' && postfix.charAt(idx + 1) != ' ')) {
                // NO !isNaN(postifx.charAt(idx + 1)). because isNaN(" ") is false ...
                var num, start_idx = idx, is_float = 0, float_tofix = 0;
                if (char == '-') {
                    idx++;
                }

                for (i = idx; i < postfix_len; i++) {
                    char = postfix.charAt(i);
                    if (char == " ")
                        break;
                    if (char == '.') is_float = true;
                    else if (is_float) float_tofix++;
                    idx++;
                }
                max_float_tofix = max_float_tofix < float_tofix ? float_tofix : max_float_tofix;

                num = postfix.substring(start_idx, idx);
                number_stack_top++;
                number_stack[number_stack_top] = num;
                idx++;  // " "
        } else if (_is_operator_char(postfix, idx)) {
            // x / + - %
            var cal_num, num1, num2;
            if (number_stack_top < 1) {
                return "error";
            }
            num2 = number_stack[number_stack_top];
            num1 = number_stack[number_stack_top - 1];
            number_stack_top -= 2;
            switch (char) {
                case '+':
                    cal_num = Number(num1) + Number(num2);
                    break;
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
            idx += 2;   // " "
        } else {
            return "error";
        }
    }

    if (number_stack_top != 0)
        return "error";
    
    result_string = number_stack[0].toString();
    for (i = 0; i < result_string.length; i++) {
        if (result_string.charAt(i) == '.')
            return parseFloat(number_stack[0]).toFixed(max_float_tofix);
    }
    return number_stack[0];
}

function _get_postfix_operator_pri(operator) {
    switch (operator) {
        case "(": 
            return 1;
        case "+":
        case "-":
            return 2;
        case "x":
        case "/":
        case "%":
            return 3;
        default:
            return 0;
    }
}

function _make_postfix_exp(str) {
    var postfix = "";
    var idx = 0, str_len, i, char;
    var operator_stack = [];
    var operator_stack_top = -1;
    var cnt1 = 0, cnt2 = 0;

    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) == '(') {
            cnt1++;
        } else if (str.charAt(i) == ')') {
            cnt2++;
        }
    }
    
    if (cnt1 != cnt2) {
        return "error";
    }

    str_len = str.length;
    while(idx < str_len) {
        char = str.charAt(idx);
        if (!isNaN(char) || 
            (idx + 1 < str_len && idx > 0 && str.charAt(idx - 1) == '(' && char == '-' && !isNaN(str.charAt(idx + 1)))) {
            if (char == '-') {
                postfix = postfix + "-";
                idx++;
            }
            
            for (i = idx; i < str_len; i++) {
                char = str.charAt(i);
                if (isNaN(char) && char != '.') {
                    break;
                }
                postfix = postfix + char;
                idx++;
            }
            postfix = postfix + " ";
        } else if (_is_operator_char(str, idx)) {
            // + - * /
            var pri = _get_postfix_operator_pri(char);
            while (operator_stack_top != -1) {
                var s_operator = operator_stack[operator_stack_top];
                var s_pri = _get_postfix_operator_pri(s_operator);
                if (s_pri < pri)
                    break;
                postfix = postfix + s_operator + " ";
                operator_stack_top--;
            }
            operator_stack_top++;
            operator_stack[operator_stack_top] = char;
            idx++;
        } else if (char == '(') {
            operator_stack_top++;
            operator_stack[operator_stack_top] = char;
            idx++;
        } else if (char == ')') {
            while (true) {
                var s_operator = operator_stack[operator_stack_top];
                operator_stack_top--;
                if (s_operator == '(') 
                    break;
                postfix = postfix + s_operator + " ";
            }
            idx++;
        } else {
            idx++;
        }
    }

    while (operator_stack_top != -1) {
        postfix = postfix + operator_stack[operator_stack_top] + " ";
        operator_stack_top--;
    }

    return postfix;
}

function run_eval() {
    var element = document.getElementById("output"); 
    var exp_str = element.value;
    var postifx_exp;
    var result;

    postfix_exp = _make_postfix_exp(exp_str);
    if (postfix_exp == "error") {
        alert("invalid expression.");
        return;
    }

    result = _cal_postfix_exp(postfix_exp);
    if (result == "error") {
        alert("invalid expression.");
        return;
    }
    
    element.value = result;
}

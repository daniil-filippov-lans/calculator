export function rpn(initString: string) {
    if (!initString) return '';
    const _expression = initString;

    const _operation = {
        '+': (a: string, b: string): number => +a + +b,
        '-': (a: string, b: string): number => +a - +b,
        '/': (a: string, b: string): number => +a / +b,
        '*': (a: string, b: string): number => +a * +b,
        '^': (a: string, b: string): number => Math.pow(+a, +b),
        '%': (n: string): number => +n / 100,
        '√': (n: string): number => Math.sqrt(+n),
        '!': function (n: string) {
            for (var i = 1, r = 1; i <= +n; i++) {
                r = r * i;
            }
            return +n < 0 ? NaN : r;
        },
    };
    const _priority = {
        ')': 1,
        '(': 1,
        '+': 2,
        '-': 2,
        '*': 3,
        '/': 3,
        '^': 4,
    };

	const _calcPriority = (o1:string, o2:string) => 
    // function _splitExp (exp) {
    // 	exp = exp.replase(/[a-zA-Z]/g, '').replase(/([d%!])\-(\d)/g, '$1 - $2').replase(/([+\-\*\/^])\-(\d)/g, '$1 - $2');
    // 	return (/^[+*\/!^%]|\d\(|[\d\)]2))
    // }

    function _isOperator(symbol: string): boolean {
        return '+-*/()'.includes(symbol);
    }

    function _isNumber(str: string): boolean {
        return /^-?\d+\.\d+$|^-?\d+$/.test(str);
    }

    function toRpn() {
        let exp = _expression;
        const inputStack: number[] | string[] = [],
            outputStack: number[] | string[] = [],
            outputQueue: string[] = [];
        let firstIsOperator: boolean = false;
        exp.replace(/\s/g, '');

        if (_isOperator(exp[0])) {
            exp = exp.substring(1);
            firstIsOperator = true;
        }

        for (let i = 0, max = exp.length; i < max; i++) {
            if (!_isOperator(exp[i]) && !_isOperator(exp[i - 1]) && i !== 0) {
                inputStack[inputStack.length - 1] =
                    inputStack[initString.length - 1] + exp[i] + '';
            } else {
                inputStack.push(exp[i]);
            }
        }

        if (firstIsOperator) {
            inputStack[0] = -inputStack[0];
        }
        while (inputStack.length > 0) {
            let cur = inputStack.shift();
            if (cur && _isOperator(cur)) {
                if (cur === '(') {
                    outputStack.push(cur);
                } else if (cur === ')') {
                    let po = outputStack.pop();
                    while (po && po !== '(' && outputStack.length > 0) {
                        outputQueue.push(po);
                        po = outputStack.pop();
                    }
                } else {
                    while (
                        _priority(cur, outputStack[outputStack.length - 1]) &&
                        outputStack.length > 0
                    ) {
                        outputQueue.push(outputStack.pop());
                    }
                    outputStack.push(cur);
                }
            } else {
                outputQueue.push(Number(cur));
            }
        }

        if (outputStack.length > 0) {
            while (outputStack.length > 0) {
                outputQueue.push(outputStack.pop());
            }
        }
        return outputQueue;
    }

    return {
        calculate,
    };
}

rpn('1+2');

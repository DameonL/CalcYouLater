class ExpressionEvaluator {
    evaluateStatement = (statement) => {
        // First we need to process parentheses recursively
        for (let i = 0; i < statement.length; i++) {
            if (Array.isArray(statement[i])) {
                statement[i] = this.evaluateStatement(statement[i]);
            }
        }
    
        // Get all the operator indices
        let operators = [];
        for (let i = 0; i < statement.length; i++) {
            if (statement[i] instanceof Function) {
                operators.push({
                    index: i,
                    operation: statement[i]
                });
            }
        }
    
        operators.sort((a, b) => {
            let getPriority = (item) => {
                for (let i = 0; i < this.mathOperators.length; i++) {
                    if (this.mathOperators[i].includes(item.operation)) {
                        return i;
                    }
                }
            };
    
            let aPriority = getPriority(a);
            let bPriority = getPriority(b);
            if (aPriority < bPriority) {
                return -1;
            } else if (aPriority > bPriority) {
                return 1;
            } else if (aPriority == bPriority) {
                return a.index < b.index ? -1 : 1;
            }
        });
    
        let output = 0;
        for (let i = 0; i < operators.length; i++) {
            let index = statement.indexOf(operators[i].operation);
            let leftStart = index - 1;
            let left = statement[leftStart];
            let rightStart = index + 1;
            let right = statement[rightStart];
            output = operators[i].operation(left, right);
            statement.splice(leftStart, 3, output);
        }
    
        return statement;
    }
}
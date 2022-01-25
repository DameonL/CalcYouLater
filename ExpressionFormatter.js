class ExpressionFormatter {
    Format(input) {
        if (this.state.history.length > 0) {
            input = input.replace("Ans", this.state.history[this.state.history.length - 1][1]);
        } else {
            input = input.replace("Ans", "0");
        }
    
        let formatted = "";
        for (let i = 0; i < input.length; i++) {
            let lastChar = input[i - 1];
            let currentChar = input[i];
            let nextChar = input[i + 1];
            let currentNumber = this.getLastNumber(input, i);
    
            if (currentChar == "." && lastChar == ".") continue;
    
            if ((currentChar == ".") && !this.isNumeric(lastChar)) {
                formatted += "0" + currentChar;
                continue;
            }
    
            if (
                (!this.isNumeric(lastChar)) &&
                (currentChar == "0") &&
                (nextChar != ".")
            )
                continue;
    
            if (
                currentChar in this.operatorFunctions &&
                currentChar != "-" &&
                !this.isNumeric(lastChar) &&
                lastChar != "" &&
                lastChar != ")"
            )
                continue;
    
            if (currentChar == "*") currentChar = "×";
            else if (currentChar == "/") currentChar = "÷";
    
            if (currentChar == "e") {
                if (currentNumber.includes(".") && lastChar != ".")
                    continue
    
                if (lastChar != ".") formatted += ".";
            }
    
    
            if (lastChar == "√" && (!this.isNumeric(currentChar) && currentChar != "(")) continue;
    
            if (currentChar == "%" && (!this.isNumeric(lastChar) && currentChar != "(")) continue;
    
            if (currentChar == "(" && nextChar == ")") {
                i++;
                continue;
            }
    
            if (currentChar == "π" && this.isNumeric(nextChar)) {
                currentChar = "×" + currentChar;
            }
    
            if ((nextChar == "(" || nextChar == "π") && this.isNumeric(currentChar)) {
                currentChar = currentChar + "×";
            }
    
            if (
                lastChar == ")" &&
                (this.isNumeric(currentChar) || currentChar == "(")
            ) {
                currentChar = "×" + currentChar;
            }
    
            formatted += currentChar;
        }
    
        return formatted;
    };
}

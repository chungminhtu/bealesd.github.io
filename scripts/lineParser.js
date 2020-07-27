export class LineParser {
    constructor() {
        if (!LineParser.instance) {
            this.tokenTypes = {
                'operator': {
                    'value': 1,
                    'regex': new RegExp('^[,-]{1}$'),
                    'sanitize': (char) => char === ',' ? ',' : '-'
                },
                'literal': {
                    'value': 2,
                    'regex': new RegExp('^[0-9]+$'),
                    'sanitize': (char) => Number(char)
                }
            };

            this.resetLexemGroup();

            LineParser.instance = this;
        }
        return LineParser.instance;
    }

    resetLexemGroup() {
        this.operatorCount = 0;
        this.literalCount = 0;
        this.operator = '';
        this.lexemGroup = [];
    }

    isSingleGroup() {
        return this.operatorCount === 0 &&
            this.literalCount === 1;
    }

    isRangeGroup() {
        return this.operatorCount === 1 &&
            this.literalCount === 2 &&
            this.operatorValue === '-';
    }

    isRangeToEndGroup() {
        return this.operatorCount === 1 &&
            this.literalCount === 1 &&
            this.operatorValue === '-';
    }

    countLiterals(lexmeGroup) {
        return lexmeGroup.filter((token) => {
            return token[this.tokenTypes.literal.value]
        }).length;
    }

    countOperators(lexmeGroup) {
        return lexmeGroup.filter((token) => {
            return token[this.tokenTypes.operator.value]
        }).length;
    }

    getOperator(lexmeGroup) {
        let operator = Object.values(lexmeGroup.filter((token) => {
            return token[this.tokenTypes.operator.value]
        }));
        return operator.length === 1 ? operator[0] : null;
    }

    lexer(rawText) {
        let lexemes = [];

        for (let i = 0; i < rawText.length; i++) {
            const rawChar = rawText[i];
            let op = this.tokenTypes.operator;
            let literal = this.tokenTypes.literal;
            if (op.regex.test(rawChar)) {
                let lexeme = {
                    'value': op.sanitize(rawChar),
                    'type': op.value
                }
                lexemes.push(lexeme);
            } else if (literal.regex.test(rawChar)) {
                let lexeme = {
                    'value': literal.sanitize(rawChar),
                    'type': literal.value
                }
                lexemes.push(lexeme);
            } else
                throw ('Invalid Row Syntax.');
        }
        return lexemes;
    }

    syntaxer(lexemes) {
        let lexemeGroups = [];

        const lexemesCount = lexemes.length;
        for (let i = 0; i < lexemesCount; i++) {
            const lexeme = lexemes[i];

            if (lexeme.type === this.tokenTypes.operator.value & lexeme.value === ',') {
                if (i - 1 < 0)
                    throw ('Parsing row numbers error.');
                else {
                    const prevLexeme = lexemes[i - 1];
                    if (prevLexeme.type === this.tokenTypes.literal.value ||
                        prevLexeme.type === this.tokenTypes.operator.value && prevLexeme.value === '-') {
                        // group is complete i.e. -, or 1,
                        lexemeGroups.push(this.lexemGroup);
                        this.resetLexemGroup();
                    } else
                        throw ('Invalid row syntax.');
                }
            } else if (lexeme.type === this.tokenTypes.operator.value & lexeme.value === '-') {
                this.operatorValue = lexeme.value;
                // check previous character is a number
                if (i - 1 < 0 || this.operatorCount > 0)
                    throw ('Parsing row numbers error.');
                else {
                    const prevLexeme = lexemes[i - 1];
                    if (prevLexeme.type === this.tokenTypes.literal.value) {
                        this.operatorCount++;

                        let currenToken = {}
                        currenToken[`${lexeme.type}`] = lexeme.value;
                        this.lexemGroup.push(currenToken)
                    } else
                        throw ('Invalid row syntax.');
                }
            } else if (lexeme.type === this.tokenTypes.literal.value) {
                if (i > 0) {
                    const prevLexeme = lexemes[i - 1];
                    let isNumber = prevLexeme.type === this.tokenTypes.literal.value;
                    if (isNumber || prevLexeme.type === this.tokenTypes.operator.value) {
                        if (!isNumber) {
                            this.literalCount++;
                            let currenToken = {};
                            currenToken[`${lexeme.type}`] = lexeme.value;
                            this.lexemGroup.push(currenToken);
                        } else if (isNumber) {
                            const previousNumber = this.lexemGroup[this.lexemGroup.length - 1][prevLexeme.type];
                            const newNumber = Number(`${previousNumber}${lexeme.value}`);

                            let currenToken = {}
                            currenToken[`${lexeme.type}`] = newNumber;
                            this.lexemGroup[this.lexemGroup.length - 1] = currenToken
                        }
                    } else
                        throw ('Invalid row syntax.');
                } else {
                    this.literalCount++;
                    let currenToken = {}
                    currenToken[`${lexeme.type}`] = lexeme.value;
                    this.lexemGroup.push(currenToken);
                }
            } else
                throw ('Invalid row syntax.');
        }

        if (this.isSingleGroup() || this.isRangeGroup() || this.isRangeToEndGroup()) {
            lexemeGroups.push(this.lexemGroup);
            this.resetLexemGroup();
            return lexemeGroups;
        } else
            throw ('Invalid row syntax.');
    }

    codeGeneration(lexmeGroups, maxRows) {
        let rows = [];

        for (let i = 0; i < lexmeGroups.length; i++) {
            const lexmeGroup = lexmeGroups[i];

            this.literalCount = this.countLiterals(lexmeGroup);
            this.operatorCount = this.countOperators(lexmeGroup);
            this.operator = this.getOperator(lexmeGroup);

            if (this.isRangeGroup()) {
                for (let j = lexmeGroup[0][this.tokenTypes.literal.value]; j <= lexmeGroup[2][this.tokenTypes.literal.value]; j++) {
                    rows.push(j);
                }
            } else if (this.isSingleGroup()) {
                rows.push(lexmeGroup[0][this.tokenTypes.literal.value]);
            } else if (this.isRangeToEndGroup()) {
                for (let j = lexmeGroup[0][this.tokenTypes.literal.value]; j <= maxRows; j++) {
                    rows.push(j);
                }
            } else {
                throw ('Invalid row syntax.');
            }
        }
        return rows;
    }
}
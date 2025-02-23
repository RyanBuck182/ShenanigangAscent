'use strict';

/**
 * Coordinate on the pseudoConsole.
 * @typedef {Object} ConsoleCoordinate
 * @property {Number} line A line on the pseudo console.
 * @property {Number} column A column on the pseudo console.
 */

/** Functions associated with the pseudoconsole. Solely comprised of static members. */
class PseudoConsole {
    static MAX_CHARS_PER_LINE = 90;
    static MAX_CHARS_PER_COMBAT_COLUMN = 25;
    static DEFAULT_MILLISECONDS_PER_CHAR = 0.01;
    static DEFAULT_MILLISECONDS_PER_LINE = this.DEFAULT_MILLISECONDS_PER_CHAR * 20;
    static FONT_SIZE_PER_CONSOLE_WIDTH = 0.02;
    static CLASS_ACTIVATOR = '§';
    static CLASS_REMOVER = '/';
    static CLASS_RESETTER = '⌡';

    /** The pseudo console html element. */
    static pseudoConsole = document.getElementById('console');

    /** The console input html element. */
    static consoleInput = document.getElementById('consoleInput');
    
    /**
     * The list of identifiers associated with the pseudo classes to apply to pseudo console output.
     * @type {Array<String>}
     */
    static #outputClassArray = [];

    /**
     * Returns the appropriate font size for the current screen size.
     * @returns {String} The font size.
     */
    static fontSize() {
        return (this.pseudoConsole.offsetWidth * this.FONT_SIZE_PER_CONSOLE_WIDTH) + 'px';
    }
    
    /**
     * Returns an array of the lines of the pseudo console.
     * @returns {NodeListOf<Element>} The lines of the pseudo console. 
     */
    static lines() {
        return this.pseudoConsole.querySelectorAll('.consoleLine');
    }

    /**
     * Finds the index of the last non-empty line.
     * @returns {Number | undefined} The index of the last non-empty line. 0 if no non-empty lines. 
     */
    static lastNonEmptyLine() {
        let lines = this.lines();
        for (let i = lines.length - 1; i >= 0; i--)
            if (lines[i].textContent.trim() != '')
                return i;
        return 0;
    }

    /**
     * Returns the columns of a line of the pseudo console.
     * @param {Element} line A line of the pseudo console.
     * @returns {NodeListOf<ChildNode>} The columns of the line. 
     */
    static columns(line) {
        return line.querySelectorAll('.consoleColumn');
    }

    /**
     * Applies the output classes to an element.
     * @param {Element} element 
     */
    static applyOutputClasses(element) {
        for (let i = 0; i < this.#outputClassArray.length; i++)
            PseudoCSSClass.getClassFromId(this.#outputClassArray[i]).styleElement(element);
    }

    /**
     * Modifies output classes based on the contents of a class activator.
     * @param {String} contents The contents of a class activator. Arguments are space delimited.
     */
    static modifyOutputClasses(contents) {
        let argumentList = [];
        function parseContents(contents) {
            contents = contents.trim();
            if (contents.includes(' ')) {
                parseContents(contents.slice(0, contents.indexOf(' ')));
                parseContents(contents.slice(contents.indexOf(' ') + 1));
            } else
                argumentList.push(contents);
        }
        parseContents(contents);

        for (let i = 0; i < argumentList.length; i++) {
            let argument = argumentList[i];
            if (argument[0] == this.CLASS_REMOVER) {
                let j = 0;
                for (; j < argument.length && (argument[j + 1] == this.CLASS_REMOVER || argument[j + 1] == undefined); j++)
                    this.removeLastOutputClass();
    
                for(; j < argument.length; j++) {
                    let classEnd = argument.indexOf(this.CLASS_REMOVER, j + 1);
                    let className = '';
                    if (classEnd != -1) {
                        if (argument[classEnd + 1] == this.CLASS_REMOVER || argument[classEnd + 1] == undefined) {
                            className = argument.slice(j + 1, classEnd + 1);
                            this.removeSpecificOutputClass(className.slice(0, className.length - 1));
                        } else {
                            className = argument.slice(j + 1, classEnd);
                            this.removeLastSpecificOutputClass(className);
                        }
                    } else {
                        className = argument.slice(j + 1);
                        this.removeLastSpecificOutputClass(className);
                    }
                    j += className.length;
                }
            } else if (argument[0] == this.CLASS_RESETTER) {
                this.removeAllOutputClasses();
            } else {
                this.addOutputClass(argument);
            }
        }
    }

    /**
     * Adds a pseudo class to the list of output classes.
     * @param {String} className The name of the class to add.
     */
    static addOutputClass(className) {
        this.#outputClassArray.push(className);
        PseudoCSSClass.getClassFromId(className).onAddition();
    }

    /** Removes the last pseudo class from the list of output classes. */
    static removeLastOutputClass() {
        let outputClass = PseudoCSSClass.getClassFromId(this.#outputClassArray[this.#outputClassArray.length - 1]);
        if (outputClass) {
            outputClass.onRemoval();
            this.#outputClassArray.pop();
        } else
            console.warn('Attempted to remove the last pseudo class but no pseudo classes could be found.');
    }

    /** 
     * Removes every instance of the specific pseudo class from the list of output classes.
     * @param {String} className The class to remove.
     */
    static removeSpecificOutputClass(className) {
        let index = this.#outputClassArray.indexOf(className);
        while (index != -1) {
            PseudoCSSClass.getClassFromId(className).onRemoval();
            this.#outputClassArray.splice(index, 1);
            index = this.#outputClassArray.indexOf(className);
        }
    }

    /** 
     * Removes last instance of the specific pseudo class from the list of output classes.
     * @param {String} className The class to remove.
     */
    static removeLastSpecificOutputClass(className) {
        let index = this.#outputClassArray.lastIndexOf(className);
        if (index != -1) {
            PseudoCSSClass.getClassFromId(className).onRemoval();
            this.#outputClassArray.splice(index, 1);
        }
    }

    /** Removes every pseudo class from the list of output classes. */
    static removeAllOutputClasses() {
        while (this.#outputClassArray.length > 0)
            this.removeLastOutputClass();
    }

    /**
     * Inserts a new console line before a specific line.
     * @param {Number} lineIndex The line to insert the new line at.
     * @returns {Element} The inserted new line.
     */
    static insertNewLine(lineIndex) {
        let line = document.createElement('div');
        line.className = 'consoleLine';
        
        line.style.fontSize = this.fontSize();
        window.addEventListener('resize', () => { line.style.fontSize = this.fontSize() });

        for (let i = 0; i < this.MAX_CHARS_PER_LINE; i++) {
            let char = document.createElement('span');
            char.textContent = ' ';
            char.classList.add('consoleColumn');
            line.appendChild(char);
        }
        line.column = 0;
        
        this.pseudoConsole.insertBefore(line, this.lines()[lineIndex]);
        window.scrollTo(0, document.body.offsetHeight);
        return line;
    }

    /**
     * Creates a new console line.
     * @returns {Element} The created new line.
     */
    static newLine() {
        let line = document.createElement('div');
        line.className = 'consoleLine';
        
        line.style.fontSize = this.fontSize();
        window.addEventListener('resize', () => { line.style.fontSize = this.fontSize() });

        for (let i = 0; i < this.MAX_CHARS_PER_LINE; i++) {
            let char = document.createElement('span');
            char.textContent = ' ';
            char.classList.add('consoleColumn');
            line.appendChild(char);
        }
        line.column = 0;
        
        this.pseudoConsole.appendChild(line);
        window.scrollTo(0, document.body.offsetHeight);
        return line;
    }

    /**
     * Creates an invisible new line. makeVisible(invisibleNewLine) to make the line visible.
     * @returns {Element} The created new line.
     */
    static invisibleNewLine() {
        let line = document.createElement('div');
        line.className = 'consoleLine';
        
        line.style.fontSize = this.fontSize();
        window.addEventListener('resize', () => { line.style.fontSize = this.fontSize() });

        for (let i = 0; i < this.MAX_CHARS_PER_LINE; i++) {
            let char = document.createElement('span');
            char.textContent = ' ';
            char.classList.add('consoleColumn');
            line.appendChild(char);
        }
        line.column = 0;

        line.hidden = true;
        this.pseudoConsole.appendChild(line);
        return line;
    }

    /**
     * Makes an invisible new line visible.
     * @param {Element} invisibleNewLine The line to make visible. 
     */
    static makeVisible(invisibleNewLine) {
        invisibleNewLine.hidden = false;
        window.scrollTo(0, document.body.offsetHeight);
    }
    
    /**
     * Instantly prints a string to the pseudo console.
     * @param {String} text The text to print.
     * @param {'last' | Number} startingLine Index of the line to start printing at.
     * @param {'last' | Number} startingColumn Index of the column to start printing at.
     * @returns {Promise<{ start: ConsoleCoordinate, end: ConsoleCoordinate }>} The coordinates where the function started and stopped printing.
     */
    static printInstant(text, startingLine = 'last', startingColumn = 'last') {
        let lines = this.lines();
        let lineIndex = (startingLine == 'last') ? lines.length - 1 : startingLine;
        let line = lines[lineIndex] || this.newLine();
        let columns = this.columns(line);

        line.column = (startingColumn == 'last') ? line.column : startingColumn;
        text = this.#insertLineBreaks(text, line.column);

        let startCoords = { line: lineIndex, column: line.column };

        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\n') {
                lineIndex++;
                line = lines[lineIndex] || this.newLine();
                columns = this.columns(line);
                continue;
            } else if (text[i] == this.CLASS_ACTIVATOR) {
                let endIndex = text.indexOf(this.CLASS_ACTIVATOR, i + 1);
                let contents = text.substring(i + 1, (endIndex == -1) ? undefined : endIndex);
                this.modifyOutputClasses(contents);
                i = (endIndex == -1) ? text.length - 1 : endIndex;
                continue;
            } else {
                this.applyOutputClasses(columns[line.column]);
                columns[line.column].textContent = text[i];
                line.column++;
            }
        }

        if (line.textContent.trim() != '')
            this.makeVisible(line);

        let endCoords = { line: lineIndex, column: line.column };
        return { start: startCoords, end: endCoords };
    }
    
    /**
     * Prints a string to pseudo console. Pauses between each character.
     * @param {String} text The text to print.
     * @param {Number} millisecondsBetween Milliseconds between each character.
     * @param {'last' | Number} startingLine Index of the line to start printing at.
     * @param {'last' | Number} startingColumn Index of the column to start printing at.
     * @returns {Promise<{ start: ConsoleCoordinate, end: ConsoleCoordinate }>} The coordinates where the function started and stopped printing.
     */
    static async printByChar(text, millisecondsBetween = this.DEFAULT_MILLISECONDS_PER_CHAR, startingLine = 'last', startingColumn = 'last') {
        let lines = this.lines();
        let lineIndex = (startingLine == 'last') ? lines.length - 1 : startingLine;
        let line = lines[lineIndex] || this.newLine();
        let columns = this.columns(line);

        line.column = (startingColumn == 'last') ? line.column : startingColumn;
        text = this.#insertLineBreaks(text, line.column);

        let startCoords = { line: lineIndex, column: line.column };

        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\n') {
                await wait(millisecondsBetween);
                if (line.hidden)
                    this.makeVisible(line);
                else
                    line = lines[++lineIndex] || this.newLine();
                columns = this.columns(line);
                continue;
            } else if (text[i] == this.CLASS_ACTIVATOR) {
                let endIndex = text.indexOf(this.CLASS_ACTIVATOR, i + 1);
                let contents = text.substring(i + 1, (endIndex == -1) ? undefined : endIndex);
                this.modifyOutputClasses(contents);
                i = (endIndex == -1) ? text.length - 1 : endIndex;
                continue;
            } else {
                await wait(millisecondsBetween);
                this.applyOutputClasses(columns[line.column]);
                columns[line.column].textContent = text[i];
                line.column++;
            }
        }

        let endCoords = { line: lineIndex, column: line.column };
        return new Promise (resolve => resolve({ start: startCoords, end: endCoords }));
    }

    /**
     * Prints a string to pseudo console. Pauses between each line.
     * @param {String} text The text to print.
     * @param {Number} millisecondsBetween Milliseconds between each line.
     * @param {'last' | Number} startingLine Index of the line to start printing at.
     * @param {'last' | Number} startingColumn Index of the column to start printing at.
     * @returns {Promise<{ start: ConsoleCoordinate, end: ConsoleCoordinate }>} The coordinates where the function started and stopped printing.
     */
    static async printByLine(text, millisecondsBetween = this.DEFAULT_MILLISECONDS_PER_LINE, startingLine = 'last', startingColumn = 'last') {
        let lines = this.lines();
        let lineIndex = (startingLine == 'last') ? lines.length - 1 : startingLine;
        let line = lines[lineIndex] || this.invisibleNewLine();
        let columns = this.columns(line);

        line.column = (startingColumn == 'last') ? line.column : startingColumn;
        text = this.#insertLineBreaks(text, line.column);

        let startCoords = { line: lineIndex, column: line.column };

        let lineText = '';

        let printLine = async() => {
            await wait(millisecondsBetween);
            for (let j = lineText.length - 1; j >= 0; j--)
                columns[line.column - 1 - j].textContent = lineText[lineText.length - 1 - j];
            this.makeVisible(line);
            lineText = '';
            line = lines[++lineIndex] || this.invisibleNewLine();
            columns = this.columns(line);
        }

        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\n') {
                await printLine();
                continue;
            } else if (text[i] == this.CLASS_ACTIVATOR) {
                let endIndex = text.indexOf(this.CLASS_ACTIVATOR, i + 1);
                let contents = text.substring(i + 1, (endIndex == -1) ? undefined : endIndex);
                this.modifyOutputClasses(contents);
                i = (endIndex == -1) ? text.length - 1 : endIndex;
                continue;
            } else {
                this.applyOutputClasses(columns[line.column]);
                lineText += text[i];
                line.column++;
            }
        }
        
        if (text[text.length - 1] != '\n')
            await printLine();

        let endCoords = { line: lineIndex, column: line.column };
        return new Promise (resolve => resolve({ start: startCoords, end: endCoords }));
    }
    
    /**
     * Replaces the characters in a line with spaces.  
     * @param {Element} line The line to clear. 
     */
    static clearLineElement(line) {
        let columns = this.columns(line);
        for (let i = 0; i < columns.length; i++) {
            let animations = columns[i].getAnimations();
            for (let j = 0; j < animations.length; j++)
                animations[j].cancel();
            columns[i].style.cssText = '';
            columns[i].textContent = ' ';
        }
        line.column = 0;
    }

    /**
     * Replaces the characters in a line with spaces.  
     * @param {Number} lineIndex The index of the line to clear. 
     * @param {Boolean | undefined} hardClear Whether to hard clear the line. (delete the element)
     */
    static clearLine(lineIndex, hardClear = false) {
        let lines = this.lines();
        let line = lines[lineIndex];
        if (!hardClear)
            this.clearLineElement(line);
        else
            line.remove();
    }

    /**
     * Clears multiple lines.  
     * @param {Number} startingLine The index of the line to start clearing.
     * @param {Number | undefined} endingLine The index of the line to end clearing (exclusive). 
     * @param {Boolean | undefined} hardClear Whether to hard clear the lines. (delete the elements)
     */
    static clearLines(startingLine, endingLine = 'last', hardClear = false) {        
        let lines = this.lines();
        if (!hardClear)
            for (let i = startingLine; i < ((endingLine == 'last') ? lines.length : endingLine); i++)
                this.clearLineElement(lines[i]);
        else
            for (let i = startingLine; i < ((endingLine == 'last') ? lines.length : endingLine); i++)
                lines[i].remove();
    }

    /**
     * Prepares a string for pseudoconsole output by inserting line breaks.
     * @param {String} text The text to prepare.
     * @param {Number} currentLineLength The length of the current line.
     */
    static #insertLineBreaks(text, currentLineLength) {
        let lineCharCount = currentLineLength;
        
        let i = 0;
        while (i < text.length) {
            if (text[i] == this.CLASS_ACTIVATOR) {
                let endIndex = text.indexOf(this.CLASS_ACTIVATOR, i + 1);
                if (endIndex == -1) {
                    text += this.CLASS_ACTIVATOR;
                    i = text.length;
                } else
                    i = endIndex + 1;
            } else if (text[i] == '\n') {
                i++;
                lineCharCount = 0;
            } else {
                let spaceIndex = text.indexOf(' ', i + 1);
                let newLineIndex = text.indexOf('\n', i + 1);
                let classIndex = text.indexOf(this.CLASS_ACTIVATOR, i + 1);
                let lastIndex = text.length;

                let potentialEndIndices = [spaceIndex, newLineIndex, classIndex, lastIndex].filter(index => index != -1);
                let wordEndIndex = Math.min(...potentialEndIndices);

                let wordLength = wordEndIndex - i;
                let wordFitsLineLength = lineCharCount + wordLength <= this.MAX_CHARS_PER_LINE;
                let wordIsTooLong = wordLength > this.MAX_CHARS_PER_LINE;

                if (wordFitsLineLength) {
                    lineCharCount += wordLength;
                    i += wordLength;
                } else if (wordIsTooLong) {
                    wordLength = (this.MAX_CHARS_PER_LINE - lineCharCount);
                    i += wordLength;
                    text = text.slice(0, i) + '\n' + text.slice(i);
                    lineCharCount = 0;
                } else {
                    text = text.slice(0, i) + '\n' + text.slice((text[i] == ' ') ? i + 1 : i++);
                    i += wordLength;
                    lineCharCount = wordLength - 1;
                }
            }
        }

        return text;
    }

    /** Returns #insertLineBreaks. This is bad remove this. */
    static get insertLineBreaks() {
        return this.#insertLineBreaks;
    }

    /**
     * Gets text input from the user.
     * @param {ConsoleCoordinate} coordinates The coordinates to start the input at.
     * @param {{
     * inputType: 'text' | 'integer' | undefined,
     * minLength: Number | undefined,
     * maxLength: Number | undefined,
     * minValue: Number | undefined,
     * maxValue: Number | undefined
     * } | undefined} constraints Constraints on the user input.
     * @returns {Promise<String>} The text input.
     */
    static async getUserInput(coordinates, constraints = {}) {
        let line = this.lines()[coordinates.line];
        let column = this.columns(line)[coordinates.column];
        let columnRect = column.getBoundingClientRect();

        /** Sizes and positions the input element. */
        let transformInput = () => {
            columnRect = column.getBoundingClientRect();
            PseudoConsole.consoleInput.style.fontSize = this.fontSize();
            this.consoleInput.style.top = columnRect.top + 'px';
            this.consoleInput.style.left = columnRect.left + 'px';
        }

        /** Focuses the input when the user starts typing. */
        let focusOnType = () => {
            let listener;
            document.addEventListener('keypress', listener = () => {
                document.removeEventListener('keypress', listener);
                this.consoleInput.focus();
            });
        }

        //Pre input
        window.addEventListener('resize', transformInput);
        document.addEventListener('scroll', transformInput);
        this.consoleInput.addEventListener('focusout', focusOnType);

        transformInput();
        this.consoleInput.type = 'text';
        this.consoleInput.maxLength = this.MAX_CHARS_PER_LINE - coordinates.column;
        this.consoleInput.size = this.consoleInput.maxLength;
        this.consoleInput.hidden = false;
        this.consoleInput.focus();

        //Input
        let input;
        let validInput;
        do {
            await this.#waitForInput();
            input = this.consoleInput.value; 
            this.consoleInput.value = '';

            validInput = false;
            if (constraints.inputType === 'integer') {
                input = input.trim();
                if (!Number.isInteger(Number(input)) || input == '')
                    this.consoleInput.placeholder = 'Not An Integer';
                else if (input < constraints.minValue)
                    this.consoleInput.placeholder = 'Too Small';
                else if (input > constraints.maxValue)
                    this.consoleInput.placeholder = 'Too Large';
                else
                    validInput = true;
            } else {
                if (input.length < constraints.minLength || input.length < 1)
                    this.consoleInput.placeholder = 'Too Short';
                else if (input.length > constraints.maxLength)
                    this.consoleInput.placeholder = 'Too Long';
                else
                    validInput = true;
            }
        } while (!validInput);
        
        //Post input
        this.consoleInput.placeholder = '';
        this.printInstant(input, coordinates.line, coordinates.column);
        this.consoleInput.hidden = true;

        window.removeEventListener('resize', transformInput);
        document.removeEventListener('scroll', transformInput);
        this.consoleInput.removeEventListener('focusout', focusOnType);

        return new Promise (resolve => resolve(input));
    }

    /**
     * Gets text input from the user.
     * @param {ConsoleCoordinate} coordinates The coordinates to start the input at.
     * @param {Number | undefined} minLength The minimum length of the input.
     * @param {Number | undefined} maxLength The maximum length of the input.
     * @returns {Promise<String>} The text input.
     */
    static async getTextInput(coordinates, minLength = undefined, maxLength = undefined) {
        return await this.getUserInput(coordinates, { inputType: 'text', minLength: minLength, maxLength: maxLength});
    }

    /**
     * Gets integer input from the user.
     * @param {ConsoleCoordinate} coordinates The coordinates to start the input at.
     * @param {Number | undefined} minValue The minimum value of the integer.
     * @param {Number | undefined} maxValue The maximum value of the integer.
     * @returns {Promise<Integer>} The integer input.
     */
    static async getIntegerInput(coordinates, minValue = undefined, maxValue = undefined) {
        return await this.getUserInput(coordinates, { inputType: 'integer', minValue: minValue, maxValue: maxValue});
    }

    /** Waits until the user presses enter. */
    static async waitForEnter() {
        return new Promise(resolve => {
            let listener;
            document.addEventListener('keydown', listener = (event) => {
                if (event.key === 'Enter') {
                    document.removeEventListener('keydown', listener);
                    resolve();
                }
            });
        });
    }

    /** Waits until the user presses enter in the input box. */
    static async #waitForInput() {
        return new Promise(resolve => {
            let listener;
            this.consoleInput.addEventListener('keydown', listener = (event) => {
                if (event.key === 'Enter') {
                    this.consoleInput.removeEventListener('keydown', listener);
                    resolve();
                }
            });
        });
    }
}
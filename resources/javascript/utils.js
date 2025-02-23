'use strict';

const DEFAULT_WAIT_MILLISECONDS = 1000;

/**
 * Waits for the specified number of milliseconds.
 * @param {Number} milliseconds Milliseconds to wait.
 */
function wait(milliseconds = DEFAULT_WAIT_MILLISECONDS) {
    if (milliseconds == 0)
        return;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Pads a string with spaces.
 * @param {String} text The string to set the width of.
 * @param {'left' | 'center' | 'center-left' | 'right'} justify How the string should be positioned.
 * @param {Number} width The width the string should be set to.
 * @param {String} padCharacter The character to pad the string with.
 * @returns {String} The padded string.
 */
function setWidth(text, justify = 'left', width = PseudoConsole.MAX_CHARS_PER_LINE, padCharacter = ' ') {
    let remainingWidth = width - lengthIfDisplayed(text);

    if (remainingWidth < 1)
        return text;
    
    switch (justify) {
        default:
            return text + padCharacter.repeat(remainingWidth);
        case 'right':
            return padCharacter.repeat(remainingWidth) + text;
        case 'center':
            return padCharacter.repeat(Math.ceil(remainingWidth / 2)) + text + padCharacter.repeat(Math.floor(remainingWidth / 2));
        case 'center-left':
            return padCharacter.repeat(Math.floor(remainingWidth / 2)) + text + padCharacter.repeat(Math.ceil(remainingWidth / 2));
    }
}

/**
 * Gets the length of a string, excluding pseudo classes. In other words, the length of the string that would be displayed. 
 * @param {String} text The string to get the length of.
 * @returns {Number} The length of the string excluding pseudo classes.
 */
function lengthIfDisplayed(text) {
    let length = text.length;

    let classActivatorIndex = text.indexOf(PseudoConsole.CLASS_ACTIVATOR);
    while (classActivatorIndex != -1) {
        let nextClassActivator = text.indexOf(PseudoConsole.CLASS_ACTIVATOR, classActivatorIndex + 1);
        length -= nextClassActivator - classActivatorIndex + 1;
        classActivatorIndex = text.indexOf(PseudoConsole.CLASS_ACTIVATOR, nextClassActivator + 1);
    }

    return length;
}

/**
 * Truncates a string to a certain length, excluding pseudo classes. In other words, truncates the length of the string that would be displayed. 
 * @param {String} text The string to truncate.
 * @param {Number} length The length to truncate the string to.
 * @returns {String} The truncated string.
 */
function truncateForDisplay(text, length) {
    let truncatedString = '';
    let truncatedStringLength = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] == PseudoConsole.CLASS_ACTIVATOR) {
            do
                truncatedString += text[i++];
            while (text[i] != PseudoConsole.CLASS_ACTIVATOR);
            truncatedString += text[i];
        } else if (truncatedStringLength < length) {
            truncatedString += text[i];
            truncatedStringLength++;
        }
    }

    return truncatedString;
}

/**
 * Generates a random integer between two values (inclusive).
 * @param {Number} min The minimum value to generate.
 * @param {Number} max The maximum value to generate.
 */
function generateRandomInteger(min, max) {
    return Number((Math.floor(Math.random() * (max + 1 - min)) + min));
}
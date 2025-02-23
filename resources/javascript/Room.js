'use strict';

/** A room. */
class Room {
    /**
     * Randomly generates a room.
     * @param {Number} difficulty
     */
    static generateRoom() {
        //to define
    }

    /**
     * Creates a new room.
     * @param {{
     * onEntry: async(self: Room) => void | undefined,
     * onExit: async(self: Room) => void | undefined,
     * combatants: Array<Combatant> | undefined,
     * onCombatStart: async(self: Room) => void | undefined,
     * onCombatEnd: async(self: Room) => void | undefined,
     * onRoundStart: async(self: Room) => void | undefined,
     * onRoundEnd: async(self: Room) => void | undefined,
     * extraProperties: Object | undefined,
     * enterRoom: async(self: Room) => void | undefined,
     * exitRoom: async(self: Room) => void | undefined,
     * playRoom: async(self: Room) => void | undefined
     * }} data Data associated with the room.
     */
    constructor(data) {
        /** The current round number. */
        this.round = 0;

        /** A function to be performed on room entry. */
        this.onEntry = data.onEntry || (() => {});
        
        /** A function to be performed on room exit. */
        this.onExit = data.onExit || (() => {});

        /** Triggers when combat starts. */
        this.combatStart = new QueuedEvent();
        if (data.onCombatStart)
            this.combatStart.addListener(() => { data.onCombatStart(this); }, -1000);

        /** Triggers when combat ends. */
        this.combatEnd = new QueuedEvent();
        if (data.onCombatEnd)
            this.combatEnd.addListener(() => { data.onCombatEnd(this); }, -1000);

        /** Triggers when a combat round starts. */
        this.roundStart = new QueuedEvent();
        if (data.onRoundStart)
            this.roundStart.addListener(() => { data.onRoundStart(this); }, -1000);

        /** Triggers when a combat round ends. */
        this.roundEnd = new QueuedEvent();
        if (data.onRoundEnd)
            this.roundEnd.addListener(() => { data.onRoundEnd(this); }, -1000);

        /** Triggers when combatants do their turn. */
        this.combatTurns = new QueuedEvent();

        /** The room's combatants. */
        this.combatants = [];
        for (let i = 0; i < data.combatants.length; i++)
            this.addCombatant(data.combatants[i]);

        Object.assign(this, data.extraProperties);

        if (data.enterRoom)
            this.enterRoom = async() => { await data.enterRoom(this); };

        if (data.exitRoom)
            this.exitRoom = async() => { await data.exitRoom(this); };

        if (data.playRoom)
            this.playRoom = async() => { await data.playRoom(this); };
    }

    /**
     * Adds a combatant to the room.
     * @param {Combatant} combatant The combatant to add.
     */
    addCombatant(combatant) {
        this.combatants.push(combatant);
        combatant.room = this;

        this.combatStart.queueAddListener(combatant.onCombatStart);
        this.roundStart.queueAddListener(combatant.onRoundStart);
        this.roundEnd.queueAddListener(combatant.onRoundEnd);
        this.combatTurns.queueAddListener(combatant.doTurn);
    }
    
    /**
     * Removes a combatant from the room.
     * @param {Combatant} combatant The combatant to remove.
     */
    async removeCombatant(combatant) {
        let combatantIndex = this.combatants.findIndex(combatantInCombatants => combatantInCombatants === combatant);
        if (combatantIndex < 0) {
            console.warn('Tried to remove a combatant from the room but the combatant was not found.');
            return;
        }
        
        this.combatants.splice(combatantIndex, 1);
        combatant.room = undefined;

        this.combatStart.queueRemoveListener(combatant.onCombatStart);
        this.roundStart.queueRemoveListener(combatant.onRoundStart);
        this.roundEnd.queueRemoveListener(combatant.onRoundEnd);
        this.combatTurns.queueRemoveListener(combatant.doTurn);
        
        await this.displayCombatStats();
    }

    /**
     * Summons a combatant to the room.
     * @param {Combatant} combatant
     * @returns {Promise<Combatant>} The new combatant.
     */
    async summonCombatant(combatant) {
        this.addCombatant(combatant);
        await this.displayCombatStats();
        await combatant.onSummon();
        return combatant;
    }

    /**
     * Replaces a combatant with another combatant.
     * @param {Combatant} combatantToReplace The combatant to replace.
     * @param {Combatant} combatantToReplaceWith The combatant to replace with.
     */
    async replaceCombatant(combatantToReplace, combatantToReplaceWith) {
        let combatantIndex = this.combatants.findIndex(combatantInRoom => combatantInRoom === combatantToReplace);
        if (combatantIndex < 0) {
            console.warn('Tried to replace a combatant in the room but the combatant was not found.');
            return;
        }

        this.combatants.splice(combatantIndex, 1, combatantToReplaceWith);
        combatantToReplace.room = undefined;
        combatantToReplaceWith.room = this;

        this.combatStart.queueReplaceListener(combatantToReplace.onCombatStart, combatantToReplaceWith.onCombatStart);
        this.roundStart.queueReplaceListener(combatantToReplace.onRoundStart, combatantToReplaceWith.onRoundStart);
        this.roundEnd.queueReplaceListener(combatantToReplace.onRoundEnd, combatantToReplaceWith.onRoundEnd);
        this.combatTurns.queueReplaceListener(combatantToReplace.doTurn, combatantToReplaceWith.doTurn);

        await this.displayCombatStats();
        await combatantToReplaceWith.onSummon();
    }

    /** Enters the room. */
    async enterRoom() {
        //entry stuff

        await this.onEntry(this);
    }

    /** Plays the room (usually means combat). */
    async playRoom() {
        await this.combatStart.triggerEvent();

        while (this.combatants.find(combatant => combatant instanceof Enemy) != undefined) {
            this.round++;
            
            await this.roundStart.triggerEvent();

            await this.displayCombatStats();

            //player should be first in combatant list, so player should go first
            await this.combatTurns.triggerEvent();

            await this.roundEnd.triggerEvent();

            // if (this.combatants.length > 1) {
                //PseudoConsole.clearLines(PseudoConsole.lastNonEmptyLine() + 1, undefined, true);
                //await PseudoConsole.printByChar('\n\nPress enter to continue...');
                //await PseudoConsole.waitForEnter();
                //PseudoConsole.clearLines(this.combatDisplayEnd.line + 1, undefined, true);
            // }
        }
        
        PseudoConsole.clearLines(this.combatDisplayStart.line - 3, undefined, true);

        if (PLAYER.health > 0)
            await PseudoConsole.printByChar('\nYou Win!');
        else
            await PseudoConsole.printByChar('\nYou Lose!');

        await this.combatEnd.triggerEvent();
    }

    /** Exits the room. */
    async exitRoom() {
        await this.onExit(this);

        //exit stuff
    }

    /** Displays combat stats. */
    async displayCombatStats() {
        if (!this.combatDisplayStart)
            this.combatDisplayStart = PseudoConsole.printInstant('\n\n').end;

        if (this.combatants.length == 0) {
            PseudoConsole.clearLines(this.combatDisplayStart.line, undefined, true);
            return;
        }

        //column widths and nameplates
        let combatantNamePlates = [];
        let columnWidths = [ 0, 0, 0 ];
        for (let i = 0; i < this.combatants.length; i++) {
            let maxHealth = String(this.combatants[i].maxHealth);
            let currentHealth = setWidth(String(this.combatants[i].health), 'right', maxHealth.length, '0').slice(0, maxHealth.length);
            combatantNamePlates[i] = this.combatants[i].name + ' (' + currentHealth + '/' + maxHealth + ')';
            
            if (i == 0)
                columnWidths[0] = Math.max(lengthIfDisplayed(this.combatants[i].image[0]), lengthIfDisplayed(combatantNamePlates[i]));
            else if (i % 2 == 1)
                columnWidths[1] = Math.max(columnWidths[1], lengthIfDisplayed(this.combatants[i].image[0]), lengthIfDisplayed(combatantNamePlates[i]));
            else
                columnWidths[2] = Math.max(columnWidths[2], lengthIfDisplayed(this.combatants[i].image[0]), lengthIfDisplayed(combatantNamePlates[i]));
        }

        for (let i = 1; i < this.combatants.length; i++)
            combatantNamePlates[i] = setWidth(combatantNamePlates[i], 'center-left', (i % 2 == 1) ? columnWidths[1] : columnWidths[2]);

        //row heights
        let rowHeights = new Array(Math.floor((this.combatants.length - 2) / 2) + 1);
        rowHeights.fill(0);
        rowHeights[0] = this.combatants[0].image.length + 1;
        for (let i = 1; i < this.combatants.length; i++)
            rowHeights[Math.floor((i - 1) / 2)] = Math.max(rowHeights[Math.floor((i - 1) / 2)], this.combatants[i].image.length + 1);
        
        //populating combat display
        let rowCount = rowHeights[0];
        for (let i = 1; i < rowHeights.length; i++)
            rowCount += rowHeights[i];
        let toDisplay = new Array(rowCount);
        toDisplay.fill('');

        {
            let rowHeight = rowHeights[0];
            let image = this.combatants[0].image;
            let columnWidth = columnWidths[0];

            toDisplay[rowHeight - 1] = combatantNamePlates[0];
            for (let i = rowHeight - 2; i >= 0; i--)
                if (image[i - (rowHeight - image.length) + 1])
                    toDisplay[i] += setWidth(image[i - (rowHeight - image.length) + 1], 'center-left', columnWidth);
                else
                    toDisplay[i] += ' '.repeat(columnWidth);

            for (let i = 0; i < rowHeight; i++) {
                if (i == Math.floor(rowHeight / 2))
                    toDisplay[i] += ' '.repeat(4) + 'vs' + ' '.repeat(4);
                else
                    toDisplay[i] += ' '.repeat(10);
            }
        }

        for (let i = 1; i < this.combatants.length; i++) {
            let rowHeightIndex = Math.floor((i - 1) / 2);
            let rowHeight = rowHeights[rowHeightIndex];
            let columnWidth = (i % 2 == 1) ? columnWidths[1] : columnWidths[2];
            let image = this.combatants[i].image;
            
            let rowStartIndex = 0;
            for (let j = 0; j < rowHeightIndex; j++)
                rowStartIndex += rowHeights[j];

            toDisplay[rowStartIndex + rowHeight - 1] += combatantNamePlates[i];
            for (let j = rowStartIndex + rowHeight - 2; j >= rowStartIndex; j--) {
                if (image[j - (rowStartIndex + rowHeight - image.length) + 1])
                    toDisplay[j] += setWidth(image[j - (rowStartIndex + rowHeight - image.length) + 1], 'center', columnWidth);
                else
                    toDisplay[j] += ' '.repeat(columnWidth);
            }

            if (i % 2 == 1) {
                if (i + 1 < this.combatants.length)
                    for (let j = rowStartIndex; j < rowStartIndex + rowHeight; j++)
                        toDisplay[j] += ' '.repeat(5);
                else
                    for (let j = rowStartIndex; j < rowStartIndex + rowHeight; j++)
                        toDisplay[j] += ' '.repeat(columnWidths[2] + 5);
                }
            else if (i + 1 < this.combatants.length) {
                let nextRowHeight = rowHeights[rowHeightIndex + 1];
                let nextRowStartIndex = rowStartIndex + rowHeight;

                for (let j = nextRowStartIndex; j < nextRowStartIndex + nextRowHeight; j++)
                    toDisplay[j] += ' '.repeat(columnWidths[0] + 10);
            }
        }

        let stringToDisplay = '';
        for (let i = 0; i < toDisplay.length; i++)
            stringToDisplay += setWidth(toDisplay[i], 'center', PseudoConsole.MAX_CHARS_PER_LINE) + '\n';

        let allocatedSpaceWasExceeded = false;
        if (this.combatDisplayEnd) {
            let allocatedSpaceExceeded = () => this.combatDisplayStart.line + toDisplay.length > this.combatDisplayEnd.line;
            if (allocatedSpaceExceeded()) {
                allocatedSpaceWasExceeded = true;
                while (allocatedSpaceExceeded())
                    PseudoConsole.insertNewLine(++this.combatDisplayEnd.line);
            }
        }

        PseudoConsole.clearLines(this.combatDisplayStart.line, (this.combatDisplayEnd) ? this.combatDisplayEnd.line : undefined);
        let coords = PseudoConsole.printInstant(stringToDisplay, this.combatDisplayStart.line);

        if (!this.combatDisplayEnd)
            await PseudoConsole.printByChar('\n');

        this.combatDisplayEnd = coords.end;
    }
}
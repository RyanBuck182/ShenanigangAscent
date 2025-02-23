'use strict';

/** An entity which combats. */
class Combatant {
    /**
     * Creates a new combatant.
     * @param {{
     * name: String,
     * identifier: String,
     * image: Array<String>,
     * maxHealth: Number,
     * health: Number | undefined,
     * onCombatStart: (self: Combatant) => Promise<void> | undefined,
     * onSummon: (self: Combatant) => Promise<void> | undefined,
     * onRoundStart: (self: Combatant) => Promise<void> | undefined, 
     * onRoundEnd: (self: Combatant) => Promise<void> | undefined, 
     * doTurn: (self: Combatant) => Promise<void> | undefined,
     * onHeal: (self: Combatant, amount: Number) => Promise<void> | undefined,
     * onTakeDamage: (self: Combatant, amount: Number) => Promise<void> | undefined,
     * onDeath: (self: Combatant) => Promise<void> | undefined,
     * extraProperties: Object | undefined,
     * takeHeal: (self: Combatant, amount: Number) => Promise<void> | undefined,
     * takeDamage: (self: Combatant, amount: Number) => Promise<void> | undefined,
     * die: (self: Combatant) => Promise<void> | undefined
     * }} data Data associated with the combatant.
     */
    constructor(data) {
        /**
         * The room the combatant is in. 
         * @type {Room}
         */
        this.room;

        /** The identifier of the combatant. */
        this.identifier = data.identifier;

        /** The name of the combatant. */
        this.name = data.name;
        if (lengthIfDisplayed(this.name) > PseudoConsole.MAX_CHARS_PER_COMBAT_COLUMN) {
            console.warn('The name of the combatant with the id \"' + this.identifier + '\" is too long. Max length: ' + PseudoConsole.MAX_CHARS_PER_COMBAT_COLUMN);
            this.name = truncateForDisplay(this.name);
        }

        /** The image of the combatant to display in combat. */
        this.image = data.image.slice();
        for (let i = 0; i < this.image.length; i++) {
            if (lengthIfDisplayed(this.image[i]) > PseudoConsole.MAX_CHARS_PER_COMBAT_COLUMN) {
                console.warn('Line ' + (i + 1) + ' of the image of the combatant with the id \"' + this.identifier + '\" is too long. Max length: ' + PseudoConsole.MAX_CHARS_PER_COMBAT_COLUMN);
                this.image[i] = truncateForDisplay(this.image[i]);
            }
        }

        /** The combatant's max health. */
        this.maxHealth = data.maxHealth;

        /** The combatant's current health. */
        this.health = data.health || this.maxHealth;

        /** Runs when combat starts. */
        this.onCombatStart = (data.onCombatStart) ? async() => { await data.onCombatStart(this); } : async() => {};

        /** Runs when the enemy is summoned. */
        this.onSummon = (data.onSummon) ? async() => { await data.onSummon(this); } : async() => {};
        
        /** Runs when the round starts. */
        this.onRoundStart = (data.onRoundStart) ? async() => { await data.onRoundStart(this); } : async() => {};

        /** Runs when the round ends. */
        this.onRoundEnd = (data.onRoundEnd) ? async() => { await data.onRoundEnd(this); } : async() => {};

        /** The combatant's actions on it's turn. If this is undefined, the combatant does nothing on it's turn. */
        this.doTurn = (data.doTurn) ? async() => {if (this.room && PLAYER.health > 0) await data.doTurn(this); } : async() => {};

        /** Runs when the combatant heals. */
        this.onHeal = data.onHeal || (async() => {});

        /** Runs when the combatant takes damage. */
        this.onTakeDamage = data.onTakeDamage || (async() => {});

        /** Runs when the combatant dies. */
        this.onDeath = data.onDeath || (async() => {});

        Object.assign(this, data.extraProperties);

        if (data.takeHeal)
            this.takeHeal = async(amount) => { await data.takeHeal(this, amount); };

        if (data.takeDamage)
            this.takeDamage = async(amount) => { await data.takeDamage(this, amount); };

        if (data.die)
            this.die = async() => { await data.die(this); };
    }

    /** 
     * Heals the combatant.
     * @param {Number} amount The amount to heal the combatant by.
     */
    async takeHeal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);

        await this.room.displayCombatStats();

        await this.onHeal(this, amount);
    }

    /**
     * Deals damage to the combatant.
     * @param {Number} amount The amount to damage the combatant by.
     */
    async takeDamage(amount) {
        this.health = Math.max(this.health - amount, 0);
        await this.room.displayCombatStats();
        
        await this.onTakeDamage(this, amount);
        
        if (this.health <= 0)
            await this.die();
    }

    /** Kills the combatant. */
    async die() {
        //fade out animation?

        await this.room.removeCombatant(this);

        await PseudoConsole.printByChar('\n\n' + this.name + ' has perished.');

        await this.onDeath(this);
    }
}
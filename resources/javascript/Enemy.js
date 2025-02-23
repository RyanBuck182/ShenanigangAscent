'use strict';

/** An enemy of the player. */
class Enemy extends Combatant {
    /**
     * A list of all defined enemies.
     * @type {Object}
     */
    static #enemyList = {};

    /**
     * Getter for #enemyList.
     * @returns {Object} A list of all defined enemies.
     */
    static get enemyList() {
        return this.#enemyList;
    }

    /**
     * An array of all generable enemies, sorted from least to most difficult.
     * @type {Array<Enemy>}
     */
    static #generableEnemyList = [];

    /**
     * Getter for #generableEnemyList.
     * @returns {Array<Enemy>} An array of all generable enemies, sorted from least to most difficult.
     */
    static get generableEnemyList() {
        return this.#generableEnemyList;
    }

    /**
     * Creates an instance of a defined enemy.
     * @param {String} identifier The identifier of the enemy to create an instance of.
     * @param {Object | undefined} modifiedProperties Properties of the enemy to overwrite for this instance.
     * @returns {Enemy} An instance of a defined enemy.
     */
    static createInstance(identifier, modifiedProperties) {
        if (Enemy.#enemyList[identifier]) {
            let instance = new Enemy(Enemy.#enemyList[identifier].creationData, false);
            Object.assign(instance, modifiedProperties);
            return instance;
        } else {
            console.warn('The enemy \"' + identifier + '\" does not exist.');
            return undefined;
        }
    }

    /**
     * Randomly generates an array of enemies.
     * @param {Number} difficulty The combined difficulty of the enemies to generate.
     * @param {Number} count The number of enemies to generate.
     */
    static generateEnemies(difficulty, count) {
        //to define
    }

    /**
     * Defines an enemy.
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
     * die: (self: Combatant) => Promise<void> | undefined,
     * generable: Boolean,
     * difficulty: Number
     * }} data Data associated with the enemy.
     * @param {Boolean | undefined} definition Whether the constructor is defining an enemy or creating an instance of one.
     */
    constructor(data, definition = true) {
        super(data);
        
        /** Whether the enemy can be generated for random encounters. */
        this.generable = data.generable;
        
        /** The difficulty of the enemy. */
        this.difficulty = data.difficulty;

        if (definition) {
            this.creationData = data;

            Enemy.#enemyList[data.identifier] = this;

            if (this.generable) {
                let insertionPoint = -1;
    
                let lowerBound = 0;
                let upperBound = Enemy.#generableEnemyList.length - 1;
                while (lowerBound <= upperBound) {
                    let midPoint = Math.floor((upperBound + lowerBound) / 2);
                    if (this.difficulty > Enemy.#generableEnemyList[midPoint].difficulty)
                        lowerBound = midPoint + 1;
                    else if (this.difficulty < Enemy.#generableEnemyList[midPoint].difficulty)
                        upperBound = midPoint - 1;
                    else {
                        insertionPoint = midPoint;
                        break;
                    }
                }
                if (insertionPoint == -1)
                    insertionPoint = lowerBound;

                while (Enemy.#generableEnemyList[insertionPoint + 1] && Enemy.#generableEnemyList[insertionPoint + 1].difficulty == this.difficulty)
                    insertionPoint++;
    
                Enemy.#generableEnemyList.splice(insertionPoint, 0, this);
            }
        }
    }
}
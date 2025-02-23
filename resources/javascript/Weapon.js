'use strict';

class Weapon extends Item {
    /**
     * A list of all defined weapons.
     * @type {Object}
     */
    static #weaponList = {};

    /**
     * Getter for #weaponList.
     * @returns {Object} A list of all defined weapons.
     */
    static get weaponList() {
        return this.#weaponList;
    }

    /**
     * Creates an instance of a defined weapon.
     * @param {String} identifier The identifier of the weapon to create an instance of.
     * @param {Object | undefined} modifiedProperties Properties of the weapon to overwrite for this instance.
     * @returns {Weapon} An instance of a defined weapon.
     */
    static createInstance(identifier, modifiedProperties) {
        if (Weapon.#weaponList[identifier]) {
            let instance = new Weapon(Weapon.#weaponList[identifier].creationData);
            Object.assign(instance, modifiedProperties);
            return instance;
        } else {
            console.warn('The weapon \"' + identifier + '\" does not exist.');
            return undefined;
        }
    }
    
    /**
     * Defines an weapon.
     * @param {{
     * name: String,
     * identifier: String,
     * rarity: String,
     * generable: Boolean,
     * onUse: (self: Item) => Promise<void>,
     * extraProperties: Object | undefined
     * }} data Data associated with the weapon.
     * @param {Boolean | undefined} definition Whether the constructor is defining an enemy or creating an instance of one.
     */
    constructor(data, definition = true) {
        super(data, definition);

        if (definition)
            Weapon.#weaponList[this.identifier] = this;
    }
}
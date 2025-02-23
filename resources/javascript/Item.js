'use strict';

class Item {
    /**
     * A list of all defined items.
     * @type {Object}
     */
    static #itemList = {};

    /**
     * Getter for #itemList.
     * @returns {Object} A list of all defined items.
     */
    static get itemList() {
        return this.#itemList;
    }

    /**
     * Creates an instance of a defined item.
     * @param {String} identifier The identifier of the item to create an instance of.
     * @param {Object | undefined} modifiedProperties Properties of the item to overwrite for this instance.
     * @returns {Item} An instance of a defined item.
     */
    static createInstance(identifier, modifiedProperties) {
        if (Item.#itemList[identifier]) {
            let instance = new Item(Item.#itemList[identifier].creationData);
            Object.assign(instance, modifiedProperties);
            return instance;
        } else {
            console.warn('The item \"' + identifier + '\" does not exist.');
            return undefined;
        }
    }

    /**
     * Defines an item.
     * @param {{
     * name: String,
     * identifier: String,
     * rarity: String,
     * generable: Boolean,
     * onUse: (self: Item) => Promise<void>,
     * extraProperties: Object | undefined
     * }} data Data associated with the item.
     * @param {Boolean | undefined} definition Whether the constructor is defining an enemy or creating an instance of one.
     */
    constructor(data, definition = true) {
        /** The name of the item. */
        this.name = data.name;

        /** The identifier of the item. */
        this.identifier = data.identifier;

        /** The rarity of the item. */
        this.rarity = data.rarity;
        
        /** Whether the item can be randomly generated or not. */
        this.generable = data.generable;

        /** Performs an action when the item is activated/used. */
        this.onUse = async() => { await data.onUse(this); };

        Object.assign(this, data.extraProperties);

        if (definition) {
            this.creationData = data;

            Item.#itemList[this.identifier] = this;
        }
    }
}
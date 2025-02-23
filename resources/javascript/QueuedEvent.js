'use strict';

class QueuedEvent {
    DEFAULT_PRIORITY = 1000;

    /** 
     * An array of all listeners and their priorities. Sorted from least to most priority.
     * @type {{
     * listener: () => Promise<void>,
     * priority: Number 
     * }[]}
     */
    #listeners = [];

    /** 
     * An array of listeners and their priorities to add to the #listener array.
     * @type {{
     * listener: () => Promise<void>,
     * priority: Number 
     * }[]}
     */
    #listenersToAdd = [];

    /** 
     * An array of listeners to remove from the #listener array.
     * @type {(() => Promise<void>)[]}
     */
    #listenersToRemove = [];

    /** 
     * An array of listeners to replace in the #listener array.
     * @type {{
     * listenerToReplace: () => Promise<void>,
     * listenerToReplaceWith: () => Promise<void>,
     * priority: Number
     * }[]}
     */
    #listenersToReplace = [];

    /**
     * Adds a listener to the #listener array.
     * @param {{
     * listener: () => Promise<void>,
     * priority: Number 
     * }} listenerData The listener and its priority.  
     */
    #addListener(listenerData) {
        let insertionPoint = -1;

        let lowerBound = 0;
        let upperBound = this.#listeners.length - 1;
        while (lowerBound <= upperBound) {
            let midPoint = Math.floor((upperBound + lowerBound) / 2);
            if (listenerData.priority > this.#listeners[midPoint].priority)
                lowerBound = midPoint + 1;
            else if (listenerData.priority < this.#listeners[midPoint].priority)
                upperBound = midPoint - 1;
            else {
                insertionPoint = midPoint;
                break;
            }
        }
        if (insertionPoint == -1)
            insertionPoint = lowerBound;

        while (this.#listeners[insertionPoint + 1] && this.#listeners[insertionPoint + 1].priority == listenerData.priority)
            insertionPoint++;

        this.#listeners.splice(insertionPoint + 1, 0, listenerData);
    }

    /**
     * Removes a listener from the #listener array.
     * @param {() => Promise<void>} listener
     */
    #removeListener(listener) {
        let index = this.#listeners.findIndex(listenerOnEvent => listenerOnEvent.listener === listener);

        if (index >= 0)
            this.#listeners.splice(index, 1);
    }

    /**
     * Replaces a listener from the #listener array with another listener.
     * @param {{
     * listenerToReplace: () => Promise<void>,
     * listenerToReplaceWith: () => Promise<void>,
     * priority: Number
     * }} listenerData The listener to replace, the listener to replace with, and its priority.
     */
    #replaceListener(listenerData) {
        let index = this.#listeners.findIndex(listenerOnEvent => listenerOnEvent.listener == listenerData.listenerToReplace);
        if (index >= 0)
            this.#listeners.splice(index, 1, { 'listener': listenerData.listenerToReplaceWith, 'priority': listenerData.priority || this.DEFAULT_PRIORITYs });
    }

    /**
     * Queues a listener to be added to the #listener array.
     * @param {() => Promise<void>} listener The listener to queue for addition to the array.
     * @param {Number | undefined} priority The priority of the listener. Determines what order the listeners are triggered when the event triggers.  
     */
    queueAddListener(listener, priority = this.DEFAULT_PRIORITY) {
        this.#listenersToAdd.push({ 'listener': listener, 'priority': priority });
    }

    /**
     * Queues a listener to be removed from the #listener array.
     * @param {() => Promise<void>} listener The listener to queue for removal from the array.
     */
    queueRemoveListener(listener) {
        this.#listenersToRemove.push(listener);
    }

    /**
     * Queues a listener to be replaced from the #listener array by another listener.
     * @param {() => Promise<void>} listenerToReplace The listener to queue for replacement from the array.
     * @param {() => Promise<void>} listenerToReplaceWith The listener to queue for replacement to the array.
     * @param {Number | undefined} priority The priority of the listener to replace with. Determines what order the listeners are triggered when the event triggers. 
     */
    queueReplaceListener(listenerToReplace, listenerToReplaceWith, priority) {
        this.#listenersToReplace.push({ 'listenerToReplace': listenerToReplace, 'listenerToReplaceWith': listenerToReplaceWith, 'priority': priority });
    }

    /**
     * Executes every listener function in the #listener array.
     * @param {any} eventData Data to send to the listener.
     */
    async triggerEvent(eventData) {
        for (let i = 0; i < this.#listenersToRemove.length; i++)
            this.#removeListener(this.#listenersToRemove[i]);
        this.#listenersToRemove = [];

        for (let i = 0; i < this.#listenersToReplace.length; i++)
            this.#replaceListener(this.#listenersToReplace[i]);
        this.#listenersToReplace = [];

        for (let i = 0; i < this.#listenersToAdd.length; i++)
            this.#addListener(this.#listenersToAdd[i]);
        this.#listenersToAdd = [];

        for (let i = 0; i < this.#listeners.length; i++)
            await this.#listeners[i].listener(eventData);
    }
}
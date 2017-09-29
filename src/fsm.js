class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == null) {
            throwError('A parameter for constructor is missed. Please, give the configuration object')
        }
        this.state = config.initial;
        this.configurator = config;
        this.history = [];
        this.future = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        if (!(state in this.configurator.states)) {
            throwError('No such a state');
            return
        }
        this.history.push(this.state);
        this.state = state;
        this.future = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let currentState = this.state;
        if (event in this.configurator.states[currentState].transitions) {
            this.history.push(this.state);
            this.state = this.configurator.states[currentState].transitions[event]
            this.future = [];
        }
        else {
            throwError('No such an event');
            return
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.configurator.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let resArr = [];
        if (!event) {
            for (let item in this.configurator.states) {
                resArr.push(item);
            }
            return resArr;
        }
        resArr = [];
        for (let item in this.configurator.states) {
            for (let item2 in this.configurator.states[item].transitions) {
                if (item2 == event) {
                    resArr.push(item)
                }
            }
        }
        return resArr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        if (this.history.length == 0) {
            return false
        }
        this.future.push(this.state);
        this.state = this.history[this.history.length - 1];
        this.history.length--;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.future.length == 0) {
            return false
        }
        this.history.push(this.state);
        this.state = this.future[this.future.length - 1];
        this.future.length--;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.future = [];
        this.history = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

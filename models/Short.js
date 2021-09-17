export class Short {
    shortList;
    
    constructor () {
        this.shortList = new Map();
        this.shortList.set('start', ['start', 's']);
        this.shortList.set('pause', ['pause', 'p']);
        this.shortList.set('hours', ['hours', 'h']);
        this.shortList.set('goal', ['goal', 'g']);
    }

    getShort (command) {
        return this.shortList.get(command);
    }

    setKorean () {
        this.shortList.get('start').push('ㄴ');
        this.shortList.get('pause').push('ㅔ');
        this.shortList.get('hours').push('ㅗ');
        this.shortList.get('goal').push('ㅎ');
    }

    clearKorean () {
        this.shortList.get('start').pop();
        this.shortList.get('pause').pop();
        this.shortList.get('hours').pop();
        this.shortList.get('goal').pop();
    }
}
export default class Short {
    private shortList: Map<string, string[]>;
    
    constructor() {
        this.shortList = new Map();
        this.shortList.set('start', ['start', 's']);
        this.shortList.set('pause', ['pause', 'p']);
        this.shortList.set('time', ['time', 't']);
        this.shortList.set('goal', ['goal', 'g']);
    }

    public getShort(command: string): string[]{
        return this.shortList.get(command);
    }

    public setKorean(): boolean {
        if (this.shortList.get('start').length === 3) return false;

        this.shortList.get('start').push('ㄴ');
        this.shortList.get('pause').push('ㅔ');
        this.shortList.get('time').push('ㅅ');
        this.shortList.get('goal').push('ㅎ');
        return true;
    }

    public clearKorean(): boolean {
        if (this.shortList.get('start').length === 2) return false;

        this.shortList.get('start').pop();
        this.shortList.get('pause').pop();
        this.shortList.get('time').pop();
        this.shortList.get('goal').pop();
        return true;
    }
}
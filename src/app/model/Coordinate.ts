export class Coordinate {

    constructor(
    ) { }

    lat: number;
    lng: number;
    user: string;
    time: Date;
    group: string;


    toString(): string {
        return 'lat: ' + this.lat + ', ln: ' + this.lng + ', user:  ' + this.user + ', time: ' + this.time.toUTCString() + ', group: ' + this.group;
    }



}
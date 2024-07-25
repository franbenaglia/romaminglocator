export class Coordinate {

    constructor(
    ) { }

    lat: number;
    ln: number;
    user: string;
    time: Date;
    group: string;

    static coordinateBuilder(lat: number, lng: number, time?: Date, user?: string, group?: string): Coordinate {

        let coordinate: Coordinate = new Coordinate();

        coordinate.lat = lat;
        coordinate.ln = lng;
        coordinate.user = user;
        coordinate.time = time;
        coordinate.group = group;

        return coordinate;
    }


    toString(): string {
        return 'lat: ' + this.lat + ', ln: ' + this.ln + ', user:  ' + this.user + ', time: ' + this.time.toUTCString() + ', group: ' + this.group;
    }



}
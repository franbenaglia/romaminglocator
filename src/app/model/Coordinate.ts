export class Coordinate {

    constructor(
    ) { }

    lat: number;
    ln: number;
    user: string;
    time: Date;
    group: String;
    save: boolean = true;

    static coordinateBuilder(lat: number, lng: number, time?: Date, user?: string, group?: String, save?: boolean): Coordinate {

        let coordinate: Coordinate = new Coordinate();

        coordinate.lat = lat;
        coordinate.ln = lng;
        coordinate.user = user;
        coordinate.time = time;
        coordinate.group = group;
        coordinate.save = save;

        return coordinate;
    }


    toString(): string {
        return 'lat: ' + this.lat + ', ln: ' + this.ln + ', user:  ' + this.user + ', time: ' + this.time.toUTCString() + ', group: ' + this.group;
    }



}
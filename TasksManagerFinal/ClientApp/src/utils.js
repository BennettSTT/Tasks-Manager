import { OrderedMap, Map } from 'immutable';

export function GWT0(now = new Date) {
    return new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
}

export function arrToMap(arr, DataRecord = Map) {
    // if (arr.length === 0) return DataRecord({});
    return arr.reduce((acc, item) =>
            acc.set(item.id, new DataRecord(item))
        , new OrderedMap({}));
}

export function mapToArr(obj) {
    return obj.valueSeq().toArray();
}
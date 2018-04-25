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

export function getDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
}

export function dueDateParse(dueDate) {
    const dueDateParse = new Date(dueDate);
    return new Date(dueDateParse.getFullYear(), dueDateParse.getMonth(), dueDateParse.getDate()).valueOf();
}
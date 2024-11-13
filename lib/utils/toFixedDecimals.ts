export const toFixedDecimal = (string: string, decimal: number) => {
    const arr = string.split(".");
    let fixed = 2;
    if (arr[1]) {
        for (let index = 0; index < arr[1].length; index++) {
            if (+arr[1][index] == 0) {
                fixed++;
            } else break;
        }
    }
    if (fixed >= decimal) {
        fixed = decimal;
    }
    return Number(string).toFixed(fixed);
};

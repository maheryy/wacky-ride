/**
 * Returns a readonly key-value pair of the given `arr`.
 *
 * @example strEnum(['A', 'B']) // { A: 'A', B: 'B' }
 */
export function strEnum<T extends string>(
  arr: ReadonlyArray<T>
): Readonly<{ [K in T]: K }> {
  return arr.reduce((accumulator, key) => {
    accumulator[key] = key;

    return accumulator;
  }, Object.create(null));
}

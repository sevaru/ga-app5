/**
 * @param { { [field]: { min: number, max: number, value: number } } } meta
 * @param {number} weight - from 0 to 1
 */
export const getInitialStateFromMeta =
    (meta, weight = 0.3) =>
        () =>

            ({
                weight,
                ...Object
                    .entries(meta)
                    .reduce((store, [key, { value }]) =>
                        ({ ...store, [key]: value }), {})
            });

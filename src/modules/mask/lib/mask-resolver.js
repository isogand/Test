import * as Masks from "./masks";

var maskKeys = Object.keys(Masks);

export default class MaskResolver {
    static resolve(type) {
        let maskKey = maskKeys.find((m) => {
            var handler = Masks[m];
            return handler && handler.getType && handler.getType() === type;
        });

        let handler = Masks[maskKey];

        // console.log(type,handler);
        if (!handler) {
            throw new Error("Mask type not supported.");
        }

        return new handler();
    }
}

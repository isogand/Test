// import {intlFormatCurrencyAndFilter} from "@src/modules/localization/intl/SGIntl";

import MoneyMask from "./money.mask";

export default class MoneyIntlMask extends MoneyMask {
    static getType() {
        return "money-intl";
    }

    constructor() {
        super();
        this.currencySettings = {};
    }

    getCurrencySettings(currency, hideCurrencySymbol) {
        // const result = intlFormatCurrencyAndFilter({
        //     currency,
        //     intlOrCustomLocale: "en",
        //     value: 100000.123456,
        // });
        const result = "not supported yet";
        return {
            unit: hideCurrencySymbol ? "" : result.replace(/[\d|,|\.]*/g, ""),
            precision: result.replace(/[^\d]*/g, "").length - 6,
            separator: ".",
            delimiter: ",",
        };
    }

    loadCurrencySettings(settings) {
        if (!this.currencySettings[settings.currency]) {
            this.currencySettings[settings.currency] = this.getCurrencySettings(
                settings.currency,
                settings.hideCurrencySymbol
            );
        }
    }

    getValue(value, settings, oldValue) {
        this.loadCurrencySettings(settings);
        const mergedSettings = this.currencySettings[settings.currency];
        return super.getValue(value, mergedSettings, oldValue);
    }
    getRawValue(maskedValue, settings) {
        this.loadCurrencySettings(settings);
        return (
            this.removeNotNumbers(maskedValue) /
            Math.pow(10, this.currencySettings[settings.currency].precision)
        ).toString();
    }
}

// List of ISO 639-1 language codes
var langCodes = [
    'ab', 'aa', 'af', 'sq', 'am', 'ar', 'an', 'hy', 'as', 'ay',
    'az', 'ba', 'eu', 'bn', 'dz', 'bh', 'bi', 'br', 'bg', 'my',
    'be', 'km', 'ca', 'zh', 'co', 'hr', 'cs', 'da', 'nl', 'en',
    'eo', 'et', 'fo', 'fa', 'fj', 'fi', 'fr', 'fy', 'gl', 'gd',
    'gv', 'ka', 'de', 'el', 'kl', 'gn', 'gu', 'ht', 'ha', 'he',
    'iw', 'hi', 'hu', 'is', 'io', 'id', 'in', 'ia', 'ie', 'iu',
    'ik', 'ga', 'it', 'ja', 'jv', 'kn', 'ks', 'kk', 'rw', 'ky',
    'rn', 'ko', 'ku', 'lo', 'la', 'lv', 'li', 'ln', 'lt', 'mk',
    'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mo', 'mn', 'na', 'ne',
    'no', 'oc', 'or', 'om', 'ps', 'pl', 'pt', 'pa', 'qu', 'rm',
    'ro', 'ru', 'sm', 'sg', 'sa', 'sr', 'sh', 'st', 'tn', 'sn',
    'ii', 'sd', 'si', 'ss', 'sk', 'sl', 'so', 'es', 'su', 'sw',
    'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'to',
    'ts', 'tr', 'tk', 'tw', 'ug', 'uk', 'ur', 'uz', 'vi', 'vo',
    'wa', 'cy', 'wo', 'xh', 'yi', 'ji', 'yo', 'zu',
    // Chinese scripts
    'zh-Hans', 'zh-Hant'
];

function checkLang(code) {
    return code.length === 0  ||  langCodes.indexOf(code) !== -1;
}

// List of ISO country codes
var countryCodes = [
    'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AQ', 'AG', 'AR', 'AM',
    'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE',
    'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO',
    'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF',
    'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK',
    'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO',
    'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ',
    'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH',
    'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GN', 'GW', 'GY',
    'HT', 'HM', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ',
    'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KP',
    'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI',
    'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT',
    'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN',
    'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'AN',
    'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM',
    'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL',
    'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'SH', 'KN', 'LC',
    'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL',
    'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'ES', 'LK', 'SD',
    'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH',
    'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV',
    'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE',
    'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
];

function checkCountry(code) {
    return code.length === 0  ||  countryCodes.indexOf(code) !== -1;
}

// Check if a language tag has the form xx-YY, where xx is a valid
// language code and YY is a valid country code.
// Return 1 if the tag is invalid, or 2 if it is valid but has
// unconventional capitalization.
module.exports.checkLangTag = function (l) {
    if (!l || l.length === 0) { return 0; }
    var n = l.lastIndexOf('-');
    var lang = '', country = '';
    if (n === -1) {
        lang = l;
    } else {
        lang = l.slice(0,n); country = l.slice(n + 1, l.length);
    }
    return (checkLang(lang) && checkCountry(country)) ? 0
      : (checkLang(lang.toLowerCase()) && checkCountry(country.toUpperCase())) ? 2
      : 1;
};

export function yell (msg) {
	return msg.toUpperCase();
}

// include i18n helper function in handlebar
var _helpers = {};
_helpers.__ = function () {
    return i18n.__.apply(this, arguments);
};
_helpers.__n = function () {
    return i18n.__n.apply(this, arguments);
};

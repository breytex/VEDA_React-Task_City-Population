export const debounce = (func, wait) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			func(...args);
        }, wait);
	}
}

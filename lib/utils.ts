import { type ClassValue, clsx } from "clsx";
import { PressableStateCallbackType } from "react-native";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isTextChildren(
	children:
		| React.ReactNode
		| ((state: PressableStateCallbackType) => React.ReactNode),
) {
	return Array.isArray(children)
		? children.every((child) => typeof child === "string")
		: typeof children === "string";
}

export function isEqual(
	x: { [x: string]: any },
	y: { [x: string]: any },
): boolean {
	const ok = Object.keys,
		tx = typeof x,
		ty = typeof y;
	return x && y && tx === "object" && tx === ty
		? ok(x).length === ok(y).length &&
				ok(x).every((key) => isEqual(x[key], y[key]))
		: x === y;
}

export function getObjectDiff(
	obj1: Record<string, any>,
	obj2: Record<string, any>,
	compareRef = false,
): string[] {
	return Object.keys(obj1).reduce((result, key) => {
		if (!obj2.hasOwnProperty(key)) {
			result.push(key);
		} else if (isEqual(obj1[key], obj2[key])) {
			const resultKeyIndex = result.indexOf(key);

			if (compareRef && obj1[key] !== obj2[key]) {
				result[resultKeyIndex] = `${key} (ref)`;
			} else {
				result.splice(resultKeyIndex, 1);
			}
		}
		return result;
	}, Object.keys(obj2));
}

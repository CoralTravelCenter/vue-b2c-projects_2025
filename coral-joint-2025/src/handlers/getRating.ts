interface HotelCategory {
	isHalfStar: boolean;
	name: string;
	starCount: number;
}

export default function getRating(
	category: HotelCategory,
	key: string | number,
): number | string {
	const catValue = category[key];
	if (catValue?.name.includes("*")) {
		return Number(catValue?.name.replace("*", "").trim());
	} else {
		return catValue?.name;
	}
}

// @ts-ignore isolatedModules
import {CoralProduct} from "@/app";

const product = new CoralProduct({
	mode: 'onlyhotel',
	hotels: [
		'XANADU MAKADI BAY',
		'XANADU ISLAND HOTEL'
	],
	nights: 7,
	lookup: 14
})

console.log(product)
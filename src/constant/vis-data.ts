export const color = {
	0: "#448605",
	1: "#0D130A",
	2: "#254B05",
}

export const new_nodes = [
	{ id: "0", label: "A9601796", color: color[1], hidden: false },
	{ id: "1", label: "9 Mei 2004", color: color[1], hidden: false },
	{ id: "2", label: "Indonesia", color: color[1], hidden: false },
	{ id: "3", label: "7 Januari 1992", color: color[1], hidden: false },
	{ id: "4", label: "Jakarta Barat", color: color[1], hidden: false },
	{ id: "5", label: "Kalideres", color: color[1], hidden: false },
	{ id: "6", label: "317123654789001", color: color[1], hidden: false },
	{
		id: "7",
		label: "NIK: 317123578789004",
		color: color[0],
		title: "NIK: 317123578789004",
		hidden: false,
	},
	{ id: "8", label: "A9601796", color: color[1], hidden: false },
	{ id: "9", label: "9 Mei 2004", color: color[1], hidden: false },
	{ id: "10", label: "Indonesia", color: color[1], hidden: false },
	{ id: "11", label: "7 Januari 1992", color: color[1], hidden: false },
	{ id: "12", label: "Jakarta Barat", color: color[1], hidden: false },
	{ id: "13", label: "Kalideres", color: color[1], hidden: false },
	{ id: "14", label: "317123654789001", color: color[1], hidden: false },
	{ id: "15", label: "317123578789004", color: color[1], hidden: false },
]

export const new_edges = [
	{ from: 1, to: 0, color: color[2], hidden: false },
	{ from: 2, to: 0, color: color[2], hidden: false },
	{ from: 3, to: 0, color: color[2], hidden: false },
	{ from: 4, to: 0, color: color[2], hidden: false },
	{ from: 5, to: 0, color: color[2], hidden: false },
	{ from: 6, to: 0, color: color[2], hidden: false },
	{
		from: 7,
		to: 0,
		color: color[2],
		hidden: false,
		font: {
			multi: true,
			background: "#FFFFFF",
			padding: 5,
			color: "#000000",
		},
		label: "default to <b>html</b>",
	},
	{
		from: 7,
		to: 8,
		color: color[2],
		label: "Passport to NIK",
		font: {
			align: "top",
		},
		hidden: false,
		arrows: {
			to: {
				enabled: true,
			},
		},
	},
	{ from: 9, to: 8, color: color[2], hidden: false },
	{ from: 10, to: 8, color: color[2], hidden: false },
	{ from: 11, to: 8, color: color[2], hidden: false },
	{ from: 12, to: 8, color: color[2], hidden: false },
	{ from: 13, to: 8, color: color[2], hidden: false },
	{ from: 14, to: 8, color: color[2], hidden: false },
	{ from: 15, to: 8, color: color[2], hidden: false },
]

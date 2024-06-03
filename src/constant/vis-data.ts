export const color = {
	0: "#56C9CA",
	1: "#F3DB89",
	2: "#D9E1E9",
}

export const new_nodes = [
	{ id: "0", label: "A9601796", color: color[0] },
	{ id: "1", label: "9 Mei 2004", color: color[2] },
	{ id: "2", label: "Indonesia", color: color[2] },
	{ id: "3", label: "7 Januari 1992", color: color[2] },
	{ id: "4", label: "Jakarta Barat", color: color[1] },
	{ id: "5", label: "Kalideres", color: color[2] },
	{ id: "6", label: "317123654789001", color: color[2] },
	{
		id: "7",
		label: "NIK: 317123578789004",
		color: color[1],
		title: "NIK: 317123578789004",
	},
	{ id: "8", label: "A9601796", color: color[0] },
	{ id: "9", label: "9 Mei 2004", color: color[2] },
	{ id: "10", label: "Indonesia", color: color[2] },
	{ id: "11", label: "7 Januari 1992", color: color[2] },
	{ id: "12", label: "Jakarta Barat", color: color[1] },
	{ id: "13", label: "Kalideres", color: color[2] },
	{ id: "14", label: "317123654789001", color: color[2] },
	{ id: "15", label: "317123578789004", color: color[1] },
]

export const new_edges = [
	{ from: 1, to: 0, color: "#000000" },
	{ from: 2, to: 0, color: "#000000" },
	{ from: 3, to: 0, color: "#000000" },
	{ from: 4, to: 0, color: "#000000" },
	{ from: 5, to: 0, color: "#000000" },
	{ from: 6, to: 0, color: "#000000" },
	{ from: 7, to: 0, color: "#000000" },
	{
		from: 8,
		to: 7,
		color: "#000000",
		label: "Passport to NIK",
		font: {
			align: "top",
		},
	},
	{ from: 9, to: 8, color: "#000000" },
	{ from: 10, to: 8, color: "#000000" },
	{ from: 11, to: 8, color: "#000000" },
	{ from: 12, to: 8, color: "#000000" },
	{ from: 13, to: 8, color: "#000000" },
	{ from: 14, to: 8, color: "#000000" },
	{ from: 15, to: 8, color: "#000000" },
]

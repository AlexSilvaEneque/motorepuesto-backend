import Sale from "../models/Sale.js"
import Purchase from "../models/Purchase.js"
import { converttoMMDDYYYY } from "../utils/index.js"

const saleDate = async (req, res) => {
    const { initial, finish } = req.body
    
    try {
        const initialDate = converttoMMDDYYYY(initial)
        const finishDate = converttoMMDDYYYY(finish)
        initialDate.setHours(0, 0, 0)
        finishDate.setHours(23, 59, 59)

        console.log(initialDate, finishDate)

        const countSale = Sale.aggregate([
            {
                $match: {
                    date: {
                        $gte: initialDate,
                        $lte: finishDate
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: "$date" },
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]).exec()

        const moneyofSale = Sale.aggregate([
            {
                $match: {
                    date: {
                        $gte: initialDate,
                        $lte: finishDate
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: "$date" },
                    },
                    total: { $sum: '$total' }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]).exec()

        const [ sale, money ] = await Promise.all([
            countSale,
            moneyofSale
        ])

        res.json({
            sale,
            money
        })

    } catch (error) {
        console.log(error)
    }
}

const purchaseDate = async (req, res) => {
    const { initial, finish } = req.body
    
    try {
        const initialDate = converttoMMDDYYYY(initial)
        const finishDate = converttoMMDDYYYY(finish)
        initialDate.setHours(0, 0, 0)
        finishDate.setHours(23, 59, 59)

        console.log(initialDate, finishDate)

        const countPurchase = Purchase.aggregate([
            {
                $match: {
                    date: {
                        $gte: initialDate,
                        $lte: finishDate
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: "$date" },
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]).exec()

        const moneyofPurchase = Purchase.aggregate([
            {
                $match: {
                    date: {
                        $gte: initialDate,
                        $lte: finishDate
                    },
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: "$date" },
                    },
                    total: { $sum: '$total' }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]).exec()

        const [ purchase, money ] = await Promise.all([
            countPurchase,
            moneyofPurchase
        ])

        res.json({
            purchase,
            money
        })

    } catch (error) {
        console.log(error)
    }
}

const reportEmployee = async (req, res) => {
    try {
        const users = await Sale.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { user_id: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user_id"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "roles",
                                localField: "role",
                                foreignField: "_id",
                                as: "role"
                            }
                        },
                        {
                            $unwind: "$role"
                        }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$user._id",
                        name: "$user.first_name",
                        last_name: "$user.last_name",
                        email: "$user.email",
                        role: "$user.role.description"
                    },
                    totalSales: { $sum: 1 }
                }
            },
            {
                $sort: { totalSales: -1 }
            }
        ]).exec()

        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

const reportClient = async (req, res) => {
    try {
        const clients = await Sale.aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "client",
                    foreignField: "_id",
                    as: "client"
                }
            },
            {
                $unwind: "$client"
            },
            {
                $match: {
                    status: true
                }
            },
            {
                $group: {
                    _id: {
                        clientId: "$client._id",
                        name: "$client.name",
                    },
                    totalSales: { $sum: 1 }
                }
            },
            {
                $sort: { totalSales: -1 }
            }
        ]).exec()

        res.json(clients)
    } catch (error) {
        console.log(error)
    }
}

export {
    saleDate,
    purchaseDate,
    reportEmployee,
    reportClient
}
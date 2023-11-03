import Client from "../models/Client.js"
import Purchase from "../models/Purchase.js"
import Sale from "../models/Sale.js"
import Supplier from "../models/Supplier.js"

const allInformation = async (req, res) => {

    try {
        const countSales = Sale.countDocuments({ status: true })
        const countPurchases = Purchase.countDocuments({ status: true })
        const countClients = Client.countDocuments({ status: true })
        const countSuppliers = Supplier.countDocuments({ status: true })

        const currentDate = new Date()
        const twoMonthsAgo = new Date()
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 4)

        const saleTotalPromise = Sale.aggregate([
            {
                $match: {
                    date: { $gte: twoMonthsAgo, $lte: currentDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$date' }
                    },
                    total: { $sum: '$total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: 1
                }
            }
        ]).exec()

        const purchaseTotalPromise = Purchase.aggregate([
            {
                $match: {
                    date: { $gte: twoMonthsAgo, $lte: currentDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$date' }
                    },
                    total: { $sum: '$total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: 1
                }
            }
        ]).exec()

        const users = Sale.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
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
                        name: ["$user.first_name", "$user.last_name"]
                    },
                    totalSales: { $sum: 1 }
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $limit: 5
            }
        ]).exec()

        const [totalSales, totalPurchases, totalClients, totalSuppliers, saleResult, purchaseResult, user] = await Promise.all([
            countSales,
            countPurchases,
            countClients,
            countSuppliers,
            saleTotalPromise,
            purchaseTotalPromise,
            users
        ])

        const currentDate2 = new Date();
        const months = [];
        for (let i = 0; i < 4; i++) {
            const month = currentDate2.toISOString().slice(0, 7);
            months.unshift(month);
            currentDate2.setMonth(currentDate2.getMonth() - 1);
        }

        const totalsSale = {}
        const totalsPurchase = {}

        months.forEach(month => {
            totalsSale[month] = {"$numberDecimal": "0"}
            totalsPurchase[month] = {"$numberDecimal": "0"}
        })

        saleResult.forEach(item => {
            totalsSale[item.month] = item.total
        })

        purchaseResult.forEach(item => {
            totalsPurchase[item.month] = item.total
        })

        // ordena los meses de manera ascendente
        const sortedMonthsSale = Object.keys(totalsSale).sort();
        const sortedMonthsPurchase = Object.keys(totalsPurchase).sort();

        // crea un nuevo objeto ordenado
        const sortedTotalsSale = {};
        sortedMonthsSale.forEach(month => {
            sortedTotalsSale[month] = totalsSale[month];
        });

        const sortedTotalsPurhcase = {};
        sortedMonthsPurchase.forEach(month => {
            sortedTotalsPurhcase[month] = totalsPurchase[month];
        });

        res.json({
            countSales: totalSales,
            countPurchases: totalPurchases,
            countClients: totalClients,
            countSuppliers: totalSuppliers,
            resultTotal: sortedTotalsSale,
            resultTotal2: sortedTotalsPurhcase,
            users: user
        })

    } catch (error) {
        console.log(error)
    }
}

export {
    allInformation
}
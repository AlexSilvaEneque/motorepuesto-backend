import mercadopago from "mercadopago"
import Sale from "../models/Sale.js"

export const createOrder = async (req, res) => {
    // req.backURL = req.body.backURL
    // console.log(req.body.backURL)
    try {
        mercadopago.configure({
            access_token: "TEST-443917902288575-101018-6e594cbfb9bb17ebfbcf9dfd29475e51-1507882704"
        })

    
        const result = await mercadopago.preferences.create({
            items: req.body.formData,
            // items: req.body,
            // back_urls: {
            //     success: "https://64b3-190-237-30-35.ngrok-free.app/payment/verify",
            //     // failure: "http://localhost:4000/api/payment/failure",
            //     failure: "https://64b3-190-237-30-35.ngrok-free.app/payment/verify",
            //     pending: "https://64b3-190-237-30-35.ngrok-free.app/payment/verify"
            // },
            back_urls: {
                success: `https://fe23-190-235-110-142.ngrok-free.app/api/payment/success?id_sale=${req.body.backURL}`,
                // failure: "http://localhost:4000/api/payment/failure",
                failure: `https://fe23-190-235-110-142.ngrok-free.app/api/payment/failure?id_sale=${req.body.backURL}`,
                pending: `https://fe23-190-235-110-142.ngrok-free.app/api/payment/pending?id_sale=${req.body.backURL}`
            },
            // notification_url: `https://64b3-190-237-30-35.ngrok-free.app/payment/verify`
            notification_url: `https://fe23-190-235-110-142.ngrok-free.app/api/payment/webhook?id=${req.body.backURL}`
        })
        console.log('init_point: ', result.response.init_point)
        res.json({
            msg: 'Redirigiendo',
            redirect: result.response.init_point
        })        
    } catch (error) {
        console.log(error)
    }
}

export const webhookOrder = async (req, res) => {
    const payment = req.query
    if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment['data.id'])
        // cambiar el estado de la venta
        if (req.query.id) {
            const sale = await Sale.findById(req.query.id)
            if (!sale) {
                return handleNotFoundError('La venta no existe', res)
            }
            
            sale.statusPayment = true
            try {
                await sale.save()
                res.json({
                    msg: 'Venta pagada'
                })
            } catch (error) {
                console.log(error)
            }
        }
        console.log('de data')
        console.log(data.response)
    }
}

// cuando se have una transaccion luego redirecciona a una ventana nueva
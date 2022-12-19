require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");

module.exports.orders = (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount:req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    //   receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.send({ code: 500, message: "server err" });
    }
    return res.send({ code: 200, message: "order created", data: order });

    //console.log(order);
  });
  //res.send(orders);
};

//rzp_test_tcbbwJBuwVwpT3 = key id
//4BBIMqA6Dj7mLwQ46X53VwdX == key secret

module.exports.verify = (req , res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  
  var expectedSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(body.toString())
    .digest("hex");
//   console.log("sig received ", req.body.response.razorpay_signature);
//   console.log("sig generated ", expectedSignature);
  //var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature){
    res.send({code:200 , message:"sign valid" });
  }else{
    res.send({code:500 , message:"sign not valid" });
  }
    //response = { signatureIsValid: "true" };
 

  
};

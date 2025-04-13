const prisma = require("./config/schema.prisma");

exports.createOrder = async (req, res) =>{
    try {
        const userId = req.user.id;
      
    

        let {
          address,
          order_description,
          items,
          totalPrice

         
        } = req.body;
    
        if (
          !address ||
          !items
        ) {
          return res.status(400).json({
            success: false,
            message: "All Fields are Mandatory",
          });
        }
    
        const newOrder = await prisma.Order.create({
            address,
            order_description,
            items,
            totalPrice  
        });
    
        await prisma.User.findByIdAndUpdate(
          { _id: userId },
          {
            $push: {
                orders: newOrder._id,
            },
          },
          { new: true }
        );
    
        res.status(200).json({
          success: true,
          data: newOrder,
          message: "Order Created Successfully",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to create Order",
          error: error.message,
        });
      }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    const curr_status = req.body;
    const order = await prisma.Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }


  
          order[status] = curr_status;
     

    await order.save();

    const updatedOrder = await Course.findOne({_id: orderId})
 

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


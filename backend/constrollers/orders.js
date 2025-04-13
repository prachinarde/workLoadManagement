const prisma = require("./config/schema.prisma");

exports.createOrder = async (req, res) =>{
    try {
        const userId = req.user.id;
      
    
        let {
          address,
          order_description,
          items,
          status,
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
            status,
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
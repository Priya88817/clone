const express=require('express')
const router=express.Router();
const isloggedin=require("../middlewares/isLoggedIn");
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
router.get("/",function(req,res)
{
    let error=req.flash("error");
    res.render("index",{error,loggedin:false});
});
router.get("/shop",isloggedin,async function(req,res)
{
    let products =await productModel.find();
    let success=req.flash("success")
    res.render("shop",{products,success});
})
router.get("/cart",isloggedin,async function(req,res)
{
    let user= await userModel.findOne({email:req.user.email}).populate("cart.product");
    // console.log(user.cart);
    // res.send("satyam");
    if(user.cart.length === 0)
    {
        req.flash("Cart is empty!");
        res.redirect("/shop");
    }
    else{
        res.render("cart",{user});
    }
})
router.get("/addtocart/:productid",isloggedin,async function(req,res)
{
    const productId = req.params.productid;

    let user=await userModel.findOne({email:req.user.email})
    const existingItem = user.cart.find(item => item.product.toString() === productId) // here item is a pair

    if(existingItem)
    {
        existingItem.count += 1;
    }
    else
    {
        user.cart.push({
            product:req.params.productid,
            count: 1
        })
    }
    await user.save();
    req.flash("success","Added to Cart")
    res.redirect("/shop")

})
router.post("/addtocart/:productid",isloggedin,async function(req,res)
{
    const productId = req.params.productid;

    let user=await userModel.findOne({email:req.user.email})
    const existingItem = user.cart.find(item => item.product.toString() === productId) // here item is a pair

    if(existingItem)
    {
        existingItem.count += 1;
    }
    else
    {
        user.cart.push({
            product:req.params.productid,
            count: 1
        })
    }
    await user.save();
    req.flash("success","Added to Cart")
    res.redirect("/cart")

})
router.post("/subtractfromCart/:productid",isloggedin,async(req,res)=>{
    const productId = req.params.productid;
    let user=await userModel.findOne({email:req.user.email})
    const existingItem = user.cart.find(item => item.product.toString() === productId) // here item is a pair
    existingItem.count -=1;
    if(existingItem.count == 0)
    {
        user.cart = user.cart.filter(i => i.product.toString() !== productId);
    }
    await user.save();
    req.flash("success","Added to Cart")
    res.redirect("/cart")

})
router.get("/logout",isloggedin,function(req,res){
    res.render("shop")
})
module.exports=router;

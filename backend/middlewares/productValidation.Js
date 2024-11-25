const joi = require('joi');

const productSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.decimal().required(),
});

const validateProduct =(req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);  
    } next();
};
module.exports = {validateProduct};
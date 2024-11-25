const joi = require('joi');
// const Categorie = require('../modelscategorieModel');

//schema de validation pour les categorie 

const categorieSchema = joi.object({
    name: joi.string().required().message({
        'string.empty': 'le nom de la categorie est obligatoire !!!',
        'any.required': 'le nom de la categorie est obligatoire !!!'
    }),
});

//middleware pour valider la categorie lors de la creation ou la mise a jour
const  validateCategorie = (req, res, next) => {
    const {error} = categorieSchema.validate(req.body);
    if (error) {
        return res.status(500).json({ message: error.details[0].message })
    } next();
} 

//middliware pour verifier si la categorie existe

const checkCategorieExists = async (req, res, next) => {
    const { id } = req.params;

    try {
        const categorie = await Categorie.findById(id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { validateCategorie, checkCategorieExists };
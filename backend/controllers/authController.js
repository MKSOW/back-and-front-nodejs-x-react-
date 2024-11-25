// const User = require('../models/userModel'); // Modèle utilisateur
// const bcrypt = require('bcrypt');            // Pour le hachage des mots de passe
// const jwt = require('jsonwebtoken');         // Pour la génération des tokens

// // Inscription d'un utilisateur
// exports.register = async (req, res) => {
//     const { username, email, password, role } = req.body;

//     try {
//         // Vérifier si l'utilisateur existe déjà
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hachage du mot de passe
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Créer un nouvel utilisateur
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         const savedUser = await newUser.save();

//         res.status(201).json({
//             message: 'User created successfully',
//             user: savedUser,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Connexion d'un utilisateur
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Vérifier si l'utilisateur existe
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Comparer les mots de passe
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Générer un token JWT
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,  // Clé secrète JWT
//             { expiresIn: '1h' }      // Le token expire après 1 heure
//         );

//         res.status(200).json({
//             message: 'Login successful',
//             token,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

const Sauce = require('../models/Sauce');
const fs = require('fs');



// afficher la page sauces
exports.getAllSauce = (req, res, next) =>{
    //req.session.isAuth = true;
    Sauce.find()
    .then((sauces) => {
        res.status(200).json(sauces)
    })
    .catch((error) => {
        res.status(400).json({
            error
        });
    });
};

// creer un sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,       
    });
    sauce.save()
     .then(() =>{
        res.status(201).json({
            message:'produit bien create !'
        })       
     })
     .catch((error) => {
        res.status(400).json({
            error
        })
     });
};

// trouver un sauce par id
exports.findOneSauce = (req, res, next) =>{
    Sauce.findOne({
        _id: req.params.id
    })
    .then((sauceUnique) => {
        res.status(200).json(sauceUnique)
    })
    .catch((error) => {
        res.status(400).json(error)
    });
};

//modifier un sauce
exports.updataSauce = (req, res, next) => {
    const sauceObject = req.file?{
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } :{...req.body};
    Sauce.updateOne({_id: req.params.id},
        {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => {
            res.status(200).json({
                message:'chaîne'
            })
        })
        .catch((error) => {
            res.status(400).json({error})
        });
    
};


// supprimer un sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => {
                res.status(200).json({
                    message:'Sauce bien supprimer !'
                })
            })
            .catch((error) => {
                res.status(400).json({
                    error
                })
            })
        })
    })
    .catch((error) => {
        res.status(500).json({error})
    });

};


//recuperer like dislike et leur userid
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let objectId = req.params.id;
    if(like===1){//like
        Sauce.updateOne(
            {_id: objectId},
            {
            $inc:{likes: 1},
            $push:{usersLiked: userId}
            }
        )
        .then(() => {res.status(201).json({message:'votre avis ete bien ajoute !'})})
        .catch((error) => {res.status(400).json({error})});
    }
    if(like===-1){ //dislike
        Sauce.updateOne(
            {_id: objectId},
            {
                $inc:{dislikes: 1},//incrementer un like dans tableau
                $push:{usersDisliked: req.body.userId}// push le userid de like dans tableau
            }
        )
        .then(() => {res.status(201).json({message:'votre avis ete bien ajoute !'})})
        .catch((error) => {res.status(400).json({error})});
    }
    if(like===0){// supprimer like dislike ou sans like
        Sauce.findOne({_id:objectId})
        .then((sauce) => {
            if (sauce.usersLiked.includes(userId)){//supprimer like
                Sauce.updateOne(
                    {_id:objectId},
                    {
                        $inc:{likes:-1},// incrementer -1 like dans tableau
                        $pull:{usersLiked:userId}, // tirer userid de dislike dans tableau usersLiked
                    }
                    )
                    .then(() => {res.status(201).json({message:'Votre like ete retire !'})})
                    .catch((error) => {res.status(400).json({error})});
            }
            if (sauce.usersDisliked.includes(userId)){// supprimer disliked
                Sauce.updateOne(
                    {_id: objectId},
                    {
                        $inc:{dislikes:-1},// incrementer -1 dislikes dans tableau
                        $pull:{usersDisliked:userId}// tirer userid dans tableau usersDisliked
                    }                   
                    )
                    .then(() => {res.status(201).json({message:'Votre like ete retire !'})})
                    .catch((error) => {res.status(400).json({error})});
            }
        })
        .catch((error) => {res.status(500).json({error})});
        

    };
    
};


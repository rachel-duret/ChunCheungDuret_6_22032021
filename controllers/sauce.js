const Sauce = require('../models/Sauce');
const fs = require('fs');




exports.getAllSauce = (req, res, next) =>{
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

exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let objectId = req.params.id;
    if(like===1){
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
    if(like===-1){
        Sauce.updateOne(
            {_id: objectId},
            {
                $inc:{dislikes: 1},
                $push:{usersDisliked: req.body.userId}
            }
        )
        .then(() => {res.status(201).json({message:'votre avis ete bien ajoute !'})})
        .catch((error) => {res.status(400).json({error})});
    }
    if(like===0){
        Sauce.findOne({_id:objectId})
        .then((sauce) => {
            if (sauce.usersLiked.includes(userId)){
                Sauce.updateOne(
                    {_id:objectId},
                    {
                        $inc:{likes:-1},
                        $pull:{usersLiked:userId}, 
                    }
                    )
                    .then(() => {res.status(201).json({message:'Votre like ete retire !'})})
                    .catch((error) => {res.status(400).json({error})});
            }
            if (sauce.usersDisliked.includes(userId)){
                Sauce.updateOne(
                    {_id: objectId},
                    {
                        $inc:{dislikes:-1},
                        $pull:{usersDisliked:userId}
                    }                   
                    )
                    .then(() => {res.status(201).json({message:'Votre like ete retire !'})})
                    .catch((error) => {res.status(400).json({error})});
            }
        })
        .catch((error) => {res.status(500).json({error})});
        

    };
    
};


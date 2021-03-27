const express = require('express');

const router = express.Router();

const elastic = require('@elastic/elasticsearch');

const bodyParser = require('body-parser').json();

const elasticClient = new elastic.Client({

    node: 'http://localhost:9200'
});


let products = [
    {
        "id": "1",
        "name": "Chelutu",
        "categories": ["caine", "mamifer"],
        "description": "Cainele lui Dorian"
    },
    {
        "id": "2",
        "name": "Dorian",
        "categories": ["om", "mamifer"],
        "description": "Stapanul lui Chelutu"
    },
    {
        "id": "3",
        "name": "Cori",
        "categories": ["vaca", "mamifer"],
        "description": "Ajutorul lui Dorian"
    }
];


router.use((req, res, next) => {
    elasticClient.index({
        index: 'logs',

        body: {
            url: req.url,
            method: req.method,
        }    

    })
    .then(res=>{
        console.log('Logs indexed');
    })
    .catch(err=>{
        console.log(err);
    });

    next();
});


router.post('/products', bodyParser, (req,res)=>{
    elasticClient.index({
        index: 'products',
        body: req.body
    })
    .then(resp=>{
        return res.status(200).json({
            msg: 'product indexed'
        });
    })
    .catch(err=>{
        return res.status(500).json({
            msg: 'Error',
            err
        });
    });
});

router.get('/products/:id', (req, res)=>{
    let query = {
        index: 'products',
        id: req.params.id
    }
    elasticClient.get(query)
    .then(resp=>{
        if(!resp){
            return res.status(404).json({
                product: resp
            });
        }
        return res.status(200).json({
            product: resp
        });
    })
    .catch(err=>{
        return res.status(500).json({
            msg: 'Error not found',
            err
        });
    });

});

router.put('/products/:id', bodyParser, (req,res)=>{
    elasticClient.update({
        index: 'products',
        id: req.params.id,
        body: {
            doc: req.body
        }
    })
    .then(resp=>{
        return res.status(200).json({
           msg: 'product updated' 
        });
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({
            msg: 'Error',
            err
        });
    });
});

router.delete('/products/:id', (req, res)=>{
    elasticClient.delete({
        index: 'products',
        id: req.params.id
    })
    .then(resp=>{
        res.status(200).json({
            'msg': 'Error'
        });
    })
    .catch(err=>{
        res.status(404).json({
            'msg': 'Error'
        });
    });

});

router.get('/products', (req,res)=>{

    let query = {
        index: 'products'
    }

    if(req.query.product) query.q = `*${req.query.product}*`;
    elasticClient.search(query)
    .then(reps=>{
        return res.status(200).json({
            products: resp.hits.hits
        });
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            msg: 'Error',
            err
        });
    });

});

module.exports = router;
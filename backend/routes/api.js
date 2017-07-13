const express = require('express');
const router = express.Router();
const log = require('../utils/logger');
const typelist = require('../constants/typelist.json');
const citylist = require('../constants/citylist.json');
const _ = require('lodash');

//get 活动分类
router.get('/type', function (req, res) {
    let paras = req.query || {};
    res.send(typelist);
});

//get 城市
router.get('/city', function (req, res) {
    let paras = req.query || {};
    if (paras.search){
        res.send(citylist.filter(item => (item.name.indexOf(paras.search)>-1 || item.uid.indexOf(paras.search)>-1)));
    }else {
        res.send(citylist);
    }
});

//get 活动搜索
router.get('/event', function (req, res) {
    let paras = req.query || {};
    //todo 根据关键词和城市搜索
    res.send({});
});

// router.post('/event', function (req, res) {
//     let paras = req.body || {};
// });

module.exports = router;

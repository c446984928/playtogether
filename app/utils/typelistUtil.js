/**
 * Created by llccc on 2017/7/11.
 */

import * as store from "react-native-simple-store";

let typeList = [
    {
        "id": 1,
        "uid": "all",
        "name": "所有"
    },
    {
        "id": 10,
        "uid": "music",
        "name": "音乐"
    },
    {
        "id": 11,
        "uid": "drama",
        "name": "戏剧"
    },
    {
        "id": 12,
        "uid": "exhibition",
        "name": "展览"
    },
    {
        "id": 13,
        "uid": "salon",
        "name": "讲座"
    },
    {
        "id": 14,
        "uid": "party",
        "name": "聚会"
    },
    {
        "id": 15,
        "uid": "sports",
        "name": "运动"
    },
    {
        "id": 16,
        "uid": "travel",
        "name": "旅行"
    },
    {
        "id": 17,
        "uid": "commonweal",
        "name": "公益"
    },
    {
        "id": 18,
        "uid": "film",
        "name": "电影"
    },
    {
        "id": 19,
        "uid": "competition",
        "name": "赛事"
    },
    {
        "id": 20,
        "uid": "course",
        "name": "课程"
    },
    {
        "id": 21,
        "uid": "kids",
        "name": "亲子"
    },
    {
        "id": 101,
        "uid": "other",
        "name": "其他"
    }
];


/*get event uid from event id ,because douban api need uid
 item sample:
 {
 "id": 1,
 "uid": "all",
 "name": "所有"
 }*/
export function getUidFromId(id){
    for (let item of typeList) {
        if (item.id === id) {
            return item.uid;
        }
    }
}
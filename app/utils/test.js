'use strict';
/**
 * Created by calvin_chen on 2017/6/14.
 */
function demo() {
    console.log(this);
}

let b = demo.prototype;
let a = new demo();
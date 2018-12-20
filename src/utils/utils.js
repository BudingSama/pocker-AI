import { number } from "prop-types";

//created by buding 2018.12.18

//牌组
const createPockerArray = () => {
    //除10取整为牌面大小 取余为花色{1：红桃2：方片3：黑桃4：梅花}
    const PockerArray = [];
    for(let i = 3; i < 16; i++) {
        for(let j = 1; j < 5; j++) {
            PockerArray.push(i * 10 + j);
        }
    }
    PockerArray.push(161,162);
    return PockerArray
}
//洗牌
const refreshPocker = (arr) => {
    const len = arr.length;
    const PockerArray = [[],[],[],[]];
    let index = 0;
    for(let i = 0; i < len - 1; i++){
        let idx = Math.floor(Math.random() * (len - i));
        let temp = arr[idx];
        arr[idx] = arr[len - i - 1];
        arr[len - i -1] = temp;
    }
    arr.forEach((ele, ind) => {
        if(ind > 50){
            PockerArray[3].push(ele)
        }else{
            index++;
            PockerArray[index - 1].push(ele);
            index = index === 3 ? 0 : index;
        }
    })
    return PockerArray;
}

//AI模块
const AIfunc = (arr) => {

}

//牌型分析
//分析顺序 炸弹->三顺->单顺->双顺->对子->散牌
const checkPockerType = (arr) => {
}

//单顺
const dsType = (arr) => {
    //23456 34567 45678 56789 678910 78910J 10JQKA
    arr.sort((a,b)=>a-b);
    const dsArr = [];
    for(let i = 0; i < arr.length - 4; i ++){
        if(!arr[i] || arr[i] === 15 || arr[i] === 16){
            //踢出大小王以及2
            continue
        }
        let item = [];
        let dataitem = [];
        for(let j = 0; j < 5; j ++){
            if(!arr[i]+j || arr[i]+j === 15 || arr[i]+j === 16){
                //踢出大小王以及2
                continue
            }
            let index = arr.indexOf(arr[i]+j)
            if(index > -1){
                item.push(index);
                dataitem.push(arr[i]+j)
                if(item.length === 5){
                    //清除
                    dsArr.push(dataitem);
                    item.forEach(ele => {
                        arr.splice(ele,1,0)
                    })
                }
            }else{
                break;
            }
        }
    }
    //单顺拓展
    const singleArr = [];
    arr.forEach(ele => {
        if(ele){
            singleArr.push(ele)
        }
    })
    dsArr.forEach(ele => {
        if(ele instanceof Array){
            singleArr.forEach(item => {
                const minIndex = singleArr.indexOf(ele[0] - 1);
                const maxIndex = singleArr.indexOf(ele[ele.length - 1] + 1)
                if(minIndex > -1){
                    //极小
                    ele.unshift(ele[0] - 1);
                    singleArr.splice(minIndex, 1);
                }else if(maxIndex > -1&&ele[ele.length - 1] + 1!==15&&ele[ele.length - 1] + 1!==16){
                    //极大
                    ele.push(ele[ele.length - 1] + 1);
                    singleArr.splice(maxIndex, 1);
                }
            })
        }
    })
    //合并连牌
    const multArr = [];
    if(dsArr.length > 1){
        for(let i = 0; i < dsArr.length - 1; i +=1){
            for(let j = i+1; j < dsArr.length; j +=1){
                if(dsArr[i][dsArr[i].length - 1] + 1 === dsArr[j][0]){
                    const mutlItem = dsArr[i].concat(dsArr[j]);
                    multArr.push(mutlItem);
                    delete dsArr[i];
                    dsArr.splice(j,1);
                    dsArr.splice(i,1);
                }
            }
        }
    }
    stType({
        ds:multArr.concat(dsArr),
        other:singleArr
    })
    return {
        ds:multArr.concat(dsArr),
        other:singleArr.sort((a,b)=>a-b)
    }
}
//对子
const multType = (obj) => {
    //检索对子
    const multArr = [];
    const arr = obj.other;
    for(let i = 0; i < arr.length - 1; i ++){
        for(let j = i + 1; j < arr.length; j ++){
            if(arr[i] === arr[j] && arr[i]!==16){
                multArr.push([arr[i],arr[i]]);
                delete arr[i];
                delete arr[j];
                break;
            }
        }
    }
    const other = [];
    obj.other.forEach(ele => {
        if(ele){
            other.push(ele)
        }
    })
    return {
        ...obj,
        other,
        dz:multArr
    }
}

//双顺
const ssType = (obj) => {
    //检索对子
    const multArr = [];
    const arr = obj.other;
    for(let i = 0; i < arr.length - 1; i ++){
        for(let j = i + 1; j < arr.length; j ++){
            if(arr[i] === arr[j] && arr[i]!==16){
                multArr.push(arr[i]);
                delete arr[i];
                delete arr[j];
                break;
            }
        }
    }
    //连对筛选
    const multList = [];
    for(let i = 0; i < multArr.length - 2; i ++){
        if(multArr[i] + 2 === multArr[i+1] + 1 && multArr[i] + 2 === multArr[i+2] && multArr[i+1] !== 15 && multArr[i+2] !== 16){
            multList.push([multArr[i],multArr[i+1],multArr[i+2]]);
            delete multArr[i];
            delete multArr[i+1];
            delete multArr[i+2];
        }
    }
    //连对拓展
    multList.forEach(ele => {
        if(ele instanceof Array){
            multArr.forEach(item => {
                if(item){
                    const minIndex = multArr.indexOf(ele[0] - 1);
                    const maxIndex = multArr.indexOf(ele[ele.length - 1] + 1);
                    if(minIndex > -1){
                        //极小
                        ele.unshift(ele[0] - 1);
                        multArr.splice(minIndex, 1, null);
                    }else if(maxIndex > -1 && ele[ele.length - 1] + 1 !== 15 && ele[ele.length - 1] + 1 !== 16){
                        ele.push(ele[ele.length - 1] + 1);
                        multArr.splice(maxIndex, 1, null);
                    }
                }
        })
        }
    })
    //合并连对
    const ldArr = [];
    if(multList.length > 1){
        for(let i = 0; i < multList.length - 1; i +=1){
            for(let j = i+1; j < multList.length; j +=1){
                if(multList[i][multList[i].length - 1] + 1 === multList[j][0]){
                    const mutlItem = multList[i].concat(multList[j]);
                    ldArr.push(mutlItem);
                    delete multList[i];
                    multList.splice(j,1);
                    multList.splice(i,1);
                }
            }
        }
    }
    const dz = [];
    const ld = [];
    const other = [];
    multArr.forEach(ele => {
        if(ele){
            dz.push([ele,ele])
        }
    })
    ldArr.forEach(ele => {
        const item = [];
        ele.forEach(data => {
            item.push([data,data])
        })
        ld.push(item);
    })
    multList.forEach(ele => {
        const item = [];
        ele.forEach(data => {
            item.push([data,data])
        })
        ld.push(item);
    })
    obj.other.forEach(ele => {
        if(ele){
            other.push(ele)
        }
    })
    const totalData = {
        dz,
        ld,
        other:other.sort((a,b)=>a-b)
    }
    console.log(totalData)
    return totalData
}

//三条
const stType = (obj) => {
    const threeArr = [];
    const arr = obj.other;
    //检索三单
    for(let i = 0; i < arr.length - 2; i ++){
        if(arr[i] === arr[i+1] && arr[i+1] === arr[i+2]){
            threeArr.push(arr[i]);
            delete arr[i];
            delete arr[i+1];
            delete arr[i+2];
        }
    }
    //检索三顺[>=2]
    const fjArr = [];
    for(let i = 0; i < threeArr.length - 1; i ++){
        if(threeArr[i] + 2 === threeArr[i+1] + 1){
            fjArr.push([threeArr[i],threeArr[i+1]])
            delete threeArr[i];
            delete threeArr[i+1];
        }
    }
    //拓展三顺
    fjArr.forEach(ele => {
        threeArr.forEach(data => {
            if(data){
                const minIndex = threeArr.indexOf(ele[0] - 1);
                const maxIndex = threeArr.indexOf(ele[ele.length - 1] + 1);
                if(minIndex > -1){
                //极小
                ele.unshift(ele[0] - 1);
                threeArr.splice(minIndex, 1, null);
                }else if(maxIndex > -1){
                //极大
                ele.push(ele[ele.length - 1] + 1);
                threeArr.splice(maxIndex, 1, null);
                }
            }
        })
    })
    //合并三顺
    const fjList = [];
    if(fjArr.length > 1){
        for(let i = 0; i < fjArr.length - 1; i +=1){
            for(let j = i+1; j < fjArr.length; j +=1){
                if(fjArr[i][fjArr[i].length - 1] + 1 === fjArr[j][0]){
                    const mutlItem = fjArr[i].concat(fjArr[j]);
                    fjList.push(mutlItem);
                    delete fjArr[i];
                    fjArr.splice(j,1);
                    fjArr.splice(i,1);
                }
            }
        }
    }
    const ssArr = [];
    const other = [];
    const sdArr = [];
    fjList.forEach(ele => {
        const item = [];
        ele.forEach(data => {
            item.push([data,data,data])
        })
        ssArr.push(item);
    })
    fjArr.forEach(ele => {
        if(ele){
            const item = [];
            ele.forEach(data => {
                item.push([data,data,data])
            })
            ssArr.push(item);
        }
    })
    threeArr.forEach(ele => {
        if(ele){
            sdArr.push([ele,ele,ele])
        }
    })
    obj.other.forEach(ele => {
        if(ele){
            other.push(ele);
        }
    })
    const totalData = {
        ...obj,
        other,
        ss:ssArr,
        sd:sdArr
    }
    return totalData
}

//炸弹
const bombType = (arr) => {
    //检索火箭
    const rocketArr = [];
    for(let i = 0; i < arr.length; i ++){
        if(Math.floor(arr[i] / 10) === 16){
            rocketArr.push(i);
        }
        if(rocketArr.length>=2){
            rocketArr.forEach(ele => {
                arr.splice(ele,1,null);
            })
            break;
        }
    }
    //检索普通炸弹
    const bombArr = [];
    for(let i = 0; i < arr.length - 1; i ++){
        const item = [arr[i]];
        for(let j = i+1; j < arr.length; j ++){
            if(Math.floor(arr[i]/10) === Math.floor(arr[j]/10) && arr[i] && arr[j]){
                item.push(arr[j]);
            }
        }
        if(item.length >= 4){
            bombArr.push(item);
        }
    }
    bombArr.forEach(ele => {
        if(ele instanceof Array){
            arr.forEach((data,index) => {
                if(Math.floor(data/10) === Math.floor(ele[0]/10)){
                    delete arr[index]
                }
            })
        }
    })
    const other = [];
    arr.forEach(ele => {
        if(ele){
            other.push(ele);
        }
    })
    if(rocketArr.length === 2){
        bombArr.push([161,162])
    }
    const totalData = {
        bomb:bombArr,
        other
    }
    console.log(totalData)
    return totalData
}




export default {
    createPockerArray,
    refreshPocker,
    dsType,
    bombType
}
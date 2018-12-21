import { number, object } from "prop-types";

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
//分析顺序 炸弹->三顺->三条->单顺->双顺->对子->散牌
/*
{
  bomb:炸弹
  ds:单顺
  dz:对子
  ls:双顺
  sd:三条
  ss:三顺
  other:散牌/未分配完成牌组
}
*/
const checkPockerType = (arr) => {
}

//单顺
const dsType = (obj) => {
    //23456 34567 45678 56789 678910 78910J 10JQKA
    const arr = obj.other.sort((a,b)=>a-b);
    const dsArr = [];
    for(let i = 0; i < arr.length - 4; i ++){
        if(arr[i] && Math.floor(arr[i]/10) !== 15 && Math.floor(arr[i]/10) !== 16){
            //踢出大小王以及2
            let item = [];
            let dataitem = [];
            for(let j = 0; j < 5; j++){
                if(arr[i]+j && Math.floor(arr[i]/10)+j !== 15 && Math.floor(arr[i]/10)+j !== 16){
                    //踢出大小王以及2
                    const indexArr = arr.map(ele => Math.floor(ele/10))
                    let index = indexArr.indexOf(Math.floor(arr[i]/10)+j);
                    if(index > -1){
                        item.push(index);
                        dataitem.push(arr[index])
                        if(item.length === 5){
                            //清除
                            dsArr.push(dataitem);
                            item.forEach(ele => {
                              delete arr[ele]
                            })
                            item.splice(0,item.length - 1)
                        }
                    }else{
                        break;
                    }
                }
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
                const indexArr = singleArr.map(res => Math.floor(res/10))
                const minIndex = indexArr.indexOf(Math.floor(ele[0]/10) - 1);
                const maxIndex = indexArr.indexOf(Math.floor(ele[ele.length - 1]/10) + 1)
                if(minIndex > -1){
                    //极小
                    ele.unshift(singleArr[minIndex]);
                    singleArr.splice(minIndex, 1);
                }else if(maxIndex > -1&&Math.floor(ele[ele.length - 1]/10) + 1!==15&&Math.floor(ele[ele.length - 1]/10) + 1!==16){
                    //极大
                    ele.push(singleArr[maxIndex]);
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
                if(Math.floor(dsArr[i][dsArr[i].length - 1]/10) + 1 === Math.floor(dsArr[j][0]/10)){
                    const mutlItem = dsArr[i].concat(dsArr[j]);
                    multArr.push(mutlItem);
                    delete dsArr[i];
                    dsArr.splice(j,1);
                    dsArr.splice(i,1);
                }
            }
        }
    }
    const totalData = {
      ...obj,
      other:singleArr,
      ds:multArr.concat(dsArr),
    }
    //检索双顺
    ssType(totalData)
}

//双顺
const ssType = (obj) => {
    //检索对子
    const multArr = [];
    const arr = obj.other.sort((a,b)=>a-b);
    for(let i = 0; i < arr.length - 1; i ++){
        for(let j = i + 1; j < arr.length; j ++){
            if(Math.floor(arr[i]/10) === Math.floor(arr[j]/10) && Math.floor(arr[i])!==16){
                multArr.push([arr[i],arr[j]]);
                delete arr[i];
                delete arr[j];
                break;
            }
        }
    }
    //连对筛选
    const multList = [];
    for(let i = 0; i < multArr.length - 2; i ++){
        if(multArr[i] && multArr[i+1] && multArr[i+2] && Math.floor(multArr[i][0]/10) + 2 === Math.floor(multArr[i+1][0]/10) + 1 && Math.floor(multArr[i][0]/10) + 2 === Math.floor(multArr[i+2][0]/10) && Math.floor(multArr[i+1][0]/10) !== 15 && Math.floor(multArr[i+2][0]/10) !== 16){
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
                    const indexArr = multArr.map(ele => {
                      return ele ? Math.floor(ele[0]/10) : null
                    })
                    const minIndex = indexArr.indexOf(Math.floor(ele[0][0]/10) - 1);
                    const maxIndex = indexArr.indexOf(Math.floor(ele[ele.length - 1][0]/10) + 1);
                    if(minIndex > -1){
                        //极小
                        ele.unshift(multArr[minIndex]);
                        multArr.splice(minIndex, 1, null);
                    }else if(maxIndex > -1 && Math.floor(ele[ele.length - 1]/10) + 1 !== 15 && Math.floor(ele[ele.length - 1]/10) + 1 !== 16){
                        ele.push(multArr[maxIndex]);
                        multArr.splice(maxIndex, 1, null);
                    }
                }
        })
        }
    })
    //合并连对
    // const ldArr = [];
    // if(multList.length > 1){
    //     for(let i = 0; i < multList.length - 1; i +=1){
    //         for(let j = i+1; j < multList.length; j +=1){
    //             if(Math.floor(multList[i][multList[i].length - 1]/10) + 1 === Math.floor(multList[j][0])/10){
    //                 const mutlItem = multList[i].concat(multList[j]);
    //                 ldArr.push(mutlItem);
    //                 delete multList[i];
    //                 multList.splice(j,1);
    //                 multList.splice(i,1);
    //             }
    //         }
    //     }
    // }
    const other = [];
    const dz = [];
    multArr.forEach(ele => {
      if(ele){
        dz.push(ele)
      }
    })
    arr.forEach(ele => {
      if(ele){
        other.push(ele)
      }
    })
    const totalData = {
      ...obj,
      other:other.sort((a,b)=>a-b),
      ls:multList,
      dz
    }
    console.log(totalData)
    startPocker(totalData)
    return totalData
}

//三条
const stType = (obj) => {
    const threeArr = [];
    const arr = obj.other.sort((a,b)=>a-b);
    //检索三单
    for(let i = 0; i < arr.length - 2; i ++){
        if(Math.floor(arr[i]/10) === Math.floor(arr[i+1]/10) && Math.floor(arr[i]/10) === Math.floor(arr[i+2]/10)){
            threeArr.push([arr[i],arr[i+1],arr[i+2]]);
            delete arr[i];
            delete arr[i+1];
            delete arr[i+2];
        }
    }
    //检索三顺[>=2]
    const fjArr = [];
    for(let i = 0; i < threeArr.length - 1; i ++){
        if(threeArr[i] && Math.floor(threeArr[i][0]/10) + 1 === Math.floor(threeArr[i+1][0]/10)){
            fjArr.push([threeArr[i],threeArr[i+1]])
            delete threeArr[i];
            delete threeArr[i+1];
        }
    }
    //拓展三顺
    fjArr.forEach(ele => {
        threeArr.forEach(data => {
            if(data){
                const indexArr = threeArr.map(res => Math.floor(res[0]/10))
                const minIndex = indexArr.indexOf(Math.floor(ele[0][0]/10) - 1);
                const maxIndex = indexArr.indexOf(Math.floor(ele[ele.length - 1][0]/10) + 1);
                if(minIndex > -1){
                //极小
                ele.unshift(threeArr[minIndex]);
                threeArr.splice(minIndex, 1, null);
                }else if(maxIndex > -1){
                //极大
                ele.push(threeArr[maxIndex]);
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
                if(Math.floor(fjArr[i][fjArr[i].length - 1][0]/10) + 1 === Math.floor(fjArr[j][0][0]/10)){
                    const mutlItem = fjArr[i].concat(fjArr[j]);
                    fjList.push(mutlItem);
                    delete fjArr[i];
                    fjArr.splice(j,1);
                    fjArr.splice(i,1);
                }
            }
        }
    }
    const other = [];
    const sd = [];
    obj.other.forEach(ele => {
        if(ele){
            other.push(ele);
        }
    })
    threeArr.forEach(ele => {
      if(ele){
        sd.push(ele)
      }
    })
    const totalData = {
        ...obj,
        other,
        ss:fjList,
        sd
    }
    //检索单顺
    dsType(totalData)
}

//炸弹
const bombType = (data) => {
    //检索火箭
    const rocketArr = [];
    const arr = [];
    const currentData = [];
    Object.assign(currentData,data);
    Object.assign(arr,data);
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
        other,
        currentData
    }
    //检索三顺
    stType(totalData)
}


//出牌顺序 单牌、对子、双顺、单顺、三顺、三条
const startPocker = (obj) => {
  const minData = obj.currentData[obj.currentData.length - 1];
  const pushPocker = [];
  for(const key in obj){
    if(obj[key].length && key !=='currentData'){
      for(let i = 0; i < obj[key].length; i ++){
        if(obj[key][i] instanceof Array){
          for(let j = 0; j < obj[key][i].length; j ++){
            if(obj[key][i][j] === minData){
              //包含最小牌的组合
              pushPocker.push(obj[key][i])
              obj[key].splice(i,1);
              if(key === 'sd'){
                //三条->检测单牌和单对
                const other = obj['other'];
                if(other.length && Math.floor(other[0]/10)!==15 && Math.floor(other[0]/10)!==16){
                  //排除2和大小王
                  pushPocker.push(other[0])
                  obj['other'].splice(0,1);
                }else if(obj['dz'].length && Math.floor(obj['dz'][0][0]/10)!==15){
                  //检测单对 排除对2
                  pushPocker.push(obj['dz'][0])
                  obj['dz'].splice(0,1);
                }
              }else if(key === 'ss'){
                //飞机
                const num = obj['ss'].length;
                if(obj['other'].length>=num && Math.floor(obj['other'][num-1]/10)!==15 && Math.floor(obj['other'][num-1]/10)!==16){
                  //存在多张单牌
                  for(let i = 0; i < num; i ++){
                    pushPocker.push(obj['other'][num-1])
                  }
                  obj['other'].splice(0,num);
                }else if(obj['dz'].length>=2 && Math.floor(obj['dz'][num-1][0]/10)!==15){
                  //检测对子 排除对2
                  for(let i = 0; i < num; i ++){
                    pushPocker.push(obj['dz'][num-1])
                  }
                  obj['dz'].splice(0,num);
                }
              }
              break;
            }
          }
        }else {
          if(obj[key][i] === minData){
            //包含最小牌的组合
            //单牌
            pushPocker.push(obj[key][i]);
            obj[key].splice(i,1);
            break;
          }
        }
      }
    }
  }
  console.log(pushPocker)
}



export default {
    createPockerArray,
    refreshPocker,
    dsType,
    bombType,
    startPocker
}

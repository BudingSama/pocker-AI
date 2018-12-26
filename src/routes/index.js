import React from 'react';
import x from '~/utils/utils';
import Styles from './index.less';
class Pocker extends React.PureComponent{
    state = {
        pockerList:null,
        startPoint:false,
        AIpointA:null,
        AIpointB:null,
        startQuery:null
    }
    initPocker = async () => {
      console.log(123)
      //初始化牌组
      const _this = this;
      //初始化牌组
      let arr = x.refreshPocker(x.createPockerArray())
      //发牌
      const pockerList = arr.map(ele => ele.sort((a,b)=>b-a));
      this.setState({
          pockerList
      })
      //随机叫分顺序
      const sort = Math.floor(Math.random()*3);
      this.setState({
        startQuery:sort
      })
      const AIpointA = x.setPockerPoint(pockerList[2]);
      const AIpointB = x.setPockerPoint(pockerList[1]);
      switch(sort){
        case 0:
        //左1->分析权重
        this.loopPoint(2);
        // if(AIpointA === 3){
        //   //地主
        //   setTimeout(()=>{
        //     const computedList = []
        //     Object.assign(computedList,pockerList);
        //     computedList[2] = computedList[2].concat(computedList[3]);
        //     _this.setState({
        //       startPoint:'start',
        //       pockerList:computedList
        //     })
        //   },1000)
        // }else{
        //   //非地主
        //   //下轮叫分
        //   setTimeout(() => {
        //     _this.setState({
        //       AIpointA:!AIpointA?'不叫':`${AIpointA}分`,
        //       startQuery:1
        //     })
        //   }, 1000);
        // }
        break;
        case 1:
        //玩家->等待叫分
        break;
        case 2:
        //右1->分析权重
        this.loopPoint(1);
        if(this.state.AIpointA){
          //全部叫分完毕
        }
        // if(AIpointB === 3){
        //   //地主
        //   setTimeout(() => {
        //     const computedList = []
        //     Object.assign(computedList,pockerList);
        //     computedList[1] = computedList[1].concat(computedList[3]);
        //     _this.setState({
        //       startPoint:'start',
        //       pockerList:computedList
        //     })
        //   }, 1000);
        // }else{
        //   //非地主
        //   //下轮叫分
        //   setTimeout(() => {
        //     _this.setState({
        //       AIpointB:!AIpointB?'不叫':`${AIpointB}分`,
        //       startQuery:0,
        //     })
        //     //左1->分析权重
        //     if(AIpointA === 3){
        //       //地主
        //       setTimeout(() => {
        //         const computedList = []
        //         Object.assign(computedList,pockerList);
        //         computedList[2] = computedList[2].concat(computedList[3]);
        //         _this.setState({
        //           startPoint:'start',
        //           pockerList:computedList
        //         })
        //       }, 1000);
        //     }else{
        //       //非地主
        //       //下轮叫分
        //       setTimeout(() => {
        //         _this.setState({
        //           AIpointA:!AIpointA?'不叫':`${AIpointA}分`,
        //           startQuery:1
        //         })
        //       }, 1000);
        //     }
        //   }, 1000);
        // }
        break;
        default:
      }
      x.bombType(pockerList[0])
    }
    UNSAFE_componentWillMount = async () => {
      this.initPocker()
    }
    getMax = () => {
      console.log(666)
      const { AIpointA, AIpointB, startPoint } = this.state;
      const a = AIpointA === '不叫' ? -1 : AIpointA.substr(0,1) * 1;
      const b = AIpointB === '不叫' ? -1 : AIpointB.substr(0,1) * 1;
      const c = startPoint === '不叫' ? -1 : startPoint.substr(0,1) * 1;
      let max;
      if(a>b&&a>c){
        //a最大 2
        max = 2;
      }else if(b>a&&b>c){
        //b最大 1
        max = 1;
      }else if(c>a&&c>b){
        //c最大 0
        max = 0;
      }else{
        //洗牌
        this.initPocker()
      }
      const computedList = []
      Object.assign(computedList,this.state.pockerList);
      computedList[max] = computedList[max].concat(computedList[3]);
      this.setState({
        pockerList:computedList
      })
    }
    loopPoint = (player) => {
      console.log(player)
      const _this = this;
      setTimeout(() => {
        const AIpoint = x.setPockerPoint(this.state.pockerList[player]);
        if(AIpoint === 3){
          //地主
          const computedList = []
          Object.assign(computedList,this.state.pockerList);
          computedList[player] = computedList[player].concat(computedList[3]);
          _this.setState({
            startPoint:'start',
            pockerList:computedList,
            AIpointA:null,
            AIpointB:null
          })
        }else{
          //非地主
          //下轮叫分
          if(player === 2){
            _this.setState({
              AIpointA:!AIpoint?'不叫':`${AIpoint}分`,
            })
            if(!_this.state.startPoint){
              _this.setState({
                startQuery:1
              })
            }else{
              //结束叫分
            }
          }else{
            _this.setState({
              AIpointB:!AIpoint?'不叫':`${AIpoint}分`,
            })
            if(!_this.state.AIpointA){
              _this.loopPoint(2);
            }
          }
        }
      }, 1000);
    }
    pointStart = (e) => {
      const _this = this;
      let text;
      const dataArr = [];
      Object.assign(dataArr,this.state.pockerList);
      switch(e.currentTarget.value){
        case 0:
        text = '不叫';
        break;
        case 1:
        text = '1分'
        break;
        case 2:
        text = '2分'
        break;
        case 3:
        text = 'start'
        dataArr[0] = (dataArr[0].concat(dataArr[3])).sort((a,b)=>b-a);
        this.setState({
          AIpointA:null,
          AIpointB:null
        })
        break;
        default:
      }
      if(text !=='start'){
        if(!this.state.AIpointB){
          //继续叫分
          _this.loopPoint(1)
        }
      }
      this.setState({
        startPoint:text,
        pockerList:dataArr
      })
    }
    render(){
        const _this = this;
        return (
        <div className={Styles.wrap}>
        {
            this.state.pockerList.map((ele,index) => <section key={index}>
                {
                    _this.state.pockerList[index].map((ele,ind) => {
                        let data = Math.floor(ele / 10);
                        let type = ele % 10;
                        let color;
                        switch(data){
                            case 11:
                                data = 'J';
                            break;
                            case 12:
                                data = 'Q';
                            break;
                            case 13:
                                data = 'K';
                            break;
                            case 14:
                                data = 'A';
                            break;
                            case 15:
                                data = '2';
                            break;
                            case 16:
                                data = '';
                            break;
                            default:
                        }
                        switch(type){
                            case 1:
                                if(Math.floor(ele / 10) === 16){
                                    color = '小王'
                                }else{
                                    color = '红桃';
                                }
                            break;
                            case 2:
                                if(Math.floor(ele / 10) === 16){
                                    color = '大王'
                                }else{
                                    color = '方片';
                                }
                            break;
                            case 3:
                                color = '黑桃';
                            break;
                            case 4:
                                color = '梅花';
                            break;
                            default:
                        }
                        //0玩家 1左人机 2右人机 3底牌
                        return index === 0 || index === 3 ?
                        index === 3 && this.state.startPoint !== 'start' ?
                        (
                          <span key={ind}> ？ </span>
                        ):
                        (
                          <span key={ind}> {color}{data} </span>
                        )
                        :
                        (
                            <div key={ind}><span>[$]</span><br/></div>
                        )
                    })
                }
            </section>)
        }
        <div className={Styles.AIpointA}>{this.state.AIpointA}</div>
        <div className={Styles.AIpointB}>{this.state.AIpointB}</div>
        {!this.state.startPoint&&this.state.startQuery === 1?
        <ul className={Styles.pointStart}>
          <li value="3" onClick={this.pointStart}>3分</li>
          <li value="2" onClick={this.pointStart}>2分</li>
          <li value="1" onClick={this.pointStart}>1分</li>
          <li value="0" onClick={this.pointStart}>不叫</li>
        </ul>:this.state.startPoint !=='start'?
        <ul className={Styles.pointStart}>{this.state.startPoint}</ul>
      :''}
        </div>
        )
    }
}
export default Pocker;

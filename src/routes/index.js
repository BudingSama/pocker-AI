import React from 'react';
import x from '~/utils/utils';
import Styles from './index.less';
class Pocker extends React.PureComponent{
    state = {
        pockerList:null,
        startPoint:false
    }
    UNSAFE_componentWillMount(){
        //初始化牌组
        let arr = x.refreshPocker(x.createPockerArray())
        //发牌
        const pockerList = arr.map(ele => ele.sort((a,b)=>b-a));
        this.setState({
            pockerList
        })
        //随机叫分顺序
        const sort = Math.floor(Math.random()*3);
        const AIa = x.setPockerPoint(pockerList[1]);
        const Aib = x.setPockerPoint(pockerList[2]);
        switch(sort){
          case 0:
          //左1->分析权重
          if(AIa === 3){
            //地主
            this.setState({
              startPoint:'start'
            })
          }
          break;
          case 1:
          //玩家->等待叫分
          break;
          case 2:
          //右1->分析权重
          break;
          default:
        }
        x.bombType(pockerList[0])
    }
    pointStart = (e) => {
      let text;
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
        break;
        default:
      }
      this.setState({
        startPoint:text
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
                            <div key={ind}><span>{color}{data}</span><br/></div>
                        )
                    })
                }
            </section>)
        }
        <div className={Styles.AIpointA}>{this.state.AIpointA}</div>
        <div className={Styles.AIpointB}>{this.state.AIpointB}</div>
        {!this.state.startPoint?
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

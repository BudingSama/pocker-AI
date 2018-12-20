import React from 'react';
import x from '~/utils/utils';
import Styles from './index.less';
class Pocker extends React.PureComponent{
    state = {
        pockerList:null,
    }
    UNSAFE_componentWillMount(){
        let arr = x.refreshPocker(x.createPockerArray())
        const pockerList = arr.map(ele => ele.sort((a,b)=>b-a));
        this.setState({
            pockerList
        })
        x.bombType(pockerList[0])
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
                        return index === 0 || index === 3 ?
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
        </div>
        )
    }
}
export default Pocker;

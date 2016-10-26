import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      basicInformation : [],
      streamsOnline: [],
      updated:false,
      presenter:[]
    };
    this.ajaxer=this.ajaxer.bind(this);
    this.toggle=this.toggle.bind(this);
  }
  ajaxer(url,streamers,stateProperty,func){
    var requests;
    requests=streamers.map(function(item){
     return axios.get(`${url}${item}?client_id=saemxqleh6tektjgkxzo5cx987s192`)
     .then(function(response){
   return response.data;
     });
   });
   axios.all(requests)
   .then(function(response){
       func(response,stateProperty,[]);
   });
  }
  toggle(status){
    switch(status){
      case "offline":
        this.setState({presenter:this.state.basicInformation});
        break;
      case "online":
        this.setState({presenter:this.state.streamsOnline});
        break;
      case "all":
        this.setState({presenter:<div>{this.state.streamsOnline}{this.state.basicInformation}</div>});
        break;
    }
  }
  componentDidMount(){
    var basicUrl = 'https://api.twitch.tv/kraken/channels/';
     var streamUrl = 'https://api.twitch.tv/kraken/streams/';
     var streamers = [
    'noobs2ninjas', 'habathcx', 'riotgames', 'starladder1',
   'beyondthesummit', 'tsm_theoddone', 'Tsm_dyrus', 'esl_csgo', 'garenatw',
   'smitegame', 'Nightblue3', 'nl_kripp', 'imaqtpie', 'esl_lol',
   'asiagodtonegg3be0', 'destructoid', 'sodapoppin', 'OGNGlobal', 'ongamenet',
   'joindotared', 'faceittv', 'taketv', 'versuta','Voyboy',
   'wingsofdeath', 'towelliee', 'TrumpSC', 'leveluplive', 'twitch', 'itshafu',
   'dotastarladder_en', 'riotgamesturkish', 'twitchplayspokemon',
   'aces_tv', 'gamespot', 'sc2proleague', 'SirhcEz', 'totalbiscuit', 'mlgsc2',
   'scarra', 'RocketBeansTV', 'lethalfrag', 'dendi', 'wcs_america', 'mlglol',
   'defrancogames', 'shadbasemurdertv', 'yogscast', 'Imt_wildturtle', 'magic',
   'streamerhouse', 'dhingameclient', 'wcs_europe', 'sing_sing', 'roomonfire',
   'onemoregametv', 'dreamleague', 'syndicate' ];
  
   var temp=[];
   var nullStreamRemover=(response,stateProperty,mapper) => {
     if(stateProperty==="streamsOnline"){
       mapper=response.filter(function(obj){
         if(obj["stream"]==null){ temp.push(obj["_links"]["channel"].slice(38)); return false;}
         else{ return true;}
       })
     }
     else{
       mapper=response;
     }
       mapper=mapper.map(function(obj,index){
           return <Online obj={obj} key={index} type={stateProperty}></Online>
     });

   (stateProperty==="streamsOnline") ? this.setState({streamsOnline:mapper,presenter:mapper}) : (stateProperty==="basicInformation") ? this.setState({basicInformation:mapper,updated:true}) : console.log("hi")
   if(!this.state.updated)
   {
     this.ajaxer(basicUrl,temp,"basicInformation",nullStreamRemover);
   }

 };

   this.ajaxer(streamUrl,streamers,"streamsOnline",nullStreamRemover);
}
  render(){
    var screen;
    if(this.state.presenter.length==0){
      screen=<span>
      <img id="loader" src={"http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif"} />
        <p>loading</p>
        </span>
    }
    else{
        screen=this.state.presenter;
    }
    return (
      <div id="vdom">
        <div id="heading">
          Twitch Streams using Twitch API
        </div>
        <div className="row">
          <button id="b1"onClick={()=>{ this.toggle("online"); } }>Online</button>
          <button id="b2" onClick={()=>{ this.toggle("offline");} }>Offline</button>
          <button id="b3" onClick={()=>{ this.toggle("all"); } }>All</button>
        </div>
      <ul>
        {screen}
    </ul>
        <div className="footer text-center">desinged & coded by <a href="http://codepen.io/Chan11/" target="_blank"><strong>Chandrahas</strong></a></div>
    </div>
    );
  }
}

class Online extends React.Component {
  render(){
    var obj=this.props.obj;
    var name,logo,preview,playing,lang,views,statusl,animation;
      if(this.props.type==="streamsOnline"){
        name = obj["stream"]["channel"]["display_name"];
        logo = obj["stream"]["channel"]["logo"];
        preview=obj["stream"]["preview"]["medium"];
        playing="Playing->"+obj["stream"]["channel"]["game"].slice(0,20)+`...`;
        lang=obj["stream"]["channel"]["language"];
        views=obj["stream"]["channel"]["views"];
        status=obj["stream"]["channel"]["status"].slice(0,20)+`...`;
        animation="bounceIn";
      }
        else if(this.props.type==='basicInformation'){
          name = obj["display_name"];
          logo = obj["logo"];
          preview="https://tse4.mm.bing.net/th?id=OIP.Ma711d24a5ea75c93fce2d670c1b49898H0&pid=15.1";
          playing="offline";
          lang=obj["language"];
          views=obj["views"];
          status=obj["status"].slice(0,18)+`...`;
          animation="flipInX ";
        }
    return (
      <li id="datalis" className={animation}>
        <Modular name={name} logo={logo} preview={preview} playing={playing} lang={lang} views={views} status={status}></Modular>
      </li>
    );
  }
}

class Modular extends React.Component{
  render() {
    return (
      <div id="lidivs">
        <div id="header">
          <p id="name">{this.props.name}</p>
          <img id="logo" src={this.props.logo}/>
        </div>
        <div id="body">
          <img id="preview" src={this.props.preview} />
        </div>
        <div id="footer">
          <p id="playing">{this.props.playing}</p>
          <p id="lang">ln: {this.props.lang}</p>
          <p id="views">Views: {this.props.views}</p>
          <p id="status">Status: {this.props.status}</p>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />,document.querySelector('.container-fluid'));

import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from "react-redux";
require ('dotenv').config()

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [ selectLanguage, setSelectedLang ] = useState(props.selectLanguage);
  
  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'
        
      switch (selectLanguage) {

        case 'en' :
          langue = 'en';
          country = 'us';
          break;
      };
      props.changeLanguage(selectLanguage);
      const data = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=5fb9991067044cbc83aadf4c458cb434&language=${langue}&country=${country}`)
      const body = await data.json()
      setSourceList(body.sources)
    }

    APIResultsLoading()
  }, [selectLanguage])

  return (
    <div>
        <Nav/>
       
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={{width:'70px', margin:'20px'}} src='/images/france.png' onClick={() => setSelectedLang('fr') } />
          <img style={{width:'70px', margin:'20px'}} src='/images/united-states.png' onClick={() => setSelectedLang('en')} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state) {
  return {
    selectedLang: state.selectLanguage, token: state.token
    }
  };

function mapDispatchToProps(dispatch) {
  return {
      changeLanguage: function(selectLanguage) {
      dispatch({ type: 'changeLang',
                selectedLang: selectLanguage });
      }
    }
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource);

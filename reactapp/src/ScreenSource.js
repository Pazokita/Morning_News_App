import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from "react-redux";
require ('dotenv').config()

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([]);
  
  useEffect(() => {
    const APIResultsLoading = async() => {
      console.log(props.selectedLang)
      const data = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=5fb9991067044cbc83aadf4c458cb434&language=${props.selectedLang}`)
      const body = await data.json()
      setSourceList(body.sources)
    }
    APIResultsLoading()
  }, [])

  const handleLanguageClick = async (language) => {
    props.changeLanguage(language);
    const response = await fetch('/language', {
      method: 'PUT',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `tokenFromFront=${props.token}&languageFromFront=${language}`
    })
    console.log(await response.json());

    props.resetWishList();
    const data = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=5fb9991067044cbc83aadf4c458cb434&language=${language}`)
    const body = await data.json()
    setSourceList(body.sources)
  }

  let styleLang = {
    width:'70px', margin:'20px', cursor:'pointer'
  }
  let styleLangSelected = {
    width:'70px', margin:'20px', cursor:'pointer', border: '5px solid #fff', borderRadius:'50%'
  }

  return (
    <div>
        <Nav/>
       
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img alt="français" style={props.selectedLang === 'fr' ? styleLangSelected : styleLang} src='/images/france.png' onClick={() => handleLanguageClick('fr') } />
          <img alt="english" style={props.selectedLang === 'en' ? styleLangSelected : styleLang} src='/images/united-states.png' onClick={() => handleLanguageClick('en')} /> 
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
  console.log('selectedLang: ' + state.selectedLang);
  return {
    selectedLang: state.selectedLang, token: state.token
    }
  };

function mapDispatchToProps(dispatch) {
  return {
    resetWishList: function () {
      dispatch({ type: "resetArticle" });
    },
    changeLanguage: function(selectedLang) {
      console.log('changeLanguage: ' + selectedLang);
      dispatch({ type: 'changeLanguage',
        selectedLang: selectedLang });
      }
    }
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource);

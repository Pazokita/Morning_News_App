import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, Icon, Modal } from "antd";
import Nav from "./Nav";

import { connect } from "react-redux";

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


  var showModal = (title, content) => {
    setVisible(true);
    setTitle(title);
    setContent(content);
  };

  var handleOk = (e) => {
    // console.log(e);
    setVisible(false);
  };

  var handleCancel = (e) => {
    //  console.log(e);
    setVisible(false);
  };

  useEffect(() => {
    const findArticles = async () => {
      const data = await fetch(`/wishlist?tokenFromFront=${props.token}&languageFromFront=${props.selectedLang}`);
      const body = await data.json();
      console.log(body);
      if (body.articlesFind) {
        body.articlesFind.forEach(article => props.addToWishList(article))
      }

    };

    findArticles();
  }, [])

  var handleRemoveClick = async (title) => {
    props.deleteToWishList(title);
    const response = await fetch('/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `titleFromFront=${title}&token=${props.token}`
    })
    console.log(response);
  }

  const handleLanguageClick = async (language) => {
    props.changeLanguage(language);
    const response = await fetch('/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `tokenFromFront=${props.token}&languageFromFront=${language}`
    })
    console.log(await response.json());

    props.resetWishList();
    const data = await fetch(`/wishlist?tokenFromFront=${props.token}&languageFromFront=${language}`);
    const body = await data.json();
    console.log(body);
    if (body.articlesFind) {
      body.articlesFind.forEach(article => props.addToWishList(article))
    }
  }

  let styleLang = {
    width: '70px', margin: '20px', cursor: 'pointer'
  }
  let styleLangSelected = {
    width: '70px', margin: '20px', cursor: 'pointer', border: '5px solid #fff', borderRadius: '50%'
  }

  var noArticles;
  if (props.myArticles.length === 0) {
    noArticles = <div style={{ marginTop: "30px" }}> No articles </div>;
  }
  return (
    <div>
      <Nav />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="Banner">
        <img alt="français" style={props.selectedLang === 'fr' ? styleLangSelected : styleLang} src='/images/france.png' onClick={() => handleLanguageClick('fr')} />
        <img alt="english" style={props.selectedLang === 'en' ? styleLangSelected : styleLang} src='/images/united-states.png' onClick={() => handleLanguageClick('en')} />
      </div>

      <div className="Card">
        {noArticles}
        {props.myArticles.map((article, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            <Card
              style={{
                width: 300,
                margin: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              cover={<img alt="example" src={article.urlToImage} />}
              actions={[
                <Icon
                  type="read"
                  key="ellipsis2"
                  onClick={() => showModal(article.title, article.content)}
                />,
                <Icon
                  type="delete"
                  key="ellipsis"
                  onClick={() => handleRemoveClick(article.title)}
                />,
              ]}
            >
              <Meta title={article.title} description={article.description} />
            </Card>
            <Modal
              title={title}
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{content}</p>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  //console.log(state)
  return { myArticles: state.wishlist, token: state.token, selectedLang: state.selectedLang };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteToWishList: function (articleTitle) {
      dispatch({ type: "deleteArticle", title: articleTitle });
    },
    addToWishList: function (article) {
      dispatch({ type: "addArticle", articleLiked: article });
    },
    resetWishList: function () {
      dispatch({ type: "resetArticle" });
    },
    changeLanguage: function (selectedLang) {
      console.log('changeLanguage: ' + selectedLang);
      dispatch({
        type: 'changeLanguage',
        selectedLang: selectedLang
      });
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);

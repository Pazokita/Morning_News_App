import React ,{useState, useEffect} from "react";
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
      const data = await fetch(`/wishlist?tokenFromFront=${props.token}`);
      const body = await data.json();
      console.log(body); 
      if(body.articlesFind){
        body.articlesFind.forEach(article => props.addToWishList(article)) 
      }
      
    };
    
    findArticles();
}, [])

  var handleRemoveClick = async (title) => {
    props.deleteToWishList(title);
    const response = await fetch('/wishlist', {
      method: 'DELETE',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `titleFromFront=${title}&token=${props.token}`
    })
    console.log(response);
  }

  var noArticles;
  if (props.myArticles.length === 0) {
    noArticles = <div style={{ marginTop: "30px" }}> No articles </div>;
  }
  return (
    <div>
      <Nav />

      <div className="Banner" />

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
  return { myArticles: state.wishlist, token: state.token };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteToWishList: function (articleTitle) {
      dispatch({ type: "deleteArticle", title: articleTitle });
    },
    addToWishList: function (article) {
      dispatch({ type: "addArticle", articleLiked: article });
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);

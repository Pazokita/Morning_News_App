export default function (wishlist = [], action) {
  if (action.type === 'addArticle') {
    var wishListCopy = [...wishlist]

    var findArticle = false

    for (let i = 0; i < wishListCopy.length; i++) {
      if (wishListCopy[i].title === action.articleLiked.title) {
        findArticle = true
      }
    }

    if (!findArticle) {
      wishListCopy.push(action.articleLiked)
    }
    //console.log(wishListCopy)
    return wishListCopy
  } else if (action.type === 'deleteArticle') {
    wishListCopy = [...wishlist]
    wishListCopy = wishlist.filter(e => e.title !== action.title);
    return wishListCopy;
  } else if (action.type === 'resetArticle') {
    return [];
  }else {
    return wishlist;
  }

}

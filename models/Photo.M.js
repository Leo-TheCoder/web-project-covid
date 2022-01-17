const db = require("../db/connectDB");

class Photo {
  static async getFirstPhoto(productId) {
    const result = await db.query(
      `select linkpic from productpic where productid = $1 limit 1`,
      [productId]
    );
    
    if(result.rows.length < 1) {
        return "#";
    }
    const linkpic = result.rows[0].linkpic;
    return linkpic;
  }

  static async getPhotos(productId) {
    const result = await db.query(
      `select linkpic from productpic where productid = $1`,
      [productId]
    );

    const linkpics = [];
    result.rows.forEach(element => {
        linkpics.push(element.linkpic);
    })

    if(linkpics.length < 1) {
        linkpics.push('#');
    }

    return linkpics;
  }
}

module.exports = Photo;
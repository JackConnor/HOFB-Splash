angular.module('getSwatchesFactory', [])

  .factory('allSwatches', allSwatches);

  function allSwatches(){
    getSwatches = function(){
      var swatches = {
        fabrics: {
          seersucker: "http://cdn.shopify.com/s/files/1/0400/5101/products/FFseernavy_grande.jpg?v=1437514918"
          ,pleather: "http://i.ebayimg.com/images/g/EB8AAOSwk5FUvXtS/s-l300.jpg",
          dockers: "https://dtpmhvbsmffsz.cloudfront.net/posts/2015/05/08/554d8bdbbcd4a73a1d00565b/s_554d8bdbbcd4a73a1d00565c.jpg"
          ,camo: "http://wiganhydroprinting.co.uk/wp-content/uploads/2014/04/clear-camo-300x3001.jpg"
          ,veneer: "http://www.arrow.gb.net/images/pages/finish-colours/material-finishes/veneer/walnut-r.jpg"
          ,nylon: "http://static1.squarespace.com/static/52965deee4b0f580c1fe0b7d/52c88375e4b03b30610b4a0a/52c8845be4b0268360ddfb8c/1388874157418/LightRoyalNylon.jpg?format=300w"
          ,leather: "http://demandware.edgesuite.net/aakh_prd/on/demandware.static/-/Sites-main/default/dwa303e31f/images/large/L7871.jpg"
          ,cotton: "http://d6lw7to1547c3.cloudfront.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/308744.jpg"
          ,denim: "https://www.shoponeonline.com/wp-content/uploads/denim-swatch.png"
        }
        ,seasons: {
          spring: "http://organically.server276.com/blog/wp-content/uploads/2014/03/18_spring-300x300.jpg"
          ,summer: "http://r2rdesigns.com/wp-content/uploads/2014/06/summer-beach-hd-desktop-wallpaper-300x300.jpg"
          ,fall: "http://img.thrfun.com/img/083/036/autumn_trees_s1.jpg"
          ,winter: "http://pixelshok.com/wp-content/uploads/2011/01/Winter-300x300.png"
        }
        ,types: {
          shirt: "http://secretenergy.com/wp-content/uploads/2014/07/SOUL-WARS-shirt-21.jpg"
          ,pants: "https://bonobos-prod-s3.imgix.net/products/10163/original/PNT_Golf_Maide_HighlandPant_Blackwatch_category.jpg?1423867714&w=300&q=74&h=300&fit=crop"
          ,dress: "http://www.kirnazabete.com/media/catalog/product/cache/1/image/300x/5e06319eda06f020e43594a9c230972d/1/1/11218940_5802764_1000/KirnaZabete-Dolce-and-Gabbana-Rose-Print-Dress-31.jpg"
          ,jacket: "http://images.motorcycle-superstore.com/productimages/300/2016-dainese-womens-michelle-leather-jacket-mcss.jpg"
          ,tee: "http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=140393304"
          ,skirt: "http://stylishcurves.com/wp-content/uploads/2014/01/burnt-orange-godet-skirt-300x300.jpg"
          ,shorts: "https://images.bigcartel.com/bigcartel/product_images/163340455/-/shorts-0175.jpg"
          ,scarf: "http://onwardpullzone.onwardreserve.netdna-cdn.com/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/o/r/or-camel-check-reversible-cashmere-scarf.jpg"
          ,hat: "http://ep.yimg.com/ay/oaklandraiders/oakland-raiders-girls-tailsweep-hat-3.jpg"
        }
        ,colors: {
          red: '#A80000'
          ,blue: "#58ACFA"
          ,white: "#FFFFFF"
          ,black: "#000000"
          ,green: "#458B00"
          ,yellow: "#F2F5A9"
        }
        ,stitch: {
          straight: ''
          ,right: ''
          ,double: ''
          ,hooklsine: ''
          ,righst: ''
          ,dousble: ''
          ,hooklsinekline: ''
          ,hooskline: ''
        }
      }
      return swatches;
    }

    return getSwatches();
  }

angular.module('getSwatchesFactory', [])

  .factory('allSwatches', allSwatches);

  function allSwatches(){
    getSwatches = function(){
      var swatches = {
        fabrics: {
          cotton_voile: {
            url: "https://res.cloudinary.com/hofb/image/upload/c_fill,h_500,w_500/v1453228835/d6ynhvoyo1ln4daoewiq.png"
            ,description: "Voile is a lightweight, semi-sheer fabric with a great drape."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,cotton_lawn: {
            url: "https://res.cloudinary.com/hofb/image/upload/c_fill,h_500,w_500/v1453228836/ynqquwm82dy3mgbxyffb.png"
            ,description: "Lawn is very similar to cotton voile but is slightly crisper."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,rayon_challis: {
            url: "https://res.cloudinary.com/hofb/image/upload/c_fill,h_500,w_500/v1453228837/zbjrhwzxgmltcn7boeek.png"
            ,description: "Rayon challis is a smooth, lightweight fabric. It drapes well and is slightly heavier than other lightweight fabrics, like cotton voile and cotton lawn."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,double_gauze: {
            url: "http://cdn.shopify.com/s/files/1/0281/7540/products/asparagus_grande.jpg?v=1440454268"
            ,description: "The double layer of Double gauze eradicates the main problem of gauze (the sheerness), while being light and breathabler."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,knit: {
            url: "http://www.naturesfabrics.com/media/catalog/product/cache/1/image/500x500/9df78eab33525d08d6e5fb8d27136e95/0/0/001_1_5.jpg"
            ,description: "Knit fabric is your go-to for any garment that needs to have a great deal of stretch."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,silk: {
            url: "https://s-media-cache-ak0.pinimg.com/736x/03/76/27/0376278b57f5e81d077f3c0fdd452682.jpg"
            ,description: "Silk is a lightweight, delicate fabric that drapes well. It has a slightly shimmery appearance. It also makes a great lining fabric."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,satin: {
            url: "https://d2d00szk9na1qq.cloudfront.net/Product/91544fc5-caf7-41dc-ac3d-74d8f32f4002/Images/Large_BV-632.jpg"
            ,description: "Satin can vary from lightweight to heavyweight, depending on the type of satin. Like silk, it has a glossy appearance."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,linen:{
            url: "https://d2d00szk9na1qq.cloudfront.net/Product/b4ce58fa-b5ad-4898-baaa-2364921973ec/Images/Large_0347067.jpg"
            ,description: "Linen is a medium-weight fabric with little elasticity (hence the wrinkles), and is a popular choice for warm-weather anything."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
          ,wool: {
            url: "http://img.archiexpo.com/images_ae/photo-g/52087-4508955.jpg"
            ,description: "Wool is extremely hard-wearing and versatile. It’s also very warm and a good choice for colder weather garments."
            ,colors: {
              red: '#A80000'
              ,blue: "#58ACFA"
              ,white: "#FFFFFF"
              ,black: "#000000"
              ,green: "#458B00"
              ,yellow: "#F2F5A9"
            }
          }
        }
        ,accessories: {
          drawCords: {
            cotton: "http://4.imimg.com/data4/OG/QE/MY-1726519/polyester-drawcords-250x250.jpg"
            ,polyester: 'http://thumbs2.ebaystatic.com/d/l225/m/mmxvo97AZNtTNT0hDBQNueg.jpg'
            ,nylon: 'http://3.imimg.com/data3/TS/LE/IMFCP-2897143/img-nylon_main-250x250.gif'
          }
          ,metalTrims: {
            buttons: 'http://d6lw7to1547c3.cloudfront.net/media/catalog/product/cache/1/small_image/300x300/9df78eab33525d08d6e5fb8d27136e95/109844.jpg'
            ,rivets: "http://img.auctiva.com/imgdata/9/9/6/8/3/1/webimg/586387289_o.jpg"
            ,eyelets: "http://ecx.images-amazon.com/images/I/511mlg44gPL._SY300_.jpg"
            ,buckles: "http://lgcdn.countrybrookdesign.com/media/catalog/product/cache/1/small_image/300x/9df78eab33525d08d6e5fb8d27136e95/d/b/dbb-nic-1-double-bar-buckle_1_6.jpg"
            ,zippers: "https://bagmakersupply.com/img/itm/baaaaaa/BAAAAAA285_0000x0000_0300x0300.jpg"
            ,hooksStoppers: "http://ecx.images-amazon.com/images/I/21L4Yw0FDmL._QL70_.jpg"
          }
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

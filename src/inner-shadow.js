(function() {

  const canvas = new fabric.Canvas('innershadow',{
    preserveObjectStacking: true
  });

  // clone efficient function
  const clone = (object) => {
    if (object === undefined || object === null || typeof object !== "object")
      return object
    else
    return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
  }

  const addObjectRect = () => {
    const object = new fabric.Rect({ width: 300, height: 300, top: 10, left: 10, fill: 'yellow', });
    canvas.add( object );
    canvas.setActiveObject(object);
    canvas.renderAll();
  }

  const addObjectCircle = () => {
    const object = new fabric.Circle({ radius: 200, top: 10, left: 10, fill: 'yellow', });
    canvas.add( object );
    canvas.setActiveObject(object);
    canvas.renderAll();
  }

  const addObjectPath = () => {

    const SVGstring = 'M123.93,127.15c2.94,15.83,21.13,36.91,17.45,53S144.31,220,140,243.75c-1,5.32-1.85,9.87-2.66,14.14a177.7,177.7,0,0,1-25-4.59c7,5.05,16,8.62,23.77,11-2.19,12.2-3.71,24.18-4.55,48.6-1.25,36.89-10.1,48.76-17.94,62.87s-22.3,17.11-37.35,13.52c0,0-17.34,8.2-28.41-4s-16.66-26.65-20.68-51.46c-.3-1.8-.64-3.58-1-5.34,8.65-1.19,20.48-3.37,30.08-7.16a156.64,156.64,0,0,1-31.69.22c-5.05-19.87-13.42-38.44-16.54-61.37-.38-2.73-.69-5.29-1-7.7,0-.08.23-16.91,24.78-21.36,0,0-24.88-2-27.67-15.53a91.85,91.85,0,0,0-2-10.33c-4.44-17.57-2-34.77,5.72-55.07l1.41-3.8c.73-2,1.4-4,2-5.9l.21-.64c3.54.07,15.7-.11,31.44-5.21,0,0-11.56,2.36-29.39-1.39a300.65,300.65,0,0,0,7-31.07C23,89.69,35.77,59.32,50.83,48.94a94.58,94.58,0,0,0,9.55-7.54c2.13-1.93,4-3.77,5.52-5.44.46-24.76,2.8-34.19,2.8-34.19C74.39-2,81,1.38,81,1.38a284.59,284.59,0,0,0-5.29,37.25c25.8,17.52,22.44,35.69,31.67,46.2C117,95.76,121,111.31,123.93,127.15Z';
    const object = new fabric.Path(String(SVGstring).trim(), {
      left: 0,
      top: 0,
      objectCaching: false,
      fill: 'yellow',
    });
    canvas.add(object);

    // set width,height
    object.set({ 
      width: object.getBoundingRect().width,
      height: object.getBoundingRect().height,
    });
    object.setCoords();
    canvas.setActiveObject(object);
    canvas.renderAll();

  }

  const createObjectInnerShadow = () => {

    const object = canvas.getActiveObject();
    const offset = 10;

    // set first object
    if( object === undefined || object === null ){
      window.alert('add and select a object');
      return;
    }

    // phase 1
    // get values of object , dimensions and position
    const { width, height, left, top, angle } = object;
    // create a rect object
    const rect = new fabric.Rect({
      typeName: 'Rect',
      width: width + ( offset * 2 ), // set margin/offset
      height: height + ( offset * 2 ),  // set margin/offset
      left: left - offset,
      top: top - offset,
      fill: "black",
      // set shadow
      shadow: {
        color: "rgba(0,0,0,1)",
        blur: 10,
        offsetX: 0,
        offsetY: 0,
      },
    });
    rect.setCoords();

    // phase 2 - apply inverted mask 
    // create a clone of object and transform like a mask inverted
    const clipOfObject = clone( object );
    rect.clipPath = clipOfObject;
    rect.clipPath.set({
      inverted: true, 
      left: ( rect.clipPath.width / 2 ) * -1,
      top: ( rect.clipPath.height / 2 ) * -1,
    });
  
    // phase 3 - apply another mask to maker inner shadow
    const clipOfObjectFinal = clone( object );
    const clipFinal = new fabric.Group([rect]);
    clipFinal.clipPath = clipOfObjectFinal;
    clipFinal.clipPath.set({
      typeName: 'ClipPath',
      left: ( rect.clipPath.width / 2 ) * -1,
      top: ( rect.clipPath.height / 2 ) * -1,
    });

    // add all on canvas
    canvas.add(clipFinal);
    canvas.bringToFront(clipFinal);
    canvas.renderAll();
    
    // shadow: {
    //   color: "rgba(100,100,100,.9)",
    //   blur: 15,
    //   offsetX: 0,
    //   offsetY: 0,
    // },

    // canvas.getActiveObject().on('event:moved', function(event){
    //   const mySelf = event.target;
    //   console.log('>>',mySelf.left,mySelf.get('left'));
    //   clipFinal.add({
    //     left: mySelf.left,
    //     top: mySelf.top,
    //     width: mySelf.width,
    //     height: mySelf.height,
    //   });
    // })

  }

  document.getElementById('addObjectRect').addEventListener("click", addObjectRect);
  document.getElementById('addObjectCircle').addEventListener("click", addObjectCircle);
  document.getElementById('addObjectPath').addEventListener("click", addObjectPath);
  document.getElementById('createObjectInnerShadow').addEventListener("click", createObjectInnerShadow);

})()

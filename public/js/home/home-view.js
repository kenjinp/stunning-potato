'use strict';

/* globals THREE */
/* globals document */

let View = Backbone.Marionette.LayoutView.extend({
	template: require('./home.dust'),

	events: {
		'click .home': 'goHome'
	},

  ui: {
    stuff: '#stuff',
  },

	goHome: function (event) {
		event.preventDefault();
		Backbone.radio.vent.trigger('home:show', {});
	},

  onShow: function () {
    console.log('IM RENDERING!');
    setTimeout(() => this.makeScene());
  },

  makeScene: function () {

    let updateStuff = [];
    let scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#bbb');

    let CANVAS_WIDTH = 200,
        CANVAS_HEIGHT = 200;

    let container = document.getElementById( 'stuff' );
    document.body.appendChild( container );

    let renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    container.appendChild( renderer.domElement );

    // let height = this.ui.canvas.height(),
    //     width = this.ui.canvas.width();
    // //renderer
    // let renderer = this.renderer = new THREE.WebGLRenderer({canvas: this.ui.canvas.eq(0) });
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( width, height );

    let camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.01, 3000 );
    camera.position.y = 80;

    let light = new THREE.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
    light.position.set( 0.75, 1, 0.25);
    scene.add( light );

    let material = new THREE.MeshBasicMaterial({ color: 0x101018});
    let geometry = new THREE.PlaneGeometry( 2000, 2000);
    let ground = new THREE.Mesh( geometry, material);
    ground.rotation.x= - 90 * Math.PI / 180;
    scene.add(ground);

    let city = this.makeCity();
    scene.add(city);

    let controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;
    updateStuff.push((delta, now) => controls.update(delta));

    updateStuff.push(() => this.renderer.render(scene, camera));

    let lastTimeMsec = null;
    let animate = (nowMsec) => {

      window.requestAnimationFrame(animate);

      lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
      let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      updateStuff.forEach((update) => {
        update(deltaMsec/1000, nowMsec/1000);
      });
    };

    window.requestAnimationFrame(animate);
  },

  makeCity: function () {
    // build the base geometry for each building
    let building = new THREE.CubeGeometry( 1, 1, 1 );
    // translate the geometry to place the pivot point at the bottom instead of the center
    building.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    // get rid of the bottom face - it is never seen
    building.faces.splice( 3, 1 );
    building.faceVertexUvs[0].splice( 3, 1 );
    // change UVs for the top face
    // - it is the roof so it wont use the same texture as the side of the building
    // - set the UVs to the single coordinate 0,0. so the roof will be the same color
    //   as a floor row.
    building.faceVertexUvs[0][2][0].set( 0, 0 );
    building.faceVertexUvs[0][2][1].set( 0, 0 );
    building.faceVertexUvs[0][2][2].set( 0, 0 );
    // building.faceVertexUvs[0][2][3].set( 0, 0 );
    // buildMesh
    let buildingMesh = new THREE.Mesh( building );

    // base colors for vertexColors. light is for vertices at the top, shaddow is for the ones at the bottom
    let light = new THREE.Color( 0xffffff );
    let shadow = new THREE.Color( 0x303050 );

    let cityGeometry = new THREE.Geometry();
    for( var i = 0; i < 20000; i ++ ){
      // put a random position
      buildingMesh.position.x   = Math.floor( Math.random() * 200 - 100 ) * 10;
      buildingMesh.position.z   = Math.floor( Math.random() * 200 - 100 ) * 10;
      // put a random rotation
      buildingMesh.rotation.y   = Math.random()*Math.PI*2;
      // put a random scale
      buildingMesh.scale.x  = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
      buildingMesh.scale.y  = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
      buildingMesh.scale.z  = buildingMesh.scale.x;

      // establish the base color for the buildingMesh
      let value   = 1 - Math.random() * Math.random();
      let baseColor   = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
      // set topColor/bottom vertexColors as adjustement of baseColor
      var topColor    = baseColor.clone().multiply( light );
      var bottomColor = baseColor.clone().multiply( shadow );
      // set .vertexColors for each face
      var geometry    = buildingMesh.geometry;
      for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
          if ( j === 2 ) {
              // set face.vertexColors on root face
              geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
          } else {
              // set face.vertexColors on sides faces
              geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
          }
      }
      // merge it with cityGeometry - very important for performance
      THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
    }

    // generate the texture
    var texture       = new THREE.Texture( generateTexture() );
    texture.anisotropy = this.renderer.getMaxAnisotropy();
    texture.needsUpdate    = true;

    // build the mesh
    var material  = new THREE.MeshLambertMaterial({
      map     : texture,
      vertexColors    : THREE.VertexColors
    });
    var cityMesh = new THREE.Mesh(cityGeometry, material );
    return cityMesh;

    function generateTexture() {
      // build a small canvas 32x64 and paint it in white
      var canvas  = document.createElement( 'canvas' );
      canvas.width = 32;
      canvas.height    = 64;
      var context = canvas.getContext( '2d' );
      // plain it in white
      context.fillStyle    = '#ffffff';
      context.fillRect( 0, 0, 32, 64 );
      // draw the window rows - with a small noise to simulate light variations in each room
      for( var y = 2; y < 64; y += 2 ){
          for( var x = 0; x < 32; x += 2 ){
              var value   = Math.floor( Math.random() * 64 );
              context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
              context.fillRect( x, y, 2, 1 );
          }
      }

      // build a bigger canvas and copy the small one in it
      // This is a trick to upscale the texture without filtering
      var canvas2 = document.createElement( 'canvas' );
      canvas2.width    = 512;
      canvas2.height   = 1024;
      context = canvas2.getContext( '2d' );
      // disable smoothing
      context.imageSmoothingEnabled        = false;
      context.webkitImageSmoothingEnabled  = false;
      context.mozImageSmoothingEnabled = false;
      // then draw the image
      context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
      // return the just built canvas2
      return canvas2;
    }
  }
});

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', -1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.freeze ) {

			return;

		}

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;

		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.handleResize();

};

module.exports = View;

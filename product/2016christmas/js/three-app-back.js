(function(global){

  var threeApp = {};
  
  var 
    container, stats;
  var
    camera, scene, renderer, sprite;

  var
    runningFlag = false,
    exitFlag = false;

  var clock = new THREE.Clock();

  var system , particlesPrev = [], particlesNext = [];

  var range = 1000;
  var long = 2000;
  var speed = 30;

  threeApp.init =  function() {
    container = document.querySelector('.canvas-wrapper');

    // camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 2, long );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;


    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 1000;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

    // world

    var sprite1 = new THREE.TextureLoader().load("../img/textures/disc.png");
    var sprite2 = new THREE.TextureLoader().load("../img/textures/disc.png");
    var sprite3 = new THREE.TextureLoader().load("../img/textures/disc.png");

    var material = new THREE.PointsMaterial( { 
      size: 20, 
      map: sprite1, 
      alphaTest: 0.5, 
      transparent: true,
      color: 0xFF00FF
    });

    var particles1 = createParticles(range, long, 0 , material);
    var particles4 = createParticles(range, long, long , material);

    material = new THREE.PointsMaterial( { 
      size: 20, 
      map: sprite2, 
      alphaTest: 0.5, 
      transparent: true,
      color: 0xffffff
    });

    var particles2 = createParticles(range, long, 0 , material);
    var particles5 = createParticles(range, long, long , material);

    material = new THREE.PointsMaterial( { 
      size: 20, 
      map: sprite3, 
      alphaTest: 0.5, 
      transparent: true,
      color: 0x00ffff
    });

    var particles3 = createParticles(range, long, 0 , material);
    var particles6 = createParticles(range, long, long , material);

    particlesPrev.push(particles1);
    particlesPrev.push(particles2);
    particlesPrev.push(particles3);

    particlesNext.push(particles4);
    particlesNext.push(particles5);
    particlesNext.push(particles6);

    scene.add( particles1 );
    scene.add( particles2 );
    scene.add( particles3 );

    scene.add( particles4 );
    scene.add( particles5 );
    scene.add( particles6 );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.domElement.className = 'animCanvas';

    container.appendChild( renderer.domElement );

    //
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    // events
    window.addEventListener( 'resize', onWindowResize, false );

  }

  threeApp.start = function() {
    camera.position.z = 0;
    runningFlag = true;
    animate();
  }

  threeApp.stop = function(callback) {
    exitFlag = true;

    setTimeout(function(){
      exitFlag = false;
      runningFlag = false;
      callback();
    }, 400);
  }

  // 创建粒子生成函数
  function createParticles(range, long, far, material ) {
    var geom = new THREE.Geometry();

    for( var i = 0; i < 1000 ; i ++) {

      var vertex =  new THREE.Vector3();
      vertex.x = range * Math.random() - range/2;
      vertex.y = range * Math.random() - range/2;
      vertex.z = long * Math.random() - long - far;

      geom.vertices.push( vertex );

    }

    var particle = new THREE.Points( geom, material );


    return particle;
  }


  // 屏幕大小变化处理
  function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }


  // 动画事件
  function animate() {
    if(runningFlag) {
      requestAnimationFrame( animate );
      render();
      stats.update();
    }
  }
  function render() {

    // 结束事件监测
    if(exitFlag) {
      camera.position.z = camera.position.z - speed * 5;
    }

    // 星空无限循环处理
    for (var i = particlesPrev.length - 1; i >= 0; i--) {
      particlesPrev[i].position.z = particlesPrev[i].position.z + speed;

      if(particlesPrev[i].position.z > long) {
        particlesPrev[i].position.z = -long;
      }
    }

    for (var i = particlesNext.length - 1; i >= 0; i--) {
      particlesNext[i].position.z = particlesNext[i].position.z + speed;

      if(particlesNext[i].position.z > long * 2) {
        particlesNext[i].position.z = 0;
      }
    }


    var delta = clock.getDelta();

    //controls.update( delta );

    renderer.render( scene, camera );
  }

  global.threeApp = threeApp;
}(this));
// Hecho por Daniel Ramirez y su equipo desarrollador de la Universidad San Buenaventura, sede San Benito - 2020
$(window).on('load', function(){
  $('.preloader').css('animation-play-state','running');
  setTimeout(() => {
    $('.preloader').css('display','none');
  }, 1000);
  parabolic();
  functionGraphic();
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

let width = document.getElementById('graphicBox').offsetWidth;

var mathFunction = "";
var xDomain = 0;
var yDomain = 0;
var mapRadius = 0;
var mapZoom = 17;

var annotationsP = [];
var xGraph = 0;
var yGraph = 0;

$('#functionPlot').click(() => {
  
  $('#clearAnno').removeClass('d-none');

  annotationsP.push({
    x: xGraph,
    text: `x = ${xGraph}`
  }, {
    y: yGraph,
    text: `y = ${yGraph}`
  });
  functionGraphic();
});

$('#clearAnno').click(() => {
  annotationsP = [];
  $('#clearAnno').addClass('d-none');
  functionGraphic();
});

var plotEcuation = $('#plotEcuation');

var lat = $('#lat');
var lng = $('#lng');

var derivativeX = "";

function functionGraphic(){

  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"derivativeText"]);

    functionPlot({
    target: "#functionPlot",
    width,
    height: 500,
    xAxis: {domain: [0,xDomain]},
    grid: true,
    tip: {
      xLine: true,    // dashed line parallel to y = 0
      yLine: true,    // dashed line parallel to x = 0
      renderer: function (x, y) {
        // Escribir
        var xF = parseFloat(x).toFixed(2);
        var yF = parseFloat(y).toFixed(2);
        $('#xCoord').html(xF);
        $('#yCoord').html(yF);

        xGraph = xF
        yGraph = yF;

        var theta = parseFloat(grades.val()) * (Math.PI/180);
        var v0 = parseFloat(v0I.val());
        var y0 = parseFloat(y0I.val());

        var vx = v0 * Math.cos(theta);
        var vy = v0 * Math.sin(theta);
        var tr1 = (v0 * Math.sin(theta)) / gravity;
        var tr = (vy + Math.sqrt(vy**2 + 4*(gravity/2)*(y0))) / (2*(gravity/2));
        var R = vx * (tr1 * 2);
        var hmax = y0 + (v0**2 * Math.sin(theta)**2) / (2 * gravity);

        var angle = Math.sqrt(((2 * gravity) / v0**2)*(Math.abs(y - y0)));
        angle = Math.asin(angle);
        angle = angle * 180 / Math.PI;

        // var tmax = (v0 * Math.sin(angle * (Math.PI/180)))/gravity;
        vy = v0 * Math.sin(angle * (Math.PI/180));
        var tmax = (vy + Math.sqrt(vy**2)) / (2*(gravity/2));
        var tFull = 0;

        if(x >= (R / 2)){
          // tFull = (tr1 * 2) - (tmax / 2);
          // tFull = tr - (Math.sqrt((2 * y) / gravity));
          vy = v0 * Math.sin(theta);
          tFull = (vy + Math.sqrt(vy**2 + (4 * (gravity / 2) * (y0 - y)))) / (2 * (gravity / 2));
        }else{
          tFull = tmax / 2;
        }

        if (y < 0 && x > 0) {
          tFull = tr;
          angle = 0;
        }

        if (y < y0) {
          angle = parseFloat('-' + angle);
        }

        if (x <= 0) {
          tFull = 0;
          angle = 0;
          $('#pTime').html(tFull);
        }else{
          $('#pTime').html(`${String(tFull).split('.')[0] + '.' + String(tFull).split('.')[1].slice(0,2)}`);
        }

        var vyf = (v0 * Math.sin(theta)) - gravity * tFull;

        var angle2 = Math.atan(vyf / vx) * (180 / Math.PI);

        $('#pAngle').html(`${parseFloat(angle2).toFixed(2)}`);

      }
    },
    data: [
      {
        fn: mathFunction,
        color: 'purple',
        derivative: {
          fn: String(derivativeX),
          updateOnMouseMove: true,
        },
        secants: [{
          x0: 0,
          color: 'green',
          updateOnMouseMove: true
        }, {
          x0: mapRadius,
          color: 'green',
          updateOnMouseMove: true
        }]
      }
    ],
    annotations: annotationsP,
  });

  functionPlot({
    target: "#functionPlot2",
    width: 311,
    height:420,
    xAxis: {domain: [0,xDomain]},
    grid: true,
    data: [
      {
        fn: mathFunction,
        color: 'purple',
        derivative: {
          fn: String(derivativeX),
          updateOnMouseMove: true
        },
        secants: [{
          x0: 0,
          color: 'green',
          updateOnMouseMove: true
        }, {
          x0: mapRadius,
          color: 'green',
          updateOnMouseMove: true
        }]
      }
    ]
  });

}

document.getElementById('detailsModal').addEventListener('show.bs.modal', function (event) {
  console.log(width2);
});

// Geolocalización - Maps

// var x = document.getElementById("demo");
// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   x.innerHTML = "Latitude: " + position.coords.latitude +
//   "<br>Longitude: " + position.coords.longitude;
// }

function iniciarMap(){
  $('#mapPrev').html('');
  $('#mapPrev').html('<div id="map"></div>');
  var coord = {lat:parseFloat(lat.val()) ,lng: parseFloat(lng.val())};
  // var map = new google.maps.Map(document.getElementById('map'),{
  //   zoom: mapZoom,
  //   center: coord
  // });
  // var marker = new google.maps.Marker({
  //   position: coord,
  //   map: map,
  //   icon: '/views/mapsIcon.png'
  // });
  // const cityCircle = new google.maps.Circle({
  //   strokeColor: "#35185c",
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: "#a058ff",
  //   fillOpacity: 0.35,
  //   map,
  //   center: {lat: parseFloat(lat.val()) ,lng: parseFloat(lng.val())},
  //   radius: mapRadius,
  // });

  var Icon = L.icon({
    iconUrl: '/views/mapsIcon.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 38], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 22], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -26] // point from which the popup should open relative to the iconAnchor
});

  var map = new L.map('map', {
    // Set latitude and longitude of the map center (required)
    center: [coord.lat, coord.lng],
    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
    zoom: mapZoom,
  });
  
  var marker = L.marker(
    [coord.lat, coord.lng],
    { 
      // icon: Icon,
      draggable: true,
      title: "",
      color: 'green',
      opacity: 0.75
  }).addTo(map);

  marker.bindPopup(`<div class="text-center"><b>Coordenadas de tu Cohete</b><br>${marker.getLatLng().lat},${marker.getLatLng().lng}</div>`);
  
  var circle = L.circle([coord.lat, coord.lng], {
    color: 'purple',
    fillColor: 'purple',
    fillOpacity: 0.3,
    radius: mapRadius
  }).addTo(map);
  
  var tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  var popup = L.popup();


  function onMapClick(e) {
    for(i in map._layers) {
      if(map._layers[i]._path != undefined) {
          try {
              map.removeLayer(map._layers[i]);
          }
          catch(es) {
              console.log("problem with " + es + map._layers[i]);
          }
      }
    }
    circle.addTo(map);
    var distance = map.distance(marker.getLatLng(),e.latlng);
    if (marker.getLatLng() && e.latlng) {
      var line = L.polyline([marker.getLatLng(), e.latlng], {
        color: 'red'
      }).addTo(map);
    }
      popup
          .setLatLng(e.latlng)
          .setContent(`<b>Lat: </b>${e.latlng.lat}<br><b>Lng: </b>${e.latlng.lng}<br><b>Distancia: </b>${parseFloat(distance).toFixed(3)}m`)
          .openOn(map);
  }

  map.on('click', onMapClick);

}

lat.keyup(e=> {
  e.preventDefault();
  iniciarMap();
});

lng.keyup(e=> {
  e.preventDefault();
  iniciarMap();
});

// Fórmulas tiro parabólico

var v0I = $('#v0');
var grades = $('#grades');
var gravity = parseFloat($('#gravity').val());
var y0I = $('#y0');
var RInput = $('#RInput');
var btnR = $('#btnR');
var detailsCont = $('#detailsCont');
var tInput = $('#tInput');
var btnT = $('#btnT');
var timeInfo = $('#timeInfo');

v0I.keyup(e => {
  e.preventDefault();
  parabolic();
});

grades.keyup(e => {
  e.preventDefault();
  parabolic();
});

y0I.keyup(e => {
  e.preventDefault();
  parabolic();
});

$('#gravity').keyup(e => {
  e.preventDefault();
  parabolic();
});

function parabolic(){

  console.clear();

  timeInfo.html("");
  tInput.val('');

  gravity = parseFloat($('#gravity').val());

  var theta = parseFloat(grades.val()) * (Math.PI/180);
  var v0 = parseFloat(v0I.val());
  var y0 = parseFloat(y0I.val());

  if (v0I.val() === "") {
    v0 = 0;
  }

  if (grades.val() === "") {
    theta = 0;
  }

  if (y0I.val() === "") {
    y0 = 0;
  }

  if ($('#gravity').val() == "" || $('#gravity').val() == 0) {
    gravity = 1;
  }

  mathFunction = `x*tan(${theta})-(${gravity}x^2)/(2*${v0}^2*cos(${theta})^2) + ${y0}`;

  var vx = v0 * Math.cos(theta);
  var vy = v0 * Math.sin(theta);
  var tr = (vy + Math.sqrt(vy**2 + 4*(gravity/2)*(y0))) / (2*(gravity/2));
  var t = (v0 * Math.sin(theta)) / gravity;
  var vyf = vy - gravity * t;
  var R = vx * tr;
  var hmax = y0 + (v0**2 * Math.sin(theta)**2) / (2 * gravity);

  RInput.val(R.toFixed(2));

  detailsContent(gravity, v0, theta, vx, vy, y0, hmax, t, R, tr)

  xDomain = R + 10;
  yDomain = hmax + 10;
  mapRadius = R;

  plotEcuation.html(`\\(y=xtan(${theta * 180/Math.PI}°)-\\dfrac{${gravity}x^2}{2(${v0.toFixed(2)})^2cos^{2}(${theta * 180/Math.PI}°)} + ${y0}\\)`)

  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"plotEcuation"]);

  derivativeX = math.derivative(mathFunction, 'x');

  var regex = /[+-]?\d+(?:\.\d+)?/g;
  var string = derivativeX.toString();

  var match;
  var matchArray = [];
  var decimal = [];
  var fraction = [];
  var newDerivative;
  while (match = regex.exec(string)) {
    if (String(match[0]).indexOf('.') > 0) {
      matchArray.push(match[0]);
    }
  }

  for (let i = 0; i < matchArray.length; i++) {
    decimal = math.fraction(Number(matchArray[i]));
    if (decimal.n === decimal.d) {
      fraction[i] = '1';
    }else{
      fraction[i] = `\\dfrac{${decimal.n}}{${decimal.d}}`;
    }
  }

  newDerivative = string.replace(matchArray[0],fraction[0]).replace(matchArray[1],fraction[1]);
  $('#derivativeText').html(`\\(${newDerivative}\\)`);

  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"derivativeText"]);

  $('#vx0').html(`\\(v_{x0}= ${parseFloat(vx).toFixed(2)}\\frac{m}{s}\\)`);
  $('#vy0').html(`\\(v_{y0}= ${parseFloat(vy).toFixed(2)}\\frac{m}{s}\\)`);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"vx0"]);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"vy0"]);

  $('#hmax').html(`\\(h_{max}= ${parseFloat(hmax).toFixed(2)}m\\)`);
  $('#thmax').html(`\\(t_{h_{max}}= ${String(t).split('.')[0] + '.' + String(t).split('.')[1].slice(0,2)}s\\)`);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"hmax"]);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"thmax"]);

  $('#R').html(`\\(R= ${parseFloat(R).toFixed(2)}m\\)`);
  $('#tr').html(`\\(t_{R}= ${String(tr).split('.')[0] + '.' + String(tr).split('.')[1].slice(0,2)}s\\)`);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"R"]);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"tr"]);

  functionGraphic();
  iniciarMap();

}

btnR.submit(e => {
  e.preventDefault();
  RParabolic();
});

function RParabolic(){

  var theta = parseFloat(grades.val()) * (Math.PI/180);
  var y0 = parseFloat(y0I.val());

  if (v0I.val() === "") {
    v0 = 0;
  }

  if (grades.val() === "") {
    theta = 0;
  }

  if (y0I.val() === "") {
    y0 = 0;
  }

  var v0R = Math.sqrt((9.8/(Math.sin(2*theta))*(RInput.val() - y0)));

  v0I.val(v0R);

  parabolic();

}

var detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
  keyboard: false
});

function detailsContent(gravity, v0, theta, vx0, vy0, y0, hmax, t, R, tr){
  theta = Math.round(parseFloat(theta) * (180/Math.PI));
  detailsCont.html(`
    <p>Un cuerpo lanzado en un espacio con gravedad \\(g = ${parseFloat(gravity).toFixed(2)} \\text{ } m/s^2\\), una velocidad inicial de \\(v_{0} = ${parseFloat(v0).toFixed(2)} \\text{ } m/s\\) y un ángulo de \\(\\theta = ${theta}^{\\circ}\\) iniciará su trayectoria con una velocidad horizontal de \\(v_{x_{0}} = ${parseFloat(vx0).toFixed(2)} \\text{ } m/s\\) y una velocidad vertical de \\(v_{y_{0}} = ${parseFloat(vy0).toFixed(2)} \\text{ } m/s\\).</p>
    <p>Si el cuerpo inicia su trayectoria desde la altura \\(y_{0} = ${y0} \\text{ } m\\), obtiene los siguientes parámetros en su trayectoria:</p>
    <p>Altura Máxima: \\(h_{max} = ${parseFloat(hmax).toFixed(2)} \\text{ } m\\)</p>
    <p>Tiempo hasta Altura Máxima: \\(t_{h_{max}} = ${String(t).split('.')[0] + '.' + String(t).split('.')[1].slice(0,2)} \\text{ } s\\)</p>
    <p>Máximo Alcance: \\(R = ${parseFloat(R).toFixed(2)} \\text{ } m\\)</p>
    <p class="mb-1">Tiempo Total: \\(t_{R} = ${String(tr).split('.')[0] + '.' + String(tr).split('.')[1].slice(0,2)} \\text{ } s\\)</p>
    <hr class="w-100 my-1">
    <p class="mt-1">También puedes calcular la posición, velocidad y ángulo de la trayectoria en el instante \\(t\\)</p>
  `);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,'detailsCont']);
}

btnT.submit(e => {
  e.preventDefault();
  timeInfoFunction();
})

function timeInfoFunction(){
  var theta = parseFloat(grades.val()) * (Math.PI/180);
  var v0 = parseFloat(v0I.val());
  var y0 = parseFloat(y0I.val());
  var vx0 = v0 * Math.cos(theta);
  var vy0 = v0 * Math.sin(theta);

  var time = parseFloat(tInput.val());
  var tr = (vy0 + Math.sqrt(vy0**2 + 4*(gravity/2)*(y0))) / (2*(gravity/2));

  var R = vx0 * time;
  var h = (vy0 * time - (1/2)*(gravity)*(time**2)) + y0;
  var vx = vx0
  var vy = vy0 - gravity * time;

  var angle = Math.sqrt(((2 * gravity) / v0**2)*(Math.abs(h - y0)));
  angle = Math.asin(angle);
  angle = angle * 180 / Math.PI;
  angle = parseInt(String(angle).split('.')[0]);

  if (h < y0) {
    angle = parseFloat('-' + angle);
  }

  var angle2 = Math.atan(vy / vx) * (180 / Math.PI);

  $('#contTimeInfo').animate({scrollTop: document.body.scrollHeight},"fast");

  if (time <= tr && time >= 0) {
    timeInfo.html(`
      <div class="mt-4">
        <p>Posición horizontal: \\(R = ${parseFloat(R).toFixed(2)}\\text{ } m\\)</p>
        <p>Posición vertical: \\(h = ${parseFloat(h).toFixed(2)}\\text{ } m\\)</p>
        <p>Velocidad horizontal: \\(v_x = ${parseFloat(vx).toFixed(2)}\\text{ } m/s\\)</p>
        <p>Velocidad vertical: \\(v_y = ${parseFloat(vy).toFixed(2)}\\text{ } m/s\\)</p>
        <p>Ángulo de la trayectoria: \\(\\theta = ${parseFloat(angle2).toFixed(2)}^{\\circ}\\)</p>
      </div>
    `);
  }else{
    timeInfo.html(`
      <div class="mt-4">
        <p>En la trayectoria definida el tiempo máximo es \\(t = ${String(tr).split('.')[0] + "." + String(tr).split('.')[1].slice(0,2)} \\text{ } s\\). Introduce un valor del tiempo anterior a este instante y superior a \\(0\\)</p>
      </div>
    `);
  }

  MathJax.Hub.Queue(["Typeset",MathJax.Hub,'timeInfo']);

}


var map = L.map('mapid').on('load', onMapLoad).setView([
    41.400, 2.206
], 9);
// map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

// en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];

function onMapLoad() {
    console.log("Mapa cargado");
    /*
	FASE 3.1
	1) Relleno el data_markers con una petición a la api
	2) Añado de forma dinámica en el select los posibles tipos de restaurantes
	3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/ 
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/mapa/api/apiRestaurants.php',
        dataType: 'json',
        success: function (data) {
            type_food_array = new Array();
            // Push each restaurant into the array
            data.forEach(element=> {
                data_markers.push(element);
                type_food_array.push(element.kind_food);    
            });

           //We divide all the elements on the array and put together a newone
           // From array[0] = "vegetarian,mex" ===> array[0] = "vegetarian", array[1] = "mex" 
           type_food_array = type_food_array.join(",").split(",");
           console.log(type_food_array);
           
           
           //Filter the repeated results from the array
           type_food_array = type_food_array.filter((item, index) => {
               return type_food_array.indexOf(item) === index;
            });
            /* //Another way of filtering repeated items in an array
             let unique_food = Array.from(new Set(type_food_array)) */
            
            
            // We add dinamically the types of food that exists on the array
           let kind_food_selector = document.querySelector("#kind_food_selector");

           type_food_array.forEach(element => {
                let newOption = document.createElement("option");
                newOption.value = element;
                newOption.innerHTML = element;
                kind_food_selector.appendChild(newOption);
            });
           

            render_to_map(data_markers, "all");

        }//sucess function    
    });//ajax call

}

$('#kind_food_selector').on('change', function () {
    console.log(this.value);
    render_to_map(data_markers, this.value);
});
 

function render_to_map(data_markers, filter) { /*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
    */

    //we clear all the restaurants everytime we change type of food
    markers.clearLayers();

    // Loop and filter those which ones will be included in each category
    data_markers.forEach(restaurant => {
            if((restaurant.kind_food).includes(filter) || filter === "all"){
                markers.addLayer(L.marker([restaurant.lat, restaurant.lng]).bindPopup("<b>"+restaurant.name +"</b><br>"+ restaurant.address))
               //console.log(restaurant);   
            }
    })
 
    map.addLayer(markers);

}

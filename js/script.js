document.addEventListener("DOMContentLoaded", function() {
    Papa.parse("data/vehicles.csv", {
        download: true,
        header: true,
        complete: function(results) {
            processCatalog(results.data);
        }
    });
});

function processCatalog(data) {
    const catalog = {};
    const masComercialesContainer = document.getElementById('masComercialesContainer');
    const otrosContainer = document.getElementById('otrosContainer');

    // Procesar la data y construir el catálogo
    data.forEach(row => {
        const { MARCA, MODELO, Año_Modelo, Conductor, Pasajero, R, Acople_Rexion, Comentarios, Imagen_Rexion, Segmento } = row;
        
        if (!catalog[MARCA]) {
            catalog[MARCA] = {};
            if (Segmento === "Más comerciales") {
                masComercialesContainer.innerHTML += `<div class="brand" onclick="selectBrand('${MARCA}')">${MARCA}</div>`;
            } else {
                otrosContainer.innerHTML += `<div class="brand" onclick="selectBrand('${MARCA}')">${MARCA}</div>`;
            }
        }
        
        if (!catalog[MARCA][MODELO]) {
            catalog[MARCA][MODELO] = {
                years: [],
                conductor: Conductor,
                pasajero: Pasajero,
                acople: Acople_Rexion,
                tipo: R,
                imagen: Imagen_Rexion
            };
        }

        catalog[MARCA][MODELO].years.push(Año_Modelo);
    });

    window.catalog = catalog;
}

function selectBrand(brand) {
    const modelSearch = document.getElementById('modelSearch');
    const modelContainer = document.getElementById('modelContainer');
    const catalog = window.catalog[brand];
    
    document.getElementById('selectedBrand').innerText = `Marca: ${brand}`;
    modelContainer.innerHTML = '';

    // Mostrar los modelos en cuadros ordenados alfabéticamente
    const sortedModels = Object.keys(catalog).sort();
    sortedModels.forEach(model => {
        modelContainer.innerHTML += `<div class="model" onclick="selectModel('${brand}', '${model}')">${model}</div>`;
    });

    modelSearch.disabled = false; // Habilitar el campo de búsqueda

    // Desplazar automáticamente al contenedor de modelos
    modelContainer.scrollIntoView({ behavior: 'smooth' });
}

function selectModel(brand, model) {
    const yearSelect = document.getElementById('year');
    const catalog = window.catalog[brand][model];

    yearSelect.innerHTML = '<option value="">Selecciona un año</option>';

    // Llenar el selector de años con los años disponibles
    catalog.years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });

    yearSelect.disabled = false; // Habilitar el selector de años
    window.selectedModel = { brand, model }; // Guardar el modelo seleccionado

    // Desplazar automáticamente al selector de años
    yearSelect.scrollIntoView({ behavior: 'smooth' });
}

function filterModels() {
    const searchValue = document.getElementById('modelSearch').value.toLowerCase();
    const modelContainer = document.getElementById('modelContainer');
    const models = modelContainer.getElementsByClassName('model');

    // Mostrar/ocultar cuadros de modelos basados en la búsqueda
    for (let i = 0; i < models.length; i++) {
        const model = models[i].innerText.toLowerCase();
        models[i].style.display = model.includes(searchValue) ? 'block' : 'none';
    }
}

function checkFormCompletion() {
    const year = document.getElementById('year').value;
    const searchButton = document.getElementById('searchButton');

    // Habilitar el botón "Buscar" solo si ya se ha seleccionado un año
    if (year !== "") {
        searchButton.disabled = false; // Habilitar el botón
        searchButton.scrollIntoView({ behavior: 'smooth' }); // Desplazar al botón
    } else {
        searchButton.disabled = true; // Deshabilitar el botón
    }
}

function showDetails() {
    const model = window.selectedModel.model;
    const brand = window.selectedModel.brand;
    const year = document.getElementById('year').value;
    const details = window.catalog[brand][model];

    // Verifica si hay un enlace válido
    const imageUrl = details.imagen ? details.imagen : '';

    // Ocultar el formulario
    document.getElementById('form-container').style.display = 'none';

    // Mostrar solo el cuadro de detalles
    document.getElementById('output').style.display = 'block';
    document.getElementById('newSearchButton').style.display = 'block';

    // Mostrar detalles del vehículo
    document.getElementById('output').innerHTML = `
        <h3>Detalles de la Plumilla</h3>
        <p><strong>Vehículo:</strong> ${brand} - ${model} - ${year}</p>
        <p><strong>Conductor:</strong> ${details.conductor}</p>
        <p><strong>Pasajero:</strong> ${details.pasajero}</p>
        <p><strong>Acople Rexion:</strong> ${details.acople}</p>
        <p><strong>Tipo:</strong> ${details.tipo}</p>
        ${imageUrl ? `<p><strong>Enlace de la Imagen Rexion:</strong> <a href="${imageUrl}" target="_blank">Ver Producto</a></p>` : ''}
        <p class="output-message">¡Esto es lo que necesitas!</p>
    `;

    // Desplazar automáticamente al mensaje de detalles
    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
}

function resetSearch() {
    // Mostrar nuevamente el formulario
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('output').style.display = 'none';
    document.getElementById('newSearchButton').style.display = 'none';

    // Resetear el formulario
    document.getElementById('year').disabled = true;
    document.getElementById('modelSearch').disabled = true;
    document.getElementById('searchButton').disabled = true;
}

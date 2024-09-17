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
    const priorityModelContainer = document.getElementById('priorityModelContainer');
    const otrosModelContainer = document.getElementById('otrosModelContainer');

    data.forEach(row => {
        const { MARCA, MODELO, Año_Modelo, Conductor, Pasajero, R, Acople_Rexion, Comentarios, Imagen_Rexion, Segmento, Segmento_Modelo, Cantidad_Modelos } = row;
        
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
                imagen: Imagen_Rexion,
                cantidadModelos: Cantidad_Modelos,
                segmentoModelo: Segmento_Modelo
            };
        }

        catalog[MARCA][MODELO].years.push(Año_Modelo);
    });

    window.catalog = catalog;
}

function selectBrand(brand) {
    clearPreviousData(); // Limpiar datos de secciones anteriores
    document.getElementById('brand-stage').style.display = 'none';
    document.getElementById('model-stage').style.display = 'block';

    const priorityModelContainer = document.getElementById('priorityModelContainer');
    const otrosModelContainer = document.getElementById('otrosModelContainer');
    const catalog = window.catalog[brand];

    document.getElementById('selectedBrand').innerText = `Marca: ${brand}`;
    priorityModelContainer.innerHTML = '';
    otrosModelContainer.innerHTML = '';

    const sortedModels = Object.keys(catalog).sort();
    sortedModels.forEach(model => {
        const modelData = catalog[model];
        if (modelData.segmentoModelo === 'Prioridad') {
            priorityModelContainer.innerHTML += `<div class="model" onclick="selectModel('${brand}', '${model}')">${model}</div>`;
        } else {
            otrosModelContainer.innerHTML += `<div class="model" onclick="selectModel('${brand}', '${model}')">${model}</div>`;
        }
    });

    document.getElementById('modelSearch').disabled = false;
    priorityModelContainer.scrollIntoView({ behavior: 'smooth' });
}

function selectModel(brand, model) {
    const catalog = window.catalog[brand][model];
    
    // Configurar el modelo y marca seleccionados antes de continuar
    window.selectedModel = { brand, model };
    
    // Si solo hay un modelo y un año, pasar directamente al detalle de plumillas
    if (catalog.years.length === 1) {
        window.selectedModel.year = catalog.years[0]; // Asignar el único año
        showDetails(); // Llamamos directamente al detalle
        return;
    }

    document.getElementById('model-stage').style.display = 'none';
    document.getElementById('year-stage').style.display = 'block';

    const yearSelect = document.getElementById('year');
    document.getElementById('selectedModel').innerText = `Modelo: ${model}`;

    yearSelect.innerHTML = '<option value="">Selecciona un año</option>';
    catalog.years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });

    yearSelect.disabled = false;
    yearSelect.scrollIntoView({ behavior: 'smooth' });
}

function goBackToBrand() {
    clearPreviousData(); // Limpiar la información cuando volvemos a marcas
    document.getElementById('model-stage').style.display = 'none';
    document.getElementById('year-stage').style.display = 'none';
    document.getElementById('brand-stage').style.display = 'block';
    document.getElementById('output').style.display = 'none';
    document.getElementById('newSearchButton').style.display = 'none';
}

function goBackToModel() {
    clearPreviousData(); // Limpiar la información cuando volvemos a modelos
    document.getElementById('year-stage').style.display = 'none';
    document.getElementById('brand-stage').style.display = 'none'; // Mostrar solo la selección de marcas
    document.getElementById('model-stage').style.display = 'block';
    document.getElementById('output').style.display = 'none';
    document.getElementById('newSearchButton').style.display = 'none';
}

function clearPreviousData() {
    // Limpiar cualquier información previa que se mantenga de secciones anteriores
    document.getElementById('selectedBrand').innerText = '';
    document.getElementById('selectedModel').innerText = '';
    document.getElementById('year').innerHTML = '';
}

function filterModels() {
    const searchValue = document.getElementById('modelSearch').value.toLowerCase();
    const modelContainer = document.getElementById('priorityModelContainer');
    const models = modelContainer.getElementsByClassName('model');

    for (let i = 0; i < models.length; i++) {
        const model = models[i].innerText.toLowerCase();
        models[i].style.display = model.includes(searchValue) ? 'block' : 'none';
    }
}

function checkFormCompletion() {
    const year = document.getElementById('year').value;
    const searchButton = document.getElementById('searchButton');

    // Solo habilitar el botón si se selecciona un año
    if (year !== "") {
        searchButton.disabled = false;
        searchButton.style.display = 'block';
        searchButton.scrollIntoView({ behavior: 'smooth' });
    } else {
        searchButton.disabled = true;
        searchButton.style.display = 'none';
    }
}

function showDetails() {
    const model = window.selectedModel.model;
    const brand = window.selectedModel.brand;
    const year = window.selectedModel.year || document.getElementById('year').value; // Si ya hay un año asignado, usarlo
    const details = window.catalog[brand][model];

    const imageUrl = details.imagen ? details.imagen : '';

    // Ocultar todas las demás secciones y mostrar solo el detalle de plumillas
    document.getElementById('brand-stage').style.display = 'none';
    document.getElementById('model-stage').style.display = 'none';
    document.getElementById('year-stage').style.display = 'none';
    document.getElementById('output').style.display = 'block';
    document.getElementById('newSearchButton').style.display = 'block';

    document.getElementById('output').innerHTML = `
        <h3>Detalles de la Plumilla</h3>
        <p><strong>Vehículo:</strong> ${brand} - ${model} - ${year}</p>
        <p><strong>Conductor:</strong> ${details.conductor}</p>
        <p><strong>Pasajero:</strong> ${details.pasajero}</p>
        <p><strong>Acople Rexion - Tipo:</strong> ${details.acople} - ${details.tipo}</p>
        ${imageUrl ? `<p><strong>Enlace de la Imagen Rexion:</strong> <a href="${imageUrl}" target="_blank">Ver Producto - Click aquí</a></p>` : ''}
        <button onclick="goBackToModel()">Volver</button>
    `;

    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
}

function resetSearch() {
    // Limpiar cualquier información de búsqueda anterior y reiniciar la interfaz
    clearPreviousData();
    document.getElementById('brand-stage').style.display = 'block'; // Mostrar solo la selección de marcas
    document.getElementById('model-stage').style.display = 'none'; // Ocultar selección de modelos
    document.getElementById('year-stage').style.display = 'none'; // Ocultar selección de año
    document.getElementById('output').style.display = 'none'; // Ocultar la sección de detalles
    document.getElementById('newSearchButton').style.display = 'none'; // Ocultar el botón de nueva búsqueda

    document.getElementById('year').disabled = true;
    document.getElementById('modelSearch').disabled = true;
    document.getElementById('searchButton').disabled = true;
    document.getElementById('searchButton').style.display = 'none';
}

function toggleOtros() {
    const otrosContainer = document.getElementById('otrosContainer');
    const displayStyle = otrosContainer.style.display;

    if (displayStyle === "none" || displayStyle === "") {
        otrosContainer.style.display = "flex";
    } else {
        otrosContainer.style.display = "none";
    }
}

function toggleOtrosModels() {
    const otrosModelContainer = document.getElementById('otrosModelContainer');
    const displayStyle = otrosModelContainer.style.display;

    if (displayStyle === "none" || displayStyle === "") {
        otrosModelContainer.style.display = "flex";
    } else {
        otrosModelContainer.style.display = "none";
    }
}

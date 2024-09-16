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
    document.getElementById('brand-stage').style.display = 'none';
    document.getElementById('model-stage').style.display = 'block';

    const modelContainer = document.getElementById('modelContainer');
    const catalog = window.catalog[brand];

    document.getElementById('selectedBrand').innerText = `Marca: ${brand}`;
    modelContainer.innerHTML = '';

    const sortedModels = Object.keys(catalog).sort();
    sortedModels.forEach(model => {
        modelContainer.innerHTML += `<div class="model" onclick="selectModel('${brand}', '${model}')">${model}</div>`;
    });

    document.getElementById('modelSearch').disabled = false;
    modelContainer.scrollIntoView({ behavior: 'smooth' });
}

function selectModel(brand, model) {
    document.getElementById('model-stage').style.display = 'none';
    document.getElementById('year-stage').style.display = 'block';

    const yearSelect = document.getElementById('year');
    const catalog = window.catalog[brand][model];

    document.getElementById('selectedModel').innerText = `Modelo: ${model}`;

    yearSelect.innerHTML = '<option value="">Selecciona un año</option>';
    catalog.years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });

    yearSelect.disabled = false;
    window.selectedModel = { brand, model };
    yearSelect.scrollIntoView({ behavior: 'smooth' });
}

function goBackToBrand() {
    document.getElementById('model-stage').style.display = 'none';
    document.getElementById('brand-stage').style.display = 'block';
}

function goBackToModel() {
    document.getElementById('year-stage').style.display = 'none';
    document.getElementById('model-stage').style.display = 'block';
}

function filterModels() {
    const searchValue = document.getElementById('modelSearch').value.toLowerCase();
    const modelContainer = document.getElementById('modelContainer');
    const models = modelContainer.getElementsByClassName('model');

    for (let i = 0; i < models.length; i++) {
        const model = models[i].innerText.toLowerCase();
        models[i].style.display = model.includes(searchValue) ? 'block' : 'none';
    }
}

function checkFormCompletion() {
    const year = document.getElementById('year').value;
    const searchButton = document.getElementById('searchButton');

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
    const year = document.getElementById('year').value;
    const details = window.catalog[brand][model];

    const imageUrl = details.imagen ? details.imagen : '';

    document.getElementById('year-stage').style.display = 'none';

    document.getElementById('output').style.display = 'block';
    document.getElementById('newSearchButton').style.display = 'block';

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

    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
}

function resetSearch() {
    document.getElementById('brand-stage').style.display = 'block';
    document.getElementById('output').style.display = 'none';
    document.getElementById('newSearchButton').style.display = 'none';

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

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
    const modelSelect = document.getElementById('model');
    const catalog = window.catalog[brand];
    
    document.getElementById('selectedBrand').innerText = `Marca: ${brand}`;
    modelSelect.innerHTML = '<option value="">Selecciona un modelo</option>';

    Object.keys(catalog).forEach(model => {
        modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });

    modelSelect.disabled = false;
    document.getElementById('year').disabled = true; // Deshabilita el selector de años hasta que se seleccione el modelo
    document.getElementById('output').innerHTML = ''; // Limpiar resultados previos
}

function updateYears() {
    const model = document.getElementById('model').value;
    const brand = document.getElementById('selectedBrand').innerText.replace('Marca: ', '');
    const yearSelect = document.getElementById('year');
    yearSelect.innerHTML = '<option value="">Selecciona un año</option>';
    
    // Si no se ha seleccionado modelo, deshabilita el selector de años
    if (!model) {
        yearSelect.disabled = true;
        return;
    }

    const years = window.catalog[brand][model].years;

    // Llena el selector de años con los años disponibles
    years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });

    yearSelect.disabled = false; // Habilita el selector de años
}

function showDetails() {
    const model = document.getElementById('model').value;
    const brand = document.getElementById('selectedBrand').innerText.replace('Marca: ', '');
    const details = window.catalog[brand][model];

    // Verifica si hay un enlace válido
    const imageUrl = details.imagen ? details.imagen : '';

    document.getElementById('output').innerHTML = `
        <h3>Detalles de la Plumilla</h3>
        <p><strong>Conductor:</strong> ${details.conductor}</p>
        <p><strong>Pasajero:</strong> ${details.pasajero}</p>
        <p><strong>Acople Rexion:</strong> ${details.acople}</p>
        <p><strong>Tipo:</strong> ${details.tipo}</p>
        ${imageUrl ? `<p><strong>Enlace de la Imagen Rexion:</strong> <a href="${imageUrl}" target="_blank">Ver Producto</a></p>` : ''}
        <p class="output-message">¡Esto es lo que necesitas!</p>
    `;
}


function toggleOtros() {
    const otrosContainer = document.getElementById('otrosContainer');
    if (otrosContainer.style.display === "none") {
        otrosContainer.style.display = "flex";
    } else {
        otrosContainer.style.display = "none";
    }
}

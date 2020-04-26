import React, { useState, useEffect } from "react";
import Formulario from "./component/Formulario";
import ListadoImagenes from "./component/ListadoImagenes";

function App() {
  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaactual, guardarPaginaActual] = useState(1);
  const [totalpaginas, guardarTotalPaginas] = useState(5);

  useEffect(() => {
    const consultaAPI = async () => {
      //Si formulario esta vacío, evita primera carga
      if (busqueda === "") return;

      //Consulta a la API
      const imagenesPorPagina = 30;
      const key = "16218458-614182f27e55d1de8dd763c5a";
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}
      &per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      //Guarda todas los objetos
      guardarImagenes(resultado.hits);

      //Calcular el total de páginas
      const calcularTotalPaginas = Math.ceil(
        resultado.totalHits / imagenesPorPagina
      );
      guardarTotalPaginas(calcularTotalPaginas);

      const jumbotron = document.querySelector(".jumbotron");
      jumbotron.scrollIntoView({ behavior: "smooth" });
    };
    consultaAPI();
  }, [busqueda, paginaactual]);

  //Pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;
    if (nuevaPaginaActual === 0) return;
    guardarPaginaActual(nuevaPaginaActual);
  };

  //Pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;
    if (nuevaPaginaActual > totalpaginas) return;
    guardarPaginaActual(nuevaPaginaActual);
  };

  return (
    <div className="container mb-10">
      <div className="jumbotron">
        <h4 className=" my-4 text-center">Buscador de Imágenes</h4>
        <Formulario guardarBusqueda={guardarBusqueda} />
      </div>

      <div className="row justify-content-center">
        <ListadoImagenes imagenes={imagenes} />

        {/* Condición para ocultar botones */}
        {paginaactual === 1 ? null : (
          <button
            type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior}
          >
            &laquo; Anterior
          </button>
        )}

        {paginaactual === totalpaginas ? null : (
          <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguiente}
          >
            Siguiente &raquo;
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

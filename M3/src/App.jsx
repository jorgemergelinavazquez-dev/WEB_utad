import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { transformarRecetas, urlAleatoria, urlBusqueda } from './api';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Buscador } from './components/Buscador';
import { Pestanas } from './components/Pestanas';
import { FiltroCategoria } from './components/FiltroCategoria';
import { ListaRecetas } from './components/ListaRecetas';
import { DetalleReceta } from './components/DetalleReceta';
import { BotonTema } from './components/BotonTema';

// Si el usuario nunca ha elegido tema, usamos el de su sistema operativo.
const temaDelSistema = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';

function App() {
  // Estado mínimo: solo lo que el usuario ha decidido.
  const [peticion, setPeticion] = useState(null); // { tipo: 'busqueda', texto } | { tipo: 'sorpresa', n }
  const [vista, setVista] = useState('resultados');
  const [categoria, setCategoria] = useState('todas');
  const [idAbierta, setIdAbierta] = useState(null);
  const [favoritas, setFavoritas] = useLocalStorage('recetario:favoritas', []);
  const [tema, setTema] = useLocalStorage('recetario:tema', temaDelSistema);

  // Todo lo demás se deriva en el render.
  const esBusqueda = peticion?.tipo === 'busqueda';
  const url = !peticion ? null : esBusqueda ? urlBusqueda(peticion.texto) : urlAleatoria(peticion.n);
  const { datos, cargando, error } = useFetch(url, { cachear: esBusqueda });

  const resultados = transformarRecetas(datos?.meals);
  const base = vista === 'favoritas' ? favoritas : resultados;
  const categorias = [...new Set(base.map((receta) => receta.categoria))].sort();
  const categoriaActiva = categorias.includes(categoria) ? categoria : 'todas';
  const visibles =
    categoriaActiva === 'todas' ? base : base.filter((receta) => receta.categoria === categoriaActiva);
  const idsFavoritas = new Set(favoritas.map((receta) => receta.id));
  const recetaAbierta = [...resultados, ...favoritas].find((receta) => receta.id === idAbierta);

  // Sincronizar el título de la pestaña del navegador (sistema externo a React).
  useEffect(() => {
    document.title = esBusqueda ? `«${peticion.texto}» · Recetario` : 'Recetario React';
  }, [esBusqueda, peticion]);

  // El tema se aplica como atributo en <html> y el CSS cambia las variables de color.
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  const alternarTema = () => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'));

  const buscar = (texto) => {
    setPeticion({ tipo: 'busqueda', texto });
    setVista('resultados');
  };

  const sorprender = () => {
    setPeticion({ tipo: 'sorpresa', n: Date.now() });
    setVista('resultados');
  };

  const alternarFavorita = (receta) => {
    setFavoritas((anteriores) =>
      anteriores.some((fav) => fav.id === receta.id)
        ? anteriores.filter((fav) => fav.id !== receta.id)
        : [...anteriores, receta],
    );
  };

  // useCallback para que DetalleReceta no vuelva a registrar el listener en cada render.
  const cerrarDetalle = useCallback(() => setIdAbierta(null), []);

  let mensajeVacio = 'Busca un plato (en inglés) o pulsa 🎲 Sorpréndeme.';
  if (vista === 'favoritas') mensajeVacio = 'Aún no tienes favoritas. Pulsa ☆ en una receta para guardarla.';
  else if (esBusqueda) mensajeVacio = `No hay recetas para «${peticion.texto}». Prueba con otra palabra.`;

  return (
    <div className="app">
      <header>
        <BotonTema tema={tema} onAlternar={alternarTema} />
        <h1>Recetario</h1>
        <p className="subtitulo">Async Odyssey, ahora en React</p>
        <Buscador onBuscar={buscar} onSorpresa={sorprender} />
      </header>

      <div className="barra">
        <Pestanas vista={vista} totalFavoritas={favoritas.length} onCambiar={setVista} />
        {categorias.length > 1 && (
          <FiltroCategoria categorias={categorias} valor={categoriaActiva} onCambiar={setCategoria} />
        )}
      </div>

      <main>
        {vista === 'resultados' && cargando && <p className="estado">Cargando recetas… ⏳</p>}
        {vista === 'resultados' && error && (
          <p className="estado error">No se pudo conectar con TheMealDB. Inténtalo de nuevo.</p>
        )}
        {(vista === 'favoritas' || (!cargando && !error)) && (
          <ListaRecetas
            recetas={visibles}
            idsFavoritas={idsFavoritas}
            mensajeVacio={mensajeVacio}
            onAbrir={setIdAbierta}
            onAlternarFavorita={alternarFavorita}
          />
        )}
      </main>

      {recetaAbierta && (
        <DetalleReceta
          receta={recetaAbierta}
          esFavorita={idsFavoritas.has(recetaAbierta.id)}
          onAlternarFavorita={alternarFavorita}
          onCerrar={cerrarDetalle}
        />
      )}
    </div>
  );
}

export default App;

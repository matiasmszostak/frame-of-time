  /*
        Simulador de E-Commerce.
        La idea de este proyecto es poder vender fotos propias desde este sitio.
        */

// Cargo el DOM

document.addEventListener("DOMContentLoaded", () => {


  "use strict";

  // Variables Globales
  let total = 0;
  const IVA = 1.21;

  // Operadores avanzados - Uso el operador lógico OR para sintetizar.
  // Inicializo un objeto carrito. Si existe un carrito en el storage, le doy ese valor. Sino, lo dejo vacío.
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

  //Agrega precio del producto al carrito
  const agregarProducto = (precio) => {
    total += precio;
    return total;
  };

  //Suma el IVA del total del carrito
  function sumarIVA() {
    total *= IVA;
    return total.toFixed(2);
  }

  //Calcula las cuotas del total del carrito
  function calcularCuotas(cuotas) {
    let precioCuota = total / cuotas;
    if (cuotas == 1) {
      return "Tendrá que pagar $" + total + " en una sola cuota.";
    } else if (cuotas > 1) {
      return (
        "Tendrá que pagar $" +
        total +
        " en " +
        cuotas +
        " cuotas de $" +
        precioCuota.toFixed(2) +
        "."
      );
    } else {
      return "Número de cuotas inválido.";
    }
  }

  //Objeto constructor
  function Producto(id, nombre, stock, precio, descuento, categoria, img) {
    this.id = id;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
    this.descuento = descuento;
    this.categoria = categoria;
    this.img = img;

    //métodos
    this.calcularDescuento = function (precio, descuento) {
      let total = precio * descuento;
      let displayDescuento = ((1 - descuento) * 100).toFixed(2);
      // console.log("Con un descuento de " + displayDescuento + "%, el precio final es de $" + total + ".")
      return "$" + total;
    };
    this.venta = function (cantidadComprada) {
      stock -= cantidadComprada;
      if (stock < 0) {
        stock += cantidadComprada;
        // console.log("Superó la cantidad de stock. Tenemos stock  " + stock + " de este producto.")
        return stock;
      } else {
        //  console.log("Queda un total de " + stock + " " + nombre)
        return stock;
      }
    };
  }

  // Creo array vacío que va a contener a todos mis objetos productos
  let listaProductos = [];


          /* (Utilizo Live Server)
        1. Uso fetch para buscar en mi archivo data.json.
        2. Con la data del json, creo un nuevo producto y agrego cada instancia al array listaProductos.
        3. Esto me permite tener de vuelta los objetos con sus métodos. */
        fetch('/data.json')
        .then((resp) => resp.json())
        .then((data) => data.forEach((producto) => 
                                        listaProductos.push(new Producto(producto.id, producto.nombre, producto.stock, producto.precio, producto.descuento, producto.categoria, producto.img))));
    
        console.log(listaProductos);




  // Actualización de precios de Mayo con método map
  const preciosMayo = listaProductos.map((el) => {
    return {
      nombre: el.nombre,
      stock: el.stock,
      precio: Math.round(el.precio * 1.1),
      descuento: el.descuento,
    };
  });

  // Incorporar eventos

  let blancoYNegro = document.querySelector(".categoria1");
  let color = document.querySelector(".categoria2");

  blancoYNegro.addEventListener("click", function () {
    renderProductos("B&W");
  });
  color.addEventListener("click", function () {
    renderProductos("color");
  });

  function renderProductos(categoria) {
    const listaSegunCategoria = listaProductos.filter(
      (x) => x.categoria == categoria
    );

    let catalogo = document.querySelector(".main-catalogo");

    catalogo.innerHTML = "";

    const handleAddProduct = (producto) => {
      // Desestructuro objeto producto
      const { id } = producto;

      //Me fijo si el carrito ya tiene el producto
      if (carrito[id]) {
        //Si ya lo tiene simplemente accedo a ese producto y le sumo 1 a la cantidad
        carrito[id].cantidad += 1;
      } else {
        //Si no lo tiene le agrego la propiedad "cantidad" y le pongo 1 porque es el primero que agrego de este producto
        producto.cantidad = 1;
        //Agrego en el carrito el producto. Uso como key el id.
        carrito[id] = producto;
      }
      const JSONCarrito = JSON.stringify(carrito);
      console.log(JSONCarrito);
      localStorage.setItem("carrito", JSONCarrito);
    };

    for (const producto of listaSegunCategoria) {
      // Desestructuración del objeto producto
      const { nombre, precio, img, id } = producto;

      let contenedor = document.createElement("div");

      contenedor.innerHTML = `<div class="card">
                                            <img src="${img}" class="imagen card-img-top" alt="...">
                                            <div class="card-body">
                                                <h5 class="card-title">${nombre}</h5>
                                                <p class="card-text">$${precio}</p>
                                                <button id="${id}" class="btn btn-outline-dark">Comprar</button>
                                            </div>
                                        </div>`;

      //Le agrego un listener al botón para que al clickear ejecute la funcion de agregar producto, pasandole el producto.
      contenedor.addEventListener("click", () => handleAddProduct(producto));

      // Le agrego un listener al botón para agregarle el Toastify
      contenedor.addEventListener("click", () => avisoToastify());

      catalogo.appendChild(contenedor);
    }
  }



  // Librerías - Función para que aparezca el cartel de Toastify
  function avisoToastify() {
    Toastify({
      text: "Producto agregado",
      duration: 1500,
    }).showToast();
  }
  
});
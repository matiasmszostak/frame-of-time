    /*
          Simulador de E-Commerce.
          La idea de este proyecto es poder vender fotos propias desde este sitio.
          */

// Cargo el DOM
  document.addEventListener("DOMContentLoaded", () => {

  
    "use strict";
    let cart = JSON.parse(localStorage.getItem("carrito")) || {};

    function renderCart() {

      let cartContainer = document.querySelector(".main-cart");
  
      cartContainer.innerHTML = "";
  
      Object.keys(cart).forEach((element) => {
        const product = cart[element];

        const { nombre, precio, id, cantidad } = product;
  
        let contenedor = document.createElement("div");
  
        contenedor.innerHTML = `<div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">${nombre}</h5>
                                                    <p class="card-text">Cantidad: ${cantidad}</p>
                                                    <p class="card-text">$${
                                                      precio * cantidad
                                                    }</p>
                                                    <button id="${id}" class="btn btn-outline-dark">Comprar</button>
                                                </div>
                                            </div>`;
  
        cartContainer.appendChild(contenedor);
      });
  
      const deleteCart = () => {
        localStorage.removeItem("carrito");
        cart = {};
        location.reload();
      };
      let deleteBtn = document.createElement("button");
  
      deleteBtn.innerHTML = `Eliminar`;
      deleteBtn.className = "btn btn-outline-danger";
      deleteBtn.addEventListener("click", () => deleteCart());
      cartContainer.appendChild(deleteBtn);
    }
  
    window.onload = renderCart();
  
    });
  